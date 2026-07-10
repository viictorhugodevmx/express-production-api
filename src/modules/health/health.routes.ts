import { Router } from 'express';

import {
  healthController,
  readinessController
} from './health.controller';

export const healthRoutes = Router();

healthRoutes.get('/', healthController);

healthRoutes.get('/readiness', readinessController);
