import { LEARNING_RECORD_STORAGE_KEY } from "../vocabulary/learning-record";

type StorageChange = {
  newValue?: unknown;
};

export function applySavedVocabularyStorageChange(
  savedVocabularyIds: Set<string> | undefined,
  changes: Record<string, StorageChange>,
  areaName: string,
): Set<string> | undefined {
  if (areaName === "local" && LEARNING_RECORD_STORAGE_KEY in changes) {
    return undefined;
  }

  return savedVocabularyIds;
}
