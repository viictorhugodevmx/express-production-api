import { app } from './app';
import { env } from './config/env';
import { logger } from './shared/utils/logger';

app.listen(env.port, () => {
  logger.info('Server started', {
    app: env.appName,
    environment: env.nodeEnv,
    port: env.port,
    url: `http://localhost:${env.port}`
  });
});
