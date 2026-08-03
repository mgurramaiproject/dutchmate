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

const zijnReview: GrammarReviewMetadata = {
  author: "DutchMate team",
  reviewState: "second-review-complete",
  reviewer: "Project owner",
  reviewedAt: "2026-07-27",
  sources: ["https://taaladvies.net/u-is-of-bent/"],
  provenance: "Original DutchMate-authored examples; no copied table or sentence text.",
};

const hebbenReview: GrammarReviewMetadata = {
  author: "DutchMate team", reviewState: "second-review-complete", reviewer: "Project owner", reviewedAt: "2026-07-27",
  sources: ["https://taaladvies.net/u-heeft-of-hebt/", "https://woordenlijst.org/zoeken/leidraad/lijst_van_vaktermen/onregelmatig_werkwoord.html"],
  provenance: "Original DutchMate-authored examples; u hebt and u heeft are both retained as reviewed alternatives.",
};

const regularReview: GrammarReviewMetadata = {
  author: "DutchMate team", reviewState: "second-review-complete", reviewer: "Project owner", reviewedAt: "2026-07-27",
  sources: ["https://taaladvies.net/d-of-t-tegenwoordige-tijd-hij-beloofd-of-hij-belooft/", "https://woordenlijst.org/zoeken/leidraad/lijst_van_vaktermen/vervoeging.html"],
  provenance: "Original DutchMate-authored examples using reviewed regular present-tense subject agreement; no copied sentence text.",
};

const inversionReview: GrammarReviewMetadata = {
  author: "DutchMate team", reviewState: "second-review-complete", reviewer: "Project owner", reviewedAt: "2026-07-27",
  sources: ["https://taaladvies.net/termen-inversie/", "https://taaladvies.net/d-of-t-tegenwoordige-tijd-hij-beloofd-of-hij-belooft/"],
  provenance: "Original DutchMate-authored questions using reviewed finite-verb inversion; no copied sentence text.",
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
      review: { ...zijnReview },
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
      review: { ...zijnReview },
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
      review: { ...zijnReview },
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
      review: { ...zijnReview },
    },
  ],
  encounterForms: [
    { subject: "ik", form: "ben" }, { subject: "jij", form: "bent" }, { subject: "je", form: "bent" },
    { subject: "u", form: "bent" }, { subject: "hij", form: "is" }, { subject: "zij", form: "is" },
    { subject: "het", form: "is" }, { subject: "wij", form: "zijn" }, { subject: "we", form: "zijn" },
    { subject: "jullie", form: "zijn" }, { subject: "ze", form: "zijn" },
  ],
  companionLessonId: "a0-hallo-ik-ben",
  review: zijnReview,
};

