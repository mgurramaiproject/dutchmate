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
  return role === "learningLanguage" ? ["nl"] : ["en", "te"];
}

export function normalizeLanguageRoles(
  value: Partial<LanguageRoleSettings> | undefined,
): LanguageRoleSettings {
  const learningLanguage = DEFAULT_LEARNING_LANGUAGE;
  const helperLanguages = getLanguageOptions("nativeLanguage");
  const nativeLanguage = getAvailableLanguage(
    value?.nativeLanguage,
    DEFAULT_NATIVE_LANGUAGE,
    helperLanguages,
  );
  const bridgeLanguage = getAvailableLanguage(
    value?.bridgeLanguage,
    DEFAULT_BRIDGE_LANGUAGE,
    helperLanguages.filter((languageCode) => languageCode !== nativeLanguage),
  );

  return { learningLanguage, nativeLanguage, bridgeLanguage };
}

export function applyLanguageRoleSelection(
  current: LanguageRoleSettings,
  changedRole: LanguageRole,
  selectedLanguage: MvpLanguageCode,
): LanguageRoleSettings {
  if (changedRole === "learningLanguage") {
    return normalizeLanguageRoles(current);
  }

  const helperLanguages = getLanguageOptions(changedRole);
  if (!helperLanguages.includes(selectedLanguage)) {
    return normalizeLanguageRoles(current);
  }

  const next = {
    learningLanguage: DEFAULT_LEARNING_LANGUAGE,
    [changedRole]: selectedLanguage,
  } as Partial<LanguageRoleSettings>;
  const used = new Set<MvpLanguageCode>([DEFAULT_LEARNING_LANGUAGE, selectedLanguage]);

  for (const role of ["nativeLanguage", "bridgeLanguage"] as const) {
    if (role === changedRole) {
      continue;
    }

    const candidate = current[role];
    if (candidate !== selectedLanguage && !used.has(candidate)) {
      next[role] = candidate;
      used.add(candidate);
    }
  }

  for (const role of ["nativeLanguage", "bridgeLanguage"] as const) {
    if (role === changedRole || next[role]) {
      continue;
    }

    const remainingLanguage = getLanguageOptions(role).find((languageCode) => !used.has(languageCode));

    if (remainingLanguage) {
      next[role] = remainingLanguage;
      used.add(remainingLanguage);
    }
  }

  return next as LanguageRoleSettings;
}

function getAvailableLanguage(
  candidate: MvpLanguageCode | undefined,
  fallback: MvpLanguageCode,
  available: MvpLanguageCode[],
): MvpLanguageCode {
  return candidate && available.includes(candidate) ? candidate : available.includes(fallback) ? fallback : available[0];
}
