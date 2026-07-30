import { describe, expect, it } from "vitest";
import { appointmentLesson, availabilityLesson, brokenThingLesson, bringLesson, cardPaymentLesson, cafeOrderLesson, delayedTrainLesson, hebbenLesson, introductionLesson, inversionLesson, lessonCatalog, regularLesson, repetitionLesson, symptomsLesson, transferLesson, validateLessonCatalog } from "./catalog";

describe("lesson catalog", () => {
  it("requires the A0 tracer to declare outcome coverage, transfer, and review metadata", () => {
    expect(introductionLesson.practiceEnvelope).toMatchObject({
      contentVersion: 1,
      outcome: { primary: "Introduce yourself and say where you live." },
      support: "guided",
      coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
      transfer: { primitive: "choose-meaning", candidateId: "ik-ben", accepted: ["ik ben"] },
    });
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons[0].practiceEnvelope!.transfer.feedback = "";
    expect(validateLessonCatalog(invalid)).toContain("a0-hallo-ik-ben.practiceEnvelope.transfer: expected reviewed transfer task");

    const unsafe = structuredClone(lessonCatalog);
    unsafe.lessons[0].practiceEnvelope!.transfer.distractors[0].misconception = "";
    expect(validateLessonCatalog(unsafe)).toContain("a0-hallo-ik-ben.practiceEnvelope.transfer: expected reviewed transfer task");
  });

  it("backfills the remaining A0 lessons with behavior-complete envelopes", () => {
    const remainingA0 = [hebbenLesson, regularLesson, inversionLesson];

    expect(remainingA0.every((lesson) => lesson.practiceEnvelope)).toBe(true);
    expect(remainingA0.map((lesson) => lesson.practiceEnvelope?.coverage)).toEqual([
      { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
      { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
      { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    ]);
    expect(remainingA0.every((lesson) => lesson.practiceEnvelope?.support === "guided")).toBe(true);
    expect(remainingA0.map((lesson) => lesson.practiceEnvelope?.transfer.candidateId)).toEqual(["ik-heb-dit-nodig", "ik-woon-hier", "woon-je-hier"]);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === inversionLesson.id)!.practiceEnvelope!.transfer.accepted = ["unknown-answer"];
    expect(validateLessonCatalog(invalid)).toContain("a0-woon-je-hier.practiceEnvelope.transfer: expected reviewed transfer task");
  });

  it("backfills the A1 conversation and cafe lessons with reduced-support transfer", () => {
    const a1Lessons = [repetitionLesson, cafeOrderLesson, cardPaymentLesson];

    expect(a1Lessons.every((lesson) => lesson.practiceEnvelope?.support === "reduced")).toBe(true);
    expect(a1Lessons.map((lesson) => lesson.practiceEnvelope?.transfer.candidateId)).toEqual(["kunt-u-dat-herhalen", "ik-wil-graag", "met-pin-betalen"]);
    expect(a1Lessons.every((lesson) => lesson.practice.some((prompt) => prompt.dimension === "recall"))).toBe(true);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === cafeOrderLesson.id)!.practiceEnvelope!.support = "guided";
    expect(validateLessonCatalog(invalid)).toContain("a1-ik-wil-graag-bestellen.practiceEnvelope.support: expected reduced support or supported version");
  });

  it("backfills the A1 transport lessons with reviewed reduced-support transfer", () => {
    const transportLessons = [transferLesson, delayedTrainLesson];

    expect(transportLessons.every((lesson) => lesson.practiceEnvelope?.support === "reduced")).toBe(true);
    expect(transportLessons.map((lesson) => lesson.practiceEnvelope?.transfer.candidateId)).toEqual(["waar-moet-ik-overstappen", "mijn-trein-is-vertraagd"]);
    expect(transportLessons.every((lesson) => lesson.practiceEnvelope?.coverage.safeApplication)).toBe(true);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === delayedTrainLesson.id)!.practiceEnvelope!.transfer.accepted = ["unknown-answer"];
    expect(validateLessonCatalog(invalid)).toContain("a1-mijn-trein-is-vertraagd.practiceEnvelope.transfer: expected reviewed transfer task");
  });

  it("backfills appointment and healthcare lessons without replacing the appointment contrast companion", () => {
    const healthcareLessons = [appointmentLesson, symptomsLesson];

    expect(healthcareLessons.every((lesson) => lesson.practiceEnvelope?.support === "reduced")).toBe(true);
    expect(healthcareLessons.map((lesson) => lesson.practiceEnvelope?.transfer.candidateId)).toEqual(["ik-wil-graag", "ik-heb-last-van"]);
    expect(appointmentLesson.contrastCompanion).toEqual({ id: "contrast.main_clause_inversion", contentVersion: 1 });
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === symptomsLesson.id)!.practiceEnvelope!.transfer.distractors[0].misconception = "";
    expect(validateLessonCatalog(invalid)).toContain("a1-ik-heb-last-van.practiceEnvelope.transfer: expected reviewed transfer task");
  });

  it("backfills the A1 home, work, and study lessons with reduced-support transfer", () => {
    const everydayLessons = [brokenThingLesson, availabilityLesson, bringLesson];

    expect(everydayLessons.every((lesson) => lesson.practiceEnvelope?.support === "reduced")).toBe(true);
    expect(everydayLessons.map((lesson) => lesson.practiceEnvelope?.transfer.candidateId)).toEqual(["er-is-iets-kapot", "ik-ben-beschikbaar", "wat-moet-ik-meenemen"]);
    expect(everydayLessons.every((lesson) => lesson.practice.some((prompt) => prompt.dimension === "recall"))).toBe(true);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);

    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === bringLesson.id)!.practiceEnvelope!.transfer.choices = ["wat moet ik meenemen"];
    expect(validateLessonCatalog(invalid)).toContain("a1-wat-moet-ik-meenemen.practiceEnvelope.transfer: expected reviewed transfer task");
  });

  it("validates the reviewed appointment micro-story", () => {
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(appointmentLesson.title).toBe("A1 · Een afspraak maken");
  });

  it("validates the real reviewed starter lessons in their published order without a duplicate appointment fixture", () => {
    const starterLessons = lessonCatalog.lessons;

    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(starterLessons.map((lesson) => lesson.title)).toEqual([
      "A0 · Hallo, ik ben…",
      "A0 · Ik heb dit nodig",
      "A0 · Ik woon en werk hier",
      "A0 · Woon je hier?",
      "A1 · Kunt u dat herhalen?",
      "A1 · Ik wil graag bestellen",
      "A1 · Kan ik met pin betalen?",
      "A1 · Waar moet ik overstappen?",
      "A1 · Mijn trein is vertraagd",
      "A1 · Een afspraak maken",
      "A1 · Ik heb last van…",
      "A1 · Er is iets kapot",
      "A1 · Ik ben beschikbaar op…",
      "A1 · Wat moet ik meenemen?",
      "A2 · Wat staat er in deze brief?",
    ]);
    expect(starterLessons.filter((lesson) => lesson.id === appointmentLesson.id)).toHaveLength(1);
    expect(starterLessons.filter((lesson) => lesson.order >= 9).map((lesson) => [lesson.id, lesson.lines.filter((line) => line.dutch.toLocaleLowerCase().includes(lesson.patternText.toLocaleLowerCase())).length])).toEqual([
      ["a1-er-is-iets-kapot", 2], ["a1-ik-ben-beschikbaar-op", 2], ["a1-wat-moet-ik-meenemen", 3], ["a2-wat-staat-er-in-deze-brief", 2],
    ]);
    expect(starterLessons.every((lesson) => lesson.lines.every((line) => line.dutch && line.english && line.telugu))).toBe(true);
    expect(starterLessons.every((lesson) => lesson.candidates.length >= 3 && lesson.candidates.length <= 5)).toBe(true);
    expect(starterLessons.every((lesson) => lesson.review.dutch && lesson.review.english && lesson.review.telugu && lesson.review.cefr && lesson.review.cultural && lesson.review.practicalUse)).toBe(true);
    expect(appointmentLesson).toMatchObject({ contentVersion: 2, candidates: [
      { id: "ik-wil-graag" }, { id: "afspraak" }, { id: "afspraak-maken" }, { id: "als-het-kan" },
    ] });
    expect(appointmentLesson).toMatchObject({ contrastCompanion: { id: "contrast.main_clause_inversion", contentVersion: 1 } });
    expect(hebbenLesson).toMatchObject({ id: "a0-ik-heb-dit-nodig", contentVersion: 1, grammarCompanion: { patternId: "a0-hebben-present" } });
    expect(regularLesson).toMatchObject({ id: "a0-ik-woon-en-werk-hier", contentVersion: 1, grammarCompanion: { patternId: "a0-regular-present" } });
    expect(inversionLesson).toMatchObject({ id: "a0-woon-je-hier", contentVersion: 1, grammarCompanion: { patternId: "a0-yes-no-inversion" } });
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

  it("reports every malformed metadata field with the lesson identifier", () => {
    const invalid = structuredClone(lessonCatalog);
    invalid.version = 2 as never;
    const appointment = invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!;
    appointment.id = "not a stable id";
    appointment.contentVersion = 0;
    appointment.pathway = "";
    appointment.order = 0;
    appointment.cefr = "B1" as never;
    appointment.title = "Appointment";
    appointment.durationMinutes = 2;

    expect(validateLessonCatalog(invalid)).toEqual(expect.arrayContaining([
      "catalog.version: unsupported version",
      "not a stable id.id: expected unique stable kebab-case identifier",
      "not a stable id.contentVersion: expected positive content version",
      "not a stable id.pathway: expected pathway with unique order",
      "not a stable id.order: expected positive order",
      "not a stable id.cefr: expected A0, A1, or A2 CEFR level",
      "not a stable id.title: expected CEFR-prefixed title",
      "not a stable id.durationMinutes: expected 3 to 5 minutes",
    ]));
  });

  it("reports every malformed story, candidate, practice, and review field", () => {
    const invalid = structuredClone(lessonCatalog);
    const appointment = invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!;
    appointment.lines = appointment.lines.slice(0, 3);
    appointment.lines[0].english = "";
    appointment.patternText = "missing pattern";
    appointment.candidates = appointment.candidates.slice(0, 2);
    appointment.practice = [{ candidateId: "missing", dimension: "recognition" }];
    appointment.review.english = false as never;

    expect(validateLessonCatalog(invalid)).toEqual(expect.arrayContaining([
      "a1-een-afspraak-maken.lines: expected 4 to 6 lines",
      "a1-een-afspraak-maken.lines: expected 35 to 60 Dutch words",
      "a1-een-afspraak-maken.lineHelp: expected Dutch, English, and Telugu for every line",
      "a1-een-afspraak-maken.pattern: expected one story-grounded explained practical pattern",
      "a1-een-afspraak-maken.candidates: expected 3 to 5 candidates",
      "a1-een-afspraak-maken.practice: expected prompts for lesson candidates",
      "a1-een-afspraak-maken.review: expected recorded Dutch, English, Telugu, CEFR, cultural, and practical-use review",
    ]));
  });

  it("rejects duplicate pathway positions and malformed candidate identities", () => {
    const invalid = structuredClone(lessonCatalog);
    const appointment = invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!;
    appointment.pathway = "first-conversations";
    appointment.order = 1;
    appointment.candidates[0].id = "not a candidate id";

    expect(validateLessonCatalog(invalid)).toEqual(expect.arrayContaining([
      "a1-een-afspraak-maken.pathway: expected pathway with unique order",
      "a1-een-afspraak-maken.candidates: expected unique trilingual candidates",
    ]));
  });

  it("rejects duplicate published lesson identities", () => {
    const invalid = structuredClone(lessonCatalog);
    invalid.lessons.find((lesson) => lesson.id === "a1-waar-moet-ik-overstappen")!.id = appointmentLesson.id;

    expect(validateLessonCatalog(invalid)).toContain("a1-een-afspraak-maken.id: expected unique stable kebab-case identifier");
  });

  it.each([
    ["duplicate candidate IDs", (lesson: typeof appointmentLesson) => { lesson.candidates[1].id = lesson.candidates[0].id; }, "candidates: expected unique trilingual candidates"],
    ["missing candidate helper text", (lesson: typeof appointmentLesson) => { lesson.candidates[0].telugu = ""; }, "candidates: expected unique trilingual candidates"],
    ["unsupported candidate kinds", (lesson: typeof appointmentLesson) => { lesson.candidates[0].kind = "phrase" as never; }, "candidates: expected unique trilingual candidates"],
    ["unsupported practice dimensions", (lesson: typeof appointmentLesson) => { lesson.practice[0].dimension = "typing" as never; }, "practice: expected prompts for lesson candidates"],
  ])("rejects %s", (_label, mutate, expectedError) => {
    const invalid = structuredClone(lessonCatalog);
    const appointment = invalid.lessons.find((lesson) => lesson.id === appointmentLesson.id)!;
    mutate(appointment);

    expect(validateLessonCatalog(invalid)).toContain(`a1-een-afspraak-maken.${expectedError}`);
  });
});
