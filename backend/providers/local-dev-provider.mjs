const knownTranslations = new Map([
  [translationKey("bonjour", "en"), "hello"],
  [translationKey("merci", "en"), "thank you"],
  [translationKey("hola", "en"), "hello"],
  [translationKey("gracias", "en"), "thank you"],
  [translationKey("guten tag", "en"), "hello"],
  [translationKey("hello", "es"), "hola"],
  [translationKey("thank you", "es"), "gracias"],
  [translationKey("good morning", "es"), "buenos dias"],
  [translationKey("hello", "fr"), "bonjour"],
  [translationKey("thank you", "fr"), "merci"],
]);

export function createLocalDevProvider() {
  return {
    name: "local-dev",
    async translate(request) {
      const translatedText =
        knownTranslations.get(translationKey(request.text, request.targetLanguage)) ??
        `[local-dev ${request.targetLanguage}] ${request.text}`;

      return {
        translatedText,
        provider: "local-dev",
      };
    },
  };
}

function translationKey(text, targetLanguage) {
  return `${targetLanguage.trim().toLowerCase()}:${text.trim().toLowerCase()}`;
}
