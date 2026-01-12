# � BRUTAL — Neo Brutalist E-Commerce

<div align="center">

![Neo Brutalism](https://img.shields.io/badge/Design-Neo%20Brutalism-000000?style=for-the-badge&labelColor=FACC15)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express 5](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**A bold, unapologetic e-commerce experience.**

*Thick borders. Hard shadows. No compromises.*

[Live Demo](#) • [Features](#-features) • [Quick Start](#-quick-start) • [Design System](#-design-system)

</div>

---

## 💡 What is This?

**BRUTAL** is a full-stack e-commerce application that breaks away from the boring, cookie-cutter online stores. Built with a striking **Neo Brutalism** design language — think thick black borders, offset shadows, and bold color blocking — this isn't just another shop template.

It's a statement.

> *"Bold designs for bold people."*

---

## ✨ Features

### 🛍️ **Customer Experience**

| Feature | Description |
|---------|-------------|
| **Smart Product Catalog** | Browse with filters by category, price range, and search |
| **Dynamic Collections** | Curated collections like "New Arrivals" and "Best Sellers" |
| **Lightning Cart** | Real-time cart with persistent state across sessions |
| **Guest Checkout** | Purchase without creating an account |
| **Cart Merging** | Guest cart seamlessly merges when you log in |
| **Order Tracking** | Track your order status at any time |
| **Product Reviews** | Read and write reviews for products |

### 🎨 **Rich UI/UX**

| Feature | Description |
|---------|-------------|
| **Neo Brutalist Design** | Unique visual identity with 4-color palette |
| **Responsive Layout** | Flawless experience from mobile to desktop |
| **Smooth Animations** | Signature "lift" hover effects on all interactive elements |
| **Dynamic Search** | Real-time product search in the header |
| **Image Galleries** | Product pages with multiple images & color swatches |

### � **Admin Dashboard**

| Feature | Description |
|---------|-------------|
| **Revenue Analytics** | Track sales and revenue at a glance |
| **Order Management** | View, filter, and update order statuses |
| **Product CRUD** | Full product management with variants |
| **Customer Insights** | Access customer data and order history |
| **Role-Based Access** | Separate Admin and Staff permissions |

### 🔐 **Authentication & Security**

| Feature | Description |
|---------|-------------|
| **Better Auth** | Modern authentication with secure sessions |
| **Protected Routes** | Role-based access control throughout |
| **HTTP-Only Cookies** | Secure token storage |
| **Account Management** | Profile updates, address book, order history |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="150"><strong>Frontend</strong></td>
<td>

- **Next.js 16** with App Router
- **React 19** with Server Components
- **Tailwind CSS 4** (latest)
- **React Query** for server state
- **Zustand** for client state

</td>
</tr>
<tr>
<td align="center"><strong>Backend</strong></td>
<td>

- **Express 5** with TypeScript
- **Prisma ORM** for database access
- **PostgreSQL** database
- **Zod** for runtime validation
- **Better Auth** for authentication

</td>
</tr>
<tr>
<td align="center"><strong>DevEx</strong></td>
<td>

- **Turbopack** for instant HMR
- **Concurrently** for parallel dev servers
- **TypeScript** throughout
- **Monorepo** structure

</td>
</tr>
</table>

---

## 🎨 Design System

This project follows a strict **Neo Brutalism** design language:

```
┌─────────────────────────────────────────────────────┐
│  🟡 YELLOW #FACC15 — Attention, highlights, badges  │
│  🔴 RED    #EF4444 — CTAs, urgency, action          │
│  ⚫ BLACK  #000000 — Borders, shadows, text         │
│  ⚪ WHITE  #FFFFFF — Backgrounds, breathing room    │
└─────────────────────────────────────────────────────┘
```

### Signature Elements
- **4px black borders** on all cards and inputs
- **Hard-offset shadows** like `4px 4px 0px #000`
- **Lift hover effect** — elements rise with shadow expansion
- **Bold typography** — Space Grotesk for headings, DM Sans for body
- **Rotated badges** for that hand-stamped aesthetic

> 📖 **[Full Design System Documentation →](frontend/DESIGN_SYSTEM.md)**

---

## � Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **npm** or **yarn**

### 1️⃣ Clone & Install

```bash
git clone https://github.com/FazlulKarimC/eCommerce_app.git
cd eCommerce_app

# Install all dependencies
npm run install:all
```

### 2️⃣ Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-key"
BETTER_AUTH_SECRET="another-secret-for-better-auth"
CLIENT_URL="http://localhost:3000"
PORT=3001
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3️⃣ Setup Database

```bash
# Push schema to database
npm run db:push

# Seed with sample products, collections & users
npm run db:seed
```

### 4️⃣ Launch! 🚀

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| **🌐 Storefront** | http://localhost:3000 |
| **⚡ API Server** | http://localhost:3001 |
| **🗄️ Prisma Studio** | `npm run db:studio` |

---

## � Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **👑 Admin** | admin@brutal.com | Admin123! |
| **👤 Staff** | staff@brutal.com | Staff123! |
| **🛒 Customer** | customer@brutal.com | Customer123! |

---

## 📜 Scripts Reference

| Command | What it does |
|---------|--------------|
| `npm run dev` | 🚀 Start frontend + backend in dev mode |
| `npm run build` | 📦 Build both for production |
| `npm run start` | 🏃 Start production servers |
| `npm run install:all` | 📥 Install all dependencies |
| `npm run db:push` | 🔄 Push Prisma schema |
| `npm run db:migrate` | 📋 Run migrations |
| `npm run db:seed` | 🌱 Seed sample data |
| `npm run db:studio` | 🔍 Open Prisma GUI |

---

## � Project Structure

```
ecommerce_app/
├── 📦 package.json          # Monorepo root
│
├── 🔙 backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   └── utils/           # Helpers
│   └── prisma/
│       ├── schema.prisma    # Database models
│       └── seed.ts          # Sample data
│
└── 🎨 frontend/
    ├── app/                  # Next.js App Router
    │   ├── (auth)/           # Login, Register
    │   ├── account/          # User dashboard
    │   ├── admin/            # Admin panel
    │   ├── products/         # Product pages
    │   ├── collections/      # Collection pages
    │   ├── categories/       # Category pages
    │   ├── cart/             # Shopping cart
    │   ├── checkout/         # Checkout flow
    │   └── thank-you/        # Order confirmation
    ├── components/           # UI components
    └── lib/                  # Utilities, hooks, API
```

---

## 🌐 API Overview

<details>
<summary><strong>📂 Public Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with filters |
| GET | `/api/products/:slug` | Product details |
| GET | `/api/collections` | List collections |
| GET | `/api/categories` | List categories |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

</details>

<details>
<summary><strong>🔒 Protected Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add to cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | User orders |
| GET | `/api/account/profile` | User profile |

</details>

<details>
<summary><strong>👑 Admin Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | Manage orders |
| GET | `/api/orders/revenue` | Revenue analytics |
| GET | `/api/admin/customers` | Customer list |
| POST | `/api/admin/products` | Create product |

</details>

---

## 🤝 Contributing

PRs are welcome! Here's how:

1. **Fork** the repo
2. **Create** a feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

> ⚠️ Please follow the **Design System** for any UI changes!

---

## 📄 License

MIT © Fazlul Karim

---

<div align="center">

### Made with 💛🖤❤️🤍

**Built with time, effort, and dedication by [Fazlul Karim](https://github.com/FazlulKarimC)**

*— Because boring websites don't deserve customers —*

</div>