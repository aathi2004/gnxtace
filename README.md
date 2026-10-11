# Form &amp; Function — Mini SaaS Template Store

> A curated full-stack web application for discovering, bookmarking, and licensing production-ready SaaS starter boilerplates and templates. Built for the **Full Stack Web Developer Intern Technical Task**.

---

## 🏛️ Project Overview

**Form & Function** is an editorial-first software template catalog crafted with a human-designed aesthetic. It moves away from generic, neon-gradient AI mockups in favor of an art-directed layout: warm canvas backgrounds, deep ink typography, restrained indigo accents, generous whitespace, and tactile interface controls.

Users can browse starter kits across practical categories (**Landing Page**, **Dashboard**, **E-commerce**, **Portfolio**, **Blog**), inspect architectural modules, save templates to their personal favorites, and manage a commercial purchase cart with simulated checkout and license key issuance.

---

## ⚡ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 | Fast SPA rendering and reactive state |
| **Styling** | Tailwind CSS v4 | Warm editorial palette, custom typography & controls |
| **Routing** | React Router v7 | Declarative routing with protected route guards |
| **HTTP Client** | Axios | Configured with request/response JWT interceptors |
| **Icons** | Lucide React | Semantic, lightweight vector iconography |
| **Backend** | Node.js + Express 5 | Modular REST API with structured controllers |
| **Database** | SQLite + Knex.js | Relational query builder with schema migrations |
| **Authentication** | JWT + bcryptjs | Token-based auth with salted password hashing |
| **Validation** | express-validator | Request sanitization and field-level error messages |
| **Security** | Helmet + CORS + Rate Limiter | Secure HTTP headers, origin checks, and brute-force mitigation |
| **Testing** | Node.js Test Runner | Zero-dependency integration tests (`node --test`) |

---

## ✨ Features & Capabilities

### 1. User Authentication & Authorization
- **Registration**: Validates full name, email format, and password length (minimum 6 characters).
- **Password Security**: Passwords are salted and hashed using `bcryptjs` before database persistence. Plaintext passwords are never stored or logged.
- **JWT Authentication**: Signs stateless tokens with configurable expiration (`7d`).
- **Session Restoration**: On application mount, verifies active tokens against `GET /api/auth/me`. Automatically purges expired sessions.
- **Protected Routes**: Gated `/favorites` page redirects unauthenticated visitors to `/login` with friendly redirection notices.
- **One-Click Demo Login**: Pre-fills evaluator credentials (`alex@example.com` / `password123`) for rapid testing.

### 2. Template Catalog & Discovery (`/templates`)
- **Seeded Starter Kits**: 8 realistic, believable boilerplates across categories: *Landing Page*, *Dashboard*, *E-commerce*, *Portfolio*, and *Blog*.
- **Real-Time Search**: Instant querying across template names, descriptions, categories, and technology tags.
- **Category Filter Pills**: Quick tab switching between categories with active states.
- **Sorting Options**: Sort by Featured / Newest, Price (Low to High), and Alphabetical (A-Z).
- **Result Counter & Reset**: Displays matching template count and a one-click filter reset when zero items match.

### 3. Detail Inspection Modal ("View Details")
- **Architecture Breakdown**: Displays key architectural features (e.g. Stripe checkout, telemetry matrices, MDX pipelines).
- **Tech Stack Pills**: Displays underlying technologies (React, Next.js, Node, Tailwind, Chart.js, etc.).
- **Live Sandbox Preview**: Interactive sandbox state toggle with simulated demo environments.
- **Dual Action Controls**: One-click actions to toggle favorite status or add to purchase cart.

### 4. Personal Favorites Management (`/favorites`)
- **User-Isolated Storage**: Favorites are strictly partitioned by authenticated user ID.
- **Duplicate Prevention**: Database composite unique constraint `(user_id, template_id)` plus controller validation prevent duplicate saves.
- **Optimistic UI Updates**: Instant heart animation and reactive badge counter updates in the navigation header.
- **In-Library Search**: Fast keyword filtering within saved bookmarks.
- **Direct Removal**: Seamless unfavorite action with instant list update.

### 5. Purchase Cart & Checkout Flow ("Add Payment in Cart")
- **Slide-Over Cart Drawer**: Slide-out cart displaying selected templates, category, price, and commercial license info.
- **Promo Code Engine**: Supports coupon codes (e.g., `INTERN20` for 20% discount).
- **Secure Mock Checkout**: Modal with credit card inputs, test card quick-fill, simulated 256-bit authorization, and instant license key delivery.

---

## 📁 Repository Structure

