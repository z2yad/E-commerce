# ◈ Lumina
### `// e-commerce platform`

> A full-stack e-commerce application built with **Angular 21** and **Express.js**, featuring Server-Side Rendering, JWT authentication, and a complete admin dashboard.

![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031?style=flat-square&logo=angular)
![Express](https://img.shields.io/badge/Express.js-4.18.3-63b3ed?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.23-68d391?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-b794f4?style=flat-square&logo=typescript)
![SSR](https://img.shields.io/badge/SSR-Angular_Universal-fc8149?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-4fd1c5?style=flat-square)

---

## 💻 Tech Stack

### 🎨 Frontend `/rendering`

| Layer | Technology | Version |
|---|---|---|
| 🏗️ Framework | Angular | 21.0.0 |
| 🔤 Language | TypeScript | 5.9.2 |
| 💅 Styling | Tailwind CSS | 4.2.1 |
| 🖼️ Icons | Lucide Angular | 0.577.0 |
| ⚡ SSR | @angular/ssr | 21.0.1 |
| 🍞 Toasts | ngx-sonner | 3.1.0 |
| 🧪 Testing | Vitest | 4.1.0 |

### ⚙️ Backend `/lumina-api`

| Layer | Technology | Version |
|---|---|---|
| 🟢 Runtime | Node.js | 18+ |
| 🚂 Framework | Express.js | 4.18.3 |
| 🍃 Database | MongoDB + Mongoose | 8.23.1 |
| 🔐 Auth | JWT (jsonwebtoken) | 9.0.2 |
| 🔑 Hashing | bcryptjs | 2.4.3 |
| ✅ Validation | express-validator | 7.0.1 |
| 📚 Docs | Swagger / OpenAPI 3.0 | 6.2.8 |
| 📧 Email | Nodemailer | 8.0.7 |
| 📸 Images | Sharp + Multer | Latest |

---

## ✨ Features

### 🛒 Customer Storefront
- Product catalog with search, pagination & category filtering
- Product detail pages with reviews
- Shopping cart via Angular Signals state
- Checkout flow and order history
- Wishlist management

### 👑 Admin Dashboard
- Sales analytics with 7-day rolling revenue chart
- Product CRUD + image uploads via Sharp / Multer
- Order management and status updates
- User management — block / unblock / delete

### 🔐 Auth & Identity
- User registration, login & profile management
- Password reset via email (Nodemailer)
- Email verification flow
- JWT access + refresh token rotation (`15m` access · `7d` refresh)

### ⚙️ Technical
- SSR with Angular Universal + lazy-loaded routes
- Swagger / OpenAPI docs at `/api/docs`
- Database seeding for local development
- Rate limiting, Helmet headers, XSS & NoSQL injection protection

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas URI)
- Angular CLI — `npm install -g @angular/cli`

### 1 — Backend

```bash
cd rendering-backend/lumina-api
npm install
cp .env.example .env     # configure your .env
npm run seed             # optional: seed sample data
npm run dev              # → http://localhost:5000
```

### 2 — Frontend

```bash
cd rendering
npm install
npm start                # → http://localhost:4200
```

---

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
