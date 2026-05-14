/**
 * Imports groceries from DummyJSON into the local catalog as Supermarket products.
 * Run: node src/database/import-supermarket-products.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const connectDB = require('../config/database');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { SUPERMARKET_CATEGORY, getSupermarketProducts } = require('./supermarket-products');

const importSupermarketProducts = async () => {
  await connectDB();

  console.log('Importing supermarket products from DummyJSON...');

  await Category.findOneAndUpdate(
    { slug: SUPERMARKET_CATEGORY.slug },
    { $set: SUPERMARKET_CATEGORY },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const products = await getSupermarketProducts();

  let insertedOrUpdated = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { title: product.title, category: SUPERMARKET_CATEGORY.slug },
      { $set: product },
      { upsert: true, runValidators: true }
    );

    insertedOrUpdated += result.upsertedCount + result.modifiedCount;
  }

  const supermarketCount = await Product.countDocuments({
    category: SUPERMARKET_CATEGORY.slug,
    isActive: true,
  });

  await Category.updateOne(
    { slug: SUPERMARKET_CATEGORY.slug },
    { productCount: supermarketCount }
  );

  console.log(`Fetched ${products.length} supermarket products`);
  console.log(`Inserted or updated ${insertedOrUpdated} products`);
  console.log(`Supermarket active total: ${supermarketCount}`);
  process.exit(0);
};

importSupermarketProducts().catch((err) => {
  console.error('Supermarket import failed:', err);
  process.exit(1);
});
