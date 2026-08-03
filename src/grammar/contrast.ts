import { lessonCatalog } from "../lessons/catalog";
import { contentCatalog } from "../content-catalog";
import type { GrammarPrimitive, GrammarReviewMetadata } from "./content";
import { isRegisteredMisconceptionSource, MAIN_CLAUSE_NO_INVERSION, misconceptionRegistry } from "./misconceptions";

export { MAIN_CLAUSE_NO_INVERSION } from "./misconceptions";

export const CONTRAST_PACK_ID = "contrast.main_clause_inversion" as const;
export const CONTRAST_CONTENT_VERSION = 1 as const;
export type ContrastPackId = typeof CONTRAST_PACK_ID;
export type ContrastMisconceptionCode = keyof typeof misconceptionRegistry;
export type ContrastComparisonItem = { id: string; label: string; sentenceNl: string; valid: boolean };
export type ContrastExercise = {
  id: string;
  packId: ContrastPackId;
  primitive: GrammarPrimitive;
  prompt: string;
  context: string;
  contextTag: string;
  choices: string[];
  tokens?: string[];
  accepted: string[];
  distractors: Array<{ value: string; misconception?: ContrastMisconceptionCode; feedback: string }>;
  feedback: string;
  evidenceEligible: true;
  review: GrammarReviewMetadata;
};
export type ContrastPack = {
  id: ContrastPackId;
  contentVersion: typeof CONTRAST_CONTENT_VERSION;
  level: "A1";
  title: string;
  capability: string;
  companionLessonId: string;
  comparison: { items: ContrastComparisonItem[] };
  explanation: string;
  meaningNote: string;
  exercises: ContrastExercise[];
  review: GrammarReviewMetadata;
};

export const contrastPack: ContrastPack = (() => {
  const pack = contentCatalog.getContrastPack(CONTRAST_PACK_ID);
  if (!pack) throw new Error(`Content catalog is missing contrast package: ${CONTRAST_PACK_ID}`);
  return pack;
})();

export function validateContrastPack(pack: ContrastPack): string[] {
  const errors: string[] = [];
  const stable = (value: string) => /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/u.test(value);
  if (pack.id !== CONTRAST_PACK_ID) errors.push(`${pack.id}.id: expected contrast.main_clause_inversion`);
  if (pack.contentVersion !== CONTRAST_CONTENT_VERSION) errors.push(`${pack.id}.contentVersion: expected version 1`);
  if (pack.level !== "A1") errors.push(`${pack.id}.level: expected A1`);
  if (!pack.title.trim() || !pack.capability.trim() || !stable(pack.companionLessonId)) errors.push(`${pack.id}: incomplete pack metadata`);
  if (!pack.explanation.trim() || !pack.meaningNote.trim()) errors.push(`${pack.id}: incomplete scoped explanation`);
  if (!pack.comparison.items.length || new Set(pack.comparison.items.map((item) => item.id)).size !== pack.comparison.items.length || pack.comparison.items.some((item) => !stable(item.id) || !item.label.trim() || !item.sentenceNl.trim() || typeof item.valid !== "boolean")) errors.push(`${pack.id}.comparison: incomplete or duplicate comparison items`);
  if (pack.comparison.items.filter((item) => item.valid).length < 2 || pack.comparison.items.every((item) => item.valid)) errors.push(`${pack.id}.comparison: expected positive and intentionally incorrect examples`);
  errors.push(...validateReviewMetadata(pack.review, `${pack.id}.review`));
  const ids = new Set<string>();
  for (const exercise of pack.exercises) {
    if (!stable(exercise.id)) errors.push(`${exercise.id}.id: expected stable kebab-case identifier`);
    if (ids.has(exercise.id)) errors.push(`duplicate contrast exercise: ${exercise.id}`);
    ids.add(exercise.id);
    if (exercise.packId !== pack.id || !exercise.prompt.trim() || !exercise.context.trim() || !exercise.contextTag.trim() || exercise.evidenceEligible !== true) errors.push(`${exercise.id}: incomplete exercise metadata`);
    if (!(exercise.primitive === "choose-form" || exercise.primitive === "contrast-form" || exercise.primitive === "change-subject" || exercise.primitive === "order-tokens" || exercise.primitive === "repair-choice")) errors.push(`${exercise.id}: unsupported primitive`);
    if (new Set(exercise.choices).size !== exercise.choices.length) errors.push(`${exercise.id}: duplicate choices`);
    if (exercise.primitive === "order-tokens" && (!exercise.tokens || exercise.tokens.length < 2 || new Set(exercise.tokens).size !== exercise.tokens.length || exercise.tokens.some((token) => !token.trim()))) errors.push(`${exercise.id}: incomplete order tokens`);
    if (exercise.primitive !== "order-tokens" && exercise.tokens !== undefined) errors.push(`${exercise.id}: unexpected order tokens`);
    if (exercise.accepted.length === 0 || new Set(exercise.accepted).size !== exercise.accepted.length || !exercise.accepted.every((answer) => exercise.choices.includes(answer))) errors.push(`${exercise.id}: incomplete accepted answers`);
    const distractorValues = exercise.distractors.map((distractor) => distractor.value);
    if (new Set(distractorValues).size !== exercise.distractors.length || exercise.distractors.some((distractor) => exercise.accepted.includes(distractor.value))) errors.push(`${exercise.id}: invalid distractor partition`);
    if (exercise.choices.some((choice) => !exercise.accepted.includes(choice) && !distractorValues.includes(choice)) || exercise.distractors.some((distractor) => !exercise.choices.includes(distractor.value))) errors.push(`${exercise.id}: every choice must be accepted or an item-specific distractor`);
    if (exercise.distractors.some((distractor) => distractor.misconception !== undefined && !Object.hasOwn(misconceptionRegistry, distractor.misconception))) errors.push(`${exercise.id}: unknown misconception code`);
    if (exercise.distractors.some((distractor) => distractor.misconception !== undefined && Object.hasOwn(misconceptionRegistry, distractor.misconception) && !isRegisteredMisconceptionSource(distractor.misconception, pack.id, exercise.id))) errors.push(`${exercise.id}: unsupported misconception source`);
    if (exercise.distractors.some((distractor) => !distractor.feedback.trim()) || !exercise.feedback.trim() || exercise.feedback === "Incorrect") errors.push(`${exercise.id}: incomplete or generic feedback`);
    errors.push(...validateReviewMetadata(exercise.review, `${exercise.id}.review`));
  }
  return errors;
}

