# 🎨 BRUTAL Frontend

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**The face of BRUTAL — where Neo Brutalism meets modern e-commerce.**

*Thick borders. Hard shadows. Unforgettable UX.*

</div>

---

## ⚡ What's Inside

This is the **Next.js 16** frontend for BRUTAL, featuring:

- 🎯 **App Router** with React Server Components
- 🔥 **Turbopack** for blazing fast development
- 🎨 **Neo Brutalist UI** — custom design system
- 🛒 **Full Shopping Experience** — cart, checkout, orders
- 🔐 **Better Auth** integration with session persistence
- 📱 **Fully Responsive** — mobile-first design

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand (client) + React Query (server) |
| **Auth** | Better Auth client |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Toasts** | Sonner |

---

## 📂 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login & Register
│   ├── account/            # User dashboard
│   │   ├── orders/         # Order history
│   │   ├── addresses/      # Address book
│   │   └── wishlist/       # Saved items
│   ├── admin/              # Admin panel (protected)
│   ├── products/           # Product catalog
│   ├── collections/        # Curated collections
│   ├── categories/         # Category pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   └── thank-you/          # Order confirmation
│
├── components/
│   ├── ui/                 # Design system components
│   ├── cart/               # Cart drawer & items
│   ├── layout/             # Header, Footer
│   └── providers/          # Context providers
│
└── lib/
    ├── api.ts              # Axios instance + cold start retry
    ├── auth.ts             # Auth store (Zustand)
    ├── auth-client.ts      # Better Auth client
    ├── cart.ts             # Cart store
    ├── hooks.ts            # React Query hooks
    └── utils.ts            # Helpers (formatPrice, cn, etc.)
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (with backend running)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

**Environment Variables** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🎨 Design System

The UI follows a strict **Neo Brutalism** design language:

```
┌──────────────────────────────────────────┐
│  🟡 YELLOW #FACC15 — Highlights, badges  │
│  🔴 RED    #EF4444 — CTAs, urgency       │
│  ⚫ BLACK  #000000 — Borders, shadows    │
│  ⚪ WHITE  #FFFFFF — Backgrounds         │
└──────────────────────────────────────────┘
```

### Key Characteristics:
- **4px black borders** on cards and inputs
- **Offset shadows** — `4px 4px 0px #000`
- **Lift hover effect** — elements "rise" on hover
- **Bold typography** — DM Sans, Space Mono fonts

> 📖 **[Full Design System →](./DESIGN_SYSTEM.md)**

---

## 🔄 Cold Start Handling

The API client includes automatic retry logic for Render cold starts:

```typescript
// Automatically retries on 502, 503, timeout
const isColdStartError = 
    error.code === 'ECONNABORTED' ||
    error.response?.status === 503;

// Waits 3s, retries up to 2 times
```

Users won't see confusing errors — just a brief wait.

---

## 🧪 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero, featured products, collections |
| **Products** | `/products` | Catalog with filters |
| **Product Detail** | `/products/[slug]` | Images, variants, reviews |
| **Cart** | `/cart` | Full cart page |
| **Checkout** | `/checkout` | Checkout with discount codes |
| **Account** | `/account` | User dashboard |
| **Admin** | `/admin` | Admin dashboard (protected) |

---

## 📦 Key Components

| Component | Purpose |
|-----------|---------|
| `<CartDrawer />` | Slide-out cart with live updates |
| `<SiteHeader />` | Navigation, search, auth state |
| `<ProductCard />` | Product display with quick add |
| `<Badge />` | Neo-brutalist status badges |
| `<Button />` | Multiple variants (primary, secondary, outline) |

---

## 🔐 Authentication

Uses **Better Auth** with:
- Session cookies (HTTP-only)
- Auto-refresh on page load via `<AuthProvider />`
- Role-based access (Customer, Staff, Admin)
- Guest cart → User cart merging

---

<div align="center">

### Built with 💛🖤

*Part of the [BRUTAL E-Commerce](../README.md) project*

</div>
