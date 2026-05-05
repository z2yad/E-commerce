require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const { globalErrorHandler } = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

// ── Routes ────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ── Security headers ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving uploaded images
  })
);

// ── CORS ──────────────────────────────────────────────────────────
// Allow the Angular dev server (4200) and any configured FRONTEND_URL
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Compression ───────────────────────────────────────────────────
app.use(compression());

// ── Request logging (dev only) ────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── MongoDB query injection sanitization ──────────────────────────
app.use(mongoSanitize());


// ── Static files (uploaded images) ───────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Swagger UI ────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Lumina API Docs',
    customCss: `
      .swagger-ui .topbar { background: linear-gradient(135deg, #d97706, #ec4899); }
      .swagger-ui .topbar-wrapper img { display: none; }
      .swagger-ui .topbar-wrapper::before { content: 'Lumina API'; color: white; font-size: 1.5rem; font-weight: bold; }
    `,
  })
);
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ success: true, status: 'ok', env: process.env.NODE_ENV, time: new Date().toISOString() })
);

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 handler ───────────────────────────────────────────────────
app.all('*', (req, res, next) =>
  next(new ApiError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404))
);

// ── Global error handler ──────────────────────────────────────────
app.use(globalErrorHandler);

module.exports = app;
