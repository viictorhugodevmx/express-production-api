import type { RequestHandler } from 'express';

import { env } from '../../config/env';
import { logger } from '../utils/logger';

export const requestTimeoutMiddleware: RequestHandler = (
  request,
  response,
  next
) => {
  const timeout = setTimeout(() => {
    if (response.headersSent) {
      return;
    }

    logger.warn('HTTP request timed out', {
      requestId: request.id,
      method: request.method,
      path: request.originalUrl,
      timeoutMs: env.requestTimeoutMs
    });

    response.status(503).json({
      message: 'Request timed out',
      code: 'REQUEST_TIMEOUT',
      requestId: request.id
    });
  }, env.requestTimeoutMs);

  response.on('finish', () => {
    clearTimeout(timeout);
  });

  response.on('close', () => {
    clearTimeout(timeout);
  });

  next();
};
