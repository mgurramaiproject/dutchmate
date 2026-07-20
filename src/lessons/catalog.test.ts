import { describe, expect, it } from "vitest";
import { appointmentLesson, lessonCatalog, validateLessonCatalog } from "./catalog";

describe("lesson catalog", () => {
  it("validates the reviewed appointment micro-story", () => {
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(appointmentLesson.title).toBe("A1 · Een afspraak maken");
  });

  it("reports stable lesson identifiers and fields for structural violations", () => {
    const invalid = structuredClone(lessonCatalog);
    invalid.lessons[0].lines = invalid.lessons[0].lines.slice(0, 3);
    invalid.lessons[0].candidates = invalid.lessons[0].candidates.slice(0, 2);

    expect(validateLessonCatalog(invalid)).toEqual(expect.arrayContaining([
      "a1-een-afspraak-maken.lines: expected 4 to 6 lines",
      "a1-een-afspraak-maken.candidates: expected 3 to 5 candidates",
    ]));
  });

  it("requires an explicit positive version for each lesson's content", () => {
    const invalid = structuredClone(lessonCatalog);
    invalid.lessons[0].contentVersion = 0;
    expect(validateLessonCatalog(invalid)).toContain("a1-een-afspraak-maken.contentVersion: expected positive content version");
  });
});
