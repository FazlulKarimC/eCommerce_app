import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import routes from './routes';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging in development
if (env.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`
🚀 E-Commerce API Server
========================
Environment: ${env.NODE_ENV}
Port: ${PORT}
Frontend URL: ${env.FRONTEND_URL}
API Base: http://localhost:${PORT}/api

Available endpoints:
- POST   /api/auth/register
- POST   /api/auth/login
- GET    /api/products
- GET    /api/collections
- GET    /api/categories
- GET    /api/cart
- POST   /api/checkout
- GET    /api/orders
- GET    /api/health
  `);
});

export default app;
