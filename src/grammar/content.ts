import { lessonCatalog, validateLessonCatalog, type GrammarPatternId, type LessonCatalog } from "../lessons/catalog";
import { contentCatalog } from "../content-catalog";

export type GrammarPrimitive = "choose-form" | "contrast-form" | "change-subject" | "order-tokens" | "repair-choice";
export type Misconception = "wrong-person" | "wrong-irregular-form" | "invalid-order";

export type GrammarExercise = {
  id: string;
  patternId: GrammarPatternId;
  primitive: GrammarPrimitive;
  prompt: string;
  context: string;
  contextTag: string;
  choices: string[];
  tokens?: string[];
  accepted: string[];
  distractors: Array<{ value: string; misconception: Misconception; feedback: string }>;
  feedback: string;
  evidenceEligible: true;
  review: GrammarReviewMetadata;
};

export type GrammarReviewMetadata = {
  author: string;
  reviewState: "self-reviewed" | "second-review-complete";
  reviewer: string;
  reviewedAt: string;
  sources: string[];
  provenance: string;
};

export type GrammarPattern = {
  id: GrammarPatternId;
  contentVersion: 1;
  level: "A0";
  capability: string;
  prerequisites: string[];
  forms: Array<{ subject: string; forms: string[] }>;
  exercises: GrammarExercise[];
  encounterForms: Array<{ subject: string; form: string; text?: string }>;
  companionLessonId: string;
  review: GrammarReviewMetadata;
};

export const GRAMMAR_PATTERN_IDS: readonly GrammarPatternId[] = ["a0-zijn-present", "a0-hebben-present", "a0-regular-present", "a0-yes-no-inversion"];

function getCatalogGrammarPattern(patternId: GrammarPatternId): GrammarPattern {
  const pattern = contentCatalog.getGrammarPattern(patternId);
  if (!pattern) throw new Error(`Content catalog is missing grammar package: ${patternId}`);
  return pattern;
}

export const zijnPattern = getCatalogGrammarPattern("a0-zijn-present");
export const hebbenPattern = getCatalogGrammarPattern("a0-hebben-present");
export const regularPattern = getCatalogGrammarPattern("a0-regular-present");
export const inversionPattern = getCatalogGrammarPattern("a0-yes-no-inversion");
export const grammarPatterns: GrammarPattern[] = [zijnPattern, hebbenPattern, regularPattern, inversionPattern];

export function getGrammarPattern(patternId: GrammarPatternId): GrammarPattern | undefined { return grammarPatterns.find((pattern) => pattern.id === patternId); }

