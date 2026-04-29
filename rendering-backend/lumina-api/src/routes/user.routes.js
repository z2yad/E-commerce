const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateUserValidator, updateProfileValidator } = require('../validators/user.validator');
const upload = require('../config/multer');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile & admin user management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user's profile
 *     responses:
 *       200:
 *         description: User profile with order count
 */
router.get('/profile', protect, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user's profile
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:    { type: string }
 *               phone:   { type: string }
 *               avatar:  { type: string, format: binary }
 *               address.street:  { type: string }
 *               address.city:    { type: string }
 *               address.state:   { type: string }
 *               address.zip:     { type: string }
 *               address.country: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put(
  '/profile',
  protect,
  upload.single('avatar'),
  updateProfileValidator,
  validate,
  userController.updateProfile
);

// ── Admin: manage all users ────────────────────────────────────────

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: skip
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/', protect, adminOnly, userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User detail
 */
router.get('/:id', protect, adminOnly, userController.getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:     { type: string }
 *               email:    { type: string }
 *               role:     { type: string, enum: [user, admin] }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', protect, adminOnly, updateUserValidator, validate, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', protect, adminOnly, userController.deleteUser);

/**
 * @swagger
 * /users/{id}/block:
 *   patch:
 *     tags: [Users]
 *     summary: Block a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User blocked
 */
router.patch('/:id/block', protect, adminOnly, userController.blockUser);

/**
 * @swagger
 * /users/{id}/unblock:
 *   patch:
 *     tags: [Users]
 *     summary: Unblock a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User unblocked
 */
router.patch('/:id/unblock', protect, adminOnly, userController.unblockUser);

module.exports = router;
