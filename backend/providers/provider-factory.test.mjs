import { describe, expect, it } from "vitest";
import { createProvider } from "./provider-factory.mjs";

describe("createProvider", () => {
  it("normalizes provider names", () => {
    expect(createProvider(" LOCAL-DEV ").name).toBe("local-dev");
  });

  it("rejects unsupported providers", () => {
    expect(() => createProvider("deepl")).toThrow(
      'Unsupported TRANSLATION_PROVIDER "deepl". Supported providers: local-dev',
    );
  });
});
