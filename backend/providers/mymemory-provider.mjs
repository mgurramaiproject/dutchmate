import { ProviderError } from "../provider-error.mjs";

const DEFAULT_MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

export function createMyMemoryProvider({
  apiUrl = DEFAULT_MYMEMORY_API_URL,
  defaultSourceLanguage = "nl",
  email,
  fetchFn = fetch,
}) {
  return {
    name: "mymemory",
    async translate(request) {
      const sourceLanguage =
        request.sourceLanguage === "auto" ? defaultSourceLanguage : request.sourceLanguage;
      const url = new URL(apiUrl);

      url.searchParams.set("q", request.text);
      url.searchParams.set("langpair", `${sourceLanguage}|${request.targetLanguage}`);
      url.searchParams.set("mt", "1");

      if (email) {
        url.searchParams.set("de", email);
      }

      const response = await fetchFn(url);

      if (!response.ok) {
        throw new ProviderError(`MyMemory returned ${response.status}`, {
          statusCode: response.status === 429 ? 429 : 502,
          providerName: "mymemory",
          providerStatus: response.status,
        });
      }

      const body = await response.json();
      const translatedText = body?.responseData?.translatedText;

      if (typeof translatedText !== "string" || !translatedText) {
        throw new Error("MyMemory response is missing responseData.translatedText");
      }

      return {
        translatedText,
        provider: "mymemory",
      };
    },
  };
}
