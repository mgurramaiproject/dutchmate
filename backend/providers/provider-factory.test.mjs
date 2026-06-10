import { describe, expect, it } from "vitest";
import {
  DEFAULT_TRANSLATION_PROVIDER,
  createProvider,
  createProviderFromEnvironment,
} from "./provider-factory.mjs";

describe("createProviderFromEnvironment", () => {
  it("uses local-dev by default", () => {
    expect(createProviderFromEnvironment({}).name).toBe(DEFAULT_TRANSLATION_PROVIDER);
  });

  it("uses TRANSLATION_PROVIDER when configured", () => {
    expect(createProviderFromEnvironment({ TRANSLATION_PROVIDER: "local-dev" }).name).toBe(
      "local-dev",
    );
  });
});

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
