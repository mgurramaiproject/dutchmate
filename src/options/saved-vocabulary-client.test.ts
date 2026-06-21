import { describe, expect, it, vi } from "vitest";
import {
  createSavedVocabularyClient,
  type SavedVocabularyRuntimeApi,
} from "./saved-vocabulary-client";

describe("createSavedVocabularyClient", () => {
  it("lists saved vocabulary entries", async () => {
    const sendMessage = vi.fn(async () => ({
      ok: true,
      result: {
        entries: [
          {
            id: "nl\u001fhuis\u001fen",
            text: "huis",
            normalizedText: "huis",
            sourceLanguage: "auto",
            detectedSourceLanguage: "nl",
            targetLanguage: "en",
            translatedText: "house",
            providerName: "test",
            createdAt: 1_000,
            updatedAt: 1_000,
          },
        ],
      },
    }));
    const client = createSavedVocabularyClient(createRuntime(sendMessage));

    await expect(client.list()).resolves.toMatchObject([
      {
        text: "huis",
        translatedText: "house",
      },
    ]);
    expect(sendMessage).toHaveBeenCalledWith({
      type: "hoverTranslate.vocabulary.list",
    });
  });

  it("deletes one saved vocabulary entry", async () => {
    const sendMessage = vi.fn(async () => ({
      ok: true,
      result: {
        deleted: true,
      },
    }));
    const client = createSavedVocabularyClient(createRuntime(sendMessage));

    await expect(client.delete("nl\u001fhuis\u001fen")).resolves.toBeUndefined();
    expect(sendMessage).toHaveBeenCalledWith({
      type: "hoverTranslate.vocabulary.delete",
      payload: {
        id: "nl\u001fhuis\u001fen",
      },
    });
  });

  it("clears saved vocabulary", async () => {
    const sendMessage = vi.fn(async () => ({
      ok: true,
      result: {
        cleared: true,
      },
    }));
    const client = createSavedVocabularyClient(createRuntime(sendMessage));

    await expect(client.clear()).resolves.toBeUndefined();
    expect(sendMessage).toHaveBeenCalledWith({
      type: "hoverTranslate.vocabulary.clear",
    });
  });

  it("throws for invalid responses", async () => {
    const client = createSavedVocabularyClient(createRuntime(vi.fn(async () => undefined)));

    await expect(client.list()).rejects.toThrow("Saved vocabulary list is unavailable.");
    await expect(client.delete("missing")).rejects.toThrow(
      "Saved vocabulary entry could not be deleted.",
    );
    await expect(client.clear()).rejects.toThrow("Saved vocabulary could not be cleared.");
  });
});

function createRuntime(sendMessage: (message: unknown) => Promise<unknown>): SavedVocabularyRuntimeApi {
  return {
    runtime: {
      sendMessage,
    },
  };
}
