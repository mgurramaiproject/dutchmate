import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import type { SavedVocabularyEntry } from "../vocabulary/saved-vocabulary";
import type { CreateOrMergeLearningItemInput, LearningItem } from "../vocabulary/learning-record";

const SAVE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.save";
const SAVE_VOCABULARY_BATCH_MESSAGE = "hoverTranslate.vocabulary.saveBatch";
const LIST_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.list";
const LEARNING_CREATE_OR_MERGE_MESSAGE = "dutchmate.learning.createOrMerge";
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
  pageContext?: string | null;
};

export type RuntimeSaveVocabularyResponse =
  | {
      ok: true;
      result:
        | {
            status: "saved" | "already-saved";
            entry: SavedVocabularyEntry;
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

export type RuntimeSaveVocabularyBatchResponse =
  | {
      ok: true;
      result: {
        results: RuntimeSaveVocabularySuccessResult[];
      };
    }
  | {
      ok: false;
      error: string;
    };

type RuntimeSaveVocabularySuccessResult = Extract<RuntimeSaveVocabularyResponse, { ok: true }>["result"];

export type RuntimeListVocabularyResponse =
  | {
      ok: true;
      result: {
        entries: SavedVocabularyEntry[];
  };

    }
  | {
      ok: false;
      error: string;
    };

export type RuntimeLearningSaveResponse = { ok: true; result: { item: LearningItem } } | { ok: false; error: string };

export function requestRuntimeCreateLearningItem(api: RuntimeVocabularyExtensionApi | undefined, payload: CreateOrMergeLearningItemInput, timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS): Promise<RuntimeLearningSaveResponse> {
  if (!api) return Promise.resolve({ ok: false, error: "Extension runtime is unavailable." });
  return new Promise((resolve) => { let settled = false; const finish = (response: RuntimeLearningSaveResponse) => { if (!settled) { settled = true; globalThis.clearTimeout(timeout); resolve(response); } }; const timeout = globalThis.setTimeout(() => finish({ ok: false, error: "Learning save timed out before the extension background worker responded." }), timeoutMs); api.runtime.sendMessage({ type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload }, (response) => { if (api.runtime.lastError) return finish({ ok: false, error: api.runtime.lastError.message ?? "Learning save failed." }); if (typeof response === "object" && response !== null && "ok" in response && response.ok === true && "result" in response && typeof response.result === "object" && response.result !== null && "item" in response.result) return finish(response as RuntimeLearningSaveResponse); finish({ ok: false, error: "No learning save response received." }); }); });
}

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

export function requestRuntimeSaveVocabularyBatch(
  extensionApi: RuntimeVocabularyExtensionApi | undefined,
  requests: RuntimeSaveVocabularyRequest[],
  timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS,
): Promise<RuntimeSaveVocabularyBatchResponse> {
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

    const settle = (response: RuntimeSaveVocabularyBatchResponse): void => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      globalThis.clearTimeout(timeout);
      resolve(response);
    };

    extensionApi.runtime.sendMessage(
      {
        type: SAVE_VOCABULARY_BATCH_MESSAGE,
        payload: {
          entries: requests,
        },
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
          isRuntimeSaveVocabularyBatchResponse(response)
            ? response
            : { ok: false, error: "No save response received." },
        );
      },
    );
  });
}

export function requestRuntimeSavedVocabularyList(
  extensionApi: RuntimeVocabularyExtensionApi | undefined,
  timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS,
): Promise<RuntimeListVocabularyResponse> {
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
        error: "Saved vocabulary list request timed out before the extension background worker responded.",
      });
    }, timeoutMs);

    const settle = (response: RuntimeListVocabularyResponse): void => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      globalThis.clearTimeout(timeout);
      resolve(response);
    };

    extensionApi.runtime.sendMessage(
      {
        type: LIST_VOCABULARY_MESSAGE,
      },
      (response) => {
        if (extensionApi.runtime.lastError) {
          settle({
            ok: false,
            error: extensionApi.runtime.lastError.message ?? "Saved vocabulary list request failed.",
          });
          return;
        }

        settle(
          isRuntimeListVocabularyResponse(response)
            ? response
            : { ok: false, error: "No saved vocabulary list response received." },
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

function isRuntimeSaveVocabularyBatchResponse(
  response: unknown,
): response is RuntimeSaveVocabularyBatchResponse {
  if (typeof response !== "object" || response === null || !("ok" in response)) {
    return false;
  }

  if (response.ok === false) {
    return "error" in response && typeof response.error === "string";
  }

  return (
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null &&
    "results" in response.result &&
    Array.isArray(response.result.results) &&
    response.result.results.every(isRuntimeSaveVocabularySuccessResult)
  );
}

function isRuntimeSaveVocabularySuccessResult(
  result: unknown,
): result is RuntimeSaveVocabularySuccessResult {
  return (
    typeof result === "object" &&
    result !== null &&
    "status" in result &&
    (result.status === "saved" ||
      result.status === "already-saved" ||
      result.status === "not-eligible" ||
      result.status === "max-entries-reached")
  );
}

function isRuntimeListVocabularyResponse(
  response: unknown,
): response is RuntimeListVocabularyResponse {
  if (typeof response !== "object" || response === null || !("ok" in response)) {
    return false;
  }

  if (response.ok === false) {
    return "error" in response && typeof response.error === "string";
  }

  return (
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null &&
    "entries" in response.result &&
    Array.isArray(response.result.entries)
  );
}
