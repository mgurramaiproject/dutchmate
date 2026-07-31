export type VerbPracticeKind = "choice" | "token-slots" | "map-placement" | "token-order";
export type VerbPracticePhase = "core" | "repair";
export type VerbPracticeAnswer = string | string[];

export type VerbPracticeQuestion = {
  id: string;
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
  coreIndex: number;
  currentRepairId: string | null;
  repairQueue: string[];
  selectedAnswer: VerbPracticeAnswer | null;
  checked: boolean;
  lastResult: VerbPracticeResult | null;
  attempts: VerbPracticeAttempt[];
  completed: boolean;
};

const questions: VerbPracticeQuestion[] = [
  {
    id: "exercise.werken.vtt.meaning", kind: "choice", prompt: "What does this sentence report?", context: "Ik heb gisteren thuis gewerkt.",
    choices: ["A weekly work routine", "One completed event from yesterday", "A possible future plan"], accepted: ["One completed event from yesterday"],
    feedback: "Correct. VTT commonly reports a completed conversational fact.", incorrectFeedback: "Look at gisteren and heb gewerkt: this reports a completed event.", repairIds: ["exercise.werken.vtt.repair-auxiliary", "exercise.werken.vtt.repair-order"],
  },
  {
    id: "exercise.werken.vtt.construct", kind: "token-slots", prompt: "Build the completed phrase with taps.", context: "Complete: ___ gewerkt.",
    tokens: ["ik", "heb", "gewerkt"], accepted: ["ik heb gewerkt"], feedback: "Correct. Build VTT with ik + heb + gewerkt.", incorrectFeedback: "Use the auxiliary heb before the participle gewerkt.",
  },
  {
    id: "exercise.werken.vtt.natural-translation", kind: "choice", prompt: "Choose the best conversational answer.", context: "A colleague asks: What did you do yesterday?",
    choices: ["Ik werk gisteren thuis.", "Ik heb gisteren thuis gewerkt.", "Ik had gisteren thuis werken."], accepted: ["Ik heb gisteren thuis gewerkt."],
    feedback: "Correct. VTT is the usual conversational choice for this standalone completed fact.", incorrectFeedback: "For this conversational context, choose Ik heb gisteren thuis gewerkt.",
  },
  {
    id: "exercise.werken.vtt.map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik heb gisteren thuis gewerkt.",
    choices: ["OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["VTT · voltooid tegenwoordige tijd"],
    feedback: "Correct. The present auxiliary heb plus participle gewerkt forms VTT.", incorrectFeedback: "The present auxiliary heb plus participle gewerkt forms VTT.",
  },
  {
    id: "exercise.werken.vtt.word-order", kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Gisteren …",
    tokens: ["Gisteren", "heb", "ik", "thuis", "gewerkt."], accepted: ["Gisteren heb ik thuis gewerkt."],
    feedback: "Correct. After Gisteren, the finite verb heb comes before ik.", incorrectFeedback: "After Gisteren, put the finite verb heb before ik: Gisteren heb ik thuis gewerkt.",
  },
];

const repairs: VerbPracticeQuestion[] = [
  {
    id: "exercise.werken.vtt.repair-auxiliary", kind: "choice", prompt: "Repair the VTT phrase.", context: "Ik ___ gisteren gewerkt.",
    choices: ["heb", "hebt", "heeft"], accepted: ["heb"], feedback: "Correct. With ik, use heb: Ik heb gisteren gewerkt.", incorrectFeedback: "With ik, use heb before the participle gewerkt.",
  },
  {
    id: "exercise.werken.vtt.repair-order", kind: "token-order", prompt: "Repair the word order after a time phrase.", context: "Gisteren …",
    tokens: ["Gisteren", "heb", "ik", "gewerkt."], accepted: ["Gisteren heb ik gewerkt."], feedback: "Correct. Dutch keeps the finite verb in the second position.", incorrectFeedback: "After Gisteren, put heb before ik: Gisteren heb ik gewerkt.",
  },
];

const questionById = new Map([...questions, ...repairs].map((question) => [question.id, question]));

export function getVerbPracticeQuestions(): VerbPracticeQuestion[] {
  return questions.map((question) => ({ ...question, phase: "core" }));
}

export function createVerbPracticeSession(): VerbPracticeSession {
  return { coreIndex: 0, currentRepairId: null, repairQueue: [], selectedAnswer: null, checked: false, lastResult: null, attempts: [], completed: false };
}

export function getCurrentVerbPracticeQuestion(session: VerbPracticeSession): (VerbPracticeQuestion & { phase: VerbPracticePhase }) | null {
  if (session.completed) return null;
  const question = session.currentRepairId ? questionById.get(session.currentRepairId) : questions[session.coreIndex];
  return question ? { ...question, phase: session.currentRepairId ? "repair" : "core" } : null;
}

export function checkVerbPracticeAnswer(session: VerbPracticeSession, answer: VerbPracticeAnswer): { session: VerbPracticeSession; result: VerbPracticeResult } {
  const question = getCurrentVerbPracticeQuestion(session);
  if (!question) return { session, result: { correct: false, feedback: "This practice run is complete.", answer: "" } };
  const normalizedAnswer = Array.isArray(answer) ? answer.join(" ") : answer;
  const correct = question.accepted.includes(normalizedAnswer);
  const result = { correct, feedback: correct ? question.feedback : question.incorrectFeedback, answer: normalizedAnswer };
  const repairQueue = !correct && question.phase === "core" ? [...session.repairQueue, ...(question.repairIds ?? [])].slice(0, 2) : session.repairQueue;
  return {
    session: {
      ...session,
      selectedAnswer: answer,
      checked: true,
      lastResult: result,
      repairQueue,
      attempts: [...session.attempts, { questionId: question.id, phase: question.phase, correct, feedback: result.feedback }],
    },
    result,
  };
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
  const completed = coreIndex >= questions.length && currentRepairId === null;
  return { ...session, coreIndex, currentRepairId, repairQueue, selectedAnswer: null, checked: false, lastResult: null, completed };
}
