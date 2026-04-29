# 🛍️ Lumina E-Commerce Platform

🚀 A full-stack e-commerce application built with **Angular 21** and **Express.js**, featuring Server-Side Rendering, JWT authentication, and a complete admin dashboard.

---

## 💻 Tech Stack

### 🎨 Frontend (`/rendering`)

| Layer | Technology | Version |
|---|---|---|
| 🏗️ Framework | Angular | 21.0.0 |
| 🔤 Language | TypeScript | 5.9.2 |
| 💅 Styling | Tailwind CSS | 4.2.1 |
| 🖼️ Icons | Lucide Angular | 0.577.0 |
| ⚡ SSR | @angular/ssr | 21.0.1 |
| 🍞 Toasts | ngx-sonner | 3.1.0 |
| 🧪 Testing | Vitest | 4.1.0 |

### ⚙️ Backend (`/rendering-backend/lumina-api`)

| Layer | Technology | Version |
|---|---|---|
| 🟢 Runtime | Node.js | 18+ |
| 🚂 Framework | Express.js | 4.18.3 |
| 🍃 Database | MongoDB + Mongoose | 8.23.1 |
| 🔐 Auth | JWT (jsonwebtoken) | 9.0.2 |
| 🔑 Hashing | bcryptjs | 2.4.3 |
| ✅ Validation | express-validator | 7.0.1 |
| 📚 Docs | Swagger/OpenAPI 3.0 | 6.2.8 |
| 📧 Email | Nodemailer | 8.0.7 |
| 📸 Images | Sharp + Multer | Latest |

---

## 📂 Project Structure

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
│           │   └── utils/              # 🛠️ Utility functions
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
