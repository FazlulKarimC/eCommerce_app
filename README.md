# Ecommerce App

A full-stack ecommerce application with a modern Next.js frontend and a robust Node.js/Express backend. The app supports product browsing, cart management, checkout, and order tracking, with a PostgreSQL database managed via Prisma ORM.

## Features
- Product listing and details
- Shopping cart and checkout flow
- Order confirmation and tracking
- Customer management
- Email notifications (via backend mailer)

## Project Structure
```
backend/    # Node.js/Express API, Prisma ORM, business logic
frontend/   # Next.js app, UI components, client logic
```

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL database (for backend)

---

## Backend Setup

1. **Install dependencies**
   ```powershell
   cd backend
   npm install
   ```

2. **Configure environment variables**
   - Create a `.env` file in the `backend` folder with your database connection string:
     ```env
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
     ```

3. **Run database migrations**
   ```powershell
   npx prisma migrate dev
   ```

4. **(Optional) Seed the database**
   ```powershell
   node prisma/seed.js
   ```

5. **Start the backend server**
   ```powershell
   npm run dev
   ```
   The backend will run on `http://localhost:3001` (or as configured).

---

## Frontend Setup

1. **Install dependencies**
   ```powershell
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   - Create a `.env.local` file in the `frontend` folder if you need to override API URLs:
     ```env
     NEXT_PUBLIC_API_URL="http://localhost:3001"
     ```

3. **Start the frontend app**
   ```powershell
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` by default.

---

## Usage
- Visit `http://localhost:3000` to use the ecommerce app.
- The frontend communicates with the backend API for all data operations.


