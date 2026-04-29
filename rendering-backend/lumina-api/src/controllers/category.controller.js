const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { success, created } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ── GET /api/v1/categories ────────────────────────────────────────
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return success(res, categories);
});

// ── GET /api/v1/categories/:id ────────────────────────────────────
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ApiError('Category not found.', 404));
  return success(res, category);
});

// ── POST /api/v1/categories (admin) ──────────────────────────────
exports.createCategory = catchAsync(async (req, res, next) => {
  const exists = await Category.findOne({ name: req.body.name });
  if (exists) return next(new ApiError('A category with this name already exists.', 409));

  if (req.file) {
    req.body.image = `/uploads/products/${req.file.filename}`;
  }

  const category = await Category.create(req.body);
  return created(res, category, 'Category created successfully');
});

// ── PUT /api/v1/categories/:id (admin) ───────────────────────────
exports.updateCategory = catchAsync(async (req, res, next) => {
  const existingCategory = await Category.findById(req.params.id);
  if (!existingCategory) return next(new ApiError('Category not found.', 404));

  const previousSlug = existingCategory.slug;

  if (req.file) {
    req.body.image = `/uploads/products/${req.file.filename}`;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Update category slug in all related products if name changed
  if (req.body.name && previousSlug !== category.slug) {
    await Product.updateMany(
      { category: previousSlug },
      { category: category.slug }
    );
  }

  return success(res, category, 'Category updated successfully');
});

// ── DELETE /api/v1/categories/:id (admin) ────────────────────────
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ApiError('Category not found.', 404));

  const productCount = await Product.countDocuments({ category: category.slug, isActive: true });
  if (productCount > 0) {
    return next(
      new ApiError(
        `Cannot delete category with ${productCount} active products. Reassign or delete products first.`,
        400
      )
    );
  }

  await Category.findByIdAndDelete(req.params.id);
  return success(res, null, 'Category deleted successfully');
});
