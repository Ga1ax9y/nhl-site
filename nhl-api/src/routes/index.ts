import { Router } from 'express';
import type { RouteDeps } from './deps';
import { createTeamsRouter } from './teams.routes';
import { createStandingsRouter } from './standings.routes';
import { createStatsRouter } from './stats.routes';
import { createRosterRouter } from './roster.routes';
import { createPlayerRouter } from './player.routes';
import { createNewsRouter } from './news.routes';
import { createScheduleRouter } from './schedule.routes';
import { createGameRouter } from './game.routes';

export function createRouter(deps: RouteDeps): Router {
  const router = Router();

  router.get('/ping', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  router.use(createTeamsRouter(deps));
  router.use(createStandingsRouter(deps));
  router.use(createStatsRouter(deps));
  router.use(createRosterRouter(deps));
  router.use(createPlayerRouter(deps));
  router.use(createNewsRouter(deps));
  router.use(createScheduleRouter(deps));
  router.use(createGameRouter(deps));

  return router;
}
