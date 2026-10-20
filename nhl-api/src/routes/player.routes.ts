import { Router } from 'express';
import { ProxyError } from '../http/proxyError';
import type { RouteDeps } from './deps';
import { isPlayerId, param } from './validation';

export function createPlayerRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  router.get('/player/:playerId', async (req, res) => {
    const playerId = param(req.params, 'playerId');

    if (!isPlayerId(playerId)) {
      throw ProxyError.badRequest('Invalid player id');
    }

    res.json(await nhlApi.getPlayerLanding(playerId));
  });

  return router;
}
