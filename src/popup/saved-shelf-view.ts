import { getOverallMastery } from "../vocabulary/daily-five";
import type { LearningItem, MasteryState } from "../vocabulary/learning-record";
import { resolveSavedVerbJourney, type SavedVerbJourneyLink } from "../verb-journeys/saved-link";

export type SavedShelfSort = "newest" | "alphabetical";
export type SavedShelfItem = {
  id: string;
  dutch: string;
  english: string;
  telugu: string;
  mastery: "New" | "Learning" | "Familiar" | "Secure";
  shelfNumber: number;
  expanded: boolean;
  verbJourney?: SavedVerbJourneyLink;
  details?: { source: "Saved from webpage" | "From lesson" | null; contexts: SavedContextView[] };
};
export type SavedContextView = {
  text: string;
  originalLabel: string;
  englishTranslation: string | null;
  teluguTranslation: string | null;
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
  strong: "Secure",
};
const SAFE_CONTEXT_MAX_LENGTH = 240;

export function sortSavedItems(items: LearningItem[], sort: SavedShelfSort | "oldest" = "newest"): LearningItem[] {
  const chronological = [...items].sort((first, second) => first.createdAt - second.createdAt || first.id.localeCompare(second.id));
  if (sort === "oldest") return chronological;
  return sort === "newest"
    ? chronological.reverse()
    : chronological.sort((first, second) => first.dutch.localeCompare(second.dutch, "nl") || first.id.localeCompare(second.id));
}

export function getSavedShelfView(items: LearningItem[], state: { sort?: SavedShelfSort; expandedItemId?: string | null; loading?: boolean; error?: string | null } = {}): SavedShelfView {
  const sort = state.sort ?? "newest";
  if (state.loading) return { status: "loading", sort };
  if (state.error) return { status: "error", sort, message: state.error };
  if (items.length === 0) return { status: "empty", sort };

  const chronological = sortSavedItems(items, "oldest");
  const shelfNumberById = new Map(chronological.map((item, index) => [item.id, index + 1]));
  const ordered = sortSavedItems(items, sort);

  return {
    status: "ready",
    sort,
    count: items.length,
    items: ordered.map((item) => {
      const expanded = item.id === state.expandedItemId;
      const verbJourney = resolveSavedVerbJourney(item);
      return {
        id: item.id,
        dutch: item.dutch,
        english: item.english ?? "Unavailable",
        telugu: item.telugu ?? "Unavailable",
        mastery: masteryLabel[getOverallMastery(item)],
        shelfNumber: shelfNumberById.get(item.id)!,
        expanded,
        ...(verbJourney ? { verbJourney } : {}),
        ...(expanded ? { details: getSafeDetails(item) } : {}),
      };
    }),
  };
}

function getSafeDetails(item: LearningItem): NonNullable<SavedShelfItem["details"]> {
  const source = [...item.sources].sort((first, second) => second.addedAt - first.addedAt)[0];
  return { source: source?.type === "webpage" ? "Saved from webpage" : source?.type === "lesson" ? "From lesson" : null, contexts: getSavedContextViews(item.contexts) };
}

export function getSavedContextViews(contexts: LearningItem["contexts"]): SavedContextView[] {
  return [...contexts]
    .sort((first, second) => second.addedAt - first.addedAt)
    .slice(0, 3)
    .map((context) => {
      const language = context.sourceLanguage === "nl" ? "Dutch" : context.sourceLanguage === "en" ? "English" : context.sourceLanguage === "te" ? "Telugu" : "Language not detected";
      return {
        text: context.text.slice(0, SAFE_CONTEXT_MAX_LENGTH),
        originalLabel: `Original context · ${language}`,
        englishTranslation: context.sourceLanguage === "en" ? null : context.english ?? null,
        teluguTranslation: context.sourceLanguage === "te" ? null : context.telugu ?? null,
      };
    });
}
