const ApiError = require('../utils/ApiError');

/**
 * Restricts access to admin-only routes.
 * Must be used AFTER `protect` middleware.
 * Compatible with the Angular `adminGuard` which checks `role === 'admin'`.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError('You do not have permission to perform this action.', 403));
};

/**
 * Role-based restriction — pass the allowed roles.
 * Usage: restrictTo('admin', 'manager')
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ApiError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = { adminOnly, restrictTo };
