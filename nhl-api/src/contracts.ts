// Публичные контракты прокси: то, что клиент получает по сети.
// Ответы standings/roster/player/schedule/stats — passthrough NHL API (не реконтрактируем).

// Единый формат ошибки всех эндпоинтов — часть контракта фронта.
export interface ErrorResponse {
  error: string;
}

export interface PingResponse {
  message: string;
}

// /api/news — структурный контракт согласован с nhl-site/src/types/news.ts
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

// --- Валидация на границе (route params) ---

export function isTeamAbbrev(value: string): boolean {
  return /^[A-Z]{3}$/.test(value);
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isPlayerId(value: string): boolean {
  return /^\d+$/.test(value);
}

// /api/stats/:season: 'current' → upstream /current, иначе {season}/2
export function statsSeasonPath(season: string): string {
  return season === 'current' ? 'current' : `${season}/2`;
}
