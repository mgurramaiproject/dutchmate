import { SAVED_VOCABULARY_STORAGE_KEY } from "../vocabulary/saved-vocabulary";

type StorageChange = {
  newValue?: unknown;
};

export function applySavedVocabularyStorageChange(
  savedVocabularyIds: Set<string> | undefined,
  changes: Record<string, StorageChange>,
  areaName: string,
): Set<string> | undefined {
  if (areaName === "local" && SAVED_VOCABULARY_STORAGE_KEY in changes) {
    return undefined;
  }

  return savedVocabularyIds;
}
