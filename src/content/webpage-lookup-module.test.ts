import { describe, expect, it, vi } from "vitest";
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
  autoSaveSelectedWords: false,
  showExampleSentence: true,
  dailyReviewBadge: true,
  cardDirection: "dutch-to-helpers",
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

  it("keeps English-source candidates in the manual save flow", async () => {
    const savedRequests: Array<{ targetLanguage: string; detectedSourceLanguage?: string }> = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        saveVocabularyBatch: async (requests) => {
          savedRequests.push(...requests);
          return {
            ok: true,
            result: {
              results: requests.map((request) => ({
                status: "saved" as const,
                entry: {
                  id: `${request.detectedSourceLanguage}\u001f${request.text}\u001f${request.targetLanguage}`,
                  text: request.text,
                  normalizedText: request.text,
                  sourceLanguage: request.sourceLanguage,
                  detectedSourceLanguage: request.detectedSourceLanguage,
                  targetLanguage: request.targetLanguage,
                  translatedText: request.translatedText,
                  providerName: request.providerName,
                  createdAt: 1,
                  updatedAt: 1,
                },
              })),
            },
          };
        },
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "house",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "house",
      sourceLanguageHint: "en",
    });
    await module.handleSaveAction();

    expect(savedRequests).toEqual(expect.arrayContaining([
      expect.objectContaining({
        targetLanguage: "nl",
        detectedSourceLanguage: "en",
      }),
    ]));
  });

  it("auto-saves eligible selected words with reliable page context when enabled", async () => {
    const savedRequests: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, autoSaveSelectedWords: true }),
      transport: createTransport({
        saveVocabularyBatch: async (requests) => {
          savedRequests.push(...requests);
          return {
            ok: true,
            result: { results: [{ status: "saved", entry: {
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
            } }] },
          };
        },
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
      pageContext: "Een huis staat daar.",
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(savedRequests).toContainEqual(
      expect.objectContaining({
        text: "huis",
        pageContext: "Een huis staat daar.",
      }),
    );
  });

  it("keeps the manual save action when automatic saving is disabled", async () => {
    const saveVocabularyBatch = vi.fn(async () => ({
      ok: true as const,
      result: { results: [] },
    }));
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ saveVocabularyBatch }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(saveVocabularyBatch).not.toHaveBeenCalled();
  });
});
