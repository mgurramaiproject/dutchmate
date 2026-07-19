import type { TranslationRequest, TranslationResult } from "../translation/provider";
import { isMvpLanguageCode } from "../shared/languages";
import type {
  SavedVocabularyEntry,
  SaveVocabularyInput,
  SaveVocabularyResult,
} from "../vocabulary/saved-vocabulary";
import type { ReviewCard, ReviewCardSummary, ReviewImportResult, ReviewRating } from "../vocabulary/review-cards";
import type { VocabularyBackup } from "../vocabulary/vocabulary-backup";
import type { ExtensionSettings } from "../shared/settings";

export const TRANSLATE_MESSAGE = "hoverTranslate.translate";
export const SAVE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.save";
export const SAVE_VOCABULARY_BATCH_MESSAGE = "hoverTranslate.vocabulary.saveBatch";
export const LIST_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.list";
export const DELETE_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.delete";
export const CLEAR_VOCABULARY_MESSAGE = "hoverTranslate.vocabulary.clear";
export const REVIEW_SUMMARY_MESSAGE = "dutchmate.review.summary";
export const REVIEW_NEW_QUEUE_MESSAGE = "dutchmate.review.newQueue";
export const REVIEW_DUE_QUEUE_MESSAGE = "dutchmate.review.dueQueue";
export const REVIEW_ALL_QUEUE_MESSAGE = "dutchmate.review.allQueue";
export const REVIEW_RATE_MESSAGE = "dutchmate.review.rate";
export const REVIEW_DELETE_MESSAGE = "dutchmate.review.delete";
export const REVIEW_EXPORT_MESSAGE = "dutchmate.review.export";
export const REVIEW_IMPORT_MESSAGE = "dutchmate.review.import";
export const REVIEW_CLEAR_MESSAGE = "dutchmate.review.clear";
export const REVIEW_SETTINGS_MESSAGE = "dutchmate.review.settings";
export const REVIEW_SETTINGS_UPDATE_MESSAGE = "dutchmate.review.settings.update";

export type ReviewSettingsChanges = Pick<
  ExtensionSettings,
  "autoSaveSelectedWords" | "showExampleSentence" | "dailyReviewBadge" | "cardDirection"
>;

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

export type ReviewSummaryMessage = {
  type: typeof REVIEW_SUMMARY_MESSAGE;
};

export type ReviewNewQueueMessage = {
  type: typeof REVIEW_NEW_QUEUE_MESSAGE;
};

export type ReviewDueQueueMessage = {
  type: typeof REVIEW_DUE_QUEUE_MESSAGE;
};

export type ReviewAllQueueMessage = {
  type: typeof REVIEW_ALL_QUEUE_MESSAGE;
};

export type ReviewRateMessage = {
  type: typeof REVIEW_RATE_MESSAGE;
  payload: {
    id: string;
    rating: ReviewRating;
  };
};

export type ReviewDeleteMessage = {
  type: typeof REVIEW_DELETE_MESSAGE;
  payload: { id: string };
};

export type ReviewExportMessage = {
  type: typeof REVIEW_EXPORT_MESSAGE;
};

export type ReviewImportMessage = {
  type: typeof REVIEW_IMPORT_MESSAGE;
  payload: { document: string };
};

export type ReviewClearMessage = {
  type: typeof REVIEW_CLEAR_MESSAGE;
};

export type ReviewSettingsMessage = {
  type: typeof REVIEW_SETTINGS_MESSAGE;
};

export type ReviewSettingsUpdateMessage = {
  type: typeof REVIEW_SETTINGS_UPDATE_MESSAGE;
  payload: Partial<ReviewSettingsChanges>;
};

export type VocabularyMessage =
  | SaveVocabularyMessage
  | SaveVocabularyBatchMessage
  | ListVocabularyMessage
  | DeleteVocabularyMessage
  | ClearVocabularyMessage;

export type ReviewMessage =
  | ReviewSummaryMessage
  | ReviewNewQueueMessage
  | ReviewDueQueueMessage
  | ReviewAllQueueMessage
  | ReviewRateMessage
  | ReviewDeleteMessage
  | ReviewExportMessage
  | ReviewImportMessage
  | ReviewClearMessage;

