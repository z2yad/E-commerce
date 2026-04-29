const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createProductValidator,
  updateProductValidator,
  productQueryValidator,
} = require('../validators/product.validator');
const upload = require('../config/multer');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filtering and pagination
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 30, maximum: 100 }
 *       - in: query
 *         name: skip
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Products list — same shape as dummyjson.com
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 products:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 total: { type: integer }
 *                 skip:  { type: integer }
 *                 limit: { type: integer }
 */
router.get('/', productQueryValidator, validate, productController.getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     tags: [Products]
 *     summary: Search products by keyword (?q=term)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: skip
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Matching products
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     tags: [Products]
 *     summary: Get all product categories
 *     security: []
 *     responses:
 *       200:
 *         description: Categories list — shape matches Angular Category interface
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 */
router.get('/categories', productController.getCategories);

/**
 * @swagger
 * /products/category/{categorySlug}:
 *   get:
 *     tags: [Products]
 *     summary: Get products by category slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: categorySlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Products in category
 */
router.get('/category/:categorySlug', productController.getProductsByCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, price, stock, category]
 *             properties:
 *               title:             { type: string }
 *               description:       { type: string }
 *               price:             { type: number }
 *               discountPercentage: { type: number }
 *               stock:             { type: integer }
 *               brand:             { type: string }
 *               category:          { type: string }
 *               isFeatured:        { type: boolean }
 *               thumbnail:         { type: string, format: binary }
 *               images:            { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Admin only
 */
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]),
  createProductValidator,
  validate,
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', protect, adminOnly, updateProductValidator, validate, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Soft-delete a product (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     tags: [Products]
 *     summary: Add a review to a product (authenticated)
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
 *             required: [rating]
 *             properties:
 *               rating:  { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review added
 *       409:
 *         description: Already reviewed
 */
router.post('/:id/reviews', protect, productController.addReview);

module.exports = router;
