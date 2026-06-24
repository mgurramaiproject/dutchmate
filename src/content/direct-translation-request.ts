import type { TranslationRequest, TranslationResult } from "../translation/provider";
import type { TranslateMessageResponse } from "./runtime-translation-client";

export const DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE =
  "Translation is temporarily busy. Try again soon.";
export const DIRECT_TRANSLATION_TIMEOUT_MESSAGE =
  "Translation request timed out before the backend responded.";
export const DIRECT_TRANSLATION_UNREACHABLE_MESSAGE =
  "Translation failed: Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.";

export type DirectTranslationSettings = {
  providerEndpoint: string;
  providerApiKey: string;
  timeoutMs: number;
};

export async function requestDirectTranslation(
  request: TranslationRequest,
  settings: DirectTranslationSettings,
  fetchFn: typeof fetch = fetch,
): Promise<TranslateMessageResponse> {
  if (!settings.providerEndpoint) {
    return {
      ok: true,
      result: {
        translatedText: `Translation will appear here. (${request.targetLanguage})`,
        providerName: "placeholder",
      },
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (settings.providerApiKey) {
    headers.Authorization = `Bearer ${settings.providerApiKey}`;
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => {
    controller.abort();
  }, settings.timeoutMs);

  try {
    const response = await fetchFn(settings.providerEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        error:
          response.status === 429
            ? DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE
            : `Translation failed: Provider returned ${response.status}`,
      };
    }

    const body = (await response.json()) as unknown;
    const translatedText = getTranslatedText(body);

    if (!translatedText) {
      return {
        ok: false,
        error: "Translation failed: Provider response is missing translatedText",
      };
    }

    const result: TranslationResult = {
      translatedText,
      providerName: "custom-endpoint",
    };

    return {
      ok: true,
      result,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof DOMException && error.name === "AbortError"
          ? DIRECT_TRANSLATION_TIMEOUT_MESSAGE
          : DIRECT_TRANSLATION_UNREACHABLE_MESSAGE,
    };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function getTranslatedText(body: unknown): string | null {
  return (
    typeof body === "object" &&
      body !== null &&
      "translatedText" in body &&
      typeof body.translatedText === "string"
  )
    ? body.translatedText
    : null;
}
