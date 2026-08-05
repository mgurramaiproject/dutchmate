export type PracticalDutchLanguage = { nl: string; en: string; te: string };

export type PracticalDutchReview = {
  author: string;
  reviewer: string;
  reviewedAt: string;
  sources: string[];
  provenance: string;
  reviewState: "self-reviewed" | "second-review-complete";
};

export type PracticalDutchExercise = {
  id: string;
  kind: "choice" | "order";
  prompt: PracticalDutchLanguage;
  context: PracticalDutchLanguage;
  choices: string[];
  tokens?: string[];
  accepted: string[];
  distractors: Array<{ answer: string; misconception: string }>;
  feedback: PracticalDutchLanguage;
  review: PracticalDutchReview;
};

export type PracticalDutchLesson = {
  id: string;
  contentVersion: number;
  cefr: "A1" | "A2";
  title: PracticalDutchLanguage;
  durationMinutes: number;
  outcome: PracticalDutchLanguage;
  context: PracticalDutchLanguage[];
  sentences: PracticalDutchLanguage[];
  chunks: Array<PracticalDutchLanguage & { id: string }>;
  vocabulary: Array<PracticalDutchLanguage & { id: string }>;
  languageFocus: {
    pattern: PracticalDutchLanguage;
    explanation: PracticalDutchLanguage;
  };
  coreExercises: PracticalDutchExercise[];
  extraExercises: PracticalDutchExercise[];
  review: PracticalDutchReview;
};

export type PracticalDutchTopic = {
  id: "practical-dutch-supermarket-shopping";
  pathway: "shopping-and-cafes";
  title: PracticalDutchLanguage;
  description: PracticalDutchLanguage;
  lessons: [PracticalDutchLesson, PracticalDutchLesson];
  review: PracticalDutchReview;
};

export function validatePracticalDutchTopic(topic: PracticalDutchTopic): string[] {
  const errors: string[] = [];
  if (!isRecord(topic)) return ["topic: expected object"];
  if (topic.id !== "practical-dutch-supermarket-shopping") errors.push("topic.id: expected stable supermarket topic identifier");
  if (topic.pathway !== "shopping-and-cafes") errors.push("topic.pathway: expected shopping-and-cafes");
  if (!isLanguage(topic.title) || !isLanguage(topic.description)) errors.push("topic.metadata: expected reviewed multilingual metadata");
  if (!Array.isArray(topic.lessons) || topic.lessons.length !== 2 || new Set(topic.lessons.map((lesson) => lesson.cefr)).size !== 2) errors.push("topic.lessons: expected one A1 and one A2 lesson");
  if (!isReviewed(topic.review)) errors.push("topic.review: expected complete review metadata");
  for (const lesson of Array.isArray(topic.lessons) ? topic.lessons : []) errors.push(...validatePracticalDutchLesson(lesson).map((error) => `${isRecord(lesson) && typeof lesson.id === "string" ? lesson.id : "lesson"}: ${error}`));
  return errors;
}

export function validatePracticalDutchLesson(lesson: PracticalDutchLesson): string[] {
  const errors: string[] = [];
  if (!isRecord(lesson)) return ["expected lesson object"];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(lesson.id)) errors.push("id: expected stable identifier");
  if (!Number.isInteger(lesson.contentVersion) || lesson.contentVersion < 1) errors.push("contentVersion: expected positive version");
  if (!Number.isInteger(lesson.durationMinutes) || lesson.durationMinutes < 5 || lesson.durationMinutes > 7) errors.push("durationMinutes: expected five to seven minutes");
  if (!Array.isArray(lesson.context) || lesson.context.length < 4 || lesson.context.length > 8) errors.push("context: expected four to eight lines");
  if (!Array.isArray(lesson.sentences) || lesson.sentences.length < 8 || lesson.sentences.length > 12) errors.push("sentences: expected eight to twelve useful sentences");
  if (!Array.isArray(lesson.chunks) || lesson.chunks.length < 4 || lesson.chunks.length > 8) errors.push("chunks: expected four to eight chunks");
  if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 8 || lesson.vocabulary.length > 15) errors.push("vocabulary: expected eight to fifteen items");
  if (!Array.isArray(lesson.coreExercises) || lesson.coreExercises.length !== 6) errors.push("coreExercises: expected exactly six exercises");
  if (!Array.isArray(lesson.extraExercises) || lesson.extraExercises.length < 6 || lesson.extraExercises.length > 10) errors.push("extraExercises: expected six to ten optional exercises");
  const chunks = Array.isArray(lesson.chunks) ? lesson.chunks : [];
  const vocabulary = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
  const coreExercises = Array.isArray(lesson.coreExercises) ? lesson.coreExercises : [];
  const extraExercises = Array.isArray(lesson.extraExercises) ? lesson.extraExercises : [];
  const ids = new Set<string>();
  for (const item of [...chunks, ...vocabulary]) {
    if (!isRecord(item) || typeof item.id !== "string" || ids.has(item.id) || !isLanguage(item)) errors.push("items: expected unique reviewed trilingual items");
    if (isRecord(item) && typeof item.id === "string") ids.add(item.id);
  }
  for (const exercise of [...coreExercises, ...extraExercises]) errors.push(...validatePracticalDutchExercise(exercise).map((error) => `${isRecord(exercise) && typeof exercise.id === "string" ? exercise.id : "exercise"}: ${error}`));
  if (!isReviewed(lesson.review)) errors.push("review: expected complete review metadata");
  return errors;
}

function validatePracticalDutchExercise(exercise: PracticalDutchExercise): string[] {
  const errors: string[] = [];
  if (!isRecord(exercise)) return ["expected exercise object"];
  const choices = Array.isArray(exercise.choices) ? exercise.choices : [];
  const accepted = Array.isArray(exercise.accepted) ? exercise.accepted : [];
  const distractors = Array.isArray(exercise.distractors) ? exercise.distractors : [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(exercise.id)) errors.push("id: expected stable identifier");
  if (!isLanguage(exercise.prompt) || !isLanguage(exercise.context)) errors.push("prompt/context: expected trilingual copy");
  if ((exercise.kind === "choice" && choices.length < 2) || choices.length < 1 || new Set(choices).size !== choices.length) errors.push("choices: expected unique deterministic choices");
  if (exercise.kind === "order" && (!Array.isArray(exercise.tokens) || exercise.tokens.length < 2 || exercise.tokens.join(" ") !== accepted[0])) errors.push("tokens: expected ordered accepted answer");
  if (accepted.length === 0 || accepted.some((answer) => !choices.includes(answer))) errors.push("accepted: expected answer from choices");
  if (distractors.some((distractor) => !isRecord(distractor) || accepted.includes(distractor.answer as string) || !choices.includes(distractor.answer as string) || typeof distractor.misconception !== "string" || !distractor.misconception)) errors.push("distractors: expected safe misconception metadata");
  if (!isLanguage(exercise.feedback) || !isReviewed(exercise.review)) errors.push("review: expected reviewed feedback metadata");
  return errors;
}

function isLanguage(value: unknown): value is PracticalDutchLanguage {
  return isRecord(value) && typeof value.nl === "string" && typeof value.en === "string" && typeof value.te === "string";
}

function isReviewed(review: unknown): review is PracticalDutchReview {
  return isRecord(review) && typeof review.author === "string" && typeof review.reviewer === "string" && typeof review.reviewedAt === "string" && Array.isArray(review.sources) && typeof review.provenance === "string" && review.author.trim().length > 0 && review.reviewer.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) && review.sources.length > 0 && review.provenance.trim().length > 0 && review.reviewState === "second-review-complete";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
