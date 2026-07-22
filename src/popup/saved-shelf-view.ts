import { getOverallMastery } from "../vocabulary/daily-five";
import type { LearningItem, MasteryState } from "../vocabulary/learning-record";

export type SavedShelfSort = "newest" | "alphabetical";
export type SavedShelfItem = {
  id: string;
  dutch: string;
  english: string;
  telugu: string;
  mastery: "New" | "Learning" | "Familiar" | "Strong";
  shelfNumber: number;
};
export type SavedShelfView =
  | { status: "loading"; sort: SavedShelfSort }
  | { status: "error"; sort: SavedShelfSort; message: string }
  | { status: "empty"; sort: SavedShelfSort }
  | { status: "ready"; sort: SavedShelfSort; count: number; items: SavedShelfItem[] };

const masteryLabel: Record<MasteryState, SavedShelfItem["mastery"]> = {
  new: "New",
  learning: "Learning",
  familiar: "Familiar",
  strong: "Strong",
};

export function getSavedShelfView(items: LearningItem[], state: { sort?: SavedShelfSort; loading?: boolean; error?: string | null } = {}): SavedShelfView {
  const sort = state.sort ?? "newest";
  if (state.loading) return { status: "loading", sort };
  if (state.error) return { status: "error", sort, message: state.error };
  if (items.length === 0) return { status: "empty", sort };

  const chronological = [...items].sort((first, second) => first.createdAt - second.createdAt || first.id.localeCompare(second.id));
  const shelfNumberById = new Map(chronological.map((item, index) => [item.id, index + 1]));
  const ordered = sort === "newest"
    ? [...chronological].reverse()
    : [...chronological].sort((first, second) => first.dutch.localeCompare(second.dutch, "nl") || first.id.localeCompare(second.id));

  return {
    status: "ready",
    sort,
    count: items.length,
    items: ordered.map((item) => ({
      id: item.id,
      dutch: item.dutch,
      english: item.english ?? "unavailable",
      telugu: item.telugu ?? "unavailable",
      mastery: masteryLabel[getOverallMastery(item)],
      shelfNumber: shelfNumberById.get(item.id)!,
    })),
  };
}