export function validateGrammarPattern(pattern: GrammarPattern): string[] {
  const errors: string[] = [];
  const stable = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value);
  if (!stable(pattern.id)) errors.push(`${pattern.id}.id: expected stable kebab-case identifier`);
  if (!GRAMMAR_PATTERN_IDS.includes(pattern.id)) errors.push(`${pattern.id}.id: expected one of the four shipped A0 pattern IDs`);
  if (!Number.isInteger(pattern.contentVersion) || pattern.contentVersion < 1) errors.push(`${pattern.id}.contentVersion: expected positive content version`);
  if (pattern.level !== "A0") errors.push(`${pattern.id}.level: expected A0`);
  if (!pattern.capability.trim()) errors.push(`${pattern.id}.capability: expected practical capability`);
  if (!stable(pattern.companionLessonId)) errors.push(`${pattern.id}.companionLessonId: incompatible lesson link`);
  if (!pattern.forms.length || pattern.forms.some((entry) => !entry.subject.trim() || entry.forms.length === 0 || entry.forms.some((form) => !form.trim()))) errors.push(`${pattern.id}.forms: incomplete reviewed forms`);
  errors.push(...validateReviewMetadata(pattern.review, `${pattern.id}.review`));
  const ids = new Set<string>();
  for (const exercise of pattern.exercises) {
    if (!stable(exercise.id)) errors.push(`${exercise.id}.id: expected stable kebab-case identifier`);
    if (ids.has(exercise.id)) errors.push(`duplicate exercise: ${exercise.id}`);
    ids.add(exercise.id);
    if (exercise.patternId !== pattern.id) errors.push(`${exercise.id}: incompatible pattern link`);
    if (!(exercise.primitive === "choose-form" || exercise.primitive === "contrast-form" || exercise.primitive === "change-subject" || exercise.primitive === "order-tokens" || exercise.primitive === "repair-choice")) errors.push(`${exercise.id}: unsupported primitive`);
    if (!exercise.prompt.trim() || !exercise.context.trim() || !exercise.contextTag.trim() || exercise.evidenceEligible !== true) errors.push(`${exercise.id}: incomplete exercise metadata`);
    if (new Set(exercise.choices).size !== exercise.choices.length) errors.push(`${exercise.id}: duplicate choices`);
    if (exercise.primitive === "order-tokens" && (!exercise.tokens || exercise.tokens.length < 2 || new Set(exercise.tokens).size !== exercise.tokens.length || exercise.tokens.some((token) => !token.trim()))) errors.push(`${exercise.id}: incomplete order tokens`);
    if (exercise.primitive !== "order-tokens" && exercise.tokens !== undefined) errors.push(`${exercise.id}: unexpected order tokens`);
    if (exercise.accepted.length === 0) errors.push(`${exercise.id}: no accepted answers`);
    if (new Set(exercise.accepted).size !== exercise.accepted.length) errors.push(`${exercise.id}: duplicate accepted answers`);
    if (!exercise.accepted.every((answer) => exercise.choices.includes(answer))) errors.push(`${exercise.id}: accepted answer is not a choice`);
    const distractorValues = exercise.distractors.map((distractor) => distractor.value);
    if (new Set(distractorValues).size !== exercise.distractors.length) errors.push(`${exercise.id}: duplicate distractors`);
    if (exercise.distractors.some((distractor) => exercise.accepted.includes(distractor.value))) errors.push(`${exercise.id}: accepted answer is a distractor`);
    if (exercise.choices.some((choice) => !exercise.accepted.includes(choice) && !distractorValues.includes(choice)) || exercise.distractors.some((distractor) => !exercise.choices.includes(distractor.value))) errors.push(`${exercise.id}: every choice must be accepted or a coded distractor`);
    if (exercise.distractors.some((distractor) => !["wrong-person", "wrong-irregular-form", "invalid-order"].includes(distractor.misconception))) errors.push(`${exercise.id}: unknown misconception`);
    if (exercise.distractors.some((distractor) => distractor.feedback.trim().length === 0)) errors.push(`${exercise.id}: distractor feedback is incomplete`);
    if (!exercise.feedback.trim() || exercise.feedback === "Incorrect") errors.push(`${exercise.id}: generic feedback`);
    errors.push(...validateReviewMetadata(exercise.review, `${exercise.id}.review`));
  }
  const encounterKeys = pattern.encounterForms.map((entry) => `${entry.subject}\u001f${entry.form}`);
  if (encounterKeys.some((entry, index) => encounterKeys.indexOf(entry) !== index) || pattern.encounterForms.some((entry) => !entry.subject.trim() || !entry.form.trim())) errors.push(`${pattern.id}.encounterForms: expected unique reviewed pairs`);
  return errors;
}

export function validateLearningContent(pattern: GrammarPattern = zijnPattern, catalog: LessonCatalog = lessonCatalog): string[] {
  const errors = [...validateGrammarPattern(pattern), ...validateLessonCatalog(catalog)];
  if (!catalog.lessons.some((lesson) => lesson.id === pattern.companionLessonId)) errors.push(`${pattern.id}.companionLessonId: lesson is missing from the bundled catalog`);
  return errors;
}

export function validateAllLearningContent(catalog: LessonCatalog = lessonCatalog, patterns: readonly GrammarPattern[] = grammarPatterns): string[] {
  return [
    ...validateLessonCatalog(catalog),
    ...(patterns.length !== GRAMMAR_PATTERN_IDS.length || new Set(patterns.map((pattern) => pattern.id)).size !== GRAMMAR_PATTERN_IDS.length || GRAMMAR_PATTERN_IDS.some((patternId) => !patterns.some((pattern) => pattern.id === patternId)) ? ["grammar pack: expected exactly the four shipped A0 pattern IDs"] : []),
    ...patterns.flatMap((pattern) => [
      ...validateGrammarPattern(pattern),
      ...(catalog.lessons.some((lesson) => lesson.id === pattern.companionLessonId) ? [] : [`${pattern.id}.companionLessonId: lesson is missing from the bundled catalog`]),
    ]),
  ];
}

function validateReviewMetadata(review: GrammarReviewMetadata | undefined, field: string): string[] {
  if (!review || typeof review.author !== "string" || typeof review.reviewer !== "string" || typeof review.reviewedAt !== "string" || !Array.isArray(review.sources) || typeof review.provenance !== "string" || !review.author.trim() || !review.reviewer.trim() || !/^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) || review.sources.length === 0 || review.sources.some((source) => typeof source !== "string" || !source.trim()) || !review.provenance.trim()) return [`${field}: incomplete review metadata or provenance`];
  return review.reviewState === "second-review-complete" ? [] : [`${field}: requires second review before runtime release`];
}

