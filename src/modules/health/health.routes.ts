import { Router } from 'express';

import {
  compressionTestController,
  controlledErrorController,
  healthController,
  readinessController
} from './health.controller';

export const healthRoutes = Router();

healthRoutes.get('/', healthController);

healthRoutes.get('/readiness', readinessController);

healthRoutes.get('/controlled-error', controlledErrorController);

healthRoutes.get('/compression-test', compressionTestController);
