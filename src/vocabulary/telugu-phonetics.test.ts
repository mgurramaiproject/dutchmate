import { describe, expect, it } from "vitest";
import { getSimpleTeluguPhonetics } from "./telugu-phonetics";

describe("simple Telugu phonetics", () => {
  it("transliterates Telugu locally with plain letters and syllable breaks", () => {
    expect(getSimpleTeluguPhonetics("శుభోదయం")).toBe("shu-bho-da-yam");
    expect(getSimpleTeluguPhonetics("ఇల్లు ఉంది")).toBe("il-lu um-di");
    expect(getSimpleTeluguPhonetics("నమస్కారం")).toBe("na-mas-kaa-ram");
  });

  it("does not fabricate a helper for missing or non-Telugu text", () => {
    expect(getSimpleTeluguPhonetics(null)).toBeNull();
    expect(getSimpleTeluguPhonetics("house")).toBeNull();
  });
});
