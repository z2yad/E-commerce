const ApiError = require('../utils/ApiError');

// ── Handle Mongoose CastError (invalid ObjectId) ─────────────────
const handleCastError = (err) =>
  new ApiError(`Invalid ${err.path}: ${err.value}.`, 400);

// ── Handle Mongoose duplicate key error ──────────────────────────
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(`Duplicate value for field '${field}'. Please use a different value.`, 409);
};

// ── Handle Mongoose validation errors ────────────────────────────
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new ApiError('Validation failed. Please check your input.', 400, messages);
};

// ── Handle JWT errors ─────────────────────────────────────────────
const handleJWTError = () =>
  new ApiError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new ApiError('Your token has expired. Please log in again.', 401);

// ── Development error response (full stack) ───────────────────────
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors || [],
    stack: err.stack,
  });
};

// ── Production error response (no internals) ─────────────────────
const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }
  // Unknown / programming error — don't leak details
  console.error('💥 Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went very wrong. Please try again later.',
    errors: [],
  });
};

// ── Global Express error handler ──────────────────────────────────
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message, name: err.name };
  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    return sendDevError(error, res);
  }

  sendProdError(error, res);
};

module.exports = { globalErrorHandler };
