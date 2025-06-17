# 🛒 Ecommerce App [![Next.js](https://img.shields.io/badge/Next.js-13+-000000.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/) [![Prisma](https://img.shields.io/badge/Prisma-ORM-2B3A67.svg?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

Welcome to a sleek, full-stack **Ecommerce Application** built with a modern tech stack! Dive into a seamless shopping experience with a polished Next.js frontend and a powerful Node.js/Express backend, all tied together with a PostgreSQL database managed via Prisma ORM.

## ✨ Features

- **Product Listings**: Browse and explore detailed product information.
- **Shopping Cart**: Add items, adjust quantities, and manage your cart with ease.
- **Checkout Flow**: Smooth and secure checkout process.
- **Order Tracking**: Keep tabs on your orders with confirmation screens.
- **Customer Management**: Handle user data effortlessly.
- **Email Notifications**: Stay updated with automated email confirmations.

## 📂 Project Structure

```
ecommerce_app/
├── backend/      # Node.js/Express API, Prisma ORM, business logic
└── frontend/     # Next.js app, UI components, client-side logic
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Tools**: npm, Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **PostgreSQL** (for backend database)

## 🚀 Getting Started

### Backend Setup

1. **Install Dependencies**  
   Navigate to the backend directory and install the required packages:
   ```powershell
   cd backend
   npm install
   ```

2. **Configure Environment Variables**  
   Create a `.env` file in the `backend` folder with your database connection string:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. **Run Database Migrations**  
   Set up your database schema with Prisma:
   ```powershell
   npx prisma migrate dev
   ```

4. **(Optional) Seed the Database**  
   Populate your database with initial data:
   ```powershell
   node prisma/seed.js
   ```

5. **Start the Backend Server**  
   Launch the backend API:
   ```powershell
   npm run dev
   ```
   The server will be available at `http://localhost:3001` (or as configured).

### Frontend Setup

1. **Install Dependencies**  
   Move to the frontend directory and install the necessary packages:
   ```powershell
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**  
   Create a `.env.local` file in the `frontend` folder to override API URLs if needed:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

3. **Start the Frontend App**  
   Run the Next.js development server:
   ```powershell
   npm run dev
   ```
   The app will be accessible at `http://localhost:3000` by default.

## 🌐 Usage

- Open your browser and visit `http://localhost:3000` to explore the ecommerce app.
- The frontend seamlessly interacts with the backend API for all data operations.

## 🤝 Contributing

We welcome contributions! Feel free to fork the repository, make improvements, and submit a pull request. Let's build something amazing together!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with 💻 and ☕ by Fazlul Karim.
