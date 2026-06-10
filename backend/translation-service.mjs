export function createTranslationService(provider) {
  return {
    async translate(request) {
      return provider.translate(request);
    },
  };
}
