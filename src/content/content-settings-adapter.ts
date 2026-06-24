import {
  defaultSettings,
  mergeSettings,
  normalizeSettings,
  SELECTION_LENGTH_LIMITS,
  type ExtensionSettings,
  type HoverTranslationMode,
} from "../shared/settings";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";

type StorageChange = {
  newValue?: unknown;
};

export type ContentSettingsExtensionApi = {
  storage: {
    sync: {
      get(
        defaults: ExtensionSettings,
        callback: (settings: Partial<ExtensionSettings>) => void,
      ): void;
    };
  };
  runtime: {
    lastError?: { message?: string };
  };
};

export async function readContentSettings(
  extensionApi: ContentSettingsExtensionApi | undefined,
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

      resolve(normalizeSettings(stored, defaultSettings));
    });
  });
}

export function applyContentSettingChanges(
  current: ExtensionSettings,
  changes: Record<string, StorageChange>,
): ExtensionSettings {
  return mergeSettings(current, settingChangesToPartialSettings(changes));
}

function settingChangesToPartialSettings(
  changes: Record<string, StorageChange>,
): Partial<ExtensionSettings> {
  return {
    isEnabled: getOptionalBooleanSetting(changes.isEnabled?.newValue),
    translateOnHover: getOptionalBooleanSetting(changes.translateOnHover?.newValue),
    translateOnSelection: getOptionalBooleanSetting(changes.translateOnSelection?.newValue),
    cacheHoveredWords: getOptionalBooleanSetting(changes.cacheHoveredWords?.newValue),
    hoverTranslationMode: getOptionalHoverTranslationModeSetting(
      changes.hoverTranslationMode?.newValue,
    ),
    hoverDelayMs: getOptionalNumberSetting(changes.hoverDelayMs?.newValue),
    maxSelectionLength: getOptionalSelectionLengthSetting(changes.maxSelectionLength?.newValue),
    sourceLanguage: getOptionalSourceLanguageSetting(changes.sourceLanguage?.newValue),
    targetLanguage: getOptionalTargetLanguageSetting(changes.targetLanguage?.newValue),
    translateToOtherMvpLanguages: getOptionalBooleanSetting(
      changes.translateToOtherMvpLanguages?.newValue,
    ),
    learningLanguage: getOptionalTargetLanguageSetting(changes.learningLanguage?.newValue),
    nativeLanguage: getOptionalTargetLanguageSetting(changes.nativeLanguage?.newValue),
    bridgeLanguage: getOptionalTargetLanguageSetting(changes.bridgeLanguage?.newValue),
    providerEndpoint: getOptionalStringSetting(changes.providerEndpoint?.newValue),
    providerApiKey: getOptionalStringSetting(changes.providerApiKey?.newValue),
  };
}

function getOptionalHoverTranslationModeSetting(value: unknown): HoverTranslationMode | undefined {
  return value === "word" || value === "sentence" ? value : undefined;
}

function getOptionalStringSetting(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getOptionalTargetLanguageSetting(value: unknown): MvpLanguageCode | undefined {
  return value === "en" || value === "nl" || value === "te"
    ? value
    : undefined;
}

function getOptionalSourceLanguageSetting(value: unknown): SourceLanguageCode | undefined {
  return value === "auto" || value === "en" || value === "nl" || value === "te"
    ? value
    : undefined;
}

function getOptionalBooleanSetting(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function getOptionalNumberSetting(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getOptionalSelectionLengthSetting(value: unknown): number | undefined {
  const numberValue = getOptionalNumberSetting(value);
  if (numberValue === undefined) {
    return undefined;
  }

  return Math.min(
    Math.max(numberValue, SELECTION_LENGTH_LIMITS.min),
    SELECTION_LENGTH_LIMITS.max,
  );
}
