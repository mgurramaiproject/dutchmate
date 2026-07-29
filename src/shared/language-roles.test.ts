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

  it("keeps the fixed helper roles when an old dropdown value is submitted", () => {
    expect(
      applyLanguageRoleSelection(DEFAULT_LANGUAGE_ROLES, "nativeLanguage", "en"),
    ).toEqual(DEFAULT_LANGUAGE_ROLES);
  });

  it("limits learning to Dutch and helper roles to English or Telugu", () => {
    expect(getLanguageOptions("learningLanguage")).toEqual(["nl"]);
    expect(getLanguageOptions("nativeLanguage")).toEqual(["te"]);
    expect(getLanguageOptions("bridgeLanguage")).toEqual(["en"]);
    expect(normalizeLanguageRoles({
      learningLanguage: "en",
      nativeLanguage: "nl",
      bridgeLanguage: "nl",
    })).toEqual(DEFAULT_LANGUAGE_ROLES);
  });

  it("migrates old helper-role choices to Telugu native and English bridge", () => {
    expect(normalizeLanguageRoles({ nativeLanguage: "en", bridgeLanguage: "te" })).toEqual(
      DEFAULT_LANGUAGE_ROLES,
    );
  });
});