```text
fullstack-intern-task/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── api/                # Axios instance & API service modules
│   │   │   ├── axios.js
│   │   │   ├── authService.js
│   │   │   └── templateService.js
│   │   ├── components/         # Reusable presentation components
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TemplateCard.jsx
│   │   │   └── TemplateModal.jsx
│   │   ├── context/            # Global React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/              # Primary route views
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── TemplatesPage.jsx
│   │   ├── App.jsx             # Router configuration & providers
│   │   ├── index.css           # Tailwind CSS imports & base styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js / Express application
│   ├── migrations/             # Knex database migrations
│   │   └── 20261011000000_create_tables.js
│   ├── src/
│   │   ├── controllers/        # Request handling logic
│   │   │   ├── authController.js
│   │   │   ├── favoriteController.js
│   │   │   └── templateController.js
│   │   ├── middleware/         # Auth, validation, & rate limiting
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validateMiddleware.js
│   │   ├── routes/             # Express API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── favoriteRoutes.js
│   │   │   └── templateRoutes.js
│   │   ├── seeds/              # Seed data & execution scripts
│   │   │   ├── seed.js
│   │   │   └── templatesData.js
│   │   ├── db.js               # Knex connection & auto-migration
│   │   └── server.js           # Express application entry point
│   ├── tests/                  # Automated integration tests
│   │   └── api.test.js
│   ├── .env.example
│   ├── knexfile.js
│   ├── package.json
│   └── test-api.js
│
├── .gitignore
├── package.json                # Root orchestration package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/fullstack-intern-task.git
cd fullstack-intern-task
```

### 2. Install Dependencies
Run the root installation script to install dependencies for both `server/` and `client/`:
```bash
npm run install:all
```
*(Or install manually: `cd server && npm install && cd ../client && npm install`)*

### 3. Configure Environment Variables

#### Backend Configuration:
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
JWT_SECRET=saas_template_store_secret_jwt_key_2026_xyz123
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration:
Create `client/.env` based on `client/.env.example`:
```env
# Leave empty for local development (Vite dev server proxies /api to http://localhost:5000)
VITE_API_URL=
```

### 4. Initialize Database & Seed Templates
Run the idempotent seed script to create SQLite tables and insert initial templates:
```bash
npm run seed
```

### 5. Start Development Servers

Open two terminal windows (or use root script):

**Terminal 1 — Backend API:**
```bash
npm run server
# Server will run on http://localhost:5000
```

**Terminal 2 — Frontend Application:**
```bash
npm run client
# Client will run on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Health & Information
- `GET /api/health` — Service health check and uptime.
- `GET /` — API root documentation with route map.

### Authentication
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register new user. Body: `{ name, email, password }` |
| `POST` | `/api/auth/login` | No | Login user. Body: `{ email, password }` |
| `GET` | `/api/auth/me` | **Yes** | Get authenticated user profile |

### Templates Catalog
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/templates` | Optional | List all templates. Query params: `search`, `category`, `sort` |
| `GET` | `/api/templates/:id` | Optional | Retrieve template details by ID |

### Favorites (User-Protected)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/favorites` | **Yes** | Retrieve all templates favorited by logged-in user |
| `POST` | `/api/favorites/:templateId` | **Yes** | Add a template to logged-in user's favorites |
| `DELETE` | `/api/favorites/:templateId` | **Yes** | Remove template from logged-in user's favorites |

---

## 🧪 Testing & Verification

### Run Automated Backend Tests
Run the comprehensive suite using Node's native test runner:
```bash
npm test
```
The test suite validates:
1. Health check endpoint status
2. Registration with valid input & bcrypt password hashing
3. Validation rejections on empty/invalid inputs
4. Rejection of duplicate email addresses with `409 Conflict`
5. Login validation & credential checking
6. Rejection of unauthenticated requests with `401 Unauthorized`
7. Templates catalog retrieval, search queries, and category filtering
8. Single template details retrieval & `404 Not Found` for missing IDs
9. User favorites creation, duplicate handling, user isolation, and removal

### Run Frontend Production Build Check
Verify client build, JSX compiling, and bundle minification:
```bash
npm run build:client
```

---

## 🌐 Deployment Guide

### Backend on Render
1. Create a **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command**: `npm install && npm run seed`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `JWT_SECRET` = `<your-secure-random-secret>`
   - `CLIENT_URL` = `<your-deployed-frontend-url>`
   - `NODE_ENV` = `production`
> **Note on SQLite Persistence:** On Render free web services, files are stored on an ephemeral filesystem. For persistent production SQLite databases on Render, attach a [Render Persistent Disk](https://render.com/docs/disks) mounted to `/data` and set `DATABASE_PATH=/data/database.sqlite`.

### Frontend on Vercel / Netlify
1. Create a **New Project** on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set **Root Directory** to `client`.
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api`
6. Deploy!

---

## 👤 Author & Candidate Information

- **Candidate Name:** Aathithya S
- **Task:** Full Stack Web Developer Intern — Technical Assignment
- **Contact Email:** `[Candidate Email / Contact Placeholder]`
- **LinkedIn Profile:** `[Candidate LinkedIn Placeholder]`
- **GitHub Profile:** `[Candidate GitHub Placeholder]`

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
