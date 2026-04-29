const User = require('../models/user.model');
const Order = require('../models/order.model');
const { success, paginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ── GET /api/v1/users/profile ────────────────────────────────────
exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const orderCount = await Order.countDocuments({ user: req.user._id });

  return success(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    orderCount,
  });
});

// ── PUT /api/v1/users/profile ────────────────────────────────────
exports.updateProfile = catchAsync(async (req, res, next) => {
  // Strip forbidden fields
  const { password, role, isActive, ...updates } = req.body;

  if (req.file) {
    updates.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return success(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
  }, 'Profile updated successfully');
});

// ── GET /api/v1/users (admin) ────────────────────────────────────
exports.getUsers = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const { search, role, isActive } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return paginated(res, users, total, skip, limit);
});

// ── GET /api/v1/users/:id (admin) ────────────────────────────────
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError('User not found.', 404));
  return success(res, user);
});

// ── PUT /api/v1/users/:id (admin) ────────────────────────────────
exports.updateUser = catchAsync(async (req, res, next) => {
  const { password, ...updates } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new ApiError('User not found.', 404));

  return success(res, user, 'User updated successfully');
});

// ── DELETE /api/v1/users/:id (admin) ─────────────────────────────
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ApiError('User not found.', 404));
  return success(res, null, 'User deleted successfully');
});

// ── PATCH /api/v1/users/:id/block (admin) ────────────────────────
exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError('User not found.', 404));

  if (user.role === 'admin') {
    return next(new ApiError('Cannot block an admin account.', 403));
  }

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  return success(res, null, 'User blocked successfully');
});

// ── PATCH /api/v1/users/:id/unblock (admin) ──────────────────────
exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  if (!user) return next(new ApiError('User not found.', 404));
  return success(res, null, 'User unblocked successfully');
});
