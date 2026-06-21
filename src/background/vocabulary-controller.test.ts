import { describe, expect, it } from "vitest";
import {
  CLEAR_VOCABULARY_MESSAGE,
  DELETE_VOCABULARY_MESSAGE,
  LIST_VOCABULARY_MESSAGE,
  SAVE_VOCABULARY_BATCH_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
} from "./messages";
import { handleVocabularyMessage } from "./vocabulary-controller";
import { SavedVocabularyStore, type SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";

const saveMessage = {
  type: SAVE_VOCABULARY_MESSAGE,
  payload: {
    text: "huis",
    sourceLanguage: "auto",
    detectedSourceLanguage: "nl",
    targetLanguage: "en",
    translatedText: "house",
    providerName: "test",
  },
} as const;

describe("handleVocabularyMessage", () => {
  it("saves and lists vocabulary entries", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    await expect(handleVocabularyMessage(saveMessage, store)).resolves.toMatchObject({
      ok: true,
      result: {
        status: "saved",
        entry: {
          text: "huis",
          translatedText: "house",
        },
      },
    });

    await expect(
      handleVocabularyMessage({ type: LIST_VOCABULARY_MESSAGE }, store),
    ).resolves.toMatchObject({
      ok: true,
      result: {
        entries: [
          {
            text: "huis",
            translatedText: "house",
          },
        ],
      },
    });
  });

  it("saves both target-language vocabulary entries in one batch", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    await expect(
      handleVocabularyMessage(
        {
          type: SAVE_VOCABULARY_BATCH_MESSAGE,
          payload: {
            entries: [
              saveMessage.payload,
              {
                ...saveMessage.payload,
                targetLanguage: "te",
                translatedText: "ఇల్లు",
              },
            ],
          },
        },
        store,
      ),
    ).resolves.toMatchObject({
      ok: true,
      result: {
        results: [{ status: "saved" }, { status: "saved" }],
      },
    });

    await expect(
      handleVocabularyMessage({ type: LIST_VOCABULARY_MESSAGE }, store),
    ).resolves.toMatchObject({
      ok: true,
      result: {
        entries: [
          {
            text: "huis",
            targetLanguage: "en",
            translatedText: "house",
          },
          {
            text: "huis",
            targetLanguage: "te",
            translatedText: "ఇల్లు",
          },
        ],
      },
    });
  });

  it("deletes one vocabulary entry", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());
    const saveResponse = await handleVocabularyMessage(saveMessage, store);

    if (
      !saveResponse.ok ||
      !("status" in saveResponse.result) ||
      saveResponse.result.status !== "saved"
    ) {
      throw new Error("Expected save to succeed");
    }

    await expect(
      handleVocabularyMessage(
        {
          type: DELETE_VOCABULARY_MESSAGE,
          payload: {
            id: saveResponse.result.entry.id,
          },
        },
        store,
      ),
    ).resolves.toEqual({
      ok: true,
      result: {
        deleted: true,
      },
    });

    await expect(
      handleVocabularyMessage({ type: LIST_VOCABULARY_MESSAGE }, store),
    ).resolves.toEqual({
      ok: true,
      result: {
        entries: [],
      },
    });
  });

  it("clears vocabulary entries", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());
    await handleVocabularyMessage(saveMessage, store);

    await expect(
      handleVocabularyMessage({ type: CLEAR_VOCABULARY_MESSAGE }, store),
    ).resolves.toEqual({
      ok: true,
      result: {
        cleared: true,
      },
    });

    await expect(
      handleVocabularyMessage({ type: LIST_VOCABULARY_MESSAGE }, store),
    ).resolves.toEqual({
      ok: true,
      result: {
        entries: [],
      },
    });
  });
});

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
