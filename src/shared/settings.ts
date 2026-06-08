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

