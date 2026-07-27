import { lessonCatalog, validateLessonCatalog, type LessonCatalog } from "../lessons/catalog";

export type GrammarPrimitive = "choose-form" | "contrast-form" | "change-subject" | "order-tokens" | "repair-choice";
export type Misconception = "wrong-person" | "wrong-irregular-form" | "invalid-order";

export type GrammarExercise = {
  id: string;
  patternId: "a0-zijn-present";
  primitive: GrammarPrimitive;
  prompt: string;
  context: string;
  contextTag: string;
  choices: string[];
  accepted: string[];
  distractors: Array<{ value: string; misconception: Misconception; feedback: string }>;
  feedback: string;
  evidenceEligible: true;
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
  id: "a0-zijn-present";
  contentVersion: 1;
  level: "A0";
  capability: string;
  prerequisites: string[];
  forms: Array<{ subject: string; forms: string[] }>;
  exercises: GrammarExercise[];
  encounterForms: Array<{ subject: string; form: string }>;
  companionLessonId: "a0-hallo-ik-ben";
  review: GrammarReviewMetadata;
};

export const zijnPattern: GrammarPattern = {
  id: "a0-zijn-present",
  contentVersion: 1,
  level: "A0",
  capability: "Introduce and identify people or simple states.",
  prerequisites: [],
  forms: [
    { subject: "ik", forms: ["ben"] },
    { subject: "jij/je", forms: ["bent"] },
    { subject: "u", forms: ["bent"] },
    { subject: "hij/zij/het", forms: ["is"] },
    { subject: "wij/we/jullie/zij/ze", forms: ["zijn"] },
  ],
  exercises: [
    {
      id: "zijn-choose-ik",
      patternId: "a0-zijn-present",
      primitive: "choose-form",
      prompt: "Choose the form for ik.",
      context: "Ik ___ Noor.",
      contextTag: "introductions",
      choices: ["ben", "bent", "is"],
      accepted: ["ben"],
      distractors: [
        { value: "bent", misconception: "wrong-person", feedback: "With ik, use ben: ik ben Noor." },
        { value: "is", misconception: "wrong-person", feedback: "With ik, use ben: ik ben Noor." },
      ],
      feedback: "With ik, use ben: ik ben Noor.",
      evidenceEligible: true,
    },
    {
      id: "zijn-change-jij",
      patternId: "a0-zijn-present",
      primitive: "change-subject",
      prompt: "Change the subject to jij.",
      context: "Jij ___ hier.",
      contextTag: "place",
      choices: ["ben", "bent", "is"],
      accepted: ["bent"],
      distractors: [
        { value: "ben", misconception: "wrong-person", feedback: "With jij, use bent: jij bent hier." },
        { value: "is", misconception: "wrong-person", feedback: "With jij, use bent: jij bent hier." },
      ],
      feedback: "With jij, use bent: jij bent hier.",
      evidenceEligible: true,
    },
    {
      id: "zijn-contrast-u",
      patternId: "a0-zijn-present",
      primitive: "contrast-form",
      prompt: "Choose the polite form.",
      context: "U ___ welkom.",
      contextTag: "politeness",
      choices: ["ben", "bent", "zijn"],
      accepted: ["bent"],
      distractors: [
        { value: "ben", misconception: "wrong-person", feedback: "With u, use bent: u bent welkom." },
        { value: "zijn", misconception: "wrong-person", feedback: "With u, use bent: u bent welkom." },
      ],
      feedback: "With u, use bent: u bent welkom.",
      evidenceEligible: true,
    },
    {
      id: "zijn-repair-zij",
      patternId: "a0-zijn-present",
      primitive: "repair-choice",
      prompt: "Repair the sentence.",
      context: "Zij ___ thuis.",
      contextTag: "home",
      choices: ["ben", "is", "zijn"],
      accepted: ["is"],
      distractors: [
        { value: "ben", misconception: "wrong-person", feedback: "For one person with zij, use is: zij is thuis." },
        { value: "zijn", misconception: "wrong-person", feedback: "For one person with zij, use is: zij is thuis." },
      ],
      feedback: "For one person with zij, use is: zij is thuis.",
      evidenceEligible: true,
    },
  ],
  encounterForms: [
    { subject: "ik", form: "ben" }, { subject: "jij", form: "bent" }, { subject: "je", form: "bent" },
    { subject: "u", form: "bent" }, { subject: "hij", form: "is" }, { subject: "zij", form: "is" },
    { subject: "het", form: "is" }, { subject: "wij", form: "zijn" }, { subject: "we", form: "zijn" },
    { subject: "jullie", form: "zijn" }, { subject: "ze", form: "zijn" },
  ],
  companionLessonId: "a0-hallo-ik-ben",
  review: {
    author: "DutchMate team",
    reviewState: "self-reviewed",
    reviewer: "DutchMate team",
    reviewedAt: "2026-07-27",
    sources: ["https://taaladvies.net/u-is-of-bent/"],
    provenance: "Original DutchMate-authored examples; no copied table or sentence text.",
  },
};

