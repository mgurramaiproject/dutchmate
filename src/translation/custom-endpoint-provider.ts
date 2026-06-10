import type { TranslationProvider, TranslationRequest, TranslationResult } from "./provider";
import { TranslationCache } from "./translation-cache";

export type CustomEndpointProviderSettings = {
  providerEndpoint: string;
  providerApiKey: string;
};

export class CustomEndpointTranslationProvider implements TranslationProvider {
  constructor(
    private readonly settings: CustomEndpointProviderSettings,
    private readonly cache: TranslationCache,
  ) {}

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const cachedResult = this.cache.get(request);

    if (cachedResult) {
      return cachedResult;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.settings.providerApiKey) {
      headers.Authorization = `Bearer ${this.settings.providerApiKey}`;
    }

    const response = await fetch(this.settings.providerEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

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
    return result;
  }
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

