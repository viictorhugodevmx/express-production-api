import { app } from './app';
import { env } from './config/env';
import { logger } from './shared/utils/logger';

const server = app.listen(env.port, () => {
  logger.info('Server started', {
    app: env.appName,
    environment: env.nodeEnv,
    port: env.port,
    url: `http://localhost:${env.port}`
  });
});

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.warn('Server shutdown started', {
    signal
  });

  server.close((error) => {
    if (error) {
      logger.error('Server shutdown failed', {
        signal,
        error: error.message
      });

      process.exit(1);
    }

    logger.info('Server shutdown completed', {
      signal
    });

    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Server shutdown forced after timeout', {
      signal,
      timeoutMs: 10000
    });

    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);
