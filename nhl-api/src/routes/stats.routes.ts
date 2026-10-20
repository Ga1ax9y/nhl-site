import { Router } from 'express';
import type { RouteDeps } from './deps';
import { param } from './validation';

export function createStatsRouter({ statsService }: RouteDeps): Router {
  const router = Router();

  router.get('/stats/:season', async (req, res) => {
    res.json(await statsService.getLeaders(param(req.params, 'season')));
  });

  return router;
}
