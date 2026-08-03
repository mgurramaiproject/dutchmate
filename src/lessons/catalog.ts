import { contentCatalog } from "../content-catalog";

export const LESSON_CATALOG_VERSION = 1;

export type GrammarPatternId = "a0-zijn-present" | "a0-hebben-present" | "a0-regular-present" | "a0-yes-no-inversion";
export type LessonLine = { dutch: string; english: string; telugu: string };
export type LessonCandidate = { id: string; dutch: string; english: string; telugu: string; kind: "word" | "chunk" };
export type LessonPracticePrompt = { candidateId: string; dimension: "recognition" | "recall" };
export type LessonPracticeSupport = "guided" | "reduced";
export type LessonPracticeReviewMetadata = { author: string; reviewState: "self-reviewed" | "second-review-complete"; reviewer: string; reviewedAt: string; sources: string[]; provenance: string };
export type LessonPracticeCoverage = { understand: true; guidedAction: true; reducedSupportRetrieval: true; safeApplication: true };
export type LessonPracticeAccessibility = { keyboard: true; focus: true; feedbackAnnouncement: true; narrowPopup: true };
export type LessonPracticeMigration = { policy: "compatible-additive"; historyKey: "lesson-id-and-content-version" };
export type LessonPracticeExercisePrimitive = "contrast-form" | "repair-choice" | "order-tokens";
export type LessonPracticeExercise = {
  contentVersion: 1;
  id: string;
  primitive: LessonPracticeExercisePrimitive;
  candidateId: string;
  dimension: "recognition" | "recall";
  prompt: string;
  context: string;
  choices: string[];
  tokens?: string[];
  accepted: string[];
  distractors: Array<{ answer: string; misconception: string }>;
  feedback: string;
  review: LessonPracticeReviewMetadata;
};
export type LessonPracticeEnvelope = {
  contentVersion: 1;
  support: LessonPracticeSupport;
  outcome: { primary: string; supporting: string[] };
  coverage: LessonPracticeCoverage;
  accessibility: LessonPracticeAccessibility;
  migration: LessonPracticeMigration;
  transfer: { id: string; primitive: "choose-meaning"; candidateId: string; prompt: string; context: string; choices: string[]; accepted: string[]; distractors: Array<{ answer: string; misconception: string }>; feedback: string };
  review: LessonPracticeReviewMetadata;
};
export type GrammarCompanion = { id: GrammarPatternId; contentVersion: 1; patternId: GrammarPatternId };
export type ContrastCompanion = { id: "contrast.main_clause_inversion"; contentVersion: 1 };
export type Lesson = {
  id: string; contentVersion: number; pathway: string; order: number; cefr: "A0" | "A1" | "A2"; title: string; durationMinutes: number;
  pattern: string; patternText: string; patternExplanation: string; lines: LessonLine[];
  candidates: LessonCandidate[]; practice: LessonPracticePrompt[]; practiceExercises: LessonPracticeExercise[]; practiceEnvelope?: LessonPracticeEnvelope; grammarCompanion?: GrammarCompanion; contrastCompanion?: ContrastCompanion;
  review: { dutch: true; english: true; telugu: true; cefr: true; cultural: true; practicalUse: true };
};
export type LessonCatalog = { version: typeof LESSON_CATALOG_VERSION; lessons: Lesson[] };

function getCatalogLesson(id: string): Lesson {
  const lesson = contentCatalog.getLesson(id);
  if (!lesson) throw new Error(`Content catalog is missing lesson package: ${id}`);
  return lesson;
}

export const introductionLesson = getCatalogLesson("a0-hallo-ik-ben");
export const hebbenLesson = getCatalogLesson("a0-ik-heb-dit-nodig");
export const regularLesson = getCatalogLesson("a0-ik-woon-en-werk-hier");
export const inversionLesson = getCatalogLesson("a0-woon-je-hier");
export const repetitionLesson = getCatalogLesson("a1-kunt-u-dat-herhalen");
export const cafeOrderLesson = getCatalogLesson("a1-ik-wil-graag-bestellen");
export const cardPaymentLesson = getCatalogLesson("a1-kan-ik-met-pin-betalen");
export const transferLesson = getCatalogLesson("a1-waar-moet-ik-overstappen");
export const delayedTrainLesson = getCatalogLesson("a1-mijn-trein-is-vertraagd");
export const appointmentLesson = getCatalogLesson("a1-een-afspraak-maken");
export const symptomsLesson = getCatalogLesson("a1-ik-heb-last-van");
export const brokenThingLesson = getCatalogLesson("a1-er-is-iets-kapot");
export const availabilityLesson = getCatalogLesson("a1-ik-ben-beschikbaar-op");
export const bringLesson = getCatalogLesson("a1-wat-moet-ik-meenemen");
export const letterLesson = getCatalogLesson("a2-wat-staat-er-in-deze-brief");

