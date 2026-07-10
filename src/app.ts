import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { healthRoutes } from './modules/health/health.routes';
import { compressionMiddleware } from './shared/middlewares/compression.middleware';
import { corsMiddleware } from './shared/middlewares/cors.middleware';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { notFoundMiddleware } from './shared/middlewares/not-found.middleware';
import { globalRateLimitMiddleware } from './shared/middlewares/rate-limit.middleware';
import { requestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { requestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';

export const app = express();

app.disable('x-powered-by');

app.use(requestIdMiddleware);

app.use(requestLoggerMiddleware);

app.use(helmet());

app.use(corsMiddleware);

app.use(globalRateLimitMiddleware);

app.use(compressionMiddleware);

app.use(express.json({
  limit: env.jsonBodyLimit
}));

app.use('/api/health', healthRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);
