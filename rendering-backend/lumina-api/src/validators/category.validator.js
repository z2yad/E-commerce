const { body } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateCategoryValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

module.exports = { createCategoryValidator, updateCategoryValidator };