export const lessonCatalog: LessonCatalog = {
  version: LESSON_CATALOG_VERSION,
  lessons: [introductionLesson, hebbenLesson, regularLesson, inversionLesson, repetitionLesson, cafeOrderLesson, cardPaymentLesson, transferLesson, delayedTrainLesson, appointmentLesson, symptomsLesson, brokenThingLesson, availabilityLesson, bringLesson, letterLesson],
};

export function validateLessonCatalog(catalog: LessonCatalog): string[] {
  const errors: string[] = [];
  if (catalog.version !== LESSON_CATALOG_VERSION) errors.push("catalog.version: unsupported version");
  const ids = new Set<string>(); const pathwayOrders = new Set<string>();
  for (const lesson of catalog.lessons) {
    const field = (name: string, valid: boolean, message: string) => { if (!valid) errors.push(`${lesson.id}.${name}: ${message}`); };
    field("id", /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id) && !ids.has(lesson.id), "expected unique stable kebab-case identifier"); ids.add(lesson.id);
    field("contentVersion", Number.isInteger(lesson.contentVersion) && lesson.contentVersion > 0, "expected positive content version");
    const pathwayOrder = `${lesson.pathway}\u001f${lesson.order}`;
    field("pathway", lesson.pathway.length > 0 && !pathwayOrders.has(pathwayOrder), "expected pathway with unique order"); pathwayOrders.add(pathwayOrder); field("order", Number.isInteger(lesson.order) && lesson.order > 0, "expected positive order");
    field("cefr", lesson.cefr === "A0" || lesson.cefr === "A1" || lesson.cefr === "A2", "expected A0, A1, or A2 CEFR level"); field("title", lesson.title.startsWith(`${lesson.cefr} · `), "expected CEFR-prefixed title"); field("durationMinutes", lesson.durationMinutes >= 3 && lesson.durationMinutes <= 5, "expected 3 to 5 minutes");
    field("lines", lesson.lines.length >= 4 && lesson.lines.length <= 6, "expected 4 to 6 lines");
    const words = lesson.lines.flatMap((line) => line.dutch.trim().split(/\s+/)).length;
    field("lines", words >= 35 && words <= 60, "expected 35 to 60 Dutch words");
    field("lineHelp", lesson.lines.every((line) => line.dutch && line.english && line.telugu), "expected Dutch, English, and Telugu for every line");
    field("pattern", lesson.pattern.length > 0 && lesson.patternText.length > 0 && lesson.patternExplanation.length > 0 && lesson.lines.some((line) => line.dutch.includes(lesson.patternText)), "expected one story-grounded explained practical pattern");
    field("contrastCompanion", lesson.contrastCompanion === undefined || (lesson.contrastCompanion.id === "contrast.main_clause_inversion" && lesson.contrastCompanion.contentVersion === 1), "expected supported contrast companion");
    field("candidates", lesson.candidates.length >= 3 && lesson.candidates.length <= 5, "expected 3 to 5 candidates");
    field("candidates", new Set(lesson.candidates.map((candidate) => candidate.id)).size === lesson.candidates.length && lesson.candidates.every((candidate) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.id) && candidate.dutch && candidate.english && candidate.telugu && (candidate.kind === "word" || candidate.kind === "chunk")), "expected unique trilingual candidates");
    field("practice", lesson.practice.length > 0 && lesson.practice.every((prompt) => lesson.candidates.some((candidate) => candidate.id === prompt.candidateId) && (prompt.dimension === "recognition" || prompt.dimension === "recall")), "expected prompts for lesson candidates");
    field("review", Object.values(lesson.review).every(Boolean), "expected recorded Dutch, English, Telugu, CEFR, cultural, and practical-use review");
    if (!lesson.practiceEnvelope) errors.push(`${lesson.id}.practiceEnvelope: required reviewed release envelope`);
    else {
      const { accessibility, migration } = lesson.practiceEnvelope;
      if (!(accessibility?.keyboard && accessibility.focus && accessibility.feedbackAnnouncement && accessibility.narrowPopup)
        || migration?.policy !== "compatible-additive" || migration.historyKey !== "lesson-id-and-content-version") errors.push(`${lesson.id}.practiceEnvelope: expected accessibility and migration declarations`);
      for (const error of validateLessonPracticeEnvelope(lesson.practiceEnvelope, lesson.candidates, lesson.cefr)) errors.push(`${lesson.id}.practiceEnvelope.${error}`);
    }
    if (validateLessonPracticeExercises(lesson.practiceExercises, lesson.candidates).length > 0) errors.push(`${lesson.id}.practiceExercises: expected three reviewed additional exercise types`);
  }
  return errors;
}

