/**
 * Lumina Database Seeder
 * Run: node src/database/seed.js
 *
 * Creates:
 *  - 1 admin user (admin@luxury.com / admin123)
 *  - 5 categories
 *  - 30 sample products  ← same fields as dummyjson.com for Angular compatibility
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { productImages } = require('./product-images');
const { SUPERMARKET_CATEGORY, getSupermarketProducts } = require('./supermarket-products');

// ── Seed data ─────────────────────────────────────────────────────

const categories = [
  { name: 'Fragrances', slug: 'fragrances', description: 'Luxury perfumes and colognes' },
  { name: 'Skincare', slug: 'skincare', description: 'Premium skincare products' },
  { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories' },
  { name: 'Electronics', slug: 'electronics', description: 'Premium tech products' },
  { name: 'Clothing', slug: 'clothing', description: 'Luxury fashion clothing' },
  SUPERMARKET_CATEGORY,
];

const buildProducts = () => [
  {
    title: 'Essence Midnight Bloom',
    description: 'A captivating blend of midnight jasmine, amber, and sandalwood. A sophisticated fragrance for the modern connoisseur.',
    price: 149.99,
    discountPercentage: 12,
    rating: 4.8,
    stock: 25,
    brand: 'Lumina Essence',
    category: 'fragrances',
    ...productImages.midnightBloom,
    isFeatured: true,
    tags: ['perfume', 'luxury', 'jasmine'],
  },
  {
    title: 'Golden Oud Elixir',
    description: 'Rich oud wood with notes of rose and amber. An opulent fragrance inspired by the Arabian Gulf.',
    price: 229.99,
    discountPercentage: 0,
    rating: 4.9,
    stock: 15,
    brand: 'Lumina Essence',
    category: 'fragrances',
    ...productImages.goldenOud,
    isFeatured: true,
    tags: ['oud', 'luxury', 'arabic'],
  },
  {
    title: 'Crystal Luminance Serum',
    description: 'Advanced brightening serum with vitamin C, hyaluronic acid, and diamond dust for a radiant glow.',
    price: 89.99,
    discountPercentage: 20,
    rating: 4.7,
    stock: 40,
    brand: 'Lumina Glow',
    category: 'skincare',
    ...productImages.crystalSerum,
    isFeatured: true,
    tags: ['serum', 'vitamin-c', 'brightening'],
  },
  {
    title: 'Obsidian Hydra Cream',
    description: 'Intense 72-hour moisture retention with black pearl extract and peptides.',
    price: 119.99,
    discountPercentage: 0,
    rating: 4.6,
    stock: 30,
    brand: 'Lumina Glow',
    category: 'skincare',
    ...productImages.hydraCream,
    isFeatured: false,
    tags: ['moisturizer', 'hydration'],
  },
  {
    title: 'Premium Leather Wallet',
    description: 'Full-grain Italian leather wallet with RFID blocking and 8 card slots.',
    price: 129.99,
    discountPercentage: 10,
    rating: 4.7,
    stock: 50,
    brand: 'Lumina Craft',
    category: 'accessories',
    ...productImages.leatherWallet,
    isFeatured: true,
    tags: ['wallet', 'leather', 'rfid'],
  },
  {
    title: 'Silk Knit Scarf',
    description: '100% Mulberry silk scarf with hand-rolled edges. Comes in a luxe gift box.',
    price: 189.99,
    discountPercentage: 0,
    rating: 4.8,
    stock: 20,
    brand: 'Lumina Craft',
    category: 'accessories',
    ...productImages.silkScarf,
    isFeatured: false,
    tags: ['silk', 'scarf', 'gift'],
  },
  {
    title: 'Noir Aviator Sunglasses',
    description: 'Polarized UV400 lenses with titanium frame and anti-scratch coating.',
    price: 299.99,
    discountPercentage: 15,
    rating: 4.9,
    stock: 12,
    brand: 'Lumina Vision',
    category: 'accessories',
    ...productImages.sunglasses,
    isFeatured: true,
    tags: ['sunglasses', 'polarized', 'titanium'],
  },
  {
    title: 'Pro Wireless ANC Headphones',
    description: 'Active noise cancellation with 40h battery life, LDAC Bluetooth codec, and memory foam ear pads.',
    price: 349.99,
    discountPercentage: 18,
    rating: 4.8,
    stock: 35,
    brand: 'Lumina Audio',
    category: 'electronics',
    ...productImages.headphones,
    isFeatured: true,
    tags: ['headphones', 'anc', 'bluetooth'],
  },
  {
    title: 'Smart Luxury Watch',
    description: 'Sapphire crystal display with health monitoring, GPS, and titanium case. 7-day battery.',
    price: 499.99,
    discountPercentage: 5,
    rating: 4.9,
    stock: 18,
    brand: 'Lumina Time',
    category: 'electronics',
    ...productImages.smartWatch,
    isFeatured: true,
    tags: ['smartwatch', 'health', 'gps'],
  },
  {
    title: '4K Portable Projector',
    description: 'Mini 4K laser projector with 1200 ANSI lumens and built-in Dolby Audio speakers.',
    price: 599.99,
    discountPercentage: 0,
    rating: 4.6,
    stock: 10,
    brand: 'Lumina Vision',
    category: 'electronics',
    ...productImages.projector,
    isFeatured: false,
    tags: ['projector', '4k', 'portable'],
  },
  {
    title: 'Cashmere Turtleneck',
    description: '100% Grade A Mongolian cashmere turtleneck. Ultra-soft, wrinkle-resistant, hand wash only.',
    price: 249.99,
    discountPercentage: 0,
    rating: 4.7,
    stock: 22,
    brand: 'Lumina Fashion',
    category: 'clothing',
    ...productImages.cashmereTurtleneck,
    isFeatured: false,
    tags: ['cashmere', 'turtleneck', 'luxury'],
  },
  {
    title: 'Tailored Wool Blazer',
    description: 'Italian wool blend blazer with Bemberg lining. Made to measure.',
    price: 399.99,
    discountPercentage: 25,
    rating: 4.8,
    stock: 8,
    brand: 'Lumina Fashion',
    category: 'clothing',
    ...productImages.woolBlazer,
    isFeatured: true,
    tags: ['blazer', 'wool', 'tailored'],
  },
  // More products to reach 30 ...
  ...[
    { title: 'Rose Absolute Parfum', category: 'fragrances', price: 189, brand: 'Lumina Essence', discountPercentage: 0, stock: 20, rating: 4.7, image: productImages.roseParfum },
    { title: 'White Tea Body Mist', category: 'fragrances', price: 59.99, brand: 'Lumina Essence', discountPercentage: 10, stock: 60, rating: 4.5, image: productImages.whiteTeaMist },
    { title: 'Retinol Night Complex', category: 'skincare', price: 99.99, brand: 'Lumina Glow', discountPercentage: 0, stock: 35, rating: 4.6, image: productImages.retinolComplex },
    { title: 'Eye Revival Eye Cream', category: 'skincare', price: 74.99, brand: 'Lumina Glow', discountPercentage: 15, stock: 28, rating: 4.5, image: productImages.eyeCream },
    { title: 'SPF 50+ Invisible Shield', category: 'skincare', price: 45.99, brand: 'Lumina Glow', discountPercentage: 0, stock: 80, rating: 4.8, image: productImages.spfShield },
    { title: 'Linen Pocket Square', category: 'accessories', price: 39.99, brand: 'Lumina Craft', discountPercentage: 0, stock: 100, rating: 4.4, image: productImages.pocketSquare },
    { title: 'Calfskin Belt', category: 'accessories', price: 149.99, brand: 'Lumina Craft', discountPercentage: 5, stock: 40, rating: 4.6, image: productImages.calfskinBelt },
    { title: 'Gold Plated Cufflinks', category: 'accessories', price: 89.99, brand: 'Lumina Craft', discountPercentage: 0, stock: 55, rating: 4.7, image: productImages.cufflinks },
    { title: 'Wireless Charging Pad', category: 'electronics', price: 79.99, brand: 'Lumina Audio', discountPercentage: 10, stock: 45, rating: 4.5, image: productImages.chargingPad },
    { title: 'Noise-Isolating Earbuds', category: 'electronics', price: 199.99, brand: 'Lumina Audio', discountPercentage: 20, stock: 32, rating: 4.7, image: productImages.earbuds },
    { title: 'Slim Leather Card Case', category: 'accessories', price: 59.99, brand: 'Lumina Craft', discountPercentage: 0, stock: 70, rating: 4.6, image: productImages.cardCase },
    { title: 'Merino Wool Beanie', category: 'clothing', price: 79.99, brand: 'Lumina Fashion', discountPercentage: 0, stock: 45, rating: 4.5, image: productImages.woolBeanie },
    { title: 'Silk Dress Shirt', category: 'clothing', price: 179.99, brand: 'Lumina Fashion', discountPercentage: 10, stock: 15, rating: 4.7, image: productImages.silkShirt },
    { title: 'Amber Oud Candle', category: 'fragrances', price: 49.99, brand: 'Lumina Home', discountPercentage: 0, stock: 50, rating: 4.6, image: productImages.oudCandle },
    { title: 'Vitamin C Eye Patches', category: 'skincare', price: 34.99, brand: 'Lumina Glow', discountPercentage: 20, stock: 120, rating: 4.4, image: productImages.eyePatches },
    { title: 'Titanium Money Clip', category: 'accessories', price: 49.99, brand: 'Lumina Craft', discountPercentage: 0, stock: 90, rating: 4.5, image: productImages.moneyClip },
    { title: 'Bluetooth Speaker Orb', category: 'electronics', price: 249.99, brand: 'Lumina Audio', discountPercentage: 8, stock: 25, rating: 4.8, image: productImages.speakerOrb },
    { title: 'Slim-Fit Chinos', category: 'clothing', price: 139.99, brand: 'Lumina Fashion', discountPercentage: 0, stock: 30, rating: 4.6, image: productImages.chinos },
  ].map(({ image, ...p }) => ({
    ...p,
    description: `Premium ${p.title.toLowerCase()} crafted with exceptional materials and attention to detail.`,
    ...image,
    isFeatured: false,
    tags: [p.category, 'luxury', 'lumina'],
  })),
];

// ── Seed ──────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  console.log('🌱 Starting seed...');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  console.log('🗑️  Cleared existing data');

  // Admin user
  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Admin Premium',
    email: process.env.ADMIN_EMAIL || 'admin@luxury.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    isEmailVerified: true,
    avatar: 'https://i.pravatar.cc/150?u=admin-lumina',
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Demo customer
  await User.create({
    name: 'Alex Rivera',
    email: 'alex@lumina.com',
    password: 'customer123',
    role: 'user',
    isEmailVerified: true,
    avatar: 'https://i.pravatar.cc/150?u=alex',
  });
  console.log('✅ Demo customer created: alex@lumina.com / customer123');

  // Categories
  const cats = await Category.insertMany(categories);
  console.log(`✅ ${cats.length} categories created`);

  // Products
  const baseProducts = buildProducts();
  let supermarketProducts = [];

  try {
    supermarketProducts = await getSupermarketProducts();
  } catch (err) {
    console.warn(`Could not fetch DummyJSON supermarket products: ${err.message}`);
  }

  const products = [...baseProducts, ...supermarketProducts];
  const created = await Product.insertMany(products);
  console.log(`✅ ${created.length} products created`);

  // Update category product counts
  for (const cat of categories) {
    const count = products.filter((p) => p.category === cat.slug).length;
    await Category.updateOne({ slug: cat.slug }, { productCount: count });
  }

  console.log('\n✨ Seed complete!');
  console.log('─'.repeat(40));
  console.log(`Admin:    ${process.env.ADMIN_EMAIL || 'admin@luxury.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log('Customer: alex@lumina.com / customer123');
  console.log('─'.repeat(40));

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
