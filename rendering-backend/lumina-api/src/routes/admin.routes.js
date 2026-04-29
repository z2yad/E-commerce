const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only dashboard & analytics endpoints
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard stats (revenue, users, orders, products)
 *     description: |
 *       Returns stats cards and recent orders compatible with the
 *       Angular AdminDashboard component's `stats` and `recentOrders` signals.
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:  { type: string }
 *                           value:  { type: string }
 *                           growth: { type: string }
 *                           type:   { type: string, enum: [up, down] }
 *                           color:  { type: string }
 *                     recentOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:       { type: string }
 *                           customer: { type: string }
 *                           product:  { type: string }
 *                           amount:   { type: string }
 *                           status:   { type: string }
 *                           date:     { type: string }
 *                     summary:
 *                       type: object
 */
router.get('/stats', adminController.getDashboardStats);

/**
 * @swagger
 * /admin/stats/sales:
 *   get:
 *     tags: [Admin]
 *     summary: Get sales chart data for the last N days
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 7 }
 *         description: Number of days to query (7 / 14 / 30)
 *     responses:
 *       200:
 *         description: Daily revenue and order counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:    { type: string, example: '2026-04-22' }
 *                       revenue: { type: number }
 *                       orders:  { type: integer }
 */
router.get('/stats/sales', adminController.getSalesChart);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Get all orders (admin dashboard orders page)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated orders
 */
router.get('/orders', adminController.getAdminOrders);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (admin dashboard users page)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get('/users', adminController.getAdminUsers);

module.exports = router;
