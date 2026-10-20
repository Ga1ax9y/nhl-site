import axios from 'axios';

const NHL_WEB_API = 'https://api-web.nhle.com';
const NHL_STATS_API = 'https://api.nhle.com/stats/rest';

export function nhlWeb(path: string): string {
  return `${NHL_WEB_API}${path}`;
}

export function nhlStats(path: string): string {
  return `${NHL_STATS_API}${path}`;
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}