export function validateLessonPracticeExercises(exercises: LessonPracticeExercise[], candidates: LessonCandidate[]): string[] {
  const errors: string[] = [];
  const candidateIds = new Set(candidates.map((candidate) => candidate.id));
  const ids = new Set<string>();
  const primitives = new Set(exercises.map((exercise) => exercise.primitive));
  const requiredPrimitives: LessonPracticeExercisePrimitive[] = ["contrast-form", "repair-choice", "order-tokens"];
  if (exercises.length !== 3 || primitives.size !== 3 || !requiredPrimitives.every((primitive) => primitives.has(primitive))) errors.push("expected exactly one exercise for each supported primitive");
  for (const exercise of exercises) {
    const choices = new Set(exercise.choices);
    const distractors = new Set(exercise.distractors.map((distractor) => distractor.answer));
    const review = exercise.review;
    const validReview = Boolean(review?.author && review.reviewer && /^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) && review.sources.length > 0 && review.provenance && review.reviewState === "second-review-complete");
    const valid = exercise.contentVersion === 1
      && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(exercise.id) && !ids.has(exercise.id)
      && (exercise.primitive === "contrast-form" || exercise.primitive === "repair-choice" || exercise.primitive === "order-tokens")
      && candidateIds.has(exercise.candidateId) && (exercise.dimension === "recognition" || exercise.dimension === "recall")
      && Boolean(exercise.prompt && exercise.context && exercise.feedback)
      && exercise.choices.length > 0 && choices.size === exercise.choices.length
      && exercise.accepted.length > 0 && exercise.accepted.every((answer) => choices.has(answer))
      && distractors.size === exercise.distractors.length && exercise.distractors.every((distractor) => choices.has(distractor.answer) && !exercise.accepted.includes(distractor.answer) && distractor.misconception)
      && (exercise.primitive === "order-tokens" ? Boolean(exercise.tokens && exercise.tokens.length > 1 && new Set(exercise.tokens).size === exercise.tokens.length && exercise.tokens.join(" ") === exercise.accepted[0]) : exercise.tokens === undefined)
      && validReview;
    if (!valid) errors.push(`${exercise.id}: incomplete or unsafe reviewed exercise`);
    ids.add(exercise.id);
  }
  return errors;
}

export function validateLessonPracticeEnvelope(envelope: LessonPracticeEnvelope, candidates: LessonCandidate[], cefr: Lesson["cefr"] = "A0"): string[] {
  const errors: string[] = [];
  if (envelope.contentVersion !== 1) errors.push("contentVersion: expected supported content version");
  if ((cefr === "A0" && envelope.support !== "guided") || (cefr !== "A0" && envelope.support !== "reduced")) errors.push("support: expected reduced support or supported version");
  if (!envelope.outcome.primary || envelope.outcome.supporting.some((outcome) => !outcome)) errors.push("outcome: expected practical primary and supporting outcomes");
  if (!Object.values(envelope.coverage).every(Boolean)) errors.push("coverage: expected complete behavior coverage");
  const transfer = envelope.transfer;
  const candidateIds = new Set(candidates.map((candidate) => candidate.id));
  const choices = new Set(transfer.choices);
  const distractorAnswers = transfer.distractors.map((distractor) => distractor.answer);
  const distractors = new Set(distractorAnswers);
  const validReview = Boolean(envelope.review.author && envelope.review.reviewer && envelope.review.reviewedAt && envelope.review.sources.length > 0 && envelope.review.provenance && (envelope.review.reviewState === "self-reviewed" || envelope.review.reviewState === "second-review-complete"));
  const validTransfer = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(transfer.id)
    && transfer.primitive === "choose-meaning"
    && candidateIds.has(transfer.candidateId)
    && Boolean(transfer.prompt && transfer.context && transfer.feedback)
    && transfer.choices.length >= 2
    && choices.size === transfer.choices.length
    && transfer.accepted.length > 0
    && transfer.accepted.every((answer) => choices.has(answer))
    && distractorAnswers.length === distractors.size
    && distractorAnswers.every((answer) => choices.has(answer) && !transfer.accepted.includes(answer))
    && choices.size === transfer.accepted.length + distractors.size
    && transfer.distractors.every((distractor) => Boolean(distractor.misconception));
  if (!validTransfer || !validReview) errors.push("transfer: expected reviewed transfer task");
  return errors;
}
