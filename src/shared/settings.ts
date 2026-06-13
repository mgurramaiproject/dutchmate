import browser from "webextension-polyfill";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  getMvpLanguageCode,
  getSourceLanguageCode,
  type MvpLanguageCode,
  type SourceLanguageCode,
} from "./languages";

export const HOVER_DELAY_LIMITS = {
  min: 150,
  max: 1500,
};
export const SELECTION_LENGTH_LIMITS = {
  min: 50,
  max: 3000,
};

export type ExtensionSettings = {
  isEnabled: boolean;
  translateOnHover: boolean;
  translateOnSelection: boolean;
  hoverDelayMs: number;
  maxSelectionLength: number;
  sourceLanguage: SourceLanguageCode;
  targetLanguage: MvpLanguageCode;
  translateToOtherMvpLanguages: boolean;
  providerEndpoint: string;
  providerApiKey: string;
};

export const defaultSettings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  hoverDelayMs: 450,
  maxSelectionLength: 600,
  sourceLanguage: DEFAULT_SOURCE_LANGUAGE,
  targetLanguage: DEFAULT_TARGET_LANGUAGE,
  translateToOtherMvpLanguages: false,
  providerEndpoint: "",
  providerApiKey: "",
};

export async function readSettings(): Promise<ExtensionSettings> {
  const stored = await browser.storage.sync.get(defaultSettings);

  return {
    isEnabled: getBooleanSetting(stored.isEnabled, defaultSettings.isEnabled),
    translateOnHover: getBooleanSetting(stored.translateOnHover, defaultSettings.translateOnHover),
    translateOnSelection: getBooleanSetting(
      stored.translateOnSelection,
      defaultSettings.translateOnSelection,
    ),
    hoverDelayMs: getNumberSetting(stored.hoverDelayMs, defaultSettings.hoverDelayMs),
    maxSelectionLength: getNumberSetting(
      stored.maxSelectionLength,
      defaultSettings.maxSelectionLength,
    ),
    sourceLanguage: getSourceLanguageCode(stored.sourceLanguage, defaultSettings.sourceLanguage),
    targetLanguage: getMvpLanguageCode(stored.targetLanguage, defaultSettings.targetLanguage),
    translateToOtherMvpLanguages: getBooleanSetting(
      stored.translateToOtherMvpLanguages,
      defaultSettings.translateToOtherMvpLanguages,
    ),
    providerEndpoint: getStringSetting(stored.providerEndpoint, defaultSettings.providerEndpoint),
    providerApiKey: getStringSetting(stored.providerApiKey, defaultSettings.providerApiKey),
  };
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function getBooleanSetting(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getNumberSetting(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function validateHoverDelayMs(value: number): string | null {
  return validateNumberRange("Hover delay", value, HOVER_DELAY_LIMITS.min, HOVER_DELAY_LIMITS.max);
}

export function validateMaxSelectionLength(value: number): string | null {
  return validateNumberRange(
    "Max selected text length",
    value,
    SELECTION_LENGTH_LIMITS.min,
    SELECTION_LENGTH_LIMITS.max,
  );
}

function validateNumberRange(label: string, value: number, min: number, max: number): string | null {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (value < min || value > max) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return null;
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
