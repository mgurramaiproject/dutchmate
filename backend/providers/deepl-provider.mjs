const DEFAULT_DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

export function createDeepLProvider({ apiKey, apiUrl = DEFAULT_DEEPL_API_URL, fetchFn = fetch }) {
  return {
    name: "deepl",
    async translate(request) {
      const response = await fetchFn(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [request.text],
          target_lang: request.targetLanguage.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepL returned ${response.status}`);
      }

      const body = await response.json();
      const translatedText = body?.translations?.[0]?.text;

      if (typeof translatedText !== "string" || !translatedText) {
        throw new Error("DeepL response is missing translations[0].text");
      }

      return {
        translatedText,
        provider: "deepl",
      };
    },
  };
}
