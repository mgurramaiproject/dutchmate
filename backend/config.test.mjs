import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./config.mjs";

describe("readBackendConfig", () => {
  it("returns local defaults", () => {
    expect(readBackendConfig({})).toEqual({
      provider: "local-dev",
      host: "127.0.0.1",
      port: 8787,
    });
  });

  it("normalizes configured values", () => {
    expect(
      readBackendConfig({
        TRANSLATION_PROVIDER: " LOCAL-DEV ",
        HOST: " 0.0.0.0 ",
        PORT: "3000",
      }),
    ).toEqual({
      provider: "local-dev",
      host: "0.0.0.0",
      port: 3000,
    });
  });

  it("rejects empty providers", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: " " })).toThrow(
      "TRANSLATION_PROVIDER must not be empty",
    );
  });

  it("rejects unsupported providers", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "deepl" })).toThrow(
      'Unsupported TRANSLATION_PROVIDER "deepl". Supported providers: local-dev',
    );
  });

  it("rejects empty hosts", () => {
    expect(() => readBackendConfig({ HOST: " " })).toThrow("HOST must not be empty");
  });

  it("rejects invalid ports", () => {
    expect(() => readBackendConfig({ PORT: "0" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
    expect(() => readBackendConfig({ PORT: "65536" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
    expect(() => readBackendConfig({ PORT: "8787abc" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
  });
});
