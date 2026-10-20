export interface ErrorResponse {
  error: string;
}

export interface PingResponse {
  message: string;
}

export interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  pubDate: string;
  guid: string;
}

export interface NewsResponse {
  items: NewsItem[];
}
