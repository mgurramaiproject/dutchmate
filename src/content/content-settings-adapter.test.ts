import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      sync: {
        get: vi.fn(),
      },
    },
  },
}));
import {
  applyContentSettingChanges,
  readContentSettings,
} from "./content-settings-adapter";

const defaultSettings = {
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
  providerEndpoint: "https://example.test/translate",
  providerApiKey: "",
} as const;

describe("content-settings-adapter", () => {
  it("reads normalized settings from extension storage", async () => {
    const settings = await readContentSettings({
      storage: {
        sync: {
          get(_defaults, callback) {
            callback({
              hoverDelayMs: 999,
              hoverTranslationMode: "sentence",
            });
          },
        },
      },
      runtime: {},
    });

    expect(settings.hoverDelayMs).toBe(450);
    expect(settings.hoverTranslationMode).toBe("sentence");
  });

  it("falls back to defaults when the runtime reports an error", async () => {
    const settings = await readContentSettings({
      storage: {
        sync: {
          get(_defaults, callback) {
            callback({});
          },
        },
      },
      runtime: {
        lastError: { message: "boom" },
      },
    });

    expect(settings).toMatchObject({
      ...defaultSettings,
      providerEndpoint: "https://dutchmate-backend.onrender.com/translate",
    });
  });

  it("applies sync storage changes through the shared settings merge rules", () => {
    const next = applyContentSettingChanges(defaultSettings, {
      hoverTranslationMode: { newValue: "sentence" },
      cacheSelectedWords: { newValue: false },
      maxSelectionLength: { newValue: 9999 },
      hoverDelayMs: { newValue: 999 },
      providerEndpoint: { newValue: "https://example.test/translate" },
    });

    expect(next.hoverTranslationMode).toBe("sentence");
    expect(next.cacheSelectedWords).toBe(false);
    expect(next.maxSelectionLength).toBe(100);
    expect(next.hoverDelayMs).toBe(450);
    expect(next.providerEndpoint).toBe("https://example.test/translate");
  });
});
