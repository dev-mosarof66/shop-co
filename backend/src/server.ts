import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import AppDataSource from './database/data-source';
import { auth } from './lib/auth';

// Load environment variables
dotenv.config();

// Import routes
import healthRoutes from './routes/health';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import userRoutes from './routes/users';
import orderRoutes from './routes/orders';
import sellerRoutes from './routes/seller';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// CORS must be first — before auth handler and all other middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(helmet());

// better-auth handler — must be before body parsers
app.all('/api/auth/*', toNodeHandler(auth));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/seller`, sellerRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: _req.path,
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize TypeORM connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established');
    }

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     E-Commerce API Server Started      ║
╚════════════════════════════════════════╝
  
  Environment: ${NODE_ENV}
  Server: http://localhost:${PORT}
  API Prefix: ${API_PREFIX}
  Database: Connected
  
  Available Routes:
  - GET  ${API_PREFIX}/health
  - GET  ${API_PREFIX}/products
  - GET  ${API_PREFIX}/users
  - GET  ${API_PREFIX}/orders
  
  ═══════════════════════════════════════
  `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
