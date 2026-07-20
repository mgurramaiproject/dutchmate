import { describe, expect, it } from "vitest";
import { appointmentLesson, lessonCatalog, validateLessonCatalog } from "./catalog";

describe("lesson catalog", () => {
  it("validates the reviewed appointment micro-story", () => {
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(appointmentLesson.title).toBe("A1 · Een afspraak maken");
  });

  it("validates the real reviewed starter lessons in their published order", () => {
    const starterLessons = lessonCatalog.lessons.filter((lesson) => lesson.order <= 4);

    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(starterLessons.map((lesson) => lesson.title)).toEqual([
      "A0 · Hallo, ik ben…",
      "A1 · Kunt u dat herhalen?",
      "A1 · Ik wil graag bestellen",
      "A1 · Kan ik met pin betalen?",
    ]);
    expect(starterLessons.every((lesson) => lesson.lines.filter((line) => line.dutch.toLocaleLowerCase().includes(lesson.patternText.toLocaleLowerCase())).length >= 2)).toBe(true);
    expect(starterLessons.every((lesson) => lesson.lines.every((line) => line.dutch && line.english && line.telugu))).toBe(true);
    expect(starterLessons.every((lesson) => lesson.candidates.every((candidate) => lesson.lines.some((line) => line.dutch.toLocaleLowerCase().includes(candidate.dutch.toLocaleLowerCase()))))).toBe(true);
    expect(starterLessons.every((lesson) => lesson.review.dutch && lesson.review.english && lesson.review.telugu && lesson.review.cefr && lesson.review.cultural && lesson.review.practicalUse)).toBe(true);
  });

  it("reports stable lesson identifiers and fields for structural violations", () => {
    const invalid = structuredClone(lessonCatalog);
    const appointment = invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!;
    appointment.lines = appointment.lines.slice(0, 3);
    appointment.candidates = appointment.candidates.slice(0, 2);

    expect(validateLessonCatalog(invalid)).toEqual(expect.arrayContaining([
      "a1-een-afspraak-maken.lines: expected 4 to 6 lines",
      "a1-een-afspraak-maken.candidates: expected 3 to 5 candidates",
    ]));
  });

  it("requires an explicit positive version for each lesson's content", () => {
    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!.contentVersion = 0;
    expect(validateLessonCatalog(invalid)).toContain("a1-een-afspraak-maken.contentVersion: expected positive content version");
  });
});
