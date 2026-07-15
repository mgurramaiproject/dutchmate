import { describe, expect, it } from "vitest";
import { handleReviewMessage } from "./review-controller";
import { REVIEW_SUMMARY_MESSAGE } from "./messages";

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
});
