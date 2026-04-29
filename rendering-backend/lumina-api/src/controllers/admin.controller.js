const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { success } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

// ── GET /api/v1/admin/stats ───────────────────────────────────────
// Powers the Admin Dashboard stats cards
exports.getDashboardStats = catchAsync(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue,
    lastMonthRevenue,
    pendingOrders,
    deliveredOrders,
    recentOrders,
    topProducts,
    newUsersThisMonth,
    newUsersLastMonth,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),

    // Total revenue (all time)
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // Last month revenue
    Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' }),

    // Recent 5 orders for the orders table
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Top 5 products by order count
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', title: { $first: '$items.title' }, totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]),

    User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
    User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    }),
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const prevRevenue = lastMonthRevenue[0]?.total || 0;
  const revenueGrowth = prevRevenue
    ? (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
    : '0';

  const userGrowth = newUsersLastMonth
    ? (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1)
    : '0';

  // Build stats cards compatible with Angular AdminDashboard component
  const stats = [
    {
      label: 'Total Revenue',
      value: `$${revenue.toFixed(2)}`,
      growth: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`,
      type: revenueGrowth >= 0 ? 'up' : 'down',
      color: 'amber',
    },
    {
      label: 'Active Users',
      value: totalUsers.toLocaleString(),
      growth: `${userGrowth >= 0 ? '+' : ''}${userGrowth}%`,
      type: userGrowth >= 0 ? 'up' : 'down',
      color: 'pink',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      growth: `${pendingOrders} pending`,
      type: 'up',
      color: 'orange',
    },
    {
      label: 'Products Listed',
      value: totalProducts.toLocaleString(),
      growth: `${deliveredOrders} delivered`,
      type: 'up',
      color: 'purple',
    },
  ];

  // Format recent orders to match existing AdminDashboard template
  const orders = recentOrders.map((o) => ({
    id: o.orderNumber,
    customer: o.user?.name || 'Guest',
    product: o.items[0]?.title || 'Multiple Items',
    amount: `$${o.totalAmount.toFixed(2)}`,
    status: o.status,
    date: formatTimeAgo(o.createdAt),
  }));

  return success(res, {
    stats,
    recentOrders: orders,
    topProducts,
    summary: {
      totalRevenue: revenue,
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      deliveredOrders,
    },
  });
});

// ── GET /api/v1/admin/stats/sales ─────────────────────────────────
// Sales chart data — last N days
exports.getSalesChart = catchAsync(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const from = new Date();
  from.setDate(from.getDate() - days);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: from }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', revenue: 1, orders: 1, _id: 0 } },
  ]);

  return success(res, data);
});

// ── GET /api/v1/admin/orders ──────────────────────────────────────
exports.getAdminOrders = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { status } = req.query;

  const filter = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: orders,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
  });
});

// ── GET /api/v1/admin/users ───────────────────────────────────────
exports.getAdminUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,
    data: users,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
  });
});

// ── Helpers ───────────────────────────────────────────────────────
function formatTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
