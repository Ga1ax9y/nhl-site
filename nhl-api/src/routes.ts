import Parser from 'rss-parser';
import { Router } from 'express';
import type { Request, Response, RequestHandler } from 'express';
import {
  isIsoDate,
  isPlayerId,
  isTeamAbbrev,
  statsSeasonPath,
} from './contracts';
import { fetchJson, nhlStats, nhlWeb } from './upstream';

const parser = new Parser();

const NEWS_RSS_URL =
  'https://www.eliteprospects.com/rss/league/nhl/transactions';

// Обёртка маршрутов: единый try/catch → { error } + статус 5xx
// (Express 5 сам форвардит reject'ы, но контрактный текст ошибки у каждого эндпоинта свой).
function asRoute(
  failureMessage: string,
  handler: (req: Request, res: Response) => Promise<void>,
): RequestHandler {
  return (req, res) => {
    handler(req, res).catch((error: unknown) => {
      console.error(failureMessage, (error as Error).message);
      res.status(500).json({ error: failureMessage });
    });
  };
}

function sendBadRequest(res: Response, error: string): void {
  res.status(400).json({ error });
}

// @types/express 5 типизирует req.params.* как string | string[],
// но паттерн маршрута гарантирует строку.
function param(params: Request['params'], name: string): string {
  return params[name] as string;
}

const router = Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'Server is running' });
});

router.get(
  '/teams',
  asRoute('Failed to fetch teams', async (req, res) => {
    res.json(await fetchJson(nhlStats('/en/franchise')));
  }),
);

router.get(
  '/standings/:season',
  asRoute('Failed to fetch standings', async (req, res) => {
    const season = param(req.params, 'season');
    res.json(await fetchJson(nhlWeb(`/v1/standings/${season}`)));
  }),
);

router.get(
  '/standings-season',
  asRoute('Failed to fetch standings', async (req, res) => {
    res.json(await fetchJson(nhlWeb('/v1/standings-season')));
  }),
);

router.get(
  '/stats/:season',
  asRoute('Failed to fetch stats', async (req, res) => {
    const seasonPath = statsSeasonPath(param(req.params, 'season'));

    const [skaterData, goalieData] = await Promise.all([
      fetchJson(nhlWeb(`/v1/skater-stats-leaders/${seasonPath}?limit=50`)),
      fetchJson(nhlWeb(`/v1/goalie-stats-leaders/${seasonPath}?limit=50`)),
    ]);

    res.json(Object.assign({}, skaterData, goalieData));
  }),
);

router.get(
  '/roster/:teamAbbrev',
  asRoute('Failed to fetch roster', async (req, res) => {
    const teamAbbrev = param(req.params, 'teamAbbrev');

    if (!isTeamAbbrev(teamAbbrev)) {
      sendBadRequest(res, 'Invalid team abbreviation');
      return;
    }

    res.json(await fetchJson(nhlWeb(`/v1/roster/${teamAbbrev}/current`)));
  }),
);

router.get(
  '/player/:playerId',
  asRoute('Failed to fetch player info', async (req, res) => {
    const playerId = param(req.params, 'playerId');

    if (!isPlayerId(playerId)) {
      sendBadRequest(res, 'Invalid player id');
      return;
    }

    res.json(await fetchJson(nhlWeb(`/v1/player/${playerId}/landing`)));
  }),
);

router.get(
  '/news',
  asRoute('Failed to fetch news', async (req, res) => {
    const feed = await parser.parseURL(NEWS_RSS_URL);

    feed.items.forEach((item) => {
      if (item.contentSnippet === undefined) return;
      const statusMatch = item.contentSnippet.match(/^Status: .+?(?=\n|$)/);
      if (statusMatch) item.contentSnippet = statusMatch[0];
    });

    res.json({ items: feed.items });
  }),
);

const handleSchedule = async (req: Request, res: Response): Promise<void> => {
  const date = param(req.params, 'date');

  if (date && date !== 'now' && !isIsoDate(date)) {
    sendBadRequest(res, 'Invalid date format. Expected YYYY-MM-DD or "now"');
    return;
  }

  res.json(await fetchJson(nhlWeb(`/v1/schedule/${date || 'now'}`)));
};

router.get('/schedule', asRoute('Failed to fetch schedule', handleSchedule));
router.get('/schedule/:date', asRoute('Failed to fetch schedule', handleSchedule));

export { router as routes };
