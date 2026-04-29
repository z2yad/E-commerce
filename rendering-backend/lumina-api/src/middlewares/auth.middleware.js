const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Protects routes — must be called before any role-restricted middleware.
 * Reads the JWT from `Authorization: Bearer <token>`.
 * Compatible with the Angular HTTP interceptor that sets this header.
 */
const protect = catchAsync(async (req, res, next) => {
  // 1. Extract token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('You are not logged in. Please log in to get access.', 401));
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError('Your session has expired. Please log in again.', 401));
    }
    return next(new ApiError('Invalid token. Please log in again.', 401));
  }

  // 3. Check user still exists
  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!user) {
    return next(new ApiError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Check if account is active
  if (!user.isActive) {
    return next(new ApiError('Your account has been deactivated. Please contact support.', 403));
  }

  // 5. Check if password was changed after token was issued
  if (user.passwordChangedAfter(decoded.iat)) {
    return next(new ApiError('User recently changed password. Please log in again.', 401));
  }

  // Attach user to request
  req.user = user;
  next();
});

module.exports = { protect };
