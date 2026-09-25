import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import productRoutes from './routes/product.routes.js';
import exampleRoutes from './routes/example.routes.js';
import paymentRoutes from "./routes/payment.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import wishListRoutes from "./routes/wishList.routes.js";
import { requestLogger } from './middleware/requestLogger.js';
import { browserSafety } from './middleware/browserSafety.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { databaseReady } from './config/db.js';
import { AppError } from './utils/AppError.js';
import { sendData } from './utils/response.js';

export function createApp(config) {
  const app = express();
  app.locals.config = config;
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', 1);
  app.use(helmet({ strictTransportSecurity: config.production ? undefined : false }));
  app.use(requestLogger);
  app.use(cors({
    credentials: true, origin(origin, callback) {
      if (!origin || config.origins.includes(origin)) return callback(null, true);
      return callback(new AppError(403, 'Origin is not allowed.', 'ORIGIN_BLOCKED'));
    }
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use(cookieParser());
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use('/api', rateLimit({
    windowMs: 60000,
    limit: 180,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a minute.' } },
  }));
  app.use('/api', browserSafety(config));
  // Liveness does not claim the database is ready.
  app.get('/api/health', (_req, res) => sendData(res, { status: 'ok', service: 'mern-base-api' }));
  app.get('/api/ready', (_req, res) => {
    if (!databaseReady()) throw new AppError(503, 'Database is not connected.', 'DATABASE_UNAVAILABLE');
    return sendData(res, { status: 'ready', database: 'connected' });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/examples', exampleRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart',cartRoutes);
  app.use('/api/wishList',wishListRoutes);
  app.use("/api/admin",adminRoutes);
  app.use("/api/cloudinary",cloudinaryRoutes);
  app.use('/api/order',orderRoutes);
  app.use('/api/payment',paymentRoutes);
  app.use('/api', notFound);
  
  if (config.serveClient) {
    const dist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
    if (!existsSync(path.join(dist, 'index.html'))) throw new Error('Run npm run build before enabling SERVE_CLIENT.');
    app.use(express.static(dist));
    app.get('/{*page}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
