import { beforeEach, describe, expect, it, vi } from "vitest";

const storageSyncGet = vi.hoisted(() => vi.fn());

vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      sync: {
        get: storageSyncGet,
      },
    },
  },
}));

import {
  defaultSettings,
  mergeSettings,
  normalizeSettings,
  readSettings,
  validateMaxSelectionLength,
} from "./settings";
import { DEFAULT_PROVIDER_ENDPOINT } from "./provider-endpoint";

describe("settings", () => {
  beforeEach(() => {
    storageSyncGet.mockReset();
  });

  it("ignores previously stored tuning values while the limits are fixed", async () => {
    storageSyncGet.mockResolvedValue({
      ...defaultSettings,
      maxSelectionLength: 600,
      hoverDelayMs: 999,
    });

    await expect(readSettings()).resolves.toMatchObject({
      maxSelectionLength: 100,
      hoverDelayMs: 450,
    });
  });

  it("uses the production backend endpoint by default", async () => {
    storageSyncGet.mockResolvedValue(defaultSettings);

    await expect(readSettings()).resolves.toMatchObject({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
    });
  });

  it("defaults selected-text translation to a concise token-conscious limit", () => {
    expect(defaultSettings.maxSelectionLength).toBe(100);
    expect(normalizeSettings({}).maxSelectionLength).toBe(100);
  });

  it("repairs duplicate stored learner language roles", async () => {
    storageSyncGet.mockResolvedValue({
      ...defaultSettings,
      learningLanguage: "nl",
      nativeLanguage: "nl",
      bridgeLanguage: "en",
    });

    await expect(readSettings()).resolves.toMatchObject({
      learningLanguage: "nl",
      nativeLanguage: "te",
      bridgeLanguage: "en",
    });
  });

  it("normalizes a stored snapshot through the shared settings seam", () => {
    expect(
      normalizeSettings({
        ...defaultSettings,
        maxSelectionLength: 600,
        learningLanguage: "nl",
        nativeLanguage: "nl",
        bridgeLanguage: "en",
      }),
    ).toMatchObject({
      maxSelectionLength: 100,
      hoverDelayMs: 450,
      learningLanguage: "nl",
      nativeLanguage: "te",
      bridgeLanguage: "en",
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
    });
  });

  it("keeps runtime setting updates coherent with options reads", () => {
    expect(
      mergeSettings(defaultSettings, {
        learningLanguage: "nl",
        nativeLanguage: "nl",
        bridgeLanguage: "en",
        maxSelectionLength: 600,
        hoverDelayMs: 999,
      }),
    ).toMatchObject({
      maxSelectionLength: 100,
      hoverDelayMs: 450,
      learningLanguage: "nl",
      nativeLanguage: "te",
      bridgeLanguage: "en",
    });
  });

  it("rejects selection limits outside the configured range", () => {
    expect(validateMaxSelectionLength(600)).toBe(
      "Max selected text length must be between 50 and 150.",
    );
  });

  it("defaults and normalizes review settings", () => {
    expect(normalizeSettings({})).toMatchObject({
      autoSaveSelectedWords: false,
      showExampleSentence: true,
      dailyReviewBadge: true,
    });

    expect(
      normalizeSettings({
        autoSaveSelectedWords: "yes" as never,
        showExampleSentence: false,
        dailyReviewBadge: false,
      }),
    ).toMatchObject({
      autoSaveSelectedWords: false,
      showExampleSentence: false,
      dailyReviewBadge: false,
    });
  });

  it("enables selected and hovered caching by default and normalizes both settings", () => {
    expect(normalizeSettings({})).toMatchObject({
      cacheHoveredWords: true,
      cacheSelectedWords: true,
    });

    expect(normalizeSettings({ cacheHoveredWords: false, cacheSelectedWords: false })).toMatchObject({
      cacheHoveredWords: false,
      cacheSelectedWords: false,
    });
  });
});
