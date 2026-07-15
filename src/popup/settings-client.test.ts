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

import { defaultSettings } from "../shared/settings";
import {
  REVIEW_CLEAR_MESSAGE,
  REVIEW_EXPORT_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
} from "../background/messages";
import { createSettingsClient } from "./settings-client";

describe("settings client", () => {
  it("exports, imports, and clears vocabulary through typed review messages", async () => {
    const backup = {
      format: "dutchmate-vocabulary-backup" as const,
      version: 1 as const,
      exportedAt: 10_000,
      cards: [],
    };
    const sendMessage = vi.fn()
      .mockResolvedValueOnce({ ok: true as const, result: { backup } })
      .mockResolvedValueOnce({
        ok: true as const,
        result: { cards: [], importedCount: 0, totalCount: 0 },
      })
      .mockResolvedValueOnce({ ok: true as const, result: { cleared: true } });
    const client = createSettingsClient({ runtime: { sendMessage } });

    await expect(client.exportVocabulary()).resolves.toEqual(backup);
    await expect(client.importVocabulary(JSON.stringify(backup))).resolves.toEqual({
      importedCount: 0,
      totalCount: 0,
    });
    await expect(client.clearVocabulary()).resolves.toBeUndefined();
    expect(sendMessage).toHaveBeenNthCalledWith(1, { type: REVIEW_EXPORT_MESSAGE });
    expect(sendMessage).toHaveBeenNthCalledWith(2, {
      type: REVIEW_IMPORT_MESSAGE,
      payload: { document: JSON.stringify(backup) },
    });
    expect(sendMessage).toHaveBeenNthCalledWith(3, { type: REVIEW_CLEAR_MESSAGE });
  });

  it("reads review settings through the background runtime", async () => {
    const sendMessage = vi.fn(async () => ({
      ok: true as const,
      result: { settings: defaultSettings },
    }));
    const client = createSettingsClient({ runtime: { sendMessage } });

    await expect(client.getSettings()).resolves.toEqual(defaultSettings);
    expect(sendMessage).toHaveBeenCalledWith({ type: REVIEW_SETTINGS_MESSAGE });
  });

  it("persists review setting changes through the typed runtime message", async () => {
    const settings = { ...defaultSettings, dailyReviewBadge: false };
    const sendMessage = vi.fn(async () => ({
      ok: true as const,
      result: { settings },
    }));
    const client = createSettingsClient({ runtime: { sendMessage } });

    await expect(client.updateSettings({ dailyReviewBadge: false })).resolves.toEqual(settings);
    expect(sendMessage).toHaveBeenCalledWith({
      type: REVIEW_SETTINGS_UPDATE_MESSAGE,
      payload: { dailyReviewBadge: false },
    });
  });
});
