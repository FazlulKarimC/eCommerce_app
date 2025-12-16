import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { env } from './config/env';
import { auth } from './config/auth';
import routes from './routes';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// API Routes - Express 5 requires named splat parameters for wildcards
app.all("/api/auth/{*splat}", toNodeHandler(auth));

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
