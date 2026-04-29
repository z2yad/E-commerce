const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { sendOrderConfirmationEmail } = require('../services/email.service');
const { success, created, paginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ── POST /api/v1/orders ───────────────────────────────────────────
// Called when the Angular Checkout form submits (currently onSubmit() does nothing)
exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  // Validate products and build snapshot
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return next(new ApiError(`Product not found: ${item.product}`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new ApiError(`Insufficient stock for "${product.title}"`, 400));
    }

    const price = product.price;
    subtotal += price * item.quantity;

    orderItems.push({
      product: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      price,
      discountPercentage: product.discountPercentage,
      quantity: item.quantity,
    });

    // Decrement stock
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingFee + tax) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'card',
    subtotal,
    shippingFee,
    tax,
    totalAmount,
    notes,
  });

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail(req.user, order).catch(() => {});

  return created(res, order, 'Order placed successfully');
});

// ── GET /api/v1/orders (admin: all orders / user: own orders) ────
exports.getOrders = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const { status } = req.query;

  const filter = {};
  if (req.user.role !== 'admin') filter.user = req.user._id;
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return paginated(res, orders, total, skip, limit);
});

// ── GET /api/v1/orders/my ─────────────────────────────────────────
exports.getMyOrders = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);

  const filter = { user: req.user._id };
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return paginated(res, orders, total, skip, limit);
});

// ── GET /api/v1/orders/:id ────────────────────────────────────────
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new ApiError('Order not found.', 404));

  // Regular users can only see their own orders
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    return next(new ApiError('You do not have access to this order.', 403));
  }

  return success(res, order);
});

// ── PUT /api/v1/orders/:id/status (admin) ─────────────────────────
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      ...(status === 'delivered' ? { deliveredAt: new Date(), paymentStatus: 'paid' } : {}),
      ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}),
    },
    { new: true, runValidators: true }
  );

  if (!order) return next(new ApiError('Order not found.', 404));
  return success(res, order, `Order status updated to "${status}"`);
});

// ── DELETE /api/v1/orders/:id (admin) ────────────────────────────
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new ApiError('Order not found.', 404));
  return success(res, null, 'Order deleted');
});
