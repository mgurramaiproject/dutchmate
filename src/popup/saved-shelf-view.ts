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
  expanded: boolean;
  details?: { source: "Saved from webpage" | "From lesson" | null; context: string | null };
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
const SAFE_CONTEXT_MAX_LENGTH = 240;

export function getSavedShelfView(items: LearningItem[], state: { sort?: SavedShelfSort; expandedItemId?: string | null; loading?: boolean; error?: string | null } = {}): SavedShelfView {
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
    items: ordered.map((item) => {
      const expanded = item.id === state.expandedItemId;
      return {
        id: item.id,
        dutch: item.dutch,
        english: item.english ?? "unavailable",
        telugu: item.telugu ?? "unavailable",
        mastery: masteryLabel[getOverallMastery(item)],
        shelfNumber: shelfNumberById.get(item.id)!,
        expanded,
        ...(expanded ? { details: getSafeDetails(item) } : {}),
      };
    }),
  };
}

function getSafeDetails(item: LearningItem): NonNullable<SavedShelfItem["details"]> {
  const source = [...item.sources].sort((first, second) => second.addedAt - first.addedAt)[0];
  const context = [...item.contexts].sort((first, second) => second.addedAt - first.addedAt)[0];
  return { source: source?.type === "webpage" ? "Saved from webpage" : source?.type === "lesson" ? "From lesson" : null, context: context?.text.slice(0, SAFE_CONTEXT_MAX_LENGTH) ?? null };
}
