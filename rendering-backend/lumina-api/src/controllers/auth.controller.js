const crypto = require('crypto');
const User = require('../models/user.model');
const { createTokenPair, rotateRefreshToken, revokeRefreshToken } = require('../services/token.service');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../services/email.service');
const { generateRandomToken, hashToken } = require('../utils/generateToken');
const { success, created, error: sendError } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ── Helper: build public user object compatible with Angular frontend ──
const buildUserPayload = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  avatar: user.avatar,
});

// ── POST /api/v1/auth/register ────────────────────────────────────
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new ApiError('An account with this email already exists.', 409));

  const user = await User.create({ name, email, password });

  // Generate email verification token (non-blocking, best effort)
  try {
    const rawToken = generateRandomToken();
    user.emailVerificationToken = hashToken(rawToken);
    await user.save({ validateBeforeSave: false });
    const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(user, verifyURL);
  } catch (_) {
    // Email sending failure should not block registration
  }

  const { accessToken, refreshToken } = await createTokenPair(user, req);

  return created(res, {
    user: buildUserPayload(user),
    accessToken,
    refreshToken,
  }, 'Registration successful');
});

// ── POST /api/v1/auth/login ───────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError('Invalid email or password.', 401));
  }

  if (!user.isActive) {
    return next(new ApiError('Your account has been deactivated. Please contact support.', 403));
  }

  const { accessToken, refreshToken } = await createTokenPair(user, req);

  return success(res, {
    user: buildUserPayload(user),
    accessToken,
    refreshToken,
  }, 'Login successful');
});

// ── POST /api/v1/auth/logout ──────────────────────────────────────
exports.logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (refreshToken) await revokeRefreshToken(refreshToken);
  return success(res, null, 'Logged out successfully');
});

// ── POST /api/v1/auth/refresh-token ──────────────────────────────
exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new ApiError('Refresh token is required.', 400));

  const tokens = await rotateRefreshToken(refreshToken, req);
  return success(res, tokens, 'Token refreshed');
});

// ── GET /api/v1/auth/me ───────────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  return success(res, { user: buildUserPayload(req.user) });
});

// ── POST /api/v1/auth/forgot-password ────────────────────────────
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't reveal whether email exists
    return success(res, null, 'If that email exists, a reset link has been sent.');
  }

  const rawToken = generateRandomToken();
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail(user, resetURL);
    return success(res, null, 'If that email exists, a reset link has been sent.');
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError('Error sending email. Please try again later.', 500));
  }
});

// ── POST /api/v1/auth/reset-password/:token ──────────────────────
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) return next(new ApiError('Invalid or expired reset token.', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const { accessToken, refreshToken } = await createTokenPair(user, req);
  return success(res, { user: buildUserPayload(user), accessToken, refreshToken }, 'Password reset successful');
});

// ── POST /api/v1/auth/change-password ────────────────────────────
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ApiError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  const { accessToken, refreshToken } = await createTokenPair(user, req);
  return success(res, { accessToken, refreshToken }, 'Password changed successfully');
});

// ── GET /api/v1/auth/verify-email/:token ─────────────────────────
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({ emailVerificationToken: hashedToken });
  if (!user) return next(new ApiError('Invalid or expired verification link.', 400));

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  return success(res, null, 'Email verified successfully');
});
