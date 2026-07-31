export type VerbPracticeKind = "choice" | "token-slots" | "map-placement" | "token-order";
export type VerbPracticePhase = "core" | "repair";
export type VerbPracticeAnswer = string | string[];

export type VerbPracticeQuestion = {
  id: string;
  verbId: "verb.werken";
  journeyId: VerbPracticeJourneyId;
  formOrSkillId: "skill.werken.ott-routine" | "skill.werken.vtt-completed" | "skill.werken.ovt-background";
  exerciseFamily: string;
  delayedOrRecombined?: boolean;
  kind: VerbPracticeKind;
  prompt: string;
  context: string;
  choices?: string[];
  tokens?: string[];
  accepted: string[];
  feedback: string;
  incorrectFeedback: string;
  repairIds?: string[];
  phase?: VerbPracticePhase;
};

export type VerbPracticeAttempt = { questionId: string; phase: VerbPracticePhase; correct: boolean; feedback: string };
export type VerbPracticeResult = { correct: boolean; feedback: string; answer: string };
export type VerbPracticeSession = {
  journeyId: VerbPracticeJourneyId;
  coreIndex: number;
  currentRepairId: string | null;
  repairQueue: string[];
  repairCount: number;
  selectedAnswer: VerbPracticeAnswer | null;
  checked: boolean;
  lastResult: VerbPracticeResult | null;
  attempts: VerbPracticeAttempt[];
  completed: boolean;
};

export type VerbPracticeJourneyId = "journey.werken.ott-routine" | "journey.werken.vtt-completed" | "journey.werken.ovt-background";
const defaultJourneyId: VerbPracticeJourneyId = "journey.werken.vtt-completed";

type AuthoredVerbPracticeQuestion = Omit<VerbPracticeQuestion, "journeyId">;
type AuthoredVerbPracticePack = { questions: AuthoredVerbPracticeQuestion[]; repairs: AuthoredVerbPracticeQuestion[] };
type VerbPracticePack = { questions: VerbPracticeQuestion[]; repairs: VerbPracticeQuestion[] };

const ottQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.ott.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Ik werk meestal thuis.",
    choices: ["A usual work routine", "One completed event from yesterday", "A possible future plan"], accepted: ["A usual work routine"],
    feedback: "Correct. OTT describes a routine or present situation.", incorrectFeedback: "Meestal signals a usual routine: Ik werk meestal thuis.", repairIds: ["exercise.werken.ott.repair-stem", "exercise.werken.ott.repair-order"],
  },
  {
    id: "exercise.werken.ott.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the present phrase with taps.", context: "Complete: ___ thuis.",
    tokens: ["ik", "werk", "thuis"], accepted: ["ik werk thuis"], feedback: "Correct. With ik, werken uses the stem werk.", incorrectFeedback: "Use the stem werk after ik: ik werk thuis.",
  },
  {
    id: "exercise.werken.ott.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday answer.", context: "A colleague asks: What do you usually do?",
    choices: ["Ik werk meestal thuis.", "Ik heb gisteren thuis gewerkt.", "Ik werkte vroeger thuis."], accepted: ["Ik werk meestal thuis."],
    feedback: "Correct. OTT is the natural choice for a usual routine.", incorrectFeedback: "For a usual routine, choose Ik werk meestal thuis.",
  },
  {
    id: "exercise.werken.ott.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik werk meestal thuis.",
    choices: ["OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["OTT · onvoltooid tegenwoordige tijd"],
    feedback: "Correct. The present stem werk forms OTT.", incorrectFeedback: "The present stem werk forms OTT: onvoltooid tegenwoordige tijd.",
  },
  {
    id: "exercise.werken.ott.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Op maandag …",
    tokens: ["Op", "maandag", "werk", "ik", "op", "kantoor."], accepted: ["Op maandag werk ik op kantoor."],
    feedback: "Correct. After Op maandag, the finite verb werk comes before ik.", incorrectFeedback: "After Op maandag, put werk before ik: Op maandag werk ik op kantoor.",
  },
];

const ottRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.werken.ott.repair-stem", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "repair-stem", kind: "choice", prompt: "Repair the present phrase.", context: "Ik ___ thuis.", choices: ["werk", "werkte", "gewerkt"], accepted: ["werk"], feedback: "Correct. With ik, werken uses werk.", incorrectFeedback: "With ik in a present routine, use werk." },
  { id: "exercise.werken.ott.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.ott-routine", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a time phrase.", context: "Op maandag …", tokens: ["Op", "maandag", "werk", "ik", "thuis."], accepted: ["Op maandag werk ik thuis."], feedback: "Correct. Dutch keeps the finite verb in second position.", incorrectFeedback: "After Op maandag, put werk before ik: Op maandag werk ik thuis." },
];

const vttQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.vtt.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence report?", context: "Ik heb gisteren thuis gewerkt.",
    choices: ["A weekly work routine", "One completed event from yesterday", "A possible future plan"], accepted: ["One completed event from yesterday"],
    feedback: "Correct. VTT commonly reports a completed conversational fact.", incorrectFeedback: "Look at gisteren and heb gewerkt: this reports a completed event.", repairIds: ["exercise.werken.vtt.repair-auxiliary", "exercise.werken.vtt.repair-order"],
  },
  {
    id: "exercise.werken.vtt.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the completed phrase with taps.", context: "Complete: ___ gewerkt.",
    tokens: ["ik", "heb", "gewerkt"], accepted: ["ik heb gewerkt"], feedback: "Correct. Build VTT with ik + heb + gewerkt.", incorrectFeedback: "Use the auxiliary heb before the participle gewerkt.",
  },
  {
    id: "exercise.werken.vtt.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best conversational answer.", context: "A colleague asks: What did you do yesterday?",
    choices: ["Ik werk gisteren thuis.", "Ik heb gisteren thuis gewerkt.", "Ik had gisteren thuis werken."], accepted: ["Ik heb gisteren thuis gewerkt."],
    feedback: "Correct. VTT is the usual conversational choice for this standalone completed fact.", incorrectFeedback: "For this conversational context, choose Ik heb gisteren thuis gewerkt.",
  },
  {
    id: "exercise.werken.vtt.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik heb gisteren thuis gewerkt.",
    choices: ["OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["VTT · voltooid tegenwoordige tijd"],
    feedback: "Correct. The present auxiliary heb plus participle gewerkt forms VTT.", incorrectFeedback: "The present auxiliary heb plus participle gewerkt forms VTT.",
  },
  {
    id: "exercise.werken.vtt.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Gisteren …",
    tokens: ["Gisteren", "heb", "ik", "thuis", "gewerkt."], accepted: ["Gisteren heb ik thuis gewerkt."],
    feedback: "Correct. After Gisteren, the finite verb heb comes before ik.", incorrectFeedback: "After Gisteren, put the finite verb heb before ik: Gisteren heb ik thuis gewerkt.",
  },
];

const vttRepairs: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.vtt.repair-auxiliary", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the VTT phrase.", context: "Ik ___ gisteren gewerkt.",
    choices: ["heb", "hebt", "heeft"], accepted: ["heb"], feedback: "Correct. With ik, use heb: Ik heb gisteren gewerkt.", incorrectFeedback: "With ik, use heb before the participle gewerkt.",
  },
  {
    id: "exercise.werken.vtt.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a time phrase.", context: "Gisteren …",
    tokens: ["Gisteren", "heb", "ik", "gewerkt."], accepted: ["Gisteren heb ik gewerkt."], feedback: "Correct. Dutch keeps the finite verb in the second position.", incorrectFeedback: "After Gisteren, put heb before ik: Gisteren heb ik gewerkt.",
  },
];

const ovtQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.ovt.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Vroeger werkte ik vaak in een café.",
    choices: ["A past habit or background", "One completed event from yesterday", "A present routine"], accepted: ["A past habit or background"],
    feedback: "Correct. OVT gives past habits or story background.", incorrectFeedback: "Vroeger and vaak signal a past habit: Vroeger werkte ik vaak in een café.", repairIds: ["exercise.werken.ovt.repair-ending", "exercise.werken.ovt.repair-order"],
  },
  {
    id: "exercise.werken.ovt.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the past phrase with taps.", context: "Complete: Ik ___ daar.",
    tokens: ["werkte", "werk", "gewerkt"], accepted: ["werkte"], feedback: "Correct. The past singular of werken is werkte.", incorrectFeedback: "Use werkte for a past habit with ik.",
  },
  {
    id: "exercise.werken.ovt.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best story background.", context: "I used to work in a café.",
    choices: ["Vroeger werkte ik in een café.", "Ik werk in een café.", "Ik heb in een café gewerkt."], accepted: ["Vroeger werkte ik in een café."],
    feedback: "Correct. OVT naturally presents a past habit or story background.", incorrectFeedback: "For ‘used to’, choose Vroeger werkte ik in een café.",
  },
  {
    id: "exercise.werken.ovt.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Vroeger werkte ik vaak in een café.",
    choices: ["OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["OVT · onvoltooid verleden tijd"],
    feedback: "Correct. The past singular werkte forms OVT.", incorrectFeedback: "The past singular werkte forms OVT: onvoltooid verleden tijd.",
  },
  {
    id: "exercise.werken.ovt.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Vroeger …",
    tokens: ["Vroeger", "werkte", "ik", "naast", "mijn", "broer."], accepted: ["Vroeger werkte ik naast mijn broer."],
    feedback: "Correct. After Vroeger, the finite verb werkte comes before ik.", incorrectFeedback: "After Vroeger, put werkte before ik: Vroeger werkte ik naast mijn broer.",
  },
];

const ovtRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.werken.ovt.repair-ending", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "repair-ending", kind: "choice", prompt: "Repair the past phrase.", context: "Vroeger ___ ik daar.", choices: ["werkte", "werk", "gewerkt"], accepted: ["werkte"], feedback: "Correct. Use werkte for a past habit.", incorrectFeedback: "For a past habit with vroeger, use werkte." },
  { id: "exercise.werken.ovt.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.ovt-background", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a time phrase.", context: "Vroeger …", tokens: ["Vroeger", "werkte", "ik", "daar."], accepted: ["Vroeger werkte ik daar."], feedback: "Correct. Dutch keeps the finite verb in second position.", incorrectFeedback: "After Vroeger, put werkte before ik: Vroeger werkte ik daar." },
];

function assignJourneyId(journeyId: VerbPracticeJourneyId, pack: AuthoredVerbPracticePack): VerbPracticePack {
  return { questions: pack.questions.map((question) => ({ ...question, journeyId })), repairs: pack.repairs.map((question) => ({ ...question, journeyId })) };
}

const practicePacks: Record<VerbPracticeJourneyId, VerbPracticePack> = {
  "journey.werken.ott-routine": assignJourneyId("journey.werken.ott-routine", { questions: ottQuestions, repairs: ottRepairs }),
  "journey.werken.vtt-completed": assignJourneyId("journey.werken.vtt-completed", { questions: vttQuestions, repairs: vttRepairs }),
  "journey.werken.ovt-background": assignJourneyId("journey.werken.ovt-background", { questions: ovtQuestions, repairs: ovtRepairs }),
};
const allPracticeQuestions = Object.values(practicePacks).flatMap((pack) => [...pack.questions, ...pack.repairs]);
const questionById = new Map(allPracticeQuestions.map((question) => [question.id, question]));
const coreQuestionIds = new Set(Object.values(practicePacks).flatMap((pack) => pack.questions.map((question) => question.id)));

export function validateVerbPracticeContent(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const [journeyId, pack] of Object.entries(practicePacks)) {
    if (pack.questions.length !== 5) errors.push(`${journeyId}: expected five core questions`);
    if (pack.repairs.length > 2) errors.push(`${journeyId}: expected no more than two authored repairs`);
    for (const question of [...pack.questions, ...pack.repairs]) {
    if (question.journeyId !== journeyId) errors.push(`${question.id}: journey ownership does not match its authored pack`);
    if (!/^exercise\.[a-z0-9.-]+$/u.test(question.id)) errors.push(`${question.id}: invalid exercise identifier`);
    if (ids.has(question.id)) errors.push(`${question.id}: duplicate exercise identifier`);
    ids.add(question.id);
    if (!question.prompt || !question.context || !question.exerciseFamily || !question.feedback || !question.incorrectFeedback || question.accepted.length === 0) errors.push(`${question.id}: incomplete authored exercise`);
    if (question.kind === "choice" || question.kind === "map-placement") {
      if (!question.choices || question.choices.length < 2 || question.accepted.some((answer) => !question.choices?.includes(answer))) errors.push(`${question.id}: accepted answers must be enumerated in choices`);
    }
    if (question.kind === "token-slots" || question.kind === "token-order") {
      if (!question.tokens || question.tokens.length < 2 || question.accepted.some((answer) => answer.split(" ").some((token) => !question.tokens?.includes(token)))) errors.push(`${question.id}: accepted token answers must use enumerated tokens`);
    }
      for (const repairId of question.repairIds ?? []) if (!pack.repairs.some((repair) => repair.id === repairId)) errors.push(`${question.id}: repair ${repairId} is not authored in this journey`);
    }
  }
  return errors;
}

