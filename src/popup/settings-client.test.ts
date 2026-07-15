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
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
} from "../background/messages";
import { createSettingsClient } from "./settings-client";

describe("settings client", () => {
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
