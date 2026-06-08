import browser from "webextension-polyfill";

export const DEFAULT_TARGET_LANGUAGE = "en";

export type ExtensionSettings = {
  targetLanguage: string;
  providerEndpoint: string;
  providerApiKey: string;
};

export const defaultSettings: ExtensionSettings = {
  targetLanguage: DEFAULT_TARGET_LANGUAGE,
  providerEndpoint: "",
  providerApiKey: "",
};

export async function readSettings(): Promise<ExtensionSettings> {
  const stored = await browser.storage.sync.get(defaultSettings);

  return {
    targetLanguage: getStringSetting(stored.targetLanguage, defaultSettings.targetLanguage),
    providerEndpoint: getStringSetting(stored.providerEndpoint, defaultSettings.providerEndpoint),
    providerApiKey: getStringSetting(stored.providerApiKey, defaultSettings.providerApiKey),
  };
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
