import { ProviderError } from "../provider-error.mjs";

const DEFAULT_GOOGLE_TRANSLATE_API_URL =
  "https://translation.googleapis.com/language/translate/v2";

export function createGoogleTranslateProvider({
  apiKey,
  apiUrl = DEFAULT_GOOGLE_TRANSLATE_API_URL,
  fetchFn = fetch,
}) {
  return {
    name: "google-translate",
    async translate(request) {
      const url = new URL(apiUrl);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("q", request.text);
      url.searchParams.set("target", request.targetLanguage);
      url.searchParams.set("format", "text");

      if (request.sourceLanguage !== "auto") {
        url.searchParams.set("source", request.sourceLanguage);
      }

      const response = await fetchFn(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new ProviderError(`Google Translate returned ${response.status}`, {
          statusCode: response.status === 429 ? 429 : 502,
          providerName: "google-translate",
          providerStatus: response.status,
        });
      }

      const body = await response.json();
      const translatedText = body?.data?.translations?.[0]?.translatedText;

      if (typeof translatedText !== "string" || !translatedText) {
        throw new Error("Google Translate response is missing data.translations[0].translatedText");
      }

      return {
        translatedText,
        provider: "google-translate",
      };
    },
  };
}
