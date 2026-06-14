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
  readSettings,
  validateMaxSelectionLength,
} from "./settings";

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

  it("rejects selection limits outside the configured range", () => {
    expect(validateMaxSelectionLength(600)).toBe(
      "Max selected text length must be between 50 and 150.",
    );
  });
});
