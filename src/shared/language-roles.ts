import { MVP_LANGUAGES, type MvpLanguageCode } from "./languages";

export const DEFAULT_LEARNING_LANGUAGE: MvpLanguageCode = "nl";
export const DEFAULT_NATIVE_LANGUAGE: MvpLanguageCode = "te";
export const DEFAULT_BRIDGE_LANGUAGE: MvpLanguageCode = "en";

export type LanguageRole = "learningLanguage" | "nativeLanguage" | "bridgeLanguage";

export type LanguageRoleSettings = {
  learningLanguage: MvpLanguageCode;
  nativeLanguage: MvpLanguageCode;
  bridgeLanguage: MvpLanguageCode;
};

const LANGUAGE_ROLE_ORDER: LanguageRole[] = [
  "learningLanguage",
  "nativeLanguage",
  "bridgeLanguage",
];

export const DEFAULT_LANGUAGE_ROLES: LanguageRoleSettings = {
  learningLanguage: DEFAULT_LEARNING_LANGUAGE,
  nativeLanguage: DEFAULT_NATIVE_LANGUAGE,
  bridgeLanguage: DEFAULT_BRIDGE_LANGUAGE,
};

export function normalizeLanguageRoles(
  value: Partial<LanguageRoleSettings> | undefined,
): LanguageRoleSettings {
  const assigned = new Set<MvpLanguageCode>();
  const normalized = {} as LanguageRoleSettings;

  for (const role of LANGUAGE_ROLE_ORDER) {
    const candidate = value?.[role];
    if (candidate && !assigned.has(candidate)) {
      normalized[role] = candidate;
      assigned.add(candidate);
      continue;
    }

    const fallback = LANGUAGE_ROLE_ORDER.map((fallbackRole) => DEFAULT_LANGUAGE_ROLES[fallbackRole]).find(
      (languageCode) => !assigned.has(languageCode),
    );

    normalized[role] = fallback ?? DEFAULT_LANGUAGE_ROLES[role];
    assigned.add(normalized[role]);
  }

  return normalized;
}

export function applyLanguageRoleSelection(
  current: LanguageRoleSettings,
  changedRole: LanguageRole,
  selectedLanguage: MvpLanguageCode,
): LanguageRoleSettings {
  const next = {
    [changedRole]: selectedLanguage,
  } as Partial<LanguageRoleSettings>;
  const used = new Set<MvpLanguageCode>([selectedLanguage]);

  for (const role of LANGUAGE_ROLE_ORDER) {
    if (role === changedRole) {
      continue;
    }

    const candidate = current[role];
    if (candidate !== selectedLanguage && !used.has(candidate)) {
      next[role] = candidate;
      used.add(candidate);
    }
  }

  for (const role of LANGUAGE_ROLE_ORDER) {
    if (role === changedRole || next[role]) {
      continue;
    }

    const remainingLanguage = MVP_LANGUAGES.map((language) => language.code).find(
      (languageCode) => !used.has(languageCode),
    );

    if (remainingLanguage) {
      next[role] = remainingLanguage;
      used.add(remainingLanguage);
    }
  }

  return next as LanguageRoleSettings;
}
