import { describe, expect, it, vi } from "vitest";
import {
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
