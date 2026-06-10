import type { TranslationProviderSettings } from "../translation/translation-service";

const defaultProviderSettings: TranslationProviderSettings = {
  providerEndpoint: "",
  providerApiKey: "",
};

export type BackgroundExtensionApi = {
  storage: {
    sync: {
      get(
        defaults: TranslationProviderSettings,
        callback: (settings: Partial<TranslationProviderSettings>) => void,
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
    return defaultProviderSettings;
  }

  return new Promise((resolve) => {
    extensionApi.storage.sync.get(defaultProviderSettings, (stored) => {
      if (extensionApi.runtime.lastError) {
        resolve(defaultProviderSettings);
        return;
      }

      resolve({
        providerEndpoint: getStringSetting(
          stored.providerEndpoint,
          defaultProviderSettings.providerEndpoint,
        ),
        providerApiKey: getStringSetting(
          stored.providerApiKey,
          defaultProviderSettings.providerApiKey,
        ),
      });
    });
  });
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

