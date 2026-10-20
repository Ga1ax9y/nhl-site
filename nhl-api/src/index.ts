import { loadConfig } from './config/env';
import { axiosHttpClient } from './http/httpClient';
import { createApp } from './http/app';
import { createNhlApi } from './upstream/nhlApi';
import { createStatsService } from './services/stats.service';
import { createNewsService } from './services/news.service';
import { createRouter } from './routes';

const config = loadConfig();

const nhlApi = createNhlApi(axiosHttpClient, config.upstream);

const router = createRouter({
  nhlApi,
  statsService: createStatsService(nhlApi),
  newsService: createNewsService(config.newsRssUrl),
});

createApp({ corsOrigin: config.corsOrigin, router }).listen(
  config.port,
  '0.0.0.0',
  () => {
    console.log(`Сервер запущен на http://localhost:${config.port}`);
  },
);
