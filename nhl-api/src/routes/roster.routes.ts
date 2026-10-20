import { Router } from 'express';
import { ProxyError } from '../http/proxyError';
import type { RouteDeps } from './deps';
import { isTeamAbbrev, param } from './validation';

export function createRosterRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  router.get('/roster/:teamAbbrev', async (req, res) => {
    const teamAbbrev = param(req.params, 'teamAbbrev');

    if (!isTeamAbbrev(teamAbbrev)) {
      throw ProxyError.badRequest('Invalid team abbreviation');
    }

    res.json(await nhlApi.getRoster(teamAbbrev));
  });

  return router;
}
