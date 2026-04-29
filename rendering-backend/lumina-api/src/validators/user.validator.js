const { body } = require('express-validator');

const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),
];

const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim(),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zip').optional().trim(),
  body('address.country').optional().trim(),
];

module.exports = { updateUserValidator, updateProfileValidator };
