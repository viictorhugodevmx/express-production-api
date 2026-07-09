import { randomUUID } from 'node:crypto';

import type { RequestHandler } from 'express';

export const requestIdMiddleware: RequestHandler = (request, response, next) => {
  const incomingRequestId = request.header('X-Request-Id');

  const requestId = incomingRequestId?.trim() || randomUUID();

  request.id = requestId;

  response.setHeader('X-Request-Id', requestId);

  next();
};
