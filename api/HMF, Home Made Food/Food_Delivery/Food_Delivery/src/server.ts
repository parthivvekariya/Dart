import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { menuRouter } from '@/api/menu/menuRouter';
import { restaurantRouter } from '@/api/restaurant/restaurantRouter';
import { reviewRouter } from '@/api/review/reviewRouter';
import { userRouter } from '@/api/user/userRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { authMiddleware } from '@/common/middleware/authMiddleware';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { authRouter } from './api/auth/authRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/restaurant', authMiddleware, restaurantRouter);
app.use('/menu', authMiddleware, menuRouter);
app.use('/review', authMiddleware, reviewRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