export function validateGrammarPattern(pattern: GrammarPattern): string[] {
  const errors: string[] = [];
  const stable = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value);
  if (!stable(pattern.id)) errors.push(`${pattern.id}.id: expected stable kebab-case identifier`);
  if (!Number.isInteger(pattern.contentVersion) || pattern.contentVersion < 1) errors.push(`${pattern.id}.contentVersion: expected positive content version`);
  if (pattern.level !== "A0") errors.push(`${pattern.id}.level: expected A0`);
  if (!pattern.capability.trim()) errors.push(`${pattern.id}.capability: expected practical capability`);
  if (pattern.companionLessonId !== "a0-hallo-ik-ben") errors.push(`${pattern.id}.companionLessonId: incompatible lesson link`);
  if (!pattern.forms.length || pattern.forms.some((entry) => !entry.subject.trim() || entry.forms.length === 0 || entry.forms.some((form) => !form.trim()))) errors.push(`${pattern.id}.forms: incomplete reviewed forms`);
  if (!pattern.review.author.trim() || !["self-reviewed", "second-review-complete"].includes(pattern.review.reviewState) || !pattern.review.reviewer.trim() || !/^\d{4}-\d{2}-\d{2}$/u.test(pattern.review.reviewedAt) || pattern.review.sources.length === 0 || pattern.review.sources.some((source) => !source.trim()) || !pattern.review.provenance.trim()) errors.push(`${pattern.id}.review: incomplete review metadata or provenance`);
  const ids = new Set<string>();
  for (const exercise of pattern.exercises) {
    if (!stable(exercise.id)) errors.push(`${exercise.id}.id: expected stable kebab-case identifier`);
    if (ids.has(exercise.id)) errors.push(`duplicate exercise: ${exercise.id}`);
    ids.add(exercise.id);
    if (exercise.patternId !== pattern.id) errors.push(`${exercise.id}: incompatible pattern link`);
    if (!(exercise.primitive === "choose-form" || exercise.primitive === "contrast-form" || exercise.primitive === "change-subject" || exercise.primitive === "order-tokens" || exercise.primitive === "repair-choice")) errors.push(`${exercise.id}: unsupported primitive`);
    if (!exercise.prompt.trim() || !exercise.context.trim() || !exercise.contextTag.trim() || exercise.evidenceEligible !== true) errors.push(`${exercise.id}: incomplete exercise metadata`);
    if (new Set(exercise.choices).size !== exercise.choices.length) errors.push(`${exercise.id}: duplicate choices`);
    if (exercise.accepted.length === 0) errors.push(`${exercise.id}: no accepted answers`);
    if (new Set(exercise.accepted).size !== exercise.accepted.length) errors.push(`${exercise.id}: duplicate accepted answers`);
    if (!exercise.accepted.every((answer) => exercise.choices.includes(answer))) errors.push(`${exercise.id}: accepted answer is not a choice`);
    if (new Set(exercise.distractors.map((distractor) => distractor.value)).size !== exercise.distractors.length) errors.push(`${exercise.id}: duplicate distractors`);
    if (exercise.distractors.some((distractor) => exercise.accepted.includes(distractor.value))) errors.push(`${exercise.id}: accepted answer is a distractor`);
    if (exercise.distractors.some((distractor) => !["wrong-person", "wrong-irregular-form", "invalid-order"].includes(distractor.misconception))) errors.push(`${exercise.id}: unknown misconception`);
    if (exercise.distractors.some((distractor) => distractor.feedback.trim().length === 0)) errors.push(`${exercise.id}: distractor feedback is incomplete`);
    if (!exercise.feedback.trim() || exercise.feedback === "Incorrect") errors.push(`${exercise.id}: generic feedback`);
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

export function isGrammarContentAvailable(pattern: GrammarPattern = zijnPattern): boolean { return validateLearningContent(pattern).length === 0; }

export function createGrammarContentReport(pattern: GrammarPattern = zijnPattern): string {
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
    `Encounter pairs: ${pattern.encounterForms.map((entry) => `${entry.subject} ${entry.form}`).join("; ")}`,
    "",
  ];
  for (const exercise of pattern.exercises) {
    lines.push(`## ${exercise.id}`, `Primitive: ${exercise.primitive}`, `Context: ${exercise.context}`, `Prompt: ${exercise.prompt}`, `Choices: ${exercise.choices.join(" | ")}`, `Accepted: ${exercise.accepted.join(" | ")}`, `Feedback: ${exercise.feedback}`);
    for (const distractor of exercise.distractors) lines.push(`Distractor: ${distractor.value} [${distractor.misconception}] -> ${distractor.feedback}`);
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

export function normalizeGrammarText(value: string): string { return value.toLocaleLowerCase().replace(/[.!?]+$/u, "").trim().replace(/\s+/gu, " "); }

export function matchZijnEncounter(value: string, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  if (!isGrammarContentAvailable(pattern)) return null;
  const words = normalizeGrammarText(value).split(" ");
  if (words.length !== 2) return null;
  return pattern.encounterForms.find((entry) => entry.subject === words[0] && entry.form === words[1]) ?? null;
}

export function matchIntroducedZijnEncounter(value: string, introduced: boolean, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  return introduced ? matchZijnEncounter(value, pattern) : null;
}
