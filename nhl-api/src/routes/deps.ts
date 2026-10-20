import type { NhlApi } from '../upstream/nhlApi';
import type { StatsService } from '../services/stats.service';
import type { NewsService } from '../services/news.service';

export interface RouteDeps {
  nhlApi: NhlApi;
  statsService: StatsService;
  newsService: NewsService;
}
