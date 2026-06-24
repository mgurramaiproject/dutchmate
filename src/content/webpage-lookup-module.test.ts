import { describe, expect, it } from "vitest";
import { WebpageLookupModule, type TranslationTransport } from "./webpage-lookup-module";

const defaultSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  cacheHoveredWords: false,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: 150,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: true,
  learningLanguage: "nl",
  nativeLanguage: "te",
  bridgeLanguage: "en",
  providerEndpoint: "https://example.test/translate",
  providerApiKey: "",
} as const;

function createTransport(
  overrides: Partial<TranslationTransport> = {},
): TranslationTransport {
  return {
    translate: async ({ text, targetLanguage }) => ({
      ok: true,
      result: {
        translatedText: `${text}-${targetLanguage}`,
        providerName: "custom-endpoint",
      },
    }),
    listSavedVocabularyIds: async () => new Set<string>(),
    saveVocabularyBatch: async () => ({
      ok: true,
      result: {
        results: [
          {
            status: "saved",
            entry: {
              id: "nl\u001fhuis\u001fen",
              text: "huis",
              normalizedText: "huis",
              sourceLanguage: "auto",
              detectedSourceLanguage: "nl",
              targetLanguage: "en",
              translatedText: "house",
              providerName: "custom-endpoint",
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    }),
    ...overrides,
  };
}

describe("WebpageLookupModule", () => {
  it("emits loading then result with save action for a selected single-word lookup", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });

    expect(events).toContainEqual({
      type: "render-loading",
      context: "selection",
      x: 10,
      y: 20,
      message: "Translating...",
    });
    expect(events).toContainEqual({
      type: "render-result",
      context: "selection",
      x: 10,
      y: 20,
      response: {
        ok: true,
        result: {
          translatedText: "English: huis-en\nTelugu: huis-te",
          providerName: "multi-target",
        },
      },
      saveAction: {
        status: "checking",
        label: "Checking...",
        disabled: true,
      },
    });
  });

  it("drops save action for hover lookups", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "hover",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });

    expect(events).toContainEqual({
      type: "render-result",
      context: "hover",
      x: 10,
      y: 20,
      response: {
        ok: true,
        result: {
          translatedText: "English: huis-en\nTelugu: huis-te",
          providerName: "multi-target",
        },
      },
      saveAction: {
        status: "hidden",
      },
    });
  });

  it("updates save state after a successful save", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });
    await module.handleSaveAction();

    expect(events).toContainEqual({
      type: "save-state-changed",
      saveAction: {
        status: "saving",
        label: "Saving...",
        disabled: true,
      },
    });
    expect(events).toContainEqual({
      type: "save-state-changed",
      saveAction: {
        status: "saved",
        label: "Saved",
        disabled: true,
      },
    });
  });
});
