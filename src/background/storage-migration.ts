import type { LearningRecordStore } from "../vocabulary/learning-record";
import type { SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";

export const STORAGE_MIGRATION_KEY = "dutchmate.storageMigration.v1";

export async function migrateExtensionStorage(storage: SavedVocabularyStorage, learningRecords: LearningRecordStore): Promise<void> {
  const marker = await storage.get(STORAGE_MIGRATION_KEY);
  await learningRecords.migrate();
  if (!isCurrentMigrationMarker(marker)) await storage.set(STORAGE_MIGRATION_KEY, { version: 1 });
}

function isCurrentMigrationMarker(value: unknown): value is { version: 1 } {
  return typeof value === "object" && value !== null && "version" in value && value.version === 1;
}
