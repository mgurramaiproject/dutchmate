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
  REVIEW_RATE_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
  type BackgroundMessageResponse,
} from "./messages";
import { createBackgroundMessageHandler } from "./message-handler";
import { ReviewCardStore } from "../vocabulary/review-cards";
import { SavedVocabularyStore, type SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";
import { defaultSettings } from "../shared/settings";

describe("createBackgroundMessageHandler", () => {
  it("refreshes the badge after vocabulary saves and ratings", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const refreshBadge = vi.fn(async () => undefined);
    const handleMessage = createBackgroundMessageHandler({
      savedVocabulary,
      reviewCards,
      reviewSettings: {
        read: async () => defaultSettings,
        update: async (changes) => ({ ...defaultSettings, ...changes }),
      },
      refreshBadge,
    });

    await send(handleMessage, {
      type: SAVE_VOCABULARY_MESSAGE,
      payload: {
        text: "huis",
        sourceLanguage: "auto",
        detectedSourceLanguage: "nl",
        targetLanguage: "en",
        translatedText: "house",
        providerName: "test",
      },
    });
    await send(handleMessage, {
      type: REVIEW_RATE_MESSAGE,
      payload: { id: "nl\u001fhuis", rating: "good" },
    });
    await expect(
      send(handleMessage, {
        type: REVIEW_SETTINGS_UPDATE_MESSAGE,
        payload: { dailyReviewBadge: false },
      }),
    ).resolves.toMatchObject({ ok: true, result: { settings: { dailyReviewBadge: false } } });

    expect(refreshBadge).toHaveBeenCalledTimes(3);
  });
});

async function send(
  handleMessage: ReturnType<typeof createBackgroundMessageHandler>,
  message: Parameters<typeof handleMessage>[0],
): Promise<BackgroundMessageResponse> {
  return new Promise((resolve) => {
    expect(handleMessage(message, resolve)).toBe(true);
  });
}

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
