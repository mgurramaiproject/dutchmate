import browser from "webextension-polyfill";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  getMvpLanguageCode,
  getSourceLanguageCode,
  type MvpLanguageCode,
  type SourceLanguageCode,
} from "./languages";
import {
  DEFAULT_LANGUAGE_ROLES,
  normalizeLanguageRoles,
  type LanguageRoleSettings,
} from "./language-roles";
import { DEFAULT_PROVIDER_ENDPOINT } from "./provider-endpoint";

export const HOVER_DELAY_LIMITS = {
  min: 150,
  max: 1500,
};
export const SELECTION_LENGTH_LIMITS = {
  min: 50,
  max: 150,
};

export type HoverTranslationMode = "word" | "sentence";
export type ExtensionSettings = {
  isEnabled: boolean;
  translateOnHover: boolean;
  translateOnSelection: boolean;
  cacheHoveredWords: boolean;
  cacheSelectedWords: boolean;
  hoverTranslationMode: HoverTranslationMode;
  hoverDelayMs: number;
  maxSelectionLength: number;
  sourceLanguage: SourceLanguageCode;
  targetLanguage: MvpLanguageCode;
  translateToOtherMvpLanguages: boolean;
  learningLanguage: MvpLanguageCode;
  nativeLanguage: MvpLanguageCode;
  bridgeLanguage: MvpLanguageCode;
  autoSaveSelectedWords: boolean;
  showExampleSentence: boolean;
  dailyReviewBadge: boolean;
  providerEndpoint: string;
  providerApiKey: string;
};

export const defaultSettings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  cacheHoveredWords: true,
  cacheSelectedWords: true,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: 100,
  sourceLanguage: DEFAULT_SOURCE_LANGUAGE,
  targetLanguage: DEFAULT_TARGET_LANGUAGE,
  translateToOtherMvpLanguages: true,
  ...DEFAULT_LANGUAGE_ROLES,
  autoSaveSelectedWords: false,
  showExampleSentence: true,
  dailyReviewBadge: true,
  providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
  providerApiKey: "",
};

export async function readSettings(): Promise<ExtensionSettings> {
  const stored = await browser.storage.sync.get(defaultSettings);
  return normalizeSettings(stored);
}

export function normalizeSettings(
  stored: Partial<ExtensionSettings> | null | undefined,
  fallback: ExtensionSettings = defaultSettings,
): ExtensionSettings {
  const languageRoles: LanguageRoleSettings = normalizeLanguageRoles({
    learningLanguage: getMvpLanguageCode(stored?.learningLanguage, fallback.learningLanguage),
    nativeLanguage: getMvpLanguageCode(stored?.nativeLanguage, fallback.nativeLanguage),
    bridgeLanguage: getMvpLanguageCode(stored?.bridgeLanguage, fallback.bridgeLanguage),
  });

  return {
    isEnabled: getBooleanSetting(stored?.isEnabled, fallback.isEnabled),
    translateOnHover: getBooleanSetting(stored?.translateOnHover, fallback.translateOnHover),
    translateOnSelection: getBooleanSetting(
      stored?.translateOnSelection,
      fallback.translateOnSelection,
    ),
    cacheHoveredWords: getBooleanSetting(stored?.cacheHoveredWords, fallback.cacheHoveredWords),
    cacheSelectedWords: getBooleanSetting(stored?.cacheSelectedWords, fallback.cacheSelectedWords),
    hoverTranslationMode: getHoverTranslationMode(
      stored?.hoverTranslationMode,
      fallback.hoverTranslationMode,
    ),
    hoverDelayMs: getNumberSetting(stored?.hoverDelayMs, fallback.hoverDelayMs),
    maxSelectionLength: getNumberSettingInRange(
      stored?.maxSelectionLength,
      fallback.maxSelectionLength,
      SELECTION_LENGTH_LIMITS.min,
      SELECTION_LENGTH_LIMITS.max,
    ),
    sourceLanguage: getSourceLanguageCode(stored?.sourceLanguage, fallback.sourceLanguage),
    targetLanguage: getMvpLanguageCode(stored?.targetLanguage, fallback.targetLanguage),
    translateToOtherMvpLanguages: getBooleanSetting(
      stored?.translateToOtherMvpLanguages,
      fallback.translateToOtherMvpLanguages,
    ),
    ...languageRoles,
    autoSaveSelectedWords: getBooleanSetting(
      stored?.autoSaveSelectedWords,
      fallback.autoSaveSelectedWords,
    ),
    showExampleSentence: getBooleanSetting(
      stored?.showExampleSentence,
      fallback.showExampleSentence,
    ),
    dailyReviewBadge: getBooleanSetting(stored?.dailyReviewBadge, fallback.dailyReviewBadge),
    providerEndpoint: getStringSetting(stored?.providerEndpoint, fallback.providerEndpoint),
    providerApiKey: getStringSetting(stored?.providerApiKey, fallback.providerApiKey),
  };
}

export function mergeSettings(
  current: ExtensionSettings,
  changes: Partial<ExtensionSettings>,
): ExtensionSettings {
  return normalizeSettings(
    {
      ...current,
      ...changes,
    },
    current,
  );
}

function getHoverTranslationMode(
  value: unknown,
  fallback: HoverTranslationMode,
): HoverTranslationMode {
  return value === "word" || value === "sentence" ? value : fallback;
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

function getNumberSettingInRange(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const numberValue = getNumberSetting(value, fallback);
  return Math.min(Math.max(numberValue, min), max);
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
