import { describe, expect, it, vi } from "vitest";
import { createReviewClient } from "./review-client";
import {
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
  type ReviewMessageResponse,
} from "../background/messages";

describe("createReviewClient", () => {
  it("requests the canonical summary through the background runtime", async () => {
    const sendMessage = vi.fn(async (): Promise<ReviewMessageResponse> => ({
      ok: true,
      result: {
        total: 3,
        due: 1,
        new: 2,
        recent: [],
      },
    }));

    await expect(createReviewClient({ runtime: { sendMessage } }).getSummary()).resolves.toEqual({
      total: 3,
      due: 1,
      new: 2,
      recent: [],
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: REVIEW_SUMMARY_MESSAGE });
  });

  it("returns a useful error for an invalid response", async () => {
    const client = createReviewClient({
      runtime: {
        sendMessage: vi.fn(
          async (): Promise<ReviewMessageResponse> => ({ ok: false, error: "No summary" }),
        ),
      },
    });

    await expect(client.getSummary()).rejects.toThrow("No summary");
  });

  it("starts new-word practice with one queue snapshot", async () => {
    const sendMessage = vi.fn(async (message): Promise<ReviewMessageResponse> => {
      expect(message).toEqual({ type: REVIEW_NEW_QUEUE_MESSAGE });
      return { ok: true, result: { cards: [] } };
    });

    await expect(createReviewClient({ runtime: { sendMessage } }).getNewQueue()).resolves.toEqual([]);
  });

  it("sends a rating and returns the persisted card", async () => {
    const card = {
      id: "nl\u001fhuis",
      dutch: "huis",
      english: "house",
      telugu: null,
      pageContext: null,
      createdAt: 1_000,
      updatedAt: 2_000,
      dueAt: 3_000,
      lastReviewedAt: 2_000,
      lastRating: "good" as const,
      reviewCount: 1,
    };
    const sendMessage = vi.fn(async (message): Promise<ReviewMessageResponse> => {
      expect(message).toEqual({
        type: REVIEW_RATE_MESSAGE,
        payload: { id: card.id, rating: "good" },
      });
      return { ok: true, result: { card } };
    });

    await expect(
      createReviewClient({ runtime: { sendMessage } }).rateCard(card.id, "good"),
    ).resolves.toEqual(card);
  });
});
