const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createOrderValidator, updateOrderStatusValidator } = require('../validators/order.validator');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order lifecycle management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place a new order (authenticated users)
 *     description: |
 *       Called when the Angular Checkout form is submitted.
 *       Validates stock, creates order snapshot, decrements inventory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:  { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *               shippingAddress: { $ref: '#/components/schemas/ShippingAddress' }
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, cash_on_delivery, paypal]
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order placed, confirmation email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Insufficient stock or invalid item
 */
router.post('/', protect, createOrderValidator, validate, orderController.createOrder);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     tags: [Orders]
 *     summary: Get current user's order history
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: skip
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User's orders
 */
router.get('/my', protect, orderController.getMyOrders);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin) or user's orders (user)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: skip
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get('/', protect, orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order detail
 *       403:
 *         description: Not your order
 *       404:
 *         description: Not found
 */
router.get('/:id', protect, orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protect, adminOnly, updateOrderStatusValidator, validate, orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', protect, adminOnly, orderController.deleteOrder);

module.exports = router;
