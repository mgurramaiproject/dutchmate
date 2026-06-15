import { ProviderError } from "../provider-error.mjs";

const DEFAULT_AZURE_TRANSLATOR_API_URL =
  "https://api.cognitive.microsofttranslator.com/translate";

export function createAzureTranslatorProvider({
  apiKey,
  apiUrl = DEFAULT_AZURE_TRANSLATOR_API_URL,
  region,
  fetchFn = fetch,
}) {
  return {
    name: "azure-translator",
    async translate(request) {
      const url = new URL(apiUrl);
      url.searchParams.set("api-version", "3.0");
      url.searchParams.set("to", request.targetLanguage);

      if (request.sourceLanguage !== "auto") {
        url.searchParams.set("from", request.sourceLanguage);
      }

      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Ocp-Apim-Subscription-Key": apiKey,
      };

      if (region) {
        headers["Ocp-Apim-Subscription-Region"] = region;
      }

      const response = await fetchFn(url, {
        method: "POST",
        headers,
        body: JSON.stringify([{ Text: request.text }]),
      });

      if (!response.ok) {
        throw new ProviderError(`Azure Translator returned ${response.status}`, {
          statusCode: response.status === 429 ? 429 : 502,
          providerName: "azure-translator",
          providerStatus: response.status,
        });
      }

      const body = await response.json();
      const translatedText = body?.[0]?.translations?.[0]?.text;

      if (typeof translatedText !== "string" || !translatedText) {
        throw new Error("Azure Translator response is missing translations[0].text");
      }

      return {
        translatedText,
        provider: "azure-translator",
      };
    },
  };
}
