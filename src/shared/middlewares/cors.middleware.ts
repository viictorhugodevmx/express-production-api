import cors from 'cors';

import { env } from '../../config/env';
import { AppError } from '../errors/app-error';

const allowedOrigins = env.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new AppError(
        'Origin is not allowed by CORS',
        403,
        'CORS_ORIGIN_NOT_ALLOWED'
      )
    );
  },
  credentials: true
});
