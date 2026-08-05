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
  if (topic.id !== "practical-dutch-supermarket-shopping") errors.push("topic.id: expected stable supermarket topic identifier");
  if (topic.pathway !== "shopping-and-cafes") errors.push("topic.pathway: expected shopping-and-cafes");
  if (!topic.title.nl || !topic.title.en || !topic.title.te || !topic.description.nl || !topic.description.en || !topic.description.te) errors.push("topic.metadata: expected reviewed multilingual metadata");
  if (!Array.isArray(topic.lessons) || topic.lessons.length !== 2 || new Set(topic.lessons.map((lesson) => lesson.cefr)).size !== 2) errors.push("topic.lessons: expected one A1 and one A2 lesson");
  if (!isReviewed(topic.review)) errors.push("topic.review: expected complete review metadata");
  for (const lesson of topic.lessons ?? []) errors.push(...validatePracticalDutchLesson(lesson).map((error) => `${lesson.id}: ${error}`));
  return errors;
}

export function validatePracticalDutchLesson(lesson: PracticalDutchLesson): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(lesson.id)) errors.push("id: expected stable identifier");
  if (!Number.isInteger(lesson.contentVersion) || lesson.contentVersion < 1) errors.push("contentVersion: expected positive version");
  if (!Number.isInteger(lesson.durationMinutes) || lesson.durationMinutes < 5 || lesson.durationMinutes > 7) errors.push("durationMinutes: expected five to seven minutes");
  if (lesson.context.length < 4 || lesson.context.length > 8) errors.push("context: expected four to eight lines");
  if (lesson.sentences.length < 8 || lesson.sentences.length > 12) errors.push("sentences: expected eight to twelve useful sentences");
  if (lesson.chunks.length < 4 || lesson.chunks.length > 8) errors.push("chunks: expected four to eight chunks");
  if (lesson.vocabulary.length < 8 || lesson.vocabulary.length > 15) errors.push("vocabulary: expected eight to fifteen items");
  if (lesson.coreExercises.length !== 6) errors.push("coreExercises: expected exactly six exercises");
  if (lesson.extraExercises.length < 6 || lesson.extraExercises.length > 10) errors.push("extraExercises: expected six to ten optional exercises");
  const ids = new Set<string>();
  for (const item of [...lesson.chunks, ...lesson.vocabulary]) {
    if (!item.id || ids.has(item.id) || !item.nl || !item.en || !item.te) errors.push("items: expected unique reviewed trilingual items");
    ids.add(item.id);
  }
  for (const exercise of [...lesson.coreExercises, ...lesson.extraExercises]) errors.push(...validatePracticalDutchExercise(exercise).map((error) => `${exercise.id}: ${error}`));
  if (!isReviewed(lesson.review)) errors.push("review: expected complete review metadata");
  return errors;
}

function validatePracticalDutchExercise(exercise: PracticalDutchExercise): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(exercise.id)) errors.push("id: expected stable identifier");
  if (!exercise.prompt.nl || !exercise.prompt.en || !exercise.prompt.te || !exercise.context.nl || !exercise.context.en || !exercise.context.te) errors.push("prompt/context: expected trilingual copy");
  if ((exercise.kind === "choice" && exercise.choices.length < 2) || exercise.choices.length < 1 || new Set(exercise.choices).size !== exercise.choices.length) errors.push("choices: expected unique deterministic choices");
  if (exercise.kind === "order" && (!exercise.tokens || exercise.tokens.length < 2 || exercise.tokens.join(" ") !== exercise.accepted[0])) errors.push("tokens: expected ordered accepted answer");
  if (exercise.accepted.length === 0 || exercise.accepted.some((answer) => !exercise.choices.includes(answer))) errors.push("accepted: expected answer from choices");
  if (exercise.distractors.some((distractor) => exercise.accepted.includes(distractor.answer) || !exercise.choices.includes(distractor.answer) || !distractor.misconception)) errors.push("distractors: expected safe misconception metadata");
  if (!exercise.feedback.nl || !exercise.feedback.en || !exercise.feedback.te || !isReviewed(exercise.review)) errors.push("review: expected reviewed feedback metadata");
  return errors;
}

function isReviewed(review: PracticalDutchReview): boolean {
  return Boolean(review.author.trim() && review.reviewer.trim() && /^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) && review.sources.length > 0 && review.provenance.trim() && review.reviewState === "second-review-complete");
}
