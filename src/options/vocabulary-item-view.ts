import type { LearningItem } from "../vocabulary/learning-record";

export function getVocabularyItemView(item: LearningItem): { dutch: string; english: string | null; telugu: string | null; source: string } {
  return { dutch: item.dutch, english: item.english, telugu: item.telugu, source: item.sources.at(-1)?.type ?? "webpage" };
}
