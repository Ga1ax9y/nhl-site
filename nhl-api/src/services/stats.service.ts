import type { NhlApi } from '../upstream/nhlApi';

export interface StatsServiceDeps {
  getSkaterLeaders(seasonPath: string): Promise<unknown>;
  getGoalieLeaders(seasonPath: string): Promise<unknown>;
}

export interface StatsService {
  getLeaders(season: string): Promise<unknown>;
}

export function createStatsService(deps: StatsServiceDeps): StatsService {
  return {
    async getLeaders(season: string) {
      const seasonPath = season === 'current' ? 'current' : `${season}/2`;

      const [skaterData, goalieData] = await Promise.all([
        deps.getSkaterLeaders(seasonPath),
        deps.getGoalieLeaders(seasonPath),
      ]);

      return Object.assign({}, skaterData, goalieData);
    },
  };
}
