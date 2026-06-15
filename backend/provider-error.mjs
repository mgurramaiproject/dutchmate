export class ProviderError extends Error {
  constructor(message, { statusCode = 502, retryAfterSeconds } = {}) {
    super(message);
    this.name = "ProviderError";
    this.statusCode = statusCode;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function getProviderErrorStatus(error) {
  if (error instanceof ProviderError) {
    return error.statusCode;
  }

  return 400;
}

export function getProviderRetryAfterSeconds(error) {
  if (error instanceof ProviderError) {
    return error.retryAfterSeconds;
  }

  return undefined;
}
