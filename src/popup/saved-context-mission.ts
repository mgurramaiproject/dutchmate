import { getWeakerMasteryDimension, type DailyFiveDimension } from "../vocabulary/daily-five";
import type { LearningContext, LearningItem } from "../vocabulary/learning-record";
import { normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";

export type SavedContextMission = {
  itemId: string;
  context: LearningContext;
  dimension: DailyFiveDimension;
  expectedAttemptCount: number;
  revealed: boolean;
};

export function getSavedContext(item: LearningItem): LearningContext | null {
  if (item.kind !== "word") return null;
  return [...item.contexts]
    .filter((context) => context.sourceLanguage === "nl" && context.text.trim().length > 0)
    .sort((first, second) => second.addedAt - first.addedAt || normalizeSavedVocabularyText(second.text).localeCompare(normalizeSavedVocabularyText(first.text)))
    .at(0) ?? null;
}

export function createSavedContextMission(item: LearningItem): SavedContextMission | null {
  const context = getSavedContext(item);
  if (!context) return null;
  const dimension = getWeakerMasteryDimension(item);
  return { itemId: item.id, context, dimension, expectedAttemptCount: item[dimension].attemptCount, revealed: false };
}

export function revealSavedContextMission(mission: SavedContextMission): SavedContextMission {
  return { ...mission, revealed: true };
}