export function isContrastContentAvailable(pack: ContrastPack = contrastPack): boolean {
  return validateContrastPack(pack).length === 0 && lessonCatalog.lessons.some((lesson) => lesson.id === pack.companionLessonId);
}

export function createContrastContentReport(pack: ContrastPack = contrastPack): string {
  const lines = [
    `# Contrast content report: ${pack.id}`,
    `Version: ${pack.contentVersion}`,
    `Level: ${pack.level}`,
    `Title: ${pack.title}`,
    `Companion lesson: ${pack.companionLessonId}`,
    `Author: ${pack.review.author}`,
    `Review state: ${pack.review.reviewState}`,
    `Reviewer: ${pack.review.reviewer}`,
    `Reviewed at: ${pack.review.reviewedAt}`,
    `Sources: ${pack.review.sources.join(", ")}`,
    `Provenance: ${pack.review.provenance}`,
    `Explanation: ${pack.explanation}`,
    `Meaning note: ${pack.meaningNote}`,
    "",
  ];
  for (const item of pack.comparison.items) lines.push(`Comparison: ${item.label} [${item.valid ? "valid" : "intentionally incorrect"}] -> ${item.sentenceNl}`);
  for (const exercise of pack.exercises) {
    lines.push(`## ${exercise.id}`, `Primitive: ${exercise.primitive}`, `Context tag: ${exercise.contextTag}`, `Prompt: ${exercise.prompt}`, `Context: ${exercise.context}`, ...(exercise.tokens ? [`Tokens: ${exercise.tokens.join(" | ")}`] : []), `Choices: ${exercise.choices.join(" | ")}`, `Accepted: ${exercise.accepted.join(" | ")}`, `Feedback: ${exercise.feedback}`);
    for (const distractor of exercise.distractors) lines.push(`Distractor: ${distractor.value} [${distractor.misconception ?? "item-specific"}] -> ${distractor.feedback}`);
  }
  return `${lines.join("\n").trim()}\n`;
}

function validateReviewMetadata(review: GrammarReviewMetadata | undefined, field: string): string[] {
  if (!review || typeof review.author !== "string" || typeof review.reviewer !== "string" || typeof review.reviewedAt !== "string" || !Array.isArray(review.sources) || typeof review.provenance !== "string" || !review.author.trim() || !review.reviewer.trim() || !/^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) || review.sources.length === 0 || review.sources.some((source) => typeof source !== "string" || !source.trim()) || !review.provenance.trim()) return [`${field}: incomplete review metadata or provenance`];
  return review.reviewState === "second-review-complete" ? [] : [`${field}: requires second review before runtime release`];
}
