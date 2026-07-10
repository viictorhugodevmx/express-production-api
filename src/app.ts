import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { notFoundMiddleware } from './shared/middlewares/not-found.middleware';
import { globalRateLimitMiddleware } from './shared/middlewares/rate-limit.middleware';
import { requestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { requestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';

export const app = express();

app.use(requestIdMiddleware);

app.use(requestLoggerMiddleware);

app.use(helmet());

app.use(cors({
  origin: env.corsOrigin
}));

app.use(globalRateLimitMiddleware);

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({
    status: 'ok',
    app: env.appName,
    environment: env.nodeEnv,
    requestId: request.id,
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);
