import type { RequestHandler } from 'express';
import onHeaders from 'on-headers';

export const responseTimeMiddleware: RequestHandler = (
  _request,
  response,
  next
) => {
  const startedAt = process.hrtime.bigint();

  onHeaders(response, () => {
    const finishedAt = process.hrtime.bigint();

    const durationMs = Number(finishedAt - startedAt) / 1_000_000;

    const formattedDuration = Number(durationMs.toFixed(2));

    response.setHeader(
      'X-Response-Time',
      `${formattedDuration}ms`
    );

    response.setHeader(
      'Server-Timing',
      `app;dur=${formattedDuration}`
    );
  });

  next();
};
