import { Router } from 'express';
import type { RouteDeps } from './deps';

export function createTeamsRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  router.get('/teams', async (req, res) => {
    res.json(await nhlApi.getFranchises());
  });

  return router;
}
