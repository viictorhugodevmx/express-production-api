import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/env';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';

interface HttpParserError extends Error {
  type?: string;
  status?: number;
}

export const errorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  const parserError = error as HttpParserError;

  if (
    parserError.type === 'entity.parse.failed'
    || (
      parserError.status === 400
      && error instanceof SyntaxError
    )
  ) {
    logger.warn('Request body contains invalid JSON', {
      requestId: request.id,
      method: request.method,
      path: request.originalUrl,
      statusCode: 400
    });

    response.status(400).json({
      message: 'Request body contains invalid JSON',
      code: 'INVALID_JSON',
      requestId: request.id
    });

    return;
  }

  if (
    parserError.type === 'entity.too.large'
    || parserError.status === 413
  ) {
    logger.warn('Request body exceeded allowed size', {
      requestId: request.id,
      method: request.method,
      path: request.originalUrl,
      statusCode: 413
    });

    response.status(413).json({
      message: 'Request body is too large',
      code: 'PAYLOAD_TOO_LARGE',
      requestId: request.id
    });

    return;
  }

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
    stack: error instanceof Error
      ? error.stack
      : undefined
  });

  response.status(500).json({
    message: env.nodeEnv === 'production'
      ? 'Internal server error'
      : errorMessage,
    code: 'INTERNAL_SERVER_ERROR',
    requestId: request.id
  });
};
