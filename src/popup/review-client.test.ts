import { describe, expect, it, vi } from "vitest";
import { createReviewSummaryClient } from "./review-client";
import { REVIEW_SUMMARY_MESSAGE, type ReviewMessageResponse } from "../background/messages";

describe("createReviewSummaryClient", () => {
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

    await expect(createReviewSummaryClient({ runtime: { sendMessage } }).getSummary()).resolves.toEqual({
      total: 3,
      due: 1,
      new: 2,
      recent: [],
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: REVIEW_SUMMARY_MESSAGE });
  });

  it("returns a useful error for an invalid response", async () => {
    const client = createReviewSummaryClient({
      runtime: {
        sendMessage: vi.fn(
          async (): Promise<ReviewMessageResponse> => ({ ok: false, error: "No summary" }),
        ),
      },
    });

    await expect(client.getSummary()).rejects.toThrow("No summary");
  });
});
