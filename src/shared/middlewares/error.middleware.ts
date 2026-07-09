import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/env';
import { AppError } from '../errors/app-error';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
    return;
  }

  const message = error instanceof Error ? error.message : 'Internal server error';

  response.status(500).json({
    message: env.nodeEnv === 'production' ? 'Internal server error' : message,
    code: 'INTERNAL_SERVER_ERROR'
  });
};
