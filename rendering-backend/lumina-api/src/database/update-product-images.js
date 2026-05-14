/**
 * Updates existing seeded products with real product images.
 * Run: node src/database/update-product-images.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const connectDB = require('../config/database');
const Product = require('../models/product.model');
const { productImagesByTitle } = require('./product-images');

const updateProductImages = async () => {
  await connectDB();

  console.log('Updating product images...');

  let matched = 0;
  let modified = 0;

  for (const [title, image] of Object.entries(productImagesByTitle)) {
    const result = await Product.updateOne(
      { title },
      {
        $set: {
          thumbnail: image.thumbnail,
          images: image.images,
        },
      }
    );

    matched += result.matchedCount;
    modified += result.modifiedCount;
  }

  console.log(`Matched ${matched} products`);
  console.log(`Updated ${modified} products`);
  process.exit(0);
};

updateProductImages().catch((err) => {
  console.error('Product image update failed:', err);
  process.exit(1);
});