export const hebbenPattern: GrammarPattern = {
  id: "a0-hebben-present",
  contentVersion: 1,
  level: "A0",
  capability: "Say what you have or need in practical lesson situations.",
  prerequisites: ["a0-zijn-present"],
  forms: [
    { subject: "ik", forms: ["heb"] },
    { subject: "jij/je", forms: ["hebt"] },
    { subject: "u", forms: ["hebt", "heeft"] },
    { subject: "hij/zij/het", forms: ["heeft"] },
    { subject: "wij/we/jullie/zij/ze", forms: ["hebben"] },
  ],
  exercises: [
    {
      id: "hebben-choose-ik", patternId: "a0-hebben-present", primitive: "choose-form",
      prompt: "Choose the form for ik.", context: "Ik ___ een pen nodig.", contextTag: "needs", choices: ["heb", "hebt", "heeft"], accepted: ["heb"],
      distractors: [
        { value: "hebt", misconception: "wrong-person", feedback: "With ik, use heb: ik heb een pen nodig." },
        { value: "heeft", misconception: "wrong-person", feedback: "With ik, use heb: ik heb een pen nodig." },
      ],
      feedback: "With ik, use heb: ik heb een pen nodig.", evidenceEligible: true, review: { ...hebbenReview },
    },
    {
      id: "hebben-change-jij", patternId: "a0-hebben-present", primitive: "change-subject",
      prompt: "Change the subject to jij.", context: "Jij ___ een schrift.", contextTag: "school-items", choices: ["heb", "hebt", "heeft"], accepted: ["hebt"],
      distractors: [
        { value: "heb", misconception: "wrong-person", feedback: "With jij, use hebt: jij hebt een schrift." },
        { value: "heeft", misconception: "wrong-person", feedback: "With jij, use hebt: jij hebt een schrift." },
      ],
      feedback: "With jij, use hebt: jij hebt een schrift.", evidenceEligible: true, review: { ...hebbenReview },
    },
    {
      id: "hebben-contrast-u", patternId: "a0-hebben-present", primitive: "contrast-form",
      prompt: "Choose a correct polite form.", context: "U ___ een extra pen.", contextTag: "politeness", choices: ["hebt", "heeft", "hebben"], accepted: ["hebt", "heeft"],
      distractors: [{ value: "hebben", misconception: "wrong-irregular-form", feedback: "With u, both hebt and heeft are correct: u hebt een extra pen or u heeft een extra pen." }],
      feedback: "With u, both hebt and heeft are correct: u hebt een extra pen or u heeft een extra pen.", evidenceEligible: true, review: { ...hebbenReview },
    },
    {
      id: "hebben-repair-wij", patternId: "a0-hebben-present", primitive: "repair-choice",
      prompt: "Repair the sentence.", context: "Wij ___ alles voor de les.", contextTag: "classroom", choices: ["heb", "heeft", "hebben"], accepted: ["hebben"],
      distractors: [
        { value: "heb", misconception: "wrong-person", feedback: "With wij, use hebben: wij hebben alles voor de les." },
        { value: "heeft", misconception: "wrong-person", feedback: "With wij, use hebben: wij hebben alles voor de les." },
      ],
      feedback: "With wij, use hebben: wij hebben alles voor de les.", evidenceEligible: true, review: { ...hebbenReview },
    },
  ],
  encounterForms: [
    { subject: "ik", form: "heb" }, { subject: "jij", form: "hebt" }, { subject: "je", form: "hebt" },
    { subject: "u", form: "hebt" }, { subject: "u", form: "heeft" }, { subject: "hij", form: "heeft" },
    { subject: "zij", form: "heeft" }, { subject: "het", form: "heeft" }, { subject: "wij", form: "hebben" },
    { subject: "we", form: "hebben" }, { subject: "jullie", form: "hebben" }, { subject: "ze", form: "hebben" },
  ],
  companionLessonId: "a0-ik-heb-dit-nodig",
  review: hebbenReview,
};

