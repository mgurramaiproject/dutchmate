import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS,
  requestRuntimeTranslation,
  type RuntimeTranslationExtensionApi,
} from "./runtime-translation-client";

const request = {
  text: "huis",
  context: "hover" as const,
  sourceLanguage: "nl",
  targetLanguage: "en",
};

describe("requestRuntimeTranslation", () => {
  it("returns a clear error when the runtime is unavailable", async () => {
    await expect(requestRuntimeTranslation(undefined, request)).resolves.toEqual({
      ok: false,
      error: "Extension runtime is unavailable.",
    });
  });

  it("resolves with the runtime translation response", async () => {
    const extensionApi: RuntimeTranslationExtensionApi = {
      runtime: {
        sendMessage: (_message, callback) => {
          callback({
            ok: true,
            result: {
              translatedText: "house",
              providerName: "custom-endpoint",
            },
          });
        },
      },
    };

    await expect(requestRuntimeTranslation(extensionApi, request)).resolves.toEqual({
      ok: true,
      result: {
        translatedText: "house",
        providerName: "custom-endpoint",
      },
    });
  });

  it("keeps the first Firefox request alive through a bounded cold start", async () => {
    vi.useFakeTimers();
    const extensionApi: RuntimeTranslationExtensionApi = {
      runtime: {
        sendMessage: (_message, callback) => {
          globalThis.setTimeout(() => callback({
            ok: true,
            result: { translatedText: "house", providerName: "custom-endpoint" },
          }), 10000);
        },
      },
    };

    const response = requestRuntimeTranslation(extensionApi, request);
    await vi.advanceTimersByTimeAsync(10000);

    await expect(response).resolves.toEqual({
      ok: true,
      result: { translatedText: "house", providerName: "custom-endpoint" },
    });
    expect(DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS).toBe(20000);
    vi.useRealTimers();
  });

  it("returns the runtime error when Chrome reports one", async () => {
    const extensionApi: RuntimeTranslationExtensionApi = {
      runtime: {
        lastError: { message: "Could not establish connection." },
        sendMessage: (_message, callback) => {
          callback();
        },
      },
    };

    await expect(requestRuntimeTranslation(extensionApi, request)).resolves.toEqual({
      ok: false,
      error: "Could not establish connection.",
    });
  });

  it("times out when the runtime never calls back", async () => {
    vi.useFakeTimers();
    const extensionApi: RuntimeTranslationExtensionApi = {
      runtime: {
        sendMessage: vi.fn(),
      },
    };

    const response = requestRuntimeTranslation(extensionApi, request, 100);

    await vi.advanceTimersByTimeAsync(100);

    await expect(response).resolves.toEqual({
      ok: false,
      error: "Translation request timed out before the extension background worker responded.",
    });
    vi.useRealTimers();
  });
});
