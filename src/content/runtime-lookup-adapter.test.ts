import { describe, expect, it } from "vitest";
import { createRuntimeLookupAdapter } from "./runtime-lookup-adapter";
import type { ExtensionSettings } from "../shared/settings";

const settings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  cacheHoveredWords: true,
  cacheSelectedWords: true,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: 100,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: true,
  learningLanguage: "nl",
  nativeLanguage: "te",
  bridgeLanguage: "en",
  autoSaveSelectedWords: false,
  showExampleSentence: true,
  dailyReviewBadge: true,
  providerEndpoint: "",
  providerApiKey: "",
};

describe("createRuntimeLookupAdapter", () => {
  it("keeps Chrome translation working when local storage is unavailable", async () => {
    const adapter = createRuntimeLookupAdapter({
      browserTarget: "chrome",
      chromeDirectTranslationFallbackMs: 0,
      directTranslationTimeoutMs: 1000,
      extensionApi: {
        runtime: { sendMessage: () => {} },
        storage: {},
      },
      getSettings: () => settings,
      delay: async () => {},
    });

    await expect(
      adapter.translate({
        text: "huis",
        context: "hover",
        sourceLanguage: "nl",
        targetLanguage: "en",
      }),
    ).resolves.toEqual({
      ok: true,
      result: { translatedText: "Translation will appear here. (en)", providerName: "placeholder" },
    });
  });
});
