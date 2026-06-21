import { describe, expect, it, vi } from "vitest";
import {
  requestRuntimeSavedVocabularyList,
  requestRuntimeSaveVocabulary,
  type RuntimeSaveVocabularyRequest,
  type RuntimeVocabularyExtensionApi,
} from "./runtime-vocabulary-client";

const request: RuntimeSaveVocabularyRequest = {
  text: "huis",
  sourceLanguage: "auto",
  detectedSourceLanguage: "nl",
  targetLanguage: "en",
  translatedText: "house",
  providerName: "test",
};

describe("requestRuntimeSaveVocabulary", () => {
  it("returns a clear error when the runtime is unavailable", async () => {
    await expect(requestRuntimeSaveVocabulary(undefined, request)).resolves.toEqual({
      ok: false,
      error: "Extension runtime is unavailable.",
    });
  });

  it("sends the save vocabulary message", async () => {
    const sendMessage = vi.fn((_message, callback) => {
      callback({
        ok: true,
        result: {
          status: "saved",
          entry: {
            id: "nl\u001fhuis\u001fen",
            text: "huis",
            normalizedText: "huis",
            sourceLanguage: "auto",
            detectedSourceLanguage: "nl",
            targetLanguage: "en",
            translatedText: "house",
            providerName: "test",
            createdAt: 1,
            updatedAt: 1,
          },
        },
      });
    });
    const extensionApi: RuntimeVocabularyExtensionApi = {
      runtime: {
        sendMessage,
      },
    };

    await expect(requestRuntimeSaveVocabulary(extensionApi, request)).resolves.toEqual({
      ok: true,
      result: {
        status: "saved",
        entry: {
          id: "nl\u001fhuis\u001fen",
          text: "huis",
          normalizedText: "huis",
          sourceLanguage: "auto",
          detectedSourceLanguage: "nl",
          targetLanguage: "en",
          translatedText: "house",
          providerName: "test",
          createdAt: 1,
          updatedAt: 1,
        },
      },
    });
    expect(sendMessage).toHaveBeenCalledWith(
      {
        type: "hoverTranslate.vocabulary.save",
        payload: request,
      },
      expect.any(Function),
    );
  });

  it("returns the runtime error when Chrome reports one", async () => {
    const extensionApi: RuntimeVocabularyExtensionApi = {
      runtime: {
        lastError: { message: "Extension context invalidated." },
        sendMessage: (_message, callback) => {
          callback();
        },
      },
    };

    await expect(requestRuntimeSaveVocabulary(extensionApi, request)).resolves.toEqual({
      ok: false,
      error: "Extension context invalidated.",
    });
  });

  it("times out when the runtime never calls back", async () => {
    vi.useFakeTimers();
    const extensionApi: RuntimeVocabularyExtensionApi = {
      runtime: {
        sendMessage: vi.fn(),
      },
    };

    const response = requestRuntimeSaveVocabulary(extensionApi, request, 100);

    await vi.advanceTimersByTimeAsync(100);

    await expect(response).resolves.toEqual({
      ok: false,
      error: "Save request timed out before the extension background worker responded.",
    });
    vi.useRealTimers();
  });
});

describe("requestRuntimeSavedVocabularyList", () => {
  it("sends the list vocabulary message", async () => {
    const sendMessage = vi.fn((_message, callback) => {
      callback({
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
              createdAt: 1,
              updatedAt: 1,
            },
          ],
        },
      });
    });
    const extensionApi: RuntimeVocabularyExtensionApi = {
      runtime: {
        sendMessage,
      },
    };

    await expect(requestRuntimeSavedVocabularyList(extensionApi)).resolves.toMatchObject({
      ok: true,
      result: {
        entries: [
          {
            id: "nl\u001fhuis\u001fen",
            text: "huis",
          },
        ],
      },
    });
    expect(sendMessage).toHaveBeenCalledWith(
      {
        type: "hoverTranslate.vocabulary.list",
      },
      expect.any(Function),
    );
  });

  it("returns the runtime error when the list request fails", async () => {
    const extensionApi: RuntimeVocabularyExtensionApi = {
      runtime: {
        lastError: { message: "Receiving end does not exist." },
        sendMessage: (_message, callback) => {
          callback();
        },
      },
    };

    await expect(requestRuntimeSavedVocabularyList(extensionApi)).resolves.toEqual({
      ok: false,
      error: "Receiving end does not exist.",
    });
  });
});
