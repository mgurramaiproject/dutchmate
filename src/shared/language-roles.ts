import type { MvpLanguageCode } from "./languages";

export const DEFAULT_LEARNING_LANGUAGE: MvpLanguageCode = "nl";
export const DEFAULT_NATIVE_LANGUAGE: MvpLanguageCode = "te";
export const DEFAULT_BRIDGE_LANGUAGE: MvpLanguageCode = "en";

export type LanguageRole = "learningLanguage" | "nativeLanguage" | "bridgeLanguage";

export type LanguageRoleSettings = {
  learningLanguage: MvpLanguageCode;
  nativeLanguage: MvpLanguageCode;
  bridgeLanguage: MvpLanguageCode;
};

export const DEFAULT_LANGUAGE_ROLES: LanguageRoleSettings = {
  learningLanguage: DEFAULT_LEARNING_LANGUAGE,
  nativeLanguage: DEFAULT_NATIVE_LANGUAGE,
  bridgeLanguage: DEFAULT_BRIDGE_LANGUAGE,
};

export function getLanguageOptions(role: LanguageRole): MvpLanguageCode[] {
  if (role === "learningLanguage") return ["nl"];
  return role === "nativeLanguage" ? ["te"] : ["en"];
}

export function normalizeLanguageRoles(
  value: Partial<LanguageRoleSettings> | undefined,
): LanguageRoleSettings {
  const learningLanguage = DEFAULT_LEARNING_LANGUAGE;
  return {
    learningLanguage,
    nativeLanguage: getAvailableLanguage(value?.nativeLanguage, DEFAULT_NATIVE_LANGUAGE, ["te"]),
    bridgeLanguage: getAvailableLanguage(value?.bridgeLanguage, DEFAULT_BRIDGE_LANGUAGE, ["en"]),
  };
}

export function applyLanguageRoleSelection(
  current: LanguageRoleSettings,
  changedRole: LanguageRole,
  selectedLanguage: MvpLanguageCode,
): LanguageRoleSettings {
  if (changedRole === "learningLanguage") {
    return normalizeLanguageRoles(current);
  }

  if (!getLanguageOptions(changedRole).includes(selectedLanguage)) {
    return normalizeLanguageRoles(current);
  }
  return normalizeLanguageRoles({ ...current, [changedRole]: selectedLanguage });
}

function getAvailableLanguage(
  candidate: MvpLanguageCode | undefined,
  fallback: MvpLanguageCode,
  available: MvpLanguageCode[],
): MvpLanguageCode {
  return candidate && available.includes(candidate) ? candidate : available.includes(fallback) ? fallback : available[0];
}
