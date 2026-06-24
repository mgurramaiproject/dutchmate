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

  it("clamps previously stored selection limits to the current maximum", async () => {
    storageSyncGet.mockResolvedValue({
      ...defaultSettings,
      maxSelectionLength: 600,
    });

    await expect(readSettings()).resolves.toMatchObject({
      maxSelectionLength: 150,
    });
  });

  it("uses the production backend endpoint by default", async () => {
    storageSyncGet.mockResolvedValue(defaultSettings);

    await expect(readSettings()).resolves.toMatchObject({
      providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
    });
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
      maxSelectionLength: 150,
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
      }),
    ).toMatchObject({
      maxSelectionLength: 150,
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
});
