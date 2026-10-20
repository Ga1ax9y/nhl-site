import express from 'express';
import cors from 'cors';
import type { Router } from 'express';
import { proxyErrorMiddleware } from './errorMiddleware';

export interface AppOptions {
  corsOrigin: string;
  router: Router;
}

export function createApp({ corsOrigin, router }: AppOptions): express.Express {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin,
      methods: ['GET'],
    }),
  );

  app.use('/api', router);
  app.use(proxyErrorMiddleware);

  return app;
}
