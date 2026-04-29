const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { success, created, paginated, error: sendError } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ── GET /api/v1/products ─────────────────────────────────────────
// Angular ProductService: getallproducts({ limit, skip, search, category })
// Response shape: { products, total, skip, limit } — matches dummyjson.com
exports.getProducts = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const { search, category, minPrice, maxPrice, featured } = req.query;

  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category.toLowerCase();
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  // Use dummyjson-compatible envelope so Angular service works without change
  return res.status(200).json({
    success: true,
    products,
    total,
    skip,
    limit,
  });
});

// ── GET /api/v1/products/search ──────────────────────────────────
// Angular uses /products?search=term OR /products/search?q=term
exports.searchProducts = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const q = req.query.q || req.query.search || '';

  const filter = { isActive: true };
  if (q) {
    filter.$text = { $search: q };
  }

  const [products, total] = await Promise.all([
    Product.find(filter, q ? { score: { $meta: 'textScore' } } : {})
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json({ success: true, products, total, skip, limit });
});

// ── GET /api/v1/products/categories ─────────────────────────────
// Angular: getcategories() expects Category[] { slug, name, url }
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return success(res, categories);
});

// ── GET /api/v1/products/category/:categorySlug ──────────────────
exports.getProductsByCategory = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const { categorySlug } = req.params;

  const filter = { isActive: true, category: categorySlug.toLowerCase() };
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json({ success: true, products, total, skip, limit });
});

// ── GET /api/v1/products/:id ─────────────────────────────────────
// Angular: getproductbyid(id) → expects Product object directly
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    return next(new ApiError('Product not found.', 404));
  }
  return success(res, product);
});

// ── POST /api/v1/products (admin) ────────────────────────────────
exports.createProduct = catchAsync(async (req, res) => {
  const data = { ...req.body };

  // Handle uploaded thumbnail/images from multer
  if (req.files?.thumbnail?.[0]) {
    data.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
  }
  if (req.files?.images) {
    data.images = req.files.images.map((f) => `/uploads/products/${f.filename}`);
  }

  // Auto-sync category in Category collection
  if (data.category) {
    await Category.findOneAndUpdate(
      { slug: data.category.toLowerCase() },
      { $inc: { productCount: 1 } }
    );
  }

  const product = await Product.create(data);
  return created(res, product, 'Product created successfully');
});

// ── PUT /api/v1/products/:id (admin) ─────────────────────────────
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new ApiError('Product not found.', 404));
  return success(res, product, 'Product updated successfully');
});

// ── DELETE /api/v1/products/:id (admin) ──────────────────────────
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) return next(new ApiError('Product not found.', 404));
  return success(res, null, 'Product deleted successfully');
});

// ── POST /api/v1/products/:id/reviews ────────────────────────────
exports.addReview = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ApiError('Product not found.', 404));

  // One review per user per product
  const already = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (already) return next(new ApiError('You have already reviewed this product.', 409));

  product.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment });
  product.recalculateRating();
  await product.save();

  return created(res, product, 'Review added');
});