export function getVerbPracticeQuestions(journeyId: VerbPracticeJourneyId = defaultJourneyId): VerbPracticeQuestion[] {
  return practicePacks[journeyId].questions.map((question) => ({ ...question, phase: "core" }));
}

export function getVerbPracticeQuestionsForSkill(formOrSkillId: string): VerbPracticeQuestion[] {
  return Object.values(practicePacks).flatMap((pack) => pack.questions).filter((question) => question.formOrSkillId === formOrSkillId);
}

export function createVerbPracticeSession(journeyId: VerbPracticeJourneyId = defaultJourneyId): VerbPracticeSession {
  return { journeyId, coreIndex: 0, currentRepairId: null, repairQueue: [], repairCount: 0, selectedAnswer: null, checked: false, lastResult: null, attempts: [], completed: false };
}

export function getCurrentVerbPracticeQuestion(session: VerbPracticeSession): (VerbPracticeQuestion & { phase: VerbPracticePhase }) | null {
  if (session.completed) return null;
  const question = session.currentRepairId ? questionById.get(session.currentRepairId) : practicePacks[session.journeyId].questions[session.coreIndex];
  return question ? { ...question, phase: session.currentRepairId ? "repair" : "core" } : null;
}

export function getVerbPracticeQuestion(id: string): (VerbPracticeQuestion & { phase: VerbPracticePhase }) | null {
  const question = questionById.get(id);
  return question ? { ...question, phase: coreQuestionIds.has(id) ? "core" : "repair" } : null;
}

export function checkVerbPracticeAnswer(session: VerbPracticeSession, answer: VerbPracticeAnswer): { session: VerbPracticeSession; result: VerbPracticeResult } {
  const question = getCurrentVerbPracticeQuestion(session);
  if (!question) return { session, result: { correct: false, feedback: "This practice run is complete.", answer: "" } };
  const result = checkVerbPracticeQuestion(question, answer);
  const availableRepairs = Math.max(0, 2 - session.repairCount - session.repairQueue.length);
  const newRepairs = !result.correct && question.phase === "core" ? (question.repairIds ?? []).slice(0, availableRepairs) : [];
  const repairQueue = [...session.repairQueue, ...newRepairs];
  return {
    session: {
      ...session,
      selectedAnswer: answer,
      checked: true,
      lastResult: result,
      repairQueue,
      repairCount: session.repairCount + newRepairs.length,
      attempts: [...session.attempts, { questionId: question.id, phase: question.phase, correct: result.correct, feedback: result.feedback }],
    },
    result,
  };
}

export function checkVerbPracticeQuestion(question: VerbPracticeQuestion, answer: VerbPracticeAnswer): VerbPracticeResult {
  const normalizedAnswer = Array.isArray(answer) ? answer.join(" ") : answer;
  const correct = question.accepted.includes(normalizedAnswer);
  return { correct, feedback: correct ? question.feedback : question.incorrectFeedback, answer: normalizedAnswer };
}

export function advanceVerbPractice(session: VerbPracticeSession): VerbPracticeSession {
  if (!session.checked || !session.lastResult || session.completed) return session;
  let coreIndex = session.coreIndex;
  let currentRepairId: string | null = session.currentRepairId;
  let repairQueue = [...session.repairQueue];
  if (currentRepairId) {
    currentRepairId = repairQueue.shift() ?? null;
    if (!currentRepairId) coreIndex += 1;
  } else if (!session.lastResult.correct && repairQueue.length > 0) {
    currentRepairId = repairQueue.shift()!;
  } else {
    coreIndex += 1;
  }
  const completed = coreIndex >= practicePacks[session.journeyId].questions.length && currentRepairId === null;
  return { ...session, coreIndex, currentRepairId, repairQueue, selectedAnswer: null, checked: false, lastResult: null, completed };
}
