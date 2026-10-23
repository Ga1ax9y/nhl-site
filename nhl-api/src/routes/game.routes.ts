import { Router } from 'express';
import type { Request } from 'express';
import { ProxyError } from '../http/proxyError';
import type { RouteDeps } from './deps';
import { isGameId, param } from './validation';

export function createGameRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  const gameIdFrom = (params: Request['params']): string => {
    const gameId = param(params, 'gameId');

    if (!isGameId(gameId)) {
      throw ProxyError.badRequest('Invalid game id');
    }

    return gameId;
  };

  router.get('/game/:gameId/landing', async (req, res) => {
    res.json(await nhlApi.getGameLanding(gameIdFrom(req.params)));
  });

  router.get('/game/:gameId/boxscore', async (req, res) => {
    res.json(await nhlApi.getGameBoxscore(gameIdFrom(req.params)));
  });

  router.get('/game/:gameId/play-by-play', async (req, res) => {
    res.json(await nhlApi.getGamePlayByPlay(gameIdFrom(req.params)));
  });

  return router;
}
