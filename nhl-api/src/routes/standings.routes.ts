import { Router } from 'express';
import type { RouteDeps } from './deps';
import { param } from './validation';

export function createStandingsRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  router.get('/standings/:season', async (req, res) => {
    res.json(await nhlApi.getStandings(param(req.params, 'season')));
  });

  router.get('/standings-season', async (req, res) => {
    res.json(await nhlApi.getStandingsSeasons());
  });

  return router;
}
