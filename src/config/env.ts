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

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsedValue;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: getNumberEnv('PORT', 3003),
  appName: getRequiredEnv('APP_NAME'),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  rateLimitWindowMs: getNumberEnv('RATE_LIMIT_WINDOW_MS', 60000),
  rateLimitMaxRequests: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', 100)
};
