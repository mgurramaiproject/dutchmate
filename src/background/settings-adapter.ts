import type { TranslationProviderSettings } from "../translation/translation-service";
import { defaultSettings, normalizeSettings } from "../shared/settings";

export type BackgroundExtensionApi = {
  storage: {
    sync: {
      get(
        defaults: typeof defaultSettings,
        callback: (settings: Partial<typeof defaultSettings>) => void,
      ): void;
    };
  };
  runtime: {
    lastError?: { message?: string };
  };
};

export async function readProviderSettings(
  extensionApi: BackgroundExtensionApi | undefined,
): Promise<TranslationProviderSettings> {
  if (!extensionApi) {
    return toProviderSettings(defaultSettings);
  }

  return new Promise((resolve) => {
    extensionApi.storage.sync.get(defaultSettings, (stored) => {
      if (extensionApi.runtime.lastError) {
        resolve(toProviderSettings(defaultSettings));
        return;
      }

      resolve(toProviderSettings(normalizeSettings(stored)));
    });
  });
}

function toProviderSettings(settings: typeof defaultSettings): TranslationProviderSettings {
  return {
    providerEndpoint: settings.providerEndpoint,
    providerApiKey: settings.providerApiKey,
  };
}
