export class ProviderError extends Error {
  constructor(
    message,
    { statusCode = 502, retryAfterSeconds, providerName, providerStatus } = {},
  ) {
    super(message);
    this.name = "ProviderError";
    this.statusCode = statusCode;
    this.retryAfterSeconds = retryAfterSeconds;
    this.providerName = providerName;
    this.providerStatus = providerStatus;
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

export function getProviderErrorMetadata(error) {
  if (!(error instanceof ProviderError)) {
    return {};
  }

  return {
    providerName: error.providerName,
    providerStatus: error.providerStatus,
    providerRateLimited: error.providerStatus === 429 || error.statusCode === 429,
  };
}
