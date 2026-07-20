import { SAVED_VOCABULARY_STORAGE_KEY } from "../vocabulary/saved-vocabulary";
import { REVIEW_CARDS_STORAGE_KEY } from "../vocabulary/review-cards";
import { LEARNING_RECORD_STORAGE_KEY } from "../vocabulary/learning-record";

export type StorageChange = {
  oldValue?: unknown;
  newValue?: unknown;
};

export function shouldRefreshSavedVocabulary(
  changes: Record<string, StorageChange>,
  areaName: string,
): boolean {
  if (areaName !== "local") {
    return false;
  }

  return SAVED_VOCABULARY_STORAGE_KEY in changes || REVIEW_CARDS_STORAGE_KEY in changes || LEARNING_RECORD_STORAGE_KEY in changes;
}
