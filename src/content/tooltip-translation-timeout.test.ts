import { describe, expect, it, vi } from "vitest";
import {
  TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE,
  withTooltipTranslationTimeout,
} from "./tooltip-translation-timeout";

describe("withTooltipTranslationTimeout", () => {
  it("fails slow translation requests with a backend timeout message", async () => {
    vi.useFakeTimers();

    const translation = withTooltipTranslationTimeout(new Promise<never>(() => {}), 100);
    const expectation = expect(translation).rejects.toThrow(TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE);

    await vi.advanceTimersByTimeAsync(100);

    await expectation;
    vi.useRealTimers();
  });

  it("lets completed translation requests resolve normally", async () => {
    await expect(withTooltipTranslationTimeout(Promise.resolve("house"), 100)).resolves.toBe(
      "house",
    );
  });
});
