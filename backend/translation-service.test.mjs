import { describe, expect, it } from "vitest";
import { createLocalDevProvider } from "./providers/local-dev-provider.mjs";
import { createTranslationService } from "./translation-service.mjs";

describe("createTranslationService", () => {
  it("returns known local development translations", async () => {
    const service = createTranslationService(createLocalDevProvider());

    await expect(
      service.translate({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).resolves.toEqual({
      translatedText: "hello",
      provider: "local-dev",
    });
  });

  it("keeps unknown translations obvious during local development", async () => {
    const service = createTranslationService(createLocalDevProvider());

    await expect(
      service.translate({
        text: "unlisted phrase",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "selection",
      }),
    ).resolves.toEqual({
      translatedText: "[local-dev en] unlisted phrase",
      provider: "local-dev",
    });
  });
});
