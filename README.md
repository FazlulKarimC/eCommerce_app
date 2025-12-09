# 🛒 Ecommerce App

[![Next.js](https://img.shields.io/badge/Next.js-16-000000.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, full-stack **e-commerce application** featuring a sleek Next.js 16 storefront with React 19, powered by an Express 5 backend with Prisma ORM. Built with TypeScript throughout for type safety and developer experience.

---

## ✨ Features

### 🛍️ Storefront
- **Product Catalog** — Browse products with filtering by collections
- **Product Details** — Detailed product pages with image galleries
- **Shopping Cart** — Persistent cart with real-time updates
- **Checkout Flow** — Streamlined checkout with order confirmation
- **Order Tracking** — Track order status with order ID lookup
- **User Accounts** — Customer registration, login, and profile management

### 🔐 Admin Dashboard
- **Dashboard Overview** — Quick stats and recent activity
- **Product Management** — CRUD operations for products
- **Order Management** — View and update order statuses
- **Role-Based Access** — Admin and Staff role support

### 🛠️ Technical Highlights
- **React Query** — Efficient data fetching and caching
- **Zustand** — Lightweight state management for cart
- **Tailwind CSS 4** — Modern utility-first styling
- **Zod Validation** — Runtime type checking on both ends
- **JWT Authentication** — Secure token-based auth with HTTP-only cookies

---

## 📂 Project Structure

```
ecommerce_app/
├── package.json        # Root package with monorepo scripts
├── backend/            # Express API + Prisma ORM
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
└── frontend/           # Next.js 16 + React 19
    ├── app/            # App Router pages
    │   ├── admin/      # Admin dashboard
    │   ├── account/    # User account pages
    │   ├── products/   # Product listing & details
    │   ├── collections/# Collection pages
    │   ├── cart/       # Shopping cart
    │   ├── checkout/   # Checkout flow
    │   └── auth/       # Login/Register
    ├── components/     # Reusable UI components
    └── lib/            # Utilities and API client
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5, TypeScript, Prisma ORM |
| **Database** | PostgreSQL |
| **State** | Zustand (cart), React Query (server state) |
| **Auth** | JWT with HTTP-only cookies |
| **Validation** | Zod |
| **Dev Tools** | Turbopack, TSX, Concurrently |

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** database

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd ecommerce_app

# Install all dependencies (root + backend + frontend)
npm run install:all
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-jwt-key"
CLIENT_URL="http://localhost:3000"
PORT=3001
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Setup Database

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development

```bash
# 🚀 Start both frontend and backend with one command!
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npm run db:studio`

---

## 📜 Available Scripts

Run from the **root directory**:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend in dev mode |
| `npm run build` | Build both for production |
| `npm run start` | Start both in production mode |
| `npm run install:all` | Install dependencies for all packages |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@brutaliststore.com | Admin123! |
| **Staff** | staff@brutaliststore.com | Staff123! |
| **Customer** | customer@example.com | Customer123! |

---

## 🌐 API Endpoints

### Public
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `GET /api/collections` — List all collections
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration

### Protected (Customer)
- `GET /api/orders` — Get user orders
- `POST /api/orders` — Create new order
- `GET /api/account/profile` — Get user profile

### Protected (Admin/Staff)
- `GET /api/admin/products` — Manage products
- `GET /api/admin/orders` — Manage orders
- `GET /api/admin/customers` — View customers

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with 💻 and ☕ by **Fazlul Karim**

</div>