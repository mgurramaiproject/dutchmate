import type { TranslationRequest, TranslationResult } from "../translation/provider";
import { isMvpLanguageCode } from "../shared/languages";
import type {
  SavedVocabularyEntry,
  SaveVocabularyInput,
  SaveVocabularyResult,
} from "../vocabulary/saved-vocabulary";

export const TRANSLATE_MESSAGE = "hoverTranslate.translate";
export const SAVE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.save";
export const SAVE_VOCABULARY_BATCH_MESSAGE = "hoverTranslate.vocabulary.saveBatch";
export const LIST_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.list";
export const DELETE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.delete";
export const CLEAR_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.clear";

export type TranslateMessage = {
  type: typeof TRANSLATE_MESSAGE;
  payload: TranslationRequest;
};

export type SaveVocabularyMessage = {
  type: typeof SAVE_VOCABULARY_MESSAGE;
  payload: SaveVocabularyInput;
};

export type SaveVocabularyBatchMessage = {
  type: typeof SAVE_VOCABULARY_BATCH_MESSAGE;
  payload: {
    entries: SaveVocabularyInput[];
  };
};

export type ListVocabularyMessage = {
  type: typeof LIST_VOCABULARY_MESSAGE;
};

export type DeleteVocabularyMessage = {
  type: typeof DELETE_VOCABULARY_MESSAGE;
  payload: {
    id: string;
  };
};

export type ClearVocabularyMessage = {
  type: typeof CLEAR_VOCABULARY_MESSAGE;
};

export type VocabularyMessage =
  | SaveVocabularyMessage
  | SaveVocabularyBatchMessage
  | ListVocabularyMessage
  | DeleteVocabularyMessage
  | ClearVocabularyMessage;

export type TranslateMessageResponse =
  | {
      ok: true;
      result: TranslationResult;
    }
  | {
      ok: false;
      error: string;
    };

export type VocabularyMessageResponse =
  | {
      ok: true;
      result:
        | SaveVocabularyResult
        | {
            results: SaveVocabularyResult[];
          }
        | {
            entries: SavedVocabularyEntry[];
          }
        | {
            deleted: true;
          }
        | {
            cleared: true;
          };
    }
  | {
      ok: false;
      error: string;
    };

export type BackgroundMessageResponse = TranslateMessageResponse | VocabularyMessageResponse;

export function isTranslateMessage(message: unknown): message is TranslateMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === TRANSLATE_MESSAGE &&
    "payload" in message
  );
}

export function isVocabularyMessage(message: unknown): message is VocabularyMessage {
  if (typeof message !== "object" || message === null || !("type" in message)) {
    return false;
  }

  if (message.type === LIST_VOCABULARY_MESSAGE || message.type === CLEAR_VOCABULARY_MESSAGE) {
    return true;
  }

  if (
    message.type === DELETE_VOCABULARY_MESSAGE &&
    "payload" in message &&
    typeof message.payload === "object" &&
    message.payload !== null &&
    "id" in message.payload
  ) {
    return typeof message.payload.id === "string";
  }

  if (message.type === SAVE_VOCABULARY_MESSAGE && "payload" in message) {
    return isSaveVocabularyPayload(message.payload);
  }

  if (message.type === SAVE_VOCABULARY_BATCH_MESSAGE && "payload" in message) {
    return isSaveVocabularyBatchPayload(message.payload);
  }

  return false;
}

function isSaveVocabularyPayload(payload: unknown): payload is SaveVocabularyInput {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const sourceLanguage = candidate.sourceLanguage;
  const detectedSourceLanguage = candidate.detectedSourceLanguage;
  const targetLanguage = candidate.targetLanguage;

  return (
    typeof candidate.text === "string" &&
    (sourceLanguage === "auto" ||
      (typeof sourceLanguage === "string" && isMvpLanguageCode(sourceLanguage))) &&
    (detectedSourceLanguage === undefined ||
      (typeof detectedSourceLanguage === "string" &&
        isMvpLanguageCode(detectedSourceLanguage))) &&
    typeof targetLanguage === "string" &&
    isMvpLanguageCode(targetLanguage) &&
    typeof candidate.translatedText === "string" &&
    typeof candidate.providerName === "string"
  );
}

function isSaveVocabularyBatchPayload(payload: unknown): payload is { entries: SaveVocabularyInput[] } {
  if (typeof payload !== "object" || payload === null || !("entries" in payload)) {
    return false;
  }

  const entries = (payload as { entries: unknown }).entries;

  return Array.isArray(entries) && entries.length > 0 && entries.every(isSaveVocabularyPayload);
}
