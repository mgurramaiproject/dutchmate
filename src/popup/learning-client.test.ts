import { describe, expect, it, vi } from "vitest";
import { createLearningClient } from "./learning-client";
import type { LearningItem } from "../vocabulary/learning-record";

describe("createLearningClient", () => {
  it("lists, deletes, and practices through the typed learning contract", async () => {
    const item = { id: "nl\u001fgoede morgen", dutch: "goede morgen", normalizedDutch: "goede morgen", kind: "chunk" } as unknown as LearningItem;
    const snapshot = { createdAt: 1, dayStartAt: 0, tasks: [{ itemId: item.id, dimension: "recognition" as const }], completedTaskIds: [], goalCompleted: false };
    const rhythm = { week: [], activity: [], resetCopy: null, milestones: [] };
    const sendMessage = vi.fn(async (message) => message.type === "dutchmate.learning.list" ? { ok: true as const, result: { items: [item] } } : message.type === "dutchmate.learning.rhythm" ? { ok: true as const, result: { rhythm } } : message.type === "dutchmate.learning.dailyFive" ? { ok: true as const, result: { snapshot } } : message.type === "dutchmate.learning.dailyFive.result" ? { ok: true as const, result: { item, snapshot } } : { ok: true as const, result: { deleted: true as const } });
    const client = createLearningClient({ runtime: { sendMessage } });
    await expect(client.list()).resolves.toEqual([item]);
    await expect(client.getRhythm()).resolves.toEqual(rhythm);
    await expect(client.delete(item.id)).resolves.toBeUndefined();
    await expect(client.getDailyFive()).resolves.toEqual(snapshot);
    await expect(client.recordDailyFiveResult(item.id, "recognition", "got-it")).resolves.toEqual({ item, snapshot });
    expect(sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.delete", payload: { id: item.id } });
  });
});