export function isGrammarContentAvailable(pattern?: GrammarPattern): boolean { return pattern ? validateLearningContent(pattern).length === 0 : validateAllLearningContent().length === 0; }

export function createGrammarContentReport(pattern: GrammarPattern | GrammarPattern[] = grammarPatterns): string {
  if (Array.isArray(pattern)) return `${pattern.map((entry) => createGrammarContentReport(entry).trim()).join("\n\n")}\n`;
  const companion = lessonCatalog.lessons.find((lesson) => lesson.id === pattern.companionLessonId);
  const lines = [
    `# Grammar content report: ${pattern.id}`,
    `Version: ${pattern.contentVersion}`,
    `Companion lesson: ${pattern.companionLessonId}`,
    `Author: ${pattern.review.author}`,
    `Review state: ${pattern.review.reviewState}`,
    `Reviewer: ${pattern.review.reviewer}`,
    `Reviewed at: ${pattern.review.reviewedAt}`,
    `Sources: ${pattern.review.sources.join(", ")}`,
    `Provenance: ${pattern.review.provenance}`,
    `Forms: ${pattern.forms.map((entry) => `${entry.subject} -> ${entry.forms.join("/")}`).join("; ")}`,
    `Encounter pairs: ${pattern.encounterForms.map((entry) => entry.text ?? `${entry.subject} ${entry.form}`).join("; ")}`,
    `Companion title: ${companion?.title ?? "missing"}`,
    ...(companion?.lines.flatMap((line) => [`Story Dutch: ${line.dutch}`, `Story English: ${line.english}`, `Story Telugu: ${line.telugu}`]) ?? []),
    "",
  ];
  for (const exercise of pattern.exercises) {
    lines.push(`## ${exercise.id}`, `Primitive: ${exercise.primitive}`, `Context tag: ${exercise.contextTag}`, `Evidence eligible: ${exercise.evidenceEligible}`, `Exercise author: ${exercise.review.author}`, `Exercise review state: ${exercise.review.reviewState}`, `Exercise reviewer: ${exercise.review.reviewer}`, `Exercise reviewed at: ${exercise.review.reviewedAt}`, `Exercise sources: ${exercise.review.sources.join(", ")}`, `Exercise provenance: ${exercise.review.provenance}`, `Context: ${exercise.context}`, `Prompt: ${exercise.prompt}`, ...(exercise.tokens ? [`Tokens: ${exercise.tokens.join(" | ")}`] : []), `Choices: ${exercise.choices.join(" | ")}`, `Accepted: ${exercise.accepted.join(" | ")}`, `Feedback: ${exercise.feedback}`);
    for (const distractor of exercise.distractors) lines.push(`Distractor: ${distractor.value} [${distractor.misconception}] -> ${distractor.feedback}`);
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

export function normalizeGrammarText(value: string): string { return value.toLocaleLowerCase().replace(/[.!?]+$/u, "").trim().replace(/\s+/gu, " "); }

export function matchZijnEncounter(value: string, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  const match = matchGrammarEncounter(value, pattern);
  return match ? { subject: match.subject, form: match.form } : null;
}

export function matchGrammarEncounter(value: string, pattern: GrammarPattern): { patternId: GrammarPatternId; subject: string; form: string } | null {
  if (!isGrammarContentAvailable(pattern)) return null;
  const normalized = normalizeGrammarText(value);
  const words = normalized.split(" ");
  const match = pattern.encounterForms.find((entry) => entry.text ? normalizeGrammarText(entry.text) === normalized : words.length === 2 && entry.subject === words[0] && entry.form === words[1]);
  return match ? { patternId: pattern.id, subject: match.subject, form: match.form } : null;
}

export function matchIntroducedZijnEncounter(value: string, introduced: boolean, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  const match = matchIntroducedGrammarEncounter(value, introduced ? [pattern.id] : [], [pattern]);
  return match ? { subject: match.subject, form: match.form } : null;
}

export function matchIntroducedGrammarEncounter(value: string, introducedPatternIds: readonly GrammarPatternId[], patterns: GrammarPattern[] = grammarPatterns): { patternId: GrammarPatternId; subject: string; form: string } | null {
  for (const pattern of patterns) {
    if (!introducedPatternIds.includes(pattern.id)) continue;
    const match = matchGrammarEncounter(value, pattern);
    if (match) return match;
  }
  return null;
}
