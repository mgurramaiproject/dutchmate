import type { TranslationRequest, TranslationResult } from "./provider";
import { CustomEndpointTranslationProvider } from "./custom-endpoint-provider";
import { PlaceholderTranslationProvider } from "./placeholder-provider";
import { TranslationCache } from "./translation-cache";

export type TranslationProviderSettings = {
  providerEndpoint: string;
  providerApiKey: string;
};

export class TranslationService {
  private readonly placeholderProvider = new PlaceholderTranslationProvider();

  constructor(
    private readonly readSettings: () => Promise<TranslationProviderSettings>,
    private readonly cache: TranslationCache,
  ) {}

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const settings = await this.readSettings();

    if (!settings.providerEndpoint) {
      return this.placeholderProvider.translate(request);
    }

    return new CustomEndpointTranslationProvider(settings, this.cache).translate(request);
  }
}

