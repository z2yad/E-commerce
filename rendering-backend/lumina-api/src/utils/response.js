/**
 * Unified JSON response helpers.
 * All responses follow the same envelope so the Angular frontend
 * can rely on a consistent structure.
 */

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const created = (res, data, message = 'Created successfully') =>
  success(res, data, message, 201);

const paginated = (res, items, total, skip, limit, message = 'Success') =>
  res.status(200).json({
    success: true,
    message,
    // The Angular ProductService expects this exact shape:
    // { products: [...], total, skip, limit }
    // For other resources we keep the same pagination keys.
    data: items,
    total,
    skip,
    limit,
  });

const error = (res, message = 'Something went wrong', statusCode = 500, errors = []) => {
  const payload = { success: false, message };
  if (errors.length) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { success, created, paginated, error };
