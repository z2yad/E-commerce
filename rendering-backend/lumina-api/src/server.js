require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// ── Unhandled promise rejections ──────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// ── Uncaught exceptions ────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

// ── Connect DB then start server ──────────────────────────────────
const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`
┌──────────────────────────────────────────────┐
│  🛍️  Lumina API Server                        │
│  ─────────────────────────────────────────── │
│  Port:    ${PORT}                              │
│  Mode:    ${process.env.NODE_ENV || 'development'}                      │
│  API:     http://localhost:${PORT}/api/v1      │
│  Docs:    http://localhost:${PORT}/api/docs    │
│  Health:  http://localhost:${PORT}/health      │
└──────────────────────────────────────────────┘
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
};

start();
