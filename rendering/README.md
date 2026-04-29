# 🛍️ Rendering - Premium E-commerce Application

[![Angular](https://img.shields.io/badge/Angular-21.0.1-DD0031?style=for-the-badge&logo=angular)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-38B2AC?style=for-the-badge&logo=tailwinds-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.0-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![SSR](https://img.shields.io/badge/SSR-Enabled-blue?style=for-the-badge)](https://angular.dev/guide/ssr)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://e-commerce-iota-sand.vercel.app/)

A modern, high-performance E-commerce platform built with **Angular 21**, featuring Server-Side Rendering (SSR), a sleek glassmorphic UI, and a robust checkout system.

**🔗 Live Demo:** [e-commerce-iota-sand.vercel.app](https://e-commerce-iota-sand.vercel.app/)

---

## ✨ Key Features

- **🚀 Server-Side Rendering (SSR):** Optimized for SEO and lightning-fast initial page loads using `@angular/ssr`.
- **📦 Product Management:** Dynamic product listing and detailed single-product views with smooth transitions.
- **🛒 Shopping Cart:** Reactive cart management with real-time updates and persistent state.
- **🛡️ Secure Checkout:** Logical multi-step checkout flow with route guards for data integrity.
- **👤 User Profiles:** Dedicated profile section for managing user-specific data.
- **🎨 Modern UI/UX:** Styled with **Tailwind CSS 4.0**, featuring glassmorphism, OKLCH color spaces, and custom micro-animations.
- **🔔 Interactive Notifications:** Real-time feedback using `ngx-sonner` toast notifications.
- **🔍 SEO Optimized:** Fully semantic HTML structure with meta-tag management.

---

## 🛠️ Tech Stack

- **Core:** Angular 21 (Signals & Modern Control Flow)
- **Styling:** Tailwind CSS 4.2.1 + PostCSS
- **Icons:** Lucide Angular
- **Notifications:** ngx-sonner
- **Testing:** Vitest + Vitest UI
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **Server:** Express.js (for SSR hosting)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `^20.0.0` or higher
- **npm:** `^11.0.0`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/z2yad/E-commerce.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

---

## 📖 Development Commands

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the app in development mode. |
| `npm run build` | Builds the project for production in the `dist/` folder. |
| `npm run test` | Executes unit tests via Vitest. |
| `npm run watch` | Builds and watches for changes. |
| `npm run serve:ssr:rendering` | Serves the SSR build locally. |

---

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── features/     # Component modules (Cart, Checkout, Products, Profile)
│   ├── services/     # Business logic and API interaction (CartService, ProductService)
│   ├── shared/       # Reusable components and layout elements
│   ├── interfaces/   # TypeScript type definitions
│   └── home/         # Landing page component
├── assets/           # Static assets (images, fonts)
└── styles.css        # Global styles and Tailwind 4 configuration
```

---

## 🧪 Testing

This project uses **Vitest** for unit testing, providing a significantly faster feedback loop than traditional Karma/Jasmine setups.

```bash
# Run tests
npm test

# Run tests with UI
npx vitest --ui
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Zeyad salim**
