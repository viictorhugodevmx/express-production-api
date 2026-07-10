import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name: string, defaultValue: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return defaultValue;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(
      `Environment variable ${name} must be a positive number`
    );
  }

  return parsedValue;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: getNumberEnv('PORT', 3003),
  appName: getRequiredEnv('APP_NAME'),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  jsonBodyLimit: process.env.JSON_BODY_LIMIT ?? '100kb',
  requestTimeoutMs: getNumberEnv('REQUEST_TIMEOUT_MS', 5000),
  rateLimitWindowMs: getNumberEnv(
    'RATE_LIMIT_WINDOW_MS',
    60000
  ),
  rateLimitMaxRequests: getNumberEnv(
    'RATE_LIMIT_MAX_REQUESTS',
    100
  )
};
