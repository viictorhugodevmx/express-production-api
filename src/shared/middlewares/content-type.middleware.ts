import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error';

const methodsWithBody = new Set([
  'POST',
  'PUT',
  'PATCH'
]);

export const contentTypeMiddleware: RequestHandler = (
  request,
  _response,
  next
) => {
  if (!methodsWithBody.has(request.method)) {
    next();
    return;
  }

  const contentLength = Number(
    request.header('Content-Length') ?? 0
  );

  const transferEncoding = request.header(
    'Transfer-Encoding'
  );

  const hasBody = contentLength > 0
    || Boolean(transferEncoding);

  if (!hasBody) {
    next();
    return;
  }

  if (!request.is('application/json')) {
    next(
      new AppError(
        'Content-Type must be application/json',
        415,
        'UNSUPPORTED_MEDIA_TYPE'
      )
    );

    return;
  }

  next();
};
