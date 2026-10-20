import { Router } from 'express';
import type { RouteDeps } from './deps';

export function createNewsRouter({ newsService }: RouteDeps): Router {
  const router = Router();

  router.get('/news', async (req, res) => {
    res.json(await newsService.getTransactions());
  });

  return router;
}