export type SettingsMessage = ReviewSettingsMessage | ReviewSettingsUpdateMessage;

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

export type ReviewMessageResponse =
  | {
      ok: true;
      result:
        | ReviewCardSummary
        | { cards: ReviewCard[] }
        | ReviewImportResult
        | { card: ReviewCard }
        | { deleted: true }
        | { backup: VocabularyBackup }
        | { cleared: true };
    }
  | {
      ok: false;
      error: string;
  };

export type SettingsMessageResponse =
  | {
      ok: true;
      result: { settings: ExtensionSettings };
    }
  | {
      ok: false;
      error: string;
    };

export type BackgroundMessageResponse =
  | TranslateMessageResponse
  | VocabularyMessageResponse
  | ReviewMessageResponse
  | SettingsMessageResponse;

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

export function isReviewMessage(message: unknown): message is ReviewMessage {
  if (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === REVIEW_SUMMARY_MESSAGE
  ) {
    return true;
  }

  if (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === REVIEW_DELETE_MESSAGE &&
    "payload" in message &&
    typeof message.payload === "object" &&
    message.payload !== null &&
    "id" in message.payload
  ) {
    return typeof message.payload.id === "string";
  }

  if (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    (message.type === REVIEW_EXPORT_MESSAGE || message.type === REVIEW_CLEAR_MESSAGE)
  ) {
    return true;
  }

  if (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === REVIEW_IMPORT_MESSAGE &&
    "payload" in message &&
    typeof message.payload === "object" &&
    message.payload !== null &&
    "document" in message.payload
  ) {
    return typeof message.payload.document === "string";
  }

  if (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    (message.type === REVIEW_NEW_QUEUE_MESSAGE ||
      message.type === REVIEW_DUE_QUEUE_MESSAGE ||
      message.type === REVIEW_ALL_QUEUE_MESSAGE)
  ) {
    return true;
  }

  if (
    typeof message !== "object" ||
    message === null ||
    !("type" in message) ||
    message.type !== REVIEW_RATE_MESSAGE ||
    !("payload" in message) ||
    typeof message.payload !== "object" ||
    message.payload === null
  ) {
    return false;
  }

  const payload = message.payload as Record<string, unknown>;
  return typeof payload.id === "string" && isReviewRating(payload.rating);
}

export function isSettingsMessage(message: unknown): message is SettingsMessage {
  if (
    typeof message !== "object" ||
    message === null ||
    !("type" in message)
  ) {
    return false;
  }

  if (message.type === REVIEW_SETTINGS_MESSAGE) {
    return true;
  }

  if (
    message.type !== REVIEW_SETTINGS_UPDATE_MESSAGE ||
    !("payload" in message) ||
    typeof message.payload !== "object" ||
    message.payload === null
  ) {
    return false;
  }

  const payload = message.payload as Record<string, unknown>;
  const keys = Object.keys(payload);
  return (
    keys.length > 0 &&
    keys.every((key) =>
      key === "autoSaveSelectedWords" ||
      key === "showExampleSentence" ||
      key === "dailyReviewBadge" ||
      key === "cardDirection",
    ) &&
    (payload.autoSaveSelectedWords === undefined || typeof payload.autoSaveSelectedWords === "boolean") &&
    (payload.showExampleSentence === undefined || typeof payload.showExampleSentence === "boolean") &&
    (payload.dailyReviewBadge === undefined || typeof payload.dailyReviewBadge === "boolean") &&
    (payload.cardDirection === undefined ||
      payload.cardDirection === "dutch-to-helpers" ||
      payload.cardDirection === "helpers-to-dutch")
  );
}

function isReviewRating(value: unknown): value is ReviewRating {
  return value === "again" || value === "hard" || value === "good" || value === "easy";
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
    typeof candidate.providerName === "string" &&
    (candidate.pageContext === undefined ||
      candidate.pageContext === null ||
      typeof candidate.pageContext === "string")
  );
}

function isSaveVocabularyBatchPayload(payload: unknown): payload is { entries: SaveVocabularyInput[] } {
  if (typeof payload !== "object" || payload === null || !("entries" in payload)) {
    return false;
  }

  const entries = (payload as { entries: unknown }).entries;

  return Array.isArray(entries) && entries.length > 0 && entries.every(isSaveVocabularyPayload);
}
