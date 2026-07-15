import type { ReviewCardSummary } from "../vocabulary/review-cards";

export type LearnSummaryView = {
  heading: string;
  description: string;
  stats: {
    value: number;
    label: string;
  }[];
  recent: {
    dutch: string;
    english: string;
    telugu: string;
  }[];
  emptyMessage: string | null;
  actions: {
    label: string;
    enabled: boolean;
  }[];
};

export function getLearnSummaryView(summary: ReviewCardSummary): LearnSummaryView {
  return {
    heading: summary.due > 0 ? "Keep reading. Review a little." : "Your reading desk is ready.",
    description:
      summary.due > 0
        ? `${summary.due} ${summary.due === 1 ? "word is" : "words are"} waiting for review.`
        : summary.total > 0
          ? "Your saved words are ready whenever you are."
          : "Save a word while reading to start your local vocabulary list.",
    stats: [
      { value: summary.due, label: "Due now" },
      { value: summary.total, label: "Saved" },
      { value: summary.new, label: "New" },
    ],
    recent: summary.recent.map((card) => ({
      dutch: card.dutch,
      english: card.english ?? "unavailable",
      telugu: card.telugu ?? "unavailable",
    })),
    emptyMessage:
      summary.recent.length === 0
        ? "No saved words yet. Select a single word on a webpage, translate it, then choose Save."
        : null,
    actions: [
      { label: "Review due words", enabled: summary.due > 0 },
      { label: "Practice new words", enabled: summary.new > 0 },
      { label: "Review all words", enabled: summary.total > 0 },
    ],
  };
}