export const regularPattern: GrammarPattern = {
  id: "a0-regular-present",
  contentVersion: 1,
  level: "A0",
  capability: "Say what you do, where you live, and what you learn in simple present-tense sentences.",
  prerequisites: ["a0-zijn-present"],
  forms: [
    { subject: "ik", forms: ["woon", "werk", "leer", "maak"] },
    { subject: "jij/je", forms: ["woont", "werkt", "leert", "maakt"] },
    { subject: "u", forms: ["woont", "werkt", "leert", "maakt"] },
    { subject: "hij/zij/het", forms: ["woont", "werkt", "leert", "maakt"] },
    { subject: "wij/we/jullie/zij/ze", forms: ["wonen", "werken", "leren", "maken"] },
  ],
  exercises: [
    {
      id: "regular-choose-ik", patternId: "a0-regular-present", primitive: "choose-form",
      prompt: "Choose the form for ik.", context: "Ik ___ in Utrecht.", contextTag: "home", choices: ["woon", "woont", "wonen"], accepted: ["woon"],
      distractors: [
        { value: "woont", misconception: "wrong-person", feedback: "With ik, use the stem woon: ik woon in Utrecht." },
        { value: "wonen", misconception: "wrong-person", feedback: "With ik, use the stem woon: ik woon in Utrecht." },
      ],
      feedback: "With ik, use the stem woon: ik woon in Utrecht.", evidenceEligible: true, review: { ...regularReview },
    },
    {
      id: "regular-change-jij", patternId: "a0-regular-present", primitive: "change-subject",
      prompt: "Change the subject to jij.", context: "Jij ___ in een team.", contextTag: "work", choices: ["werk", "werkt", "werken"], accepted: ["werkt"],
      distractors: [
        { value: "werk", misconception: "wrong-person", feedback: "With jij, add -t to the stem: jij werkt in een team." },
        { value: "werken", misconception: "wrong-person", feedback: "With jij, use werkt, not the plural werken: jij werkt in een team." },
      ],
      feedback: "With jij, add -t to the stem: jij werkt in een team.", evidenceEligible: true, review: { ...regularReview },
    },
    {
      id: "regular-contrast-u", patternId: "a0-regular-present", primitive: "contrast-form",
      prompt: "Choose the polite form.", context: "U ___ Nederlands.", contextTag: "learning", choices: ["leer", "leert", "leren"], accepted: ["leert"],
      distractors: [
        { value: "leer", misconception: "wrong-person", feedback: "With u, add -t to the stem: u leert Nederlands." },
        { value: "leren", misconception: "wrong-person", feedback: "With u, use the singular form leert, not the plural leren: u leert Nederlands." },
      ],
      feedback: "With u, add -t to the stem: u leert Nederlands.", evidenceEligible: true, review: { ...regularReview },
    },
    {
      id: "regular-repair-wij", patternId: "a0-regular-present", primitive: "repair-choice",
      prompt: "Repair the sentence.", context: "Wij ___ een plan.", contextTag: "plans", choices: ["maak", "maakt", "maken"], accepted: ["maken"],
      distractors: [
        { value: "maak", misconception: "wrong-person", feedback: "With wij, use the plural form maken: wij maken een plan." },
        { value: "maakt", misconception: "wrong-person", feedback: "With wij, use the plural form maken, not maakt: wij maken een plan." },
      ],
      feedback: "With wij, use the plural form maken: wij maken een plan.", evidenceEligible: true, review: { ...regularReview },
    },
  ],
  encounterForms: [
    { subject: "ik", form: "woon" }, { subject: "ik", form: "werk" }, { subject: "ik", form: "leer" }, { subject: "ik", form: "maak" },
    { subject: "jij", form: "woont" }, { subject: "jij", form: "werkt" }, { subject: "jij", form: "leert" }, { subject: "jij", form: "maakt" },
    { subject: "je", form: "woont" }, { subject: "je", form: "werkt" }, { subject: "je", form: "leert" }, { subject: "je", form: "maakt" },
    { subject: "u", form: "woont" }, { subject: "u", form: "werkt" }, { subject: "u", form: "leert" }, { subject: "u", form: "maakt" },
    { subject: "hij", form: "woont" }, { subject: "hij", form: "werkt" }, { subject: "hij", form: "leert" }, { subject: "hij", form: "maakt" },
    { subject: "zij", form: "woont" }, { subject: "zij", form: "werkt" }, { subject: "zij", form: "leert" }, { subject: "zij", form: "maakt" },
    { subject: "het", form: "woont" }, { subject: "het", form: "werkt" }, { subject: "het", form: "leert" }, { subject: "het", form: "maakt" },
    { subject: "wij", form: "wonen" }, { subject: "wij", form: "werken" }, { subject: "wij", form: "leren" }, { subject: "wij", form: "maken" },
    { subject: "we", form: "wonen" }, { subject: "we", form: "werken" }, { subject: "we", form: "leren" }, { subject: "we", form: "maken" },
    { subject: "jullie", form: "wonen" }, { subject: "jullie", form: "werken" }, { subject: "jullie", form: "leren" }, { subject: "jullie", form: "maken" },
    { subject: "zij", form: "wonen" }, { subject: "zij", form: "werken" }, { subject: "zij", form: "leren" }, { subject: "zij", form: "maken" },
    { subject: "ze", form: "wonen" }, { subject: "ze", form: "werken" }, { subject: "ze", form: "leren" }, { subject: "ze", form: "maken" },
  ],
  companionLessonId: "a0-ik-woon-en-werk-hier",
  review: regularReview,
};

