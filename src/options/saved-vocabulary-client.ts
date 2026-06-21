import type { SavedVocabularyEntry } from "../vocabulary/saved-vocabulary";

const LIST_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.list";
const DELETE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.delete";
const CLEAR_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.clear";

export type SavedVocabularyRuntimeApi = {
  runtime: {
    sendMessage(message: unknown): Promise<unknown>;
  };
};

export type SavedVocabularyClient = {
  list(): Promise<SavedVocabularyEntry[]>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
};

export function createSavedVocabularyClient(
  extensionApi: SavedVocabularyRuntimeApi,
): SavedVocabularyClient {
  return {
    async list() {
      const response = await extensionApi.runtime.sendMessage({
        type: LIST_VOCABULARY_MESSAGE,
      });

      if (!isVocabularyListResponse(response)) {
        throw new Error("Saved vocabulary list is unavailable.");
      }

      return response.result.entries;
    },

    async delete(id: string) {
      const response = await extensionApi.runtime.sendMessage({
        type: DELETE_VOCABULARY_MESSAGE,
        payload: { id },
      });

      if (!isDeleteResponse(response)) {
        throw new Error("Saved vocabulary entry could not be deleted.");
      }
    },

    async clear() {
      const response = await extensionApi.runtime.sendMessage({
        type: CLEAR_VOCABULARY_MESSAGE,
      });

      if (!isClearResponse(response)) {
        throw new Error("Saved vocabulary could not be cleared.");
      }
    },
  };
}

function isVocabularyListResponse(response: unknown): response is {
  ok: true;
  result: {
    entries: SavedVocabularyEntry[];
  };
} {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null &&
    "entries" in response.result &&
    Array.isArray(response.result.entries)
  );
}

function isDeleteResponse(response: unknown): response is {
  ok: true;
  result: {
    deleted: true;
  };
} {
  return (
    isSuccessObjectResponse(response) &&
    "deleted" in response.result &&
    response.result.deleted === true
  );
}

function isClearResponse(response: unknown): response is {
  ok: true;
  result: {
    cleared: true;
  };
} {
  return (
    isSuccessObjectResponse(response) &&
    "cleared" in response.result &&
    response.result.cleared === true
  );
}

function isSuccessObjectResponse(response: unknown): response is {
  ok: true;
  result: Record<string, unknown>;
} {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null
  );
}
