export type TranslationRequest = {
  text: string;
  sourceLanguage: "auto";
  targetLanguage: string;
  context: "hover" | "selection";
};

export type TranslationResult = {
  translatedText: string;
  providerName: string;
};

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}
