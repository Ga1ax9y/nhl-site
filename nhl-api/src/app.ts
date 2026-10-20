import express from 'express';
import cors from 'cors';
import { routes } from './routes';

export function createApp(): express.Express {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173', // 172.20.10.2:5173
      methods: ['GET'],
    }),
  );

  app.use('/api', routes);

  return app;
}
