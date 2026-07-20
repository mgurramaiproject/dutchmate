import { describe, expect, it } from "vitest";
import { getLearnSummaryView, getRecentVocabularyItems } from "./learn-summary";
import type { ReviewCardSummary } from "../vocabulary/review-cards";

describe("getLearnSummaryView", () => {
  it("exposes counts, partial meanings, recent words, and available actions", () => {
    const summary: ReviewCardSummary = {
      total: 2,
      due: 1,
      new: 1,
      recent: [
        {
          id: "nl\u001fhuis",
          dutch: "huis",
          english: "house",
          telugu: null,
          pageContext: null,
          createdAt: 1_000,
          updatedAt: 1_000,
          dueAt: null,
          lastReviewedAt: null,
          lastRating: null,
          reviewCount: 0,
        },
      ],
    };

    expect(getLearnSummaryView(summary)).toMatchObject({
      heading: "Keep reading. Review a little.",
      description: "1 word is waiting for review.",
      stats: [
        { value: 1, label: "Due now" },
        { value: 2, label: "Saved" },
        { value: 1, label: "New" },
      ],
      recentLabel: "Recently saved · 1 of 2",
      recent: [{ dutch: "huis", english: "house", telugu: "unavailable" }],
      actions: [
        { label: "Review due words", enabled: true },
        { label: "Practice new words", enabled: true },
        { label: "Review all words", enabled: true },
      ],
    });
  });

  it("describes the empty state and disables actions without cards", () => {
    expect(
      getLearnSummaryView({ total: 0, due: 0, new: 0, recent: [] }),
    ).toMatchObject({
      heading: "Your reading desk is ready.",
      emptyMessage: "No saved words yet. Select a single word on a webpage, translate it, then choose Save.",
      actions: [
        { enabled: false },
        { enabled: false },
        { enabled: false },
      ],
    });
  });

  it("includes a saved chunk in the popup vocabulary list", () => {
    expect(getRecentVocabularyItems([], [{ dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం", kind: "chunk", createdAt: 2 } as never])).toEqual([{ dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం" }]);
  });
});
