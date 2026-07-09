import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { notFoundMiddleware } from './shared/middlewares/not-found.middleware';
import { requestIdMiddleware } from './shared/middlewares/request-id.middleware';

export const app = express();

app.use(requestIdMiddleware);

app.use(helmet());

app.use(cors({
  origin: env.corsOrigin
}));

app.use(express.json());

app.use(morgan('dev'));

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
