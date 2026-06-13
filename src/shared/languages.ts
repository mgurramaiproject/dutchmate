export const MVP_LANGUAGES = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "nl",
    label: "Dutch",
  },
  {
    code: "te",
    label: "Telugu",
  },
] as const;

export type MvpLanguageCode = (typeof MVP_LANGUAGES)[number]["code"];

export const DEFAULT_TARGET_LANGUAGE: MvpLanguageCode = "en";

const MVP_LANGUAGE_CODES = new Set<string>(MVP_LANGUAGES.map((language) => language.code));

export function isMvpLanguageCode(value: string): value is MvpLanguageCode {
  return MVP_LANGUAGE_CODES.has(value);
}

export function getMvpLanguageCode(
  value: unknown,
  fallback = DEFAULT_TARGET_LANGUAGE,
): MvpLanguageCode {
  return typeof value === "string" && isMvpLanguageCode(value) ? value : fallback;
}
