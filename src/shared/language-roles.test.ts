import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE_ROLES,
  applyLanguageRoleSelection,
  getLanguageOptions,
  normalizeLanguageRoles,
} from "./language-roles";

describe("language roles", () => {
  it("fills missing language roles with the current defaults", () => {
    expect(normalizeLanguageRoles(undefined)).toEqual(DEFAULT_LANGUAGE_ROLES);
  });

  it("repairs duplicate stored language roles", () => {
    expect(
      normalizeLanguageRoles({
        learningLanguage: "nl",
        nativeLanguage: "nl",
        bridgeLanguage: "en",
      }),
    ).toEqual({
      learningLanguage: "nl",
      nativeLanguage: "te",
      bridgeLanguage: "en",
    });
  });

  it("keeps all three language roles distinct when one dropdown changes", () => {
    expect(
      applyLanguageRoleSelection(DEFAULT_LANGUAGE_ROLES, "nativeLanguage", "en"),
    ).toEqual({
      learningLanguage: "nl",
      nativeLanguage: "en",
      bridgeLanguage: "te",
    });
  });

  it("limits learning to Dutch and helper roles to English or Telugu", () => {
    expect(getLanguageOptions("learningLanguage")).toEqual(["nl"]);
    expect(getLanguageOptions("nativeLanguage")).toEqual(["en", "te"]);
    expect(getLanguageOptions("bridgeLanguage")).toEqual(["en", "te"]);
    expect(normalizeLanguageRoles({
      learningLanguage: "en",
      nativeLanguage: "nl",
      bridgeLanguage: "nl",
    })).toEqual(DEFAULT_LANGUAGE_ROLES);
  });
});
