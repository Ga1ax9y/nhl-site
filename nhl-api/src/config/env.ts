export const NHL_WEB_API = 'https://api-web.nhle.com';
export const NHL_STATS_API = 'https://api.nhle.com/stats/rest';
export const NEWS_RSS_URL =
  'https://www.eliteprospects.com/rss/league/nhl/transactions';

export interface UpstreamUrls {
  webBase: string;
  statsBase: string;
}

export interface AppConfig {
  port: number;
  corsOrigin: string;
  newsRssUrl: string;
  upstream: UpstreamUrls;
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    newsRssUrl: NEWS_RSS_URL,
    upstream: {
      webBase: NHL_WEB_API,
      statsBase: NHL_STATS_API,
    },
  };
}
