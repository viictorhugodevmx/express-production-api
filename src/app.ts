import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';

export const app = express();

app.use(helmet());
app.use(cors({
  origin: env.corsOrigin
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    app: env.appName,
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});
