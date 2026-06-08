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

export function validateProviderEndpoint(endpoint: string): string | null {
  if (!endpoint) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return "Enter a valid provider endpoint URL.";
  }

  if (url.protocol === "https:") {
    return null;
  }

  if (
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1")
  ) {
    return null;
  }

  return "Use HTTPS, or localhost HTTP for local development.";
}
