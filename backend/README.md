# ⚡ BRUTAL Backend

<div align="center">

![Express 5](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**The engine behind BRUTAL — fast, secure, and scalable.**

*RESTful API • Better Auth • Real-time validation*

</div>

---

## ⚡ What's Inside

This is the **Express 5** backend for BRUTAL, featuring:

- 🔐 **Better Auth** with secure session cookies
- 🗄️ **Prisma ORM** for type-safe database access
- ✅ **Zod Validation** for runtime type checking
- 📧 **Resend Integration** for transactional emails
- 🛡️ **Rate Limiting** to prevent abuse
- 🔄 **Guest Cart Merging** for seamless UX

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Express 5 |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | Better Auth |
| **Validation** | Zod |
| **Email** | Resend |
| **Security** | express-rate-limit, helmet-ready |

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── auth.ts         # Better Auth configuration
│   │   ├── database.ts     # Prisma client
│   │   └── env.ts          # Environment variables
│   │
│   ├── routes/
│   │   ├── products.ts     # Product CRUD & catalog
│   │   ├── cart.ts         # Cart management
│   │   ├── checkout.ts     # Order processing
│   │   ├── orders.ts       # Order management
│   │   ├── customers.ts    # Customer profiles
│   │   ├── collections.ts  # Product collections
│   │   ├── categories.ts   # Categories
│   │   ├── wishlist.ts     # User wishlists
│   │   ├── contact.ts      # Contact form
│   │   └── newsletter.ts   # Newsletter signup
│   │
│   ├── services/
│   │   ├── product.service.ts   # Product business logic
│   │   ├── cart.service.ts      # Cart operations
│   │   ├── order.service.ts     # Order processing
│   │   ├── email.service.ts     # Resend email sending
│   │   └── customer.service.ts  # Customer management
│   │
│   ├── middleware/
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── requireRole.ts  # Role-based access control
│   │   ├── validate.ts     # Zod validation middleware
│   │   ├── rateLimit.ts    # Rate limiting
│   │   └── errorHandler.ts # Global error handling
│   │
│   ├── validators/         # Zod schemas
│   └── utils/              # Helpers
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeder
│
└── index.ts                # Server entry point
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push    # Push schema
npm run db:seed    # Seed sample data

# Start dev server
npm run dev

# Build for production
npm run build

# Start production
npm run start
```

---

## 🔧 Environment Variables

```env
# Required
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
BETTER_AUTH_SECRET="32-character-random-string"
FRONTEND_URL="http://localhost:3000"

# Optional - Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxx"
FROM_EMAIL="onboarding@resend.dev"
CONTACT_EMAIL="your@email.com"

# Development
NODE_ENV="development"
PORT=3001
```

---

## 🔐 Authentication

Powered by **Better Auth** with:

| Feature | Implementation |
|---------|----------------|
| Sessions | 7-day expiry, 24h refresh |
| Cookies | HTTP-only, secure in production |
| Cross-Domain | `sameSite: "none"` for Vercel ↔ Render |
| Roles | CUSTOMER, STAFF, ADMIN |

---

## 🛡️ Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/*` | 300 requests / 15 min |
| `/api/auth/*` | 15 requests / 15 min |
| `/api/contact` | 9 requests / hour |

---

## 🌐 API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with filters |
| GET | `/api/products/:slug` | Product details |
| GET | `/api/collections` | List collections |
| GET | `/api/categories` | List categories |
| POST | `/api/contact` | Contact form submission |
| POST | `/api/newsletter/subscribe` | Newsletter signup |

### Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:id` | Update cart item |
| DELETE | `/api/cart/remove/:id` | Remove cart item |
| POST | `/api/checkout` | Process order |
| GET | `/api/orders/my-orders` | User's order history |
| GET | `/api/wishlist` | Get wishlist |

### Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | All orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| POST | `/api/orders/:id/fulfillment` | Add shipping info |
| GET | `/api/orders/stats` | Revenue analytics |
| GET | `/api/customers` | Customer list |
| POST | `/api/products` | Create product |

---

## 📧 Email Features

Using **Resend** for transactional emails:

| Email | Trigger |
|-------|---------|
| Order Confirmation | Checkout complete |
| Shipping Notification | Fulfillment added |
| Contact Form | Contact submission |
| Newsletter Welcome | Subscription |

---

## 🗄️ Database Schema Highlights

```prisma
model Product {
  variants      ProductVariant[]
  images        ProductImage[]
  reviews       Review[]
  collections   Collection[]
  wishlistItems WishlistItem[]
}

model Order {
  items         OrderItem[]
  customer      Customer?
  payments      Payment[]
  fulfillments  Fulfillment[]
  discountCode  DiscountCode?
}

model Cart {
  items         CartItem[]
  customer      Customer?  // For logged-in users
  sessionId     String?    // For guests
}
```

> 📖 **Full schema:** `prisma/schema.prisma`

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run production build |
| `npm run db:push` | Push schema changes |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🚀 Deployment (Render)

### Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=your-postgres-url
BETTER_AUTH_SECRET=your-secret
FRONTEND_URL=https://yourapp.vercel.app
```

### Build Settings:

```
Build Command: npm install && npm run build
Start Command: node dist/index.js
```

---

<div align="center">

### Built with 💛🖤

*Part of the [BRUTAL E-Commerce](../README.md) project*

</div>
