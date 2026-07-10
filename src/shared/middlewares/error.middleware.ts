import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/env';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    logger.warn('Controlled application error', {
      requestId: request.id,
      method: request.method,
      path: request.originalUrl,
      statusCode: error.statusCode,
      code: error.code,
      error: error.message
    });

    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      requestId: request.id
    });

    return;
  }

  const errorMessage = error instanceof Error
    ? error.message
    : 'Unknown internal error';

  logger.error('Unhandled application error', {
    requestId: request.id,
    method: request.method,
    path: request.originalUrl,
    statusCode: 500,
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined
  });

  response.status(500).json({
    message: env.nodeEnv === 'production'
      ? 'Internal server error'
      : errorMessage,
    code: 'INTERNAL_SERVER_ERROR',
    requestId: request.id
  });
};
