import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";

const SAVE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.save";
const DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS = 7000;

export type RuntimeVocabularyExtensionApi = {
  runtime: {
    lastError?: { message?: string };
    sendMessage(message: unknown, callback: (response?: unknown) => void): void;
  };
};

export type RuntimeSaveVocabularyRequest = {
  text: string;
  sourceLanguage: SourceLanguageCode;
  detectedSourceLanguage?: MvpLanguageCode;
  targetLanguage: MvpLanguageCode;
  translatedText: string;
  providerName: string;
};

export type RuntimeSaveVocabularyResponse =
  | {
      ok: true;
      result:
        | {
            status: "saved" | "already-saved";
          }
        | {
            status: "not-eligible";
            reason: "not-single-word";
          }
        | {
            status: "max-entries-reached";
            maxEntries: number;
          };
    }
  | {
      ok: false;
      error: string;
    };

export function requestRuntimeSaveVocabulary(
  extensionApi: RuntimeVocabularyExtensionApi | undefined,
  request: RuntimeSaveVocabularyRequest,
  timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS,
): Promise<RuntimeSaveVocabularyResponse> {
  if (!extensionApi) {
    return Promise.resolve({
      ok: false,
      error: "Extension runtime is unavailable.",
    });
  }

  return new Promise((resolve) => {
    let isSettled = false;
    const timeout = globalThis.setTimeout(() => {
      settle({
        ok: false,
        error: "Save request timed out before the extension background worker responded.",
      });
    }, timeoutMs);

    const settle = (response: RuntimeSaveVocabularyResponse): void => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      globalThis.clearTimeout(timeout);
      resolve(response);
    };

    extensionApi.runtime.sendMessage(
      {
        type: SAVE_VOCABULARY_MESSAGE,
        payload: request,
      },
      (response) => {
        if (extensionApi.runtime.lastError) {
          settle({
            ok: false,
            error: extensionApi.runtime.lastError.message ?? "Save request failed.",
          });
          return;
        }

        settle(
          isRuntimeSaveVocabularyResponse(response)
            ? response
            : { ok: false, error: "No save response received." },
        );
      },
    );
  });
}

function isRuntimeSaveVocabularyResponse(
  response: unknown,
): response is RuntimeSaveVocabularyResponse {
  if (typeof response !== "object" || response === null || !("ok" in response)) {
    return false;
  }

  if (response.ok === false) {
    return "error" in response && typeof response.error === "string";
  }

  if (
    response.ok !== true ||
    !("result" in response) ||
    typeof response.result !== "object" ||
    response.result === null ||
    !("status" in response.result)
  ) {
    return false;
  }

  return (
    response.result.status === "saved" ||
    response.result.status === "already-saved" ||
    response.result.status === "not-eligible" ||
    response.result.status === "max-entries-reached"
  );
}
