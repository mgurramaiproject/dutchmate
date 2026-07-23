import type { TranslationProvider, TranslationRequest, TranslationResult } from "./provider";
import { TranslationCache } from "./translation-cache";

export type PersistentTranslationCacheLayer = {
  get(request: TranslationRequest): Promise<TranslationResult | null>;
  set(request: TranslationRequest, result: TranslationResult): Promise<void>;
};

export type CustomEndpointProviderSettings = {
  providerEndpoint: string;
  providerApiKey: string;
  timeoutMs?: number;
};

// Hosted providers can cold-start after the browser or extension has been idle.
// This remains bounded, but leaves enough time for the first request to wake them.
export const DEFAULT_PROVIDER_TIMEOUT_MS = 20000;

export class CustomEndpointTranslationProvider implements TranslationProvider {
  constructor(
    private readonly settings: CustomEndpointProviderSettings,
    private readonly cache: TranslationCache,
    private readonly persistentCache?: PersistentTranslationCacheLayer,
  ) {}

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const cachedResult = this.cache.get(request);

    if (cachedResult) {
      return cachedResult;
    }

    const persistentResult = await this.persistentCache?.get(request);

    if (persistentResult) {
      this.cache.set(request, persistentResult);
      return persistentResult;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.settings.providerApiKey) {
      headers.Authorization = `Bearer ${this.settings.providerApiKey}`;
    }

    const response = await fetchWithTimeout(
      this.settings.providerEndpoint,
      {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      },
      this.settings.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS,
    );

    if (!response.ok) {
      throw new Error(`Provider returned ${response.status}`);
    }

    const payload = await response.json();
    const translatedText = getTranslatedText(payload);

    if (!translatedText) {
      throw new Error("Provider response is missing translatedText");
    }

    const result: TranslationResult = {
      translatedText,
      providerName: "custom-endpoint",
    };

    this.cache.set(request, result);
    await this.persistentCache?.set(request, result);
    return result;
  }
}

async function fetchWithTimeout(
  endpoint: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(endpoint, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Provider request timed out");
    }

    if (isNetworkError(error)) {
      throw new Error(
        "Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.",
      );
    }

    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

function getTranslatedText(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "translatedText" in payload &&
    typeof payload.translatedText === "string"
  ) {
    return payload.translatedText;
  }

  return null;
}
