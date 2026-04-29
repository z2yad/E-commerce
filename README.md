# Lumina E-Commerce Platform

A full-stack e-commerce application built with **Angular 21** and **Express.js**, featuring Server-Side Rendering, JWT authentication, and a complete admin dashboard.

---

## Tech Stack

### Frontend (`/rendering`)

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 21.0.0 |
| Language | TypeScript | 5.9.2 |
| Styling | Tailwind CSS | 4.2.1 |
| Icons | Lucide Angular | 0.577.0 |
| SSR | @angular/ssr | 21.0.1 |
| Toasts | ngx-sonner | 3.1.0 |
| Testing | Vitest | 4.1.0 |

### Backend (`/rendering-backend/lumina-api`)

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.18.3 |
| Database | MongoDB + Mongoose | 8.23.1 |
| Auth | JWT (jsonwebtoken) | 9.0.2 |
| Hashing | bcryptjs | 2.4.3 |
| Validation | express-validator | 7.0.1 |
| Docs | Swagger/OpenAPI 3.0 | 6.2.8 |
| Email | Nodemailer | 8.0.7 |
| Images | Sharp + Multer | Latest |

---

## Project Structure

```
E-comerce/
├── rendering/                          # Angular Frontend (SPA + SSR)
│   └── src/
│       └── app/
│           ├── core/
│           │   └── interceptors/       # HTTP auth interceptor (token refresh)
│           ├── shared/
│           │   ├── components/         # Header, loading, stats-card, toast
│           │   ├── guards/             # auth.guard, admin.guard
│           │   └── utils/
│           ├── features/
│           │   ├── admin/              # Admin dashboard
│           │   ├── auth/               # Login & register
│           │   ├── products/           # Product list & details
│           │   ├── cart/               # Shopping cart
│           │   ├── checkout/           # Checkout flow
│           │   ├── profile/            # User profile
│           │   └── not-found/          # 404 page
│           ├── home/                   # Home page (hero + product grid)
│           ├── services/               # HTTP services
│           └── interfaces/             # TypeScript types
│
└── rendering-backend/
    └── lumina-api/                     # Express REST API
        └── src/
            ├── config/                 # DB, JWT, Multer, Swagger
            ├── models/                 # Mongoose schemas
            ├── controllers/            # Business logic
            ├── routes/                 # Express routers
            ├── middlewares/            # Auth, admin, error, validation
            ├── validators/             # Input validation schemas
            ├── services/               # Reusable business logic
            └── database/
                └── seed.js             # DB seeding script
```

---

## Features

### Customer-Facing
- Product catalog with search, pagination, and category filtering
- Product detail pages with reviews
- Shopping cart (Angular Signals state)
- Checkout flow and order history
- User registration, login, and profile management
- Wishlist
- Password reset via email
- Email verification

### Admin Dashboard
- Sales analytics and 7-day rolling revenue chart
- Product management (CRUD + image uploads)
- Order management and status updates
- User management (block/unblock/delete)

### Technical
- JWT access + refresh token rotation
- Server-Side Rendering (SSR) with Angular Universal
- Lazy-loaded routes for optimal bundle size
- Swagger/OpenAPI documentation at `/api/docs`
- Database seeding for local development
- Rate limiting, Helmet headers, XSS protection, MongoDB sanitization

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas URI)
- Angular CLI (`npm install -g @angular/cli`)

### 1. Clone the repository

```bash
git clone <repo-url>
cd E-comerce
```

### 2. Start the Backend

```bash
cd rendering-backend/lumina-api
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, etc.

# (Optional) Seed the database with sample data and an admin account
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Start the Frontend

```bash
cd rendering
npm install
npm start
```

The app will be available at `http://localhost:4200`.

---

## API Reference

**Base URL:** `http://localhost:5000/api/v1`

**Interactive Docs:** `http://localhost:5000/api/docs`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login (returns access + refresh tokens) |
| POST | `/auth/logout` | Optional | Invalidate refresh token |
| POST | `/auth/refresh-token` | Public | Rotate access token |
| GET | `/auth/me` | Bearer | Get current user |
| POST | `/auth/forgot-password` | Public | Send password reset email |
| POST | `/auth/reset-password/:token` | Public | Reset password |
| POST | `/auth/change-password` | Bearer | Change password |
| GET | `/auth/verify-email/:token` | Public | Verify email address |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | Public | List products (paginated) |
| GET | `/products/search?q=...` | Public | Search products |
| GET | `/products/:id` | Public | Product details |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| POST | `/products/:id/reviews` | Bearer | Add review |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Bearer | Place an order |
| GET | `/orders/my` | Bearer | Current user's orders |
| GET | `/orders/:id` | Bearer | Order details |
| PUT | `/orders/:id/status` | Admin | Update order status |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Admin | Dashboard statistics |
| GET | `/admin/stats/sales?days=7` | Admin | Rolling sales data |
| GET | `/admin/orders` | Admin | All orders |
| GET | `/admin/users` | Admin | All users |

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

## Environment Variables

Create `rendering-backend/lumina-api/.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lumina

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password

FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

---

## Available Scripts

### Frontend

```bash
npm start                   # Dev server on :4200
npm run build               # Production build
npm run test                # Run Vitest test suite
npm run serve:ssr:rendering # Run SSR production server
```

### Backend

```bash
npm run dev    # Dev server with nodemon
npm start      # Production server
npm run seed   # Seed database with sample data
npm run lint   # ESLint
```

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes; refresh tokens rotate on use
- Rate limiting: 100 req/15 min general, 10 req/15 min on auth routes
- Helmet HTTP security headers
- CORS restricted to configured frontend origins
- MongoDB injection sanitization via `express-mongo-sanitize`
- XSS protection via `xss-clean`

---

## License

MIT