export const inversionPattern: GrammarPattern = {
  id: "a0-yes-no-inversion",
  contentVersion: 1,
  level: "A0",
  capability: "Ask simple yes-or-no questions about everyday places, work, and routines.",
  prerequisites: ["a0-zijn-present"],
  forms: [
    { subject: "jij/je", forms: ["woont", "werkt", "leert", "maakt"] },
    { subject: "u", forms: ["woont", "werkt", "leert", "maakt"] },
  ],
  exercises: [
    {
      id: "inversion-order-je", patternId: "a0-yes-no-inversion", primitive: "order-tokens",
      prompt: "Build the question.", context: "Je woont hier.", contextTag: "inversion", tokens: ["Woon", "je", "hier?"], choices: ["Woon je hier?", "Je woont hier?", "Woon hier je?"], accepted: ["Woon je hier?"],
      distractors: [
        { value: "Je woont hier?", misconception: "wrong-person", feedback: "Before je in a question, use the stem without -t and put it first: Woon je hier?" },
        { value: "Woon hier je?", misconception: "invalid-order", feedback: "Put the finite verb first and je immediately after it: Woon je hier?" },
      ],
      feedback: "Put the finite verb first. Before je, use woon without -t: Woon je hier?", evidenceEligible: true, review: { ...inversionReview },
    },
    {
      id: "inversion-order-u", patternId: "a0-yes-no-inversion", primitive: "order-tokens",
      prompt: "Build the polite question.", context: "U werkt vandaag.", contextTag: "polite-question", tokens: ["Werkt", "u", "vandaag?"], choices: ["Werkt u vandaag?", "Werk u vandaag?", "U werkt vandaag?"], accepted: ["Werkt u vandaag?"],
      distractors: [
        { value: "Werk u vandaag?", misconception: "wrong-person", feedback: "Before u, keep the -t on the finite verb: Werkt u vandaag?" },
        { value: "U werkt vandaag?", misconception: "invalid-order", feedback: "In a yes-or-no question, put the finite verb before u: Werkt u vandaag?" },
      ],
      feedback: "Put the finite verb first and keep -t before u: Werkt u vandaag?", evidenceEligible: true, review: { ...inversionReview },
    },
    {
      id: "inversion-contrast-je", patternId: "a0-yes-no-inversion", primitive: "contrast-form",
      prompt: "Choose the form before je.", context: "___ je in Utrecht?", contextTag: "jij-je", choices: ["Woon", "Woont", "Wonen"], accepted: ["Woon"],
      distractors: [
        { value: "Woont", misconception: "wrong-person", feedback: "Before je in a question, use woon without -t: Woon je in Utrecht?" },
        { value: "Wonen", misconception: "wrong-person", feedback: "Je is singular here, so use woon, not the plural wonen: Woon je in Utrecht?" },
      ],
      feedback: "Before je in a question, use the stem without -t: woon.", evidenceEligible: true, review: { ...inversionReview },
    },
    {
      id: "inversion-repair-u", patternId: "a0-yes-no-inversion", primitive: "repair-choice",
      prompt: "Repair the polite question.", context: "___ u morgen?", contextTag: "u-contrast", choices: ["Werkt", "Werk", "Werken"], accepted: ["Werkt"],
      distractors: [
        { value: "Werk", misconception: "wrong-person", feedback: "Before u, keep -t on the finite verb: Werkt u morgen?" },
        { value: "Werken", misconception: "wrong-person", feedback: "U takes the singular -t form here, not the plural werken: Werkt u morgen?" },
      ],
      feedback: "Before u, keep -t on the finite verb: werkt.", evidenceEligible: true, review: { ...inversionReview },
    },
  ],
  encounterForms: [
    { subject: "je", form: "woon", text: "Woon je hier?" },
    { subject: "je", form: "werk", text: "Werk je vandaag?" },
    { subject: "u", form: "werkt", text: "Werkt u morgen?" },
    { subject: "u", form: "leert", text: "Leert u Nederlands?" },
  ],
  companionLessonId: "a0-woon-je-hier",
  review: inversionReview,
};

export const GRAMMAR_PATTERN_IDS: readonly GrammarPatternId[] = ["a0-zijn-present", "a0-hebben-present", "a0-regular-present", "a0-yes-no-inversion"];
const legacyGrammarPatterns: GrammarPattern[] = [zijnPattern, hebbenPattern, regularPattern, inversionPattern];
export const grammarPatterns: GrammarPattern[] = GRAMMAR_PATTERN_IDS.map((patternId) => contentCatalog.getGrammarPattern(patternId) ?? legacyGrammarPatterns.find((pattern) => pattern.id === patternId)!);

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
