const { body } = require('express-validator');

const createOrderValidator = [
  // Shipping address — mirrors the Angular Checkout form exactly
  body('shippingAddress.name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be 3–30 characters'),

  body('shippingAddress.email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('shippingAddress.address')
    .trim().notEmpty().withMessage('Address is required'),

  body('shippingAddress.city')
    .trim().notEmpty().withMessage('City is required'),

  body('shippingAddress.state')
    .trim().notEmpty().withMessage('State is required'),

  body('shippingAddress.zip')
    .trim().notEmpty().withMessage('ZIP code is required'),

  body('shippingAddress.phone')
    .trim().notEmpty().withMessage('Phone number is required'),

  body('shippingAddress.country')
    .trim().notEmpty().withMessage('Country is required'),

  // Cart items
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

  body('items.*.product')
    .notEmpty().withMessage('Product ID is required for each item'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  body('paymentMethod')
    .optional()
    .isIn(['card', 'cash_on_delivery', 'paypal'])
    .withMessage('Invalid payment method'),
];

const updateOrderStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

module.exports = { createOrderValidator, updateOrderStatusValidator };
