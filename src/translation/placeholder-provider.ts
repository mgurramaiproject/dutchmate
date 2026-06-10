import type { TranslationProvider, TranslationRequest, TranslationResult } from "./provider";

export class PlaceholderTranslationProvider implements TranslationProvider {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    return {
      translatedText: `Translation will appear here. (${request.targetLanguage})`,
      providerName: "placeholder",
    };
  }
}

