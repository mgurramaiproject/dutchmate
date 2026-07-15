import { describe, expect, it } from "vitest";
import { handleReviewMessage } from "./review-controller";
import {
  REVIEW_ALL_QUEUE_MESSAGE,
  REVIEW_DUE_QUEUE_MESSAGE,
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
} from "./messages";
import type { ReviewCard } from "../vocabulary/review-cards";

describe("handleReviewMessage", () => {
  it("returns the canonical review summary", async () => {
    const summary = {
      total: 2,
      due: 1,
      new: 1,
      recent: [],
    };

    await expect(
      handleReviewMessage({ type: REVIEW_SUMMARY_MESSAGE }, {
        summary: async () => summary,
      }),
    ).resolves.toEqual({ ok: true, result: summary });
  });

  it("returns a safe error when the summary is unavailable", async () => {
    await expect(
      handleReviewMessage({ type: REVIEW_SUMMARY_MESSAGE }, {
        summary: async () => {
          throw new Error("storage failed");
        },
      }),
    ).resolves.toEqual({ ok: false, error: "Review summary is unavailable." });
  });

  it("returns a stable snapshot of new cards", async () => {
    const cards = [{ id: "nl\u001fhuis" }] as never[];

    await expect(
      handleReviewMessage({ type: REVIEW_NEW_QUEUE_MESSAGE }, {
        summary: async () => ({ total: 0, due: 0, new: 0, recent: [] }),
        newQueue: async () => cards,
      }),
    ).resolves.toEqual({ ok: true, result: { cards } });
  });

  it("returns stable snapshots for due and all-card review", async () => {
    const dueCards = [{ id: "nl\u001fdue" }] as never[];
    const allCards = [{ id: "nl\u001fall" }] as never[];

    await expect(
      handleReviewMessage({ type: REVIEW_DUE_QUEUE_MESSAGE }, {
        summary: async () => ({ total: 0, due: 0, new: 0, recent: [] }),
        dueQueue: async () => dueCards,
      }),
    ).resolves.toEqual({ ok: true, result: { cards: dueCards } });

    await expect(
      handleReviewMessage({ type: REVIEW_ALL_QUEUE_MESSAGE }, {
        summary: async () => ({ total: 0, due: 0, new: 0, recent: [] }),
        allQueue: async () => allCards,
      }),
    ).resolves.toEqual({ ok: true, result: { cards: allCards } });
  });

  it("persists the selected rating through the review provider", async () => {
    const card = { id: "nl\u001fhuis" } as ReviewCard;

    await expect(
      handleReviewMessage(
        { type: REVIEW_RATE_MESSAGE, payload: { id: card.id, rating: "easy" } },
        {
          summary: async () => ({ total: 0, due: 0, new: 0, recent: [] }),
          rate: async (id, rating) => ({ ...card, id: `${id}:${rating}` }),
        },
      ),
    ).resolves.toEqual({ ok: true, result: { card: { id: "nl\u001fhuis:easy" } } });
  });

  it("uses operation-specific errors for failed ratings", async () => {
    await expect(
      handleReviewMessage(
        { type: REVIEW_RATE_MESSAGE, payload: { id: "nl\u001fmissing", rating: "again" } },
        {
          summary: async () => ({ total: 0, due: 0, new: 0, recent: [] }),
          rate: async () => {
            throw new Error("missing");
          },
        },
      ),
    ).resolves.toEqual({ ok: false, error: "Your rating could not be saved." });
  });
});
