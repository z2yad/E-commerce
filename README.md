# ◈ Lumina — Premium E-Commerce Platform
## `// Full-stack e-commerce with Angular 21 SSR + Express.js backend`

> A production-ready, full-stack e-commerce application built with **Angular 21** and **Express.js**, featuring Server-Side Rendering, JWT authentication, Swagger documentation, and a complete admin dashboard with analytics.

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031?style=for-the-badge&logo=angular)
![Express](https://img.shields.io/badge/Express.js-4.18.3-90C53F?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.23-10AA50?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-4fd1c5?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Default Credentials](#-default-credentials)
- [Database Seeding](#-database-seeding)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ Customer Storefront
- **Product Catalog** — Dynamic product listings with pagination and real-time search
- **Category Filtering** — Browse by category with sub-filters
- **Product Details** — Rich product pages with image galleries and specifications
- **Shopping Cart** — Reactive cart with Angular Signals, persisted to localStorage
- **Wishlist Management** — Save favorites with instant add-to-cart functionality
- **Secure Checkout** — Multi-step checkout flow with input validation
- **Order History** — Track orders and view past purchases
- **User Reviews** — Product ratings and customer feedback system

### 👑 Admin Dashboard
- **Analytics Dashboard** — Real-time sales metrics with 7-day revenue charts
- **Product Management** — Full CRUD operations with image upload & optimization (Sharp)
- **Order Management** — View, filter, and update order statuses
- **User Management** — Manage customer accounts (block, unblock, delete)
- **Inventory Tracking** — Monitor product stock levels
- **Sales Reports** — Generate detailed sales and revenue reports
- **Performance Metrics** — Top products, customer activity, trends

### 🔐 Authentication & Security
- **User Registration & Login** — Secure account creation with email verification
- **JWT Token Authentication** — Access tokens (`15m`) + Refresh tokens (`7d`) with rotation
- **Password Reset** — Email-based password recovery via Nodemailer
- **Role-Based Access Control (RBAC)** — Separate customer and admin routes
- **Security Headers** — Helmet.js for XSS, CORS, NoSQL injection protection
- **Rate Limiting** — Protection against brute force attacks (100 req/15min, 10 auth attempts)
- **Password Hashing** — bcryptjs with salt rounds

### ⚡ Technical Excellence
- **Server-Side Rendering (SSR)** — Angular Universal for SEO optimization and faster FCP
- **Lazy-Loaded Routes** — Module-based code splitting for performance
- **Angular Signals** — Modern state management replacing traditional RxJS patterns
- **Responsive Design** — Mobile-first UI with Tailwind CSS dark theme
- **Glassmorphism Effects** — Modern UI with backdrop blur and transparency effects
- **Skeleton Loading** — Better UX with animated loading states
- **Image Optimization** — Sharp for thumbnail generation and format conversion
- **REST API with Swagger** — Full OpenAPI 3.0 documentation at `/api/docs`

---

## 💻 Tech Stack

### Frontend — `/rendering`

| Component | Technology | Version |
|---|---|---|
| **Framework** | Angular | 21.0.0 |
| **Language** | TypeScript | 5.9.2 |
| **CSS Framework** | Tailwind CSS | 4.2.1 |
| **UI Icons** | Lucide Angular | 0.577.0 |
| **SSR** | @angular/ssr (Angular Universal) | 21.0.1 |
| **State Management** | Angular Signals | 21.0.0 |
| **Notifications** | ngx-sonner | 3.1.0 |
| **Testing** | Vitest | 4.1.0 |
| **Utilities** | clsx, tailwind-merge, class-variance-authority | Latest |

### Backend — `/rendering-backend/lumina-api`

| Component | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 4.18.3 |
| **Database** | MongoDB + Mongoose | 8.23.1 |
| **Language** | JavaScript (ES6+) | — |
| **Authentication** | JWT (jsonwebtoken) | 9.0.2 |
| **Password Security** | bcryptjs | 2.4.3 |
| **Validation** | express-validator | 7.0.1 |
| **API Documentation** | Swagger UI / OpenAPI 3.0 | 6.2.8 |
| **Email Service** | Nodemailer | 8.0.7 |
| **File Upload** | Multer | Latest |
| **Image Processing** | Sharp | Latest |
| **Security** | Helmet.js, CORS, Rate Limit | Latest |
| **Environment Config** | dotenv | Latest |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** — Version 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** — Version 9.0.0 or higher (comes with Node.js)
- **Angular CLI** — `npm install -g @angular/cli@21`
- **MongoDB** — Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI
- **Git** — For version control

### Verify Installation
```bash
node --version       # Should be v18.0.0 or higher
npm --version        # Should be v9.0.0 or higher
ng version           # Should show Angular 21
mongod --version     # Should be v4.0 or higher
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/z2yad/E-commerce.git
cd E-commerce
```

### 2. Setup Backend — Lumina API

```bash
# Navigate to backend directory
cd rendering-backend/lumina-api

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env with your configuration
# - MongoDB URI (local: mongodb://localhost:27017/rendering OR Atlas)
# - JWT secrets (change from defaults!)
# - Email credentials (Gmail, SendGrid, etc.)
# - Frontend URL for CORS

# Seed the database (creates admin + sample products)
npm run seed

# Start development server
npm run dev
# API running at http://localhost:5000
```

### 3. Setup Frontend — Lumina UI

```bash
# Navigate to frontend directory (from project root)
cd rendering

# Install dependencies
npm install

# Start development server
npm start
# App running at http://localhost:4200
```

### 4. Access the Application

- **Frontend** — http://localhost:4200
- **API** — http://localhost:5000
- **API Docs** — http://localhost:5000/api/docs
- **Admin Login** — admin@luxury.com / admin123 (after seed)
- **Customer Test** — alex@lumina.com / customer123 (after seed)

---

## 📂 Project Structure

```
E-commerce/
├── rendering/                          # Angular 21 Frontend (SSR)
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/              # Feature modules (products, cart, checkout, etc.)
│   │   │   │   ├── admin/             # Admin dashboard
│   │   │   │   ├── auth/              # Login, register, password reset
│   │   │   │   ├── cart/              # Shopping cart management
│   │   │   │   ├── checkout/          # Checkout flow
│   │   │   │   ├── products/          # Product listing & details
│   │   │   │   ├── profile/           # User profile & orders
│   │   │   │   └── [other routes]
│   │   │   ├── core/                  # Core services & interceptors
│   │   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   │   └── [core services]
│   │   │   ├── shared/                # Shared components & utilities
│   │   │   │   ├── components/        # Reusable components
│   │   │   │   ├── guards/            # Route guards
│   │   │   │   └── utils/             # Utility functions
│   │   │   ├── home/                  # Home page component
│   │   │   ├── services/              # Application services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── seo.service.ts
│   │   │   │   └── [other services]
│   │   │   ├── app.routes.ts          # Main routing
│   │   │   ├── app.config.ts          # App configuration
│   │   │   └── app.ts                 # Root component
│   │   ├── main.ts                    # Bootstrap script
│   │   ├── main.server.ts             # SSR bootstrap
│   │   ├── server.ts                  # Express server for SSR
│   │   ├── styles.css                 # Global styles
│   │   └── index.html                 # Main HTML file
│   ├── angular.json                   # Angular CLI config
│   ├── tsconfig.json                  # TypeScript config
│   ├── package.json                   # Frontend dependencies
│   └── README.md                       # Frontend-specific docs
│
├── rendering-backend/
│   └── lumina-api/                    # Express.js Backend
│       ├── src/
│       │   ├── controllers/           # Request handlers
│       │   │   ├── auth.controller.js
│       │   │   ├── product.controller.js
│       │   │   ├── cart.controller.js
│       │   │   ├── order.controller.js
│       │   │   ├── admin.controller.js
│       │   │   └── [other controllers]
│       │   ├── models/                # Mongoose schemas
│       │   │   ├── user.model.js
│       │   │   ├── product.model.js
│       │   │   ├── order.model.js
│       │   │   ├── category.model.js
│       │   │   └── refreshToken.model.js
│       │   ├── routes/                # API route definitions
│       │   │   ├── auth.routes.js
│       │   │   ├── product.routes.js
│       │   │   ├── order.routes.js
│       │   │   └── [other routes]
│       │   ├── middlewares/           # Express middlewares
│       │   │   ├── auth.middleware.js
│       │   │   ├── error.middleware.js
│       │   │   ├── validate.middleware.js
│       │   │   └── admin.middleware.js
│       │   ├── services/              # Business logic
│       │   │   ├── token.service.js
│       │   │   └── email.service.js
│       │   ├── utils/                 # Utility functions
│       │   │   └── ApiError.js
│       │   ├── config/                # Configuration files
│       │   │   ├── database.js
│       │   │   ├── jwt.js
│       │   │   ├── multer.js
│       │   │   └── swagger.js
│       │   ├── validators/            # Input validators
│       │   ├── database/              # Database seeds & migrations
│       │   │   ├── seed.js
│       │   │   └── [migration scripts]
│       │   ├── app.js                 # Express app setup
│       │   └── server.js              # Server entry point
│       ├── uploads/                   # User uploads directory
│       │   ├── avatars/
│       │   └── products/
│       ├── .env.example               # Environment variables template
│       ├── package.json               # Backend dependencies
│       ├── README.md                  # Backend-specific docs
│       └── IMPLEMENTATION_REPORT.md   # Technical implementation details
│
└── README.md                          # This file

```

---

## 🔧 Environment Configuration

### Backend `.env` File

Create `.env` in `rendering-backend/lumina-api/` directory:

```env
# ─── Server ───────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ─── MongoDB ──────────────────────────────────────────────────────
# Local: mongodb://localhost:27017/rendering
# Atlas: mongodb+srv://user:password@cluster.mongodb.net/rendering
MONGODB_URI=mongodb://localhost:27017/rendering

# ─── JWT (Change these in production!) ─────────────────────────────
JWT_ACCESS_SECRET=your_long_random_secret_min_32_chars_prod
JWT_REFRESH_SECRET=your_long_random_secret_min_32_chars_prod
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# ─── Email Configuration ──────────────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use Gmail app password, not actual password
EMAIL_FROM="Lumina Store <noreply@lumina.com>"

# ─── Frontend URL (CORS) ───────────────────────────────────────────
FRONTEND_URL=http://localhost:4200

# ─── File Upload ───────────────────────────────────────────────────
MAX_FILE_SIZE=5242880       # 5MB in bytes
UPLOAD_PATH=uploads

# ─── Rate Limiting ────────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # Max requests in window
AUTH_RATE_LIMIT_MAX=10       # Max auth attempts in window

# ─── Admin Seed ───────────────────────────────────────────────────
ADMIN_NAME=Admin Premium
ADMIN_EMAIL=admin@luxury.com
ADMIN_PASSWORD=admin123      # Change in production!
```

**Production Security Notes:**
- Use environment variables from hosting provider (Vercel, Azure, AWS, etc.)
- Never commit `.env` to version control
- Use strong, random secrets (min 32 characters)
- Use Gmail App Passwords, not account passwords
- Use MongoDB Atlas instead of local database

---

## 📚 API Documentation

### Swagger UI

Once the backend is running, access the interactive API documentation:

```
http://localhost:5000/api/docs
```

### Key API Endpoints

#### Authentication
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/auth/refresh-token    # Get new access token
POST   /api/auth/logout           # Logout
POST   /api/auth/password-reset   # Request password reset
```

#### Products
```
GET    /api/products              # Get all products (paginated)
GET    /api/products/:id          # Get product details
GET    /api/categories            # Get all categories
POST   /api/admin/products        # Create product (admin only)
PUT    /api/admin/products/:id    # Update product (admin only)
DELETE /api/admin/products/:id    # Delete product (admin only)
```

#### Orders
```
POST   /api/orders                # Create order
GET    /api/orders                # Get user's orders
GET    /api/orders/:id            # Get order details
PUT    /api/admin/orders/:id      # Update order status (admin)
```

#### Users
```
GET    /api/users/profile         # Get current user profile
PUT    /api/users/profile         # Update user profile
GET    /api/admin/users           # List all users (admin only)
PUT    /api/admin/users/:id       # Update user (admin only)
DELETE /api/admin/users/:id       # Delete user (admin only)
```

---

## 🔑 Default Credentials

After running `npm run seed`, use these credentials to test the application:

### Admin Account
| Field | Value |
|---|---|
| Email | admin@luxury.com |
| Password | admin123 |
| Role | Admin |

### Sample Customer Account
| Field | Value |
|---|---|
| Email | alex@lumina.com |
| Password | customer123 |
| Role | Customer |

⚠️ **Important:** Change these credentials in production!

---

## 🌱 Database Seeding

The seed script automatically creates:
- **1 Admin User** with full permissions
- **10 Sample Customers** with complete profiles
- **50 Product Samples** across multiple categories (Fashion, Electronics, Beauty)
- **10 Sample Orders** with various statuses
- **3 Product Categories**

### Run Seeding

```bash
cd rendering-backend/lumina-api

# Clear and reseed the database
npm run seed

# Expected output:
# ✓ Database connected
# ✓ Collections dropped
# ✓ Admin user created: admin@luxury.com
# ✓ 10 customers seeded
# ✓ 50 products seeded
# ✓ 10 orders seeded
# ✓ Database seeding completed successfully!
```

---

## 📋 Available Scripts

### Backend Scripts

```bash
cd rendering-backend/lumina-api

npm run dev          # Start development server (with nodemon)
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint (if configured)
npm test             # Run tests (if configured)
```

### Frontend Scripts

```bash
cd rendering

npm start            # Start dev server (ng serve)
npm run build        # Build for production
npm run build:ssr    # Build with SSR
npm run serve:ssr    # Serve SSR version locally
npm run lint         # Run ESLint
npm test             # Run tests with Vitest
npm run test:ui      # Open Vitest UI
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

```bash
# The `rendering` folder can be deployed to Vercel
# Push to GitHub, connect repo to Vercel, it auto-deploys
# Build command: npm run build:ssr
# Output directory: dist/rendering/browser
```

### Backend Deployment (Railway, Render, Heroku, etc.)

```bash
# Push `rendering-backend/lumina-api` to your hosting provider
# Set environment variables on the platform
# Build command: npm install
# Start command: npm start
# Ensure MongoDB URI points to Atlas
```

### Environment Variables for Production

Set these on your deployment platform:
- `NODE_ENV=production`
- `MONGODB_URI=<your-mongodb-atlas-uri>`
- `JWT_ACCESS_SECRET=<strong-random-secret>`
- `JWT_REFRESH_SECRET=<strong-random-secret>`
- `FRONTEND_URL=<your-domain.com>`
- Email and other credentials

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/z2yad/E-commerce.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style
- Use ESLint for JavaScript/TypeScript
- Follow Angular style guide for frontend
- Use meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal and commercial purposes.

---

## 🙋 Support & Questions

- **Report Issues** — [GitHub Issues](https://github.com/z2yad/E-commerce/issues)
- **Discussions** — [GitHub Discussions](https://github.com/z2yad/E-commerce/discussions)
- **Email** — Contact the maintainers

---

## 🎯 Roadmap

- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Product Reviews & Ratings System
- [ ] Advanced Search & Filters
- [ ] Inventory Management
- [ ] Email Notifications
- [ ] Mobile App (React Native)
- [ ] Analytics Dashboard
- [ ] Multi-language Support (i18n)
- [ ] Dark/Light Theme Toggle
- [ ] Advanced Admin Analytics

---

<div align="center">

Made with ❤️ by the Lumina Team

[⬆ Back to top](#-lumina--premium-e-commerce-platform)

</div>

## 📜 Scripts

### Frontend (`/rendering`)

| Command | Description |
|---|---|
| `npm start` | Dev server · `:4200` |
| `npm run build` | Production build |
| `npm run test` | Run Vitest suite |
| `npm run serve:ssr:rendering` | Run SSR production server |

### Backend (`/lumina-api`)

| Command | Description |
|---|---|
| `npm run dev` | Dev server with nodemon |
| `npm start` | Production server |
| `npm run seed` | Seed MongoDB with sample data |
| `npm run lint` | ESLint |

---

## 🌐 API Reference

**Base URL:** `http://localhost:5000/api/v1`  
**Interactive Docs:** `http://localhost:5000/api/docs`

### 🔑 Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login — returns access + refresh tokens |
| `POST` | `/auth/logout` | Optional | Invalidate refresh token |
| `POST` | `/auth/refresh-token` | Public | Rotate access token |
| `GET` | `/auth/me` | Bearer | Get current user |
| `POST` | `/auth/forgot-password` | Public | Send password reset email |
| `POST` | `/auth/reset-password/:token` | Public | Reset password |
| `POST` | `/auth/change-password` | Bearer | Change password |
| `GET` | `/auth/verify-email/:token` | Public | Verify email address |

### 📦 Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | Public | List products (paginated) |
| `GET` | `/products/search?q=...` | Public | Search products |
| `GET` | `/products/:id` | Public | Product details |
| `POST` | `/products` | Admin | Create product |
| `PUT` | `/products/:id` | Admin | Update product |
| `DELETE` | `/products/:id` | Admin | Delete product |
| `POST` | `/products/:id/reviews` | Bearer | Add review |

### 🧾 Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/orders` | Bearer | Place an order |
| `GET` | `/orders/my` | Bearer | Current user's orders |
| `GET` | `/orders/:id` | Bearer | Order details |
| `PUT` | `/orders/:id/status` | Admin | Update order status |

### 📊 Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | Admin | Dashboard statistics |
| `GET` | `/admin/stats/sales?days=7` | Admin | Rolling sales data |
| `GET` | `/admin/orders` | Admin | All orders |
| `GET` | `/admin/users` | Admin | All users |

### Response Format

```json
{
  "success": true,
  "data": {},
  "total": 100,
  "skip": 0,
  "limit": 10
}
```

---

## 🔒 Security

| Measure | Detail |
|---|---|
| 🔑 bcrypt passwords | 12 rounds of hashing |
| 🔄 JWT rotation | 15m access · 7d refresh with reuse detection |
| 🚦 Rate limiting | 100 req/15 min general · 10 req/15 min on auth routes |
| 🛡️ Helmet headers | HTTP security headers on every response |
| 🧹 XSS + NoSQL clean | `xss-clean` + `express-mongo-sanitize` |
| 🌐 CORS restricted | Configured frontend origins only |

---

## 🗂️ Project Structure

```text
E-comerce/
├── rendering/                          # 🎨 Angular Frontend (SPA + SSR)
│   └── src/
│       └── app/
│           ├── core/
│           │   └── interceptors/       # 🛡️ HTTP auth interceptor (token refresh)
│           ├── shared/
│           │   ├── components/         # 🧩 Header, loading, stats-card, toast
│           │   ├── guards/             # 🚦 auth.guard, admin.guard
│           │   └── utils/
│           ├── features/
│           │   ├── admin/              # 👑 Admin dashboard
│           │   ├── auth/               # 🔐 Login & register
│           │   ├── products/           # 📦 Product list & details
│           │   ├── cart/               # 🛒 Shopping cart
│           │   ├── checkout/           # 💳 Checkout flow
│           │   ├── profile/            # 👤 User profile
│           │   └── not-found/          # 🚫 404 page
│           ├── home/                   # 🏠 Home page (hero + product grid)
│           ├── services/               # 🔌 HTTP services
│           └── interfaces/             # 📝 TypeScript types
│
└── rendering-backend/
    └── lumina-api/                     # ⚙️ Express REST API
        └── src/
            ├── config/                 # 🔧 DB, JWT, Multer, Swagger
            ├── models/                 # 📊 Mongoose schemas
            ├── controllers/            # 🧠 Business logic
            ├── routes/                 # 🛣️ Express routers
            ├── middlewares/            # 🚧 Auth, admin, error, validation
            ├── validators/             # ✅ Input validation schemas
            ├── services/               # 🔄 Reusable business logic
            └── database/
                └── seed.js             # 🌱 DB seeding script
```

---

## 🔧 Environment Variables

Create `rendering-backend/lumina-api/.env` from `.env.example`:

| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | API server port |
| `MONGO_URI` | `mongodb://localhost:27017/lumina` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | `your_secret` | Access token signing key |
| `JWT_REFRESH_SECRET` | `your_secret` | Refresh token signing key |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token TTL |
| `EMAIL_HOST` | `smtp.example.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USER` | `you@example.com` | SMTP username |
| `EMAIL_PASS` | `password` | SMTP password |
| `FRONTEND_URL` | `http://localhost:4200` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment mode |

---

## 📄 License

MIT — Lumina E-Commerce Platform · Angular 21 + Express.js
