import { describe, expect, it, vi } from "vitest";
import { createLearningClient } from "./learning-client";
import type { LearningItem } from "../vocabulary/learning-record";

describe("createLearningClient", () => {
  it("lists and deletes a saved chunk through the typed learning contract", async () => {
    const item = { id: "nl\u001fgoede morgen", dutch: "goede morgen", normalizedDutch: "goede morgen", kind: "chunk" } as unknown as LearningItem;
    const sendMessage = vi.fn(async (message) => message.type === "dutchmate.learning.list" ? { ok: true as const, result: { items: [item] } } : { ok: true as const, result: { deleted: true as const } });
    const client = createLearningClient({ runtime: { sendMessage } });
    await expect(client.list()).resolves.toEqual([item]);
    await expect(client.delete(item.id)).resolves.toBeUndefined();
    expect(sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.delete", payload: { id: item.id } });
  });
});
