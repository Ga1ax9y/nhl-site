import type { HttpClient } from '../http/httpClient';
import { ProxyError } from '../http/proxyError';
import type { UpstreamUrls } from '../config/env';

export interface NhlApi {
  getFranchises(): Promise<unknown>;
  getStandings(season: string): Promise<unknown>;
  getStandingsSeasons(): Promise<unknown>;
  getSkaterLeaders(seasonPath: string): Promise<unknown>;
  getGoalieLeaders(seasonPath: string): Promise<unknown>;
  getRoster(teamAbbrev: string): Promise<unknown>;
  getPlayerLanding(playerId: string): Promise<unknown>;
  getSchedule(date: string): Promise<unknown>;
  getGameLanding(gameId: string): Promise<unknown>;
  getGameBoxscore(gameId: string): Promise<unknown>;
  getGamePlayByPlay(gameId: string): Promise<unknown>;
}

export function createNhlApi(
  httpClient: HttpClient,
  upstream: UpstreamUrls,
): NhlApi {
  const upstreamJson = async (
    failureMessage: string,
    url: string,
  ): Promise<unknown> => {
    try {
      return await httpClient.getJson(url);
    } catch (cause) {
      throw new ProxyError(500, failureMessage, cause);
    }
  };

  return {
    getFranchises: () =>
      upstreamJson('Failed to fetch teams', `${upstream.statsBase}/en/franchise`),
    getStandings: (season) =>
      upstreamJson('Failed to fetch standings', `${upstream.webBase}/v1/standings/${season}`),
    getStandingsSeasons: () =>
      upstreamJson('Failed to fetch standings', `${upstream.webBase}/v1/standings-season`),
    getSkaterLeaders: (seasonPath) =>
      upstreamJson(
        'Failed to fetch stats',
        `${upstream.webBase}/v1/skater-stats-leaders/${seasonPath}?limit=50`,
      ),
    getGoalieLeaders: (seasonPath) =>
      upstreamJson(
        'Failed to fetch stats',
        `${upstream.webBase}/v1/goalie-stats-leaders/${seasonPath}?limit=50`,
      ),
    getRoster: (teamAbbrev) =>
      upstreamJson('Failed to fetch roster', `${upstream.webBase}/v1/roster/${teamAbbrev}/current`),
    getPlayerLanding: (playerId) =>
      upstreamJson('Failed to fetch player info', `${upstream.webBase}/v1/player/${playerId}/landing`),
    getSchedule: (date) =>
      upstreamJson('Failed to fetch schedule', `${upstream.webBase}/v1/schedule/${date}`),
    getGameLanding: (gameId) =>
      upstreamJson('Failed to fetch game', `${upstream.webBase}/v1/gamecenter/${gameId}/landing`),
    getGameBoxscore: (gameId) =>
      upstreamJson('Failed to fetch game boxscore', `${upstream.webBase}/v1/gamecenter/${gameId}/boxscore`),
    getGamePlayByPlay: (gameId) =>
      upstreamJson('Failed to fetch game play-by-play', `${upstream.webBase}/v1/gamecenter/${gameId}/play-by-play`),
  };
}
