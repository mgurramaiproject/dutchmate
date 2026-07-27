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
    },
  ],
  encounterForms: [
    { subject: "ik", form: "ben" }, { subject: "jij", form: "bent" }, { subject: "je", form: "bent" },
    { subject: "u", form: "bent" }, { subject: "hij", form: "is" }, { subject: "zij", form: "is" },
    { subject: "het", form: "is" }, { subject: "wij", form: "zijn" }, { subject: "we", form: "zijn" },
    { subject: "jullie", form: "zijn" }, { subject: "ze", form: "zijn" },
  ],
};

export function validateGrammarPattern(pattern: GrammarPattern): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const exercise of pattern.exercises) {
    if (ids.has(exercise.id)) errors.push(`duplicate exercise: ${exercise.id}`);
    ids.add(exercise.id);
    if (exercise.accepted.length === 0) errors.push(`${exercise.id}: no accepted answers`);
    if (!exercise.accepted.every((answer) => exercise.choices.includes(answer))) errors.push(`${exercise.id}: accepted answer is not a choice`);
    if (exercise.distractors.some((distractor) => exercise.accepted.includes(distractor.value))) errors.push(`${exercise.id}: accepted answer is a distractor`);
    if (exercise.distractors.some((distractor) => distractor.feedback.trim().length === 0)) errors.push(`${exercise.id}: distractor feedback is incomplete`);
  }
  return errors;
}

export function normalizeGrammarText(value: string): string { return value.toLocaleLowerCase().replace(/[.!?]+$/u, "").trim().replace(/\s+/gu, " "); }

export function matchZijnEncounter(value: string, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  const words = normalizeGrammarText(value).split(" ");
  if (words.length !== 2) return null;
  return pattern.encounterForms.find((entry) => entry.subject === words[0] && entry.form === words[1]) ?? null;
}

export function matchIntroducedZijnEncounter(value: string, introduced: boolean, pattern: GrammarPattern = zijnPattern): { subject: string; form: string } | null {
  return introduced ? matchZijnEncounter(value, pattern) : null;
}
