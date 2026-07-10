import type { Request, Response } from 'express';

import { env } from '../../config/env';
import { AppError } from '../../shared/errors/app-error';

export function healthController(request: Request, response: Response): void {
  response.status(200).json({
    status: 'ok',
    app: env.appName,
    environment: env.nodeEnv,
    requestId: request.id,
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
}

export function readinessController(request: Request, response: Response): void {
  response.status(200).json({
    status: 'ready',
    app: env.appName,
    requestId: request.id,
    checks: {
      environment: true,
      port: true,
      corsOrigin: true,
      rateLimit: true
    },
    timestamp: new Date().toISOString()
  });
}

export function controlledErrorController(): void {
  throw new AppError(
    'Controlled test error',
    400,
    'CONTROLLED_TEST_ERROR'
  );
}
