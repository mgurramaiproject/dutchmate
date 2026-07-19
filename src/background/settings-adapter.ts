import type { TranslationProviderSettings } from "../translation/translation-service";
import { defaultSettings, normalizeSettings, type ExtensionSettings } from "../shared/settings";

export type BackgroundExtensionApi = {
  storage: {
    sync: {
      get(
        defaults: typeof defaultSettings,
        callback: (settings: Partial<typeof defaultSettings>) => void,
      ): void;
      set?(settings: Partial<typeof defaultSettings>, callback?: () => void): void;
    };
  };
  runtime: {
    lastError?: { message?: string };
  };
};

export async function readProviderSettings(
  extensionApi: BackgroundExtensionApi | undefined,
): Promise<TranslationProviderSettings> {
  return toProviderSettings(await readExtensionSettings(extensionApi));
}

export async function readExtensionSettings(
  extensionApi: BackgroundExtensionApi | undefined,
): Promise<ExtensionSettings> {
  if (!extensionApi) {
    return defaultSettings;
  }

  return new Promise((resolve) => {
    extensionApi.storage.sync.get(defaultSettings, (stored) => {
      if (extensionApi.runtime.lastError) {
        resolve(defaultSettings);
        return;
      }

      resolve(normalizeSettings(stored));
    });
  });
}

function toProviderSettings(settings: typeof defaultSettings): TranslationProviderSettings {
  return {
    providerEndpoint: settings.providerEndpoint,
    providerApiKey: settings.providerApiKey,
  };
}
