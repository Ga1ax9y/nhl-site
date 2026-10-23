import type { Request } from 'express';

export function param(params: Request['params'], name: string): string {
  return params[name] as string;
}

export function isTeamAbbrev(value: string): boolean {
  return /^[A-Z]{3}$/.test(value);
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isPlayerId(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isGameId(value: string): boolean {
  return /^\d+$/.test(value);
}
