import type { ErrorRequestHandler } from 'express';
import { ProxyError } from './proxyError';

export const proxyErrorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ProxyError) {
    if (error.status >= 500) console.error(error.message, error.cause);
    res.status(error.status).json({ error: error.message });
    return;
  }

  console.error('Unhandled server error:', error);
  res.status(500).json({ error: 'Internal server error' });
};
