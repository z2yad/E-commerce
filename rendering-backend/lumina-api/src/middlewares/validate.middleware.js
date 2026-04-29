const { validationResult } = require('express-validator');
const { error: sendError } = require('../utils/response');

/**
 * Reads express-validator errors from the request and returns
 * a 422 response with a structured `errors` array.
 * Must be placed AFTER express-validator `check()` chains in the route.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const messages = result.array().map((e) => `${e.path}: ${e.msg}`);
  return sendError(res, 'Validation failed', 422, messages);
};

module.exports = { validate };
