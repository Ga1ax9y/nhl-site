import { Router } from 'express';
import type { Request, Response } from 'express';
import { ProxyError } from '../http/proxyError';
import type { RouteDeps } from './deps';
import { isIsoDate, param } from './validation';

export function createScheduleRouter({ nhlApi }: RouteDeps): Router {
  const router = Router();

  const handleSchedule = async (req: Request, res: Response): Promise<void> => {
    const date = param(req.params, 'date');

    if (date && date !== 'now' && !isIsoDate(date)) {
      throw ProxyError.badRequest(
        'Invalid date format. Expected YYYY-MM-DD or "now"',
      );
    }

    res.json(await nhlApi.getSchedule(date || 'now'));
  };

  router.get('/schedule', handleSchedule);
  router.get('/schedule/:date', handleSchedule);

  return router;
}
