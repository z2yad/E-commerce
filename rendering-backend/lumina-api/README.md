# Lumina E-Commerce API

Production-ready REST API backend for the Lumina Angular 21 E-Commerce frontend.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (access + refresh token rotation) |
| Validation | express-validator |
| Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet · CORS · Rate Limit · Mongo Sanitize |
| Email | Nodemailer |
| Uploads | Multer |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → edit .env with your MongoDB URI and secrets

# 3. Seed the database (creates admin + sample products)
npm run seed

# 4. Start dev server
npm run dev
```

Server starts at **http://localhost:5000**

## API Docs

Swagger UI: http://localhost:5000/api/docs  
OpenAPI JSON: http://localhost:5000/api/docs.json  
Health check: http://localhost:5000/health

## Default Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@luxury.com | admin123 |
| Customer | alex@lumina.com | customer123 |

## API Base URL

```
http://localhost:5000/api/v1
```

## Endpoints Summary

### Auth
| Method | URL | Auth |
|---|---|---|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| POST | /auth/logout | Optional |
| POST | /auth/refresh-token | Public |
| GET | /auth/me | Bearer |
| POST | /auth/forgot-password | Public |
| POST | /auth/reset-password/:token | Public |
| POST | /auth/change-password | Bearer |
| GET | /auth/verify-email/:token | Public |

### Products
| Method | URL | Auth |
|---|---|---|
| GET | /products | Public |
| GET | /products/search?q= | Public |
| GET | /products/categories | Public |
| GET | /products/category/:slug | Public |
| GET | /products/:id | Public |
| POST | /products | Admin |
| PUT | /products/:id | Admin |
| DELETE | /products/:id | Admin |
| POST | /products/:id/reviews | Bearer |

### Orders
| Method | URL | Auth |
|---|---|---|
| POST | /orders | Bearer |
| GET | /orders | Bearer (admin sees all) |
| GET | /orders/my | Bearer |
| GET | /orders/:id | Bearer |
| PUT | /orders/:id/status | Admin |
| DELETE | /orders/:id | Admin |

### Users
| Method | URL | Auth |
|---|---|---|
| GET | /users/profile | Bearer |
| PUT | /users/profile | Bearer |
| GET | /users | Admin |
| GET | /users/:id | Admin |
| PUT | /users/:id | Admin |
| DELETE | /users/:id | Admin |
| PATCH | /users/:id/block | Admin |
| PATCH | /users/:id/unblock | Admin |

### Admin Dashboard
| Method | URL | Auth |
|---|---|---|
| GET | /admin/stats | Admin |
| GET | /admin/stats/sales?days=7 | Admin |
| GET | /admin/orders | Admin |
| GET | /admin/users | Admin |

### Categories
| Method | URL | Auth |
|---|---|---|
| GET | /categories | Public |
| GET | /categories/:id | Public |
| POST | /categories | Admin |
| PUT | /categories/:id | Admin |
| DELETE | /categories/:id | Admin |

## Angular Frontend Integration

The backend is designed to be a drop-in replacement for `dummyjson.com`:

- `/products` returns `{ products, total, skip, limit }` — same envelope
- Product `id` field is a string (MongoDB ObjectId), not an integer — Angular components handle both
- JWT tokens are stored in `localStorage` by the Angular `AuthService`
- The Angular `authInterceptor` automatically adds `Authorization: Bearer <token>`
- On 401, the interceptor refreshes the token and retries automatically

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in DB with rotation & reuse detection
- Rate limiting: 100 req/15min general, 10 req/15min on auth endpoints
- Helmet security headers
- MongoDB query injection sanitization
- CORS restricted to configured origins