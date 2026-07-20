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

  return LEARNING_RECORD_STORAGE_KEY in changes;
}
