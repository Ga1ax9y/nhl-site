export class ProxyError extends Error {
  readonly status: number;

  constructor(status: number, message: string, cause?: unknown) {
    super(message);
    this.name = 'ProxyError';
    this.status = status;
    if (cause !== undefined) this.cause = cause;
  }

  static badRequest(message: string): ProxyError {
    return new ProxyError(400, message);
  }
}
