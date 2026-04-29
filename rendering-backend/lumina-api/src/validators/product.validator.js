const { body, query } = require('express-validator');

const createProductValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10–5000 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be 0–100'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('brand')
    .optional()
    .trim(),

  body('thumbnail')
    .optional()
    .isURL().withMessage('Thumbnail must be a valid URL (or upload an image)'),
];

const updateProductValidator = [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 5000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim(),
];

const productQueryValidator = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
  query('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a non-negative integer'),
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
];

module.exports = { createProductValidator, updateProductValidator, productQueryValidator };
