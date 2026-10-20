import Parser from 'rss-parser';
import { ProxyError } from '../http/proxyError';
import type { NewsItem, NewsResponse } from '../types/api';

export interface NewsService {
  getTransactions(): Promise<NewsResponse>;
}

export function createNewsService(newsRssUrl: string): NewsService {
  const parser = new Parser();

  return {
    async getTransactions() {
      try {
        const feed = await parser.parseURL(newsRssUrl);

        const items = feed.items.map(
          (item): NewsItem => {
            const snippet = item.contentSnippet ?? '';
            const statusMatch = snippet.match(/^Status: .+?(?=\n|$)/);

            return {
              title: item.title ?? '',
              contentSnippet: statusMatch ? statusMatch[0] : snippet,
              link: item.link ?? '',
              pubDate: item.pubDate ?? '',
              guid: item.guid ?? '',
            };
          },
        );

        return { items };
      } catch (cause) {
        throw new ProxyError(500, 'Failed to fetch news', cause);
      }
    },
  };
}
