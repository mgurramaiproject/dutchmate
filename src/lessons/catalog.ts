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
const lessonPracticeReview: LessonPracticeReviewMetadata = {
  author: "DutchMate team",
  reviewState: "second-review-complete",
  reviewer: "Project owner",
  reviewedAt: "2026-07-30",
  sources: ["Original DutchMate-authored lesson content."],
  provenance: "Original DutchMate-authored lesson transfer task reviewed with its lesson micro-story; no copied sentence text.",
};
const lessonPracticeAccessibility: LessonPracticeAccessibility = { keyboard: true, focus: true, feedbackAnnouncement: true, narrowPopup: true };
const lessonPracticeMigration: LessonPracticeMigration = { policy: "compatible-additive", historyKey: "lesson-id-and-content-version" };

type LessonPracticeExerciseSeed = {
  candidateId: string;
  phrase: string;
  chooseContext: string;
  chooseDistractors: [string, string];
  repairContext: string;
  repairCorrect: string;
  repairDistractors: [string, string];
  orderContext: string;
  orderSentence: string;
};

function createLessonPracticeExercises(lessonId: string, seed: LessonPracticeExerciseSeed): LessonPracticeExercise[] {
  const review = lessonPracticeReview;
  return [
    {
      contentVersion: 1, id: `${lessonId}-contrast-form`, primitive: "contrast-form", candidateId: seed.candidateId, dimension: "recognition",
      prompt: "Choose the phrase that fits the situation.", context: seed.chooseContext, choices: [seed.phrase, ...seed.chooseDistractors], accepted: [seed.phrase],
      distractors: seed.chooseDistractors.map((answer) => ({ answer, misconception: "lesson-context-mismatch" })), feedback: `Use ${seed.phrase} here: ${seed.phrase}.`, review,
    },
    {
      contentVersion: 1, id: `${lessonId}-repair-choice`, primitive: "repair-choice", candidateId: seed.candidateId, dimension: "recall",
      prompt: seed.repairContext, context: "Choose the reviewed sentence.", choices: [seed.repairCorrect, ...seed.repairDistractors], accepted: [seed.repairCorrect],
      distractors: seed.repairDistractors.map((answer) => ({ answer, misconception: "lesson-form-or-order" })), feedback: `Use the reviewed form: ${seed.repairCorrect}`, review,
    },
    {
      contentVersion: 1, id: `${lessonId}-order-tokens`, primitive: "order-tokens", candidateId: seed.candidateId, dimension: "recall",
      prompt: "Build the sentence in the lesson context.", context: seed.orderContext, choices: [seed.orderSentence], tokens: seed.orderSentence.split(" "), accepted: [seed.orderSentence], distractors: [],
      feedback: `Build the sentence as: ${seed.orderSentence}`, review,
    },
  ];
}

export const introductionLesson: Lesson = {
  id: "a0-hallo-ik-ben", contentVersion: 1, pathway: "first-conversations", order: 1,
  cefr: "A0", title: "A0 · Hallo, ik ben…", durationMinutes: 3,
  pattern: "Ik ben…", patternText: "ik ben", patternExplanation: "Use ik ben… to say who you are. Add your name after the phrase.",
  lines: [
    { dutch: "Hallo, ik ben Ravi. Ik woon sinds kort in Utrecht.", english: "Hello, I am Ravi. I have lived in Utrecht for a short time.", telugu: "హలో, నేను రవి. నేను ఇటీవలే ఉట్రెహ్ట్‌లో నివసిస్తున్నాను." },
    { dutch: "Hallo Ravi, ik ben Noor. Leuk je te ontmoeten.", english: "Hello Ravi, I am Noor. Nice to meet you.", telugu: "హలో రవి, నేను నూర్. మిమ్మల్ని కలవడం ఆనందంగా ఉంది." },
    { dutch: "Leuk je te ontmoeten, Noor. Woon je hier ook?", english: "Nice to meet you, Noor. Do you live here too?", telugu: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది, నూర్. మీరు కూడా ఇక్కడే నివసిస్తున్నారా?" },
    { dutch: "Ja, ik woon vlakbij. Welkom in de buurt!", english: "Yes, I live nearby. Welcome to the neighbourhood!", telugu: "అవును, నేను దగ్గరలోనే నివసిస్తున్నాను. ఈ పరిసరాలకు స్వాగతం!" },
  ],
  candidates: [
    { id: "ik-ben", dutch: "ik ben", english: "I am", telugu: "నేను", kind: "chunk" },
    { id: "leuk-je-te-ontmoeten", dutch: "leuk je te ontmoeten", english: "nice to meet you", telugu: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది", kind: "chunk" },
    { id: "ik-woon", dutch: "ik woon", english: "I live", telugu: "నేను నివసిస్తున్నాను", kind: "chunk" },
    { id: "vlakbij", dutch: "vlakbij", english: "nearby", telugu: "దగ్గరలో", kind: "word" },
  ],
  practice: [
    { candidateId: "ik-ben", dimension: "recognition" }, { candidateId: "leuk-je-te-ontmoeten", dimension: "recall" },
    { candidateId: "ik-woon", dimension: "recognition" }, { candidateId: "vlakbij", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a0-hallo-ik-ben", {
    candidateId: "ik-ben", phrase: "ik ben", chooseContext: "You meet Noor and introduce yourself: ___ Ravi.", chooseDistractors: ["ik woon", "vlakbij"],
    repairContext: "Repair the introduction.", repairCorrect: "Hallo, ik ben Ravi.", repairDistractors: ["Hallo, ik woon Ravi.", "Hallo, vlakbij Ravi."], orderContext: "Say who you are.", orderSentence: "Ik ben Ravi.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  grammarCompanion: { id: "a0-zijn-present", contentVersion: 1, patternId: "a0-zijn-present" },
  practiceEnvelope: {
    contentVersion: 1,
    support: "guided",
    outcome: { primary: "Introduce yourself and say where you live.", supporting: ["Recognize ik ben and ik woon in a friendly introduction."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a0-hallo-ik-ben-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-ben",
      prompt: "You meet someone new. Choose the Dutch phrase to introduce yourself.",
      context: "You say who you are: ___ Ravi.",
      choices: ["ik ben", "ik woon", "vlakbij"],
      accepted: ["ik ben"],
      distractors: [{ answer: "ik woon", misconception: "location-not-identity" }, { answer: "vlakbij", misconception: "place-fragment-not-introduction" }],
      feedback: "Use ik ben to say who you are: Ik ben Ravi.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const hebbenLesson: Lesson = {
  id: "a0-ik-heb-dit-nodig", contentVersion: 1, pathway: "needs-and-routines", order: 1,
  cefr: "A0", title: "A0 · Ik heb dit nodig", durationMinutes: 3,
  pattern: "Ik heb dit nodig.", patternText: "Ik heb", patternExplanation: "Use hebben to say what you have or need. The form changes with the subject.",
  lines: [
    { dutch: "Voor mijn Nederlandse les heb ik een pen nodig.", english: "I need a pen for my Dutch lesson.", telugu: "నా డచ్ పాఠానికి నాకు ఒక పెన్ కావాలి." },
    { dutch: "Ik heb ook een schrift en een potlood bij me.", english: "I also have a notebook and a pencil with me.", telugu: "నా దగ్గర ఒక నోట్‌బుక్ మరియు పెన్సిల్ కూడా ఉన్నాయి." },
    { dutch: "Heb jij een gum? Ja, jij hebt een pen.", english: "Do you have an eraser? Yes, you have a pen.", telugu: "నీ దగ్గర రబ్బరు ఉందా? అవును, నీ దగ్గర ఒక పెన్ ఉంది." },
    { dutch: "Hebt u een extra schrift? U heeft geluk.", english: "Do you have an extra notebook? You are in luck.", telugu: "మీ దగ్గర అదనపు నోట్‌బుక్ ఉందా? మీ అదృష్టం బాగుంది." },
    { dutch: "Wij hebben alles voor de les en kunnen beginnen.", english: "We have everything for the lesson and can begin.", telugu: "పాఠానికి కావాల్సినవన్నీ మా దగ్గర ఉన్నాయి, మేము ప్రారంభించవచ్చు." },
  ],
  candidates: [
    { id: "ik-heb-dit-nodig", dutch: "ik heb dit nodig", english: "I need this", telugu: "నాకు ఇది కావాలి", kind: "chunk" },
    { id: "een-pen", dutch: "een pen", english: "a pen", telugu: "ఒక పెన్", kind: "word" },
    { id: "een-schrift", dutch: "een schrift", english: "a notebook", telugu: "ఒక నోట్‌బుక్", kind: "word" },
    { id: "een-potlood", dutch: "een potlood", english: "a pencil", telugu: "ఒక పెన్సిల్", kind: "word" },
  ],
  practice: [
    { candidateId: "ik-heb-dit-nodig", dimension: "recognition" }, { candidateId: "een-pen", dimension: "recall" },
    { candidateId: "een-schrift", dimension: "recognition" }, { candidateId: "een-potlood", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a0-ik-heb-dit-nodig", {
    candidateId: "ik-heb-dit-nodig", phrase: "ik heb dit nodig", chooseContext: "For class, say that you need a pen: ___ een pen.", chooseDistractors: ["ik woon hier", "woon je hier"],
    repairContext: "Repair the classroom request.", repairCorrect: "Ik heb dit nodig.", repairDistractors: ["Ik heb hier nodig.", "Ik woon dit nodig."], orderContext: "Say that you need this.", orderSentence: "Ik heb dit nodig.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "guided",
    outcome: { primary: "Say that you need a simple item.", supporting: ["Recognize ik heb dit nodig in a classroom or shopping situation."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a0-ik-heb-dit-nodig-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-heb-dit-nodig",
      prompt: "You need a pen for class. Choose the Dutch phrase to say that you need this.",
      context: "You need a pen: ___ een pen nodig.",
      choices: ["ik heb dit nodig", "ik woon hier", "ik ben beschikbaar"],
      accepted: ["ik heb dit nodig"],
      distractors: [{ answer: "ik woon hier", misconception: "place-not-need" }, { answer: "ik ben beschikbaar", misconception: "availability-not-need" }],
      feedback: "Use ik heb dit nodig to say that you need this: Ik heb dit nodig.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
  grammarCompanion: { id: "a0-hebben-present", contentVersion: 1, patternId: "a0-hebben-present" },
};

export const regularLesson: Lesson = {
  id: "a0-ik-woon-en-werk-hier", contentVersion: 1, pathway: "home-and-work", order: 1,
  cefr: "A0", title: "A0 · Ik woon en werk hier", durationMinutes: 3,
  pattern: "Ik woon en werk hier.", patternText: "Ik woon", patternExplanation: "Regular verbs usually use the stem with -t for jij, u, and one person, and the full -en form for plural subjects.",
  lines: [
    { dutch: "Ik woon in Utrecht en ik leer Nederlands.", english: "I live in Utrecht and I learn Dutch.", telugu: "నేను ఉట్రెహ్ట్‌లో నివసిస్తున్నాను మరియు డచ్ నేర్చుకుంటున్నాను." },
    { dutch: "Jij werkt in een café en je woont dichtbij.", english: "You work in a cafe and you live nearby.", telugu: "నువ్వు ఒక కేఫేలో పని చేస్తున్నావు మరియు దగ్గరలో నివసిస్తున్నావు." },
    { dutch: "U leert snel en u werkt elke dag.", english: "You learn quickly and you work every day.", telugu: "మీరు త్వరగా నేర్చుకుంటారు మరియు ప్రతిరోజూ పని చేస్తారు." },
    { dutch: "Hij maakt een plan voor de week.", english: "He makes a plan for the week.", telugu: "అతను వారానికి ఒక ప్రణాళిక తయారు చేస్తాడు." },
    { dutch: "Wij wonen en werken hier samen.", english: "We live and work here together.", telugu: "మేము ఇక్కడ కలిసి నివసిస్తూ పని చేస్తున్నాము." },
  ],
  candidates: [
    { id: "ik-woon-hier", dutch: "ik woon hier", english: "I live here", telugu: "నేను ఇక్కడ నివసిస్తున్నాను", kind: "chunk" },
    { id: "ik-leer-nederlands", dutch: "ik leer Nederlands", english: "I learn Dutch", telugu: "నేను డచ్ నేర్చుకుంటున్నాను", kind: "chunk" },
    { id: "je-werkt", dutch: "je werkt", english: "you work", telugu: "నువ్వు పని చేస్తున్నావు", kind: "chunk" },
    { id: "een-plan-maken", dutch: "een plan maken", english: "to make a plan", telugu: "ఒక ప్రణాళిక తయారు చేయడం", kind: "chunk" },
  ],
  practice: [
    { candidateId: "ik-woon-hier", dimension: "recognition" }, { candidateId: "ik-leer-nederlands", dimension: "recall" },
    { candidateId: "je-werkt", dimension: "recognition" }, { candidateId: "een-plan-maken", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a0-ik-woon-en-werk-hier", {
    candidateId: "ik-woon-hier", phrase: "ik woon hier", chooseContext: "Tell your new neighbour where you live: ___.", chooseDistractors: ["ik heb dit nodig", "woon je hier"],
    repairContext: "Repair the home-and-work statement.", repairCorrect: "Ik woon en werk hier.", repairDistractors: ["Ik woon en werkt hier.", "Ik woont en werk hier."], orderContext: "Say where you live.", orderSentence: "Ik woon hier.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "guided",
    outcome: { primary: "Say where you live and work in simple present tense.", supporting: ["Recognize ik woon hier and je werkt in everyday home-and-work situations."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a0-ik-woon-en-werk-hier-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-woon-hier",
      prompt: "You tell a new neighbour where you live. Choose the Dutch phrase.",
      context: "You say where you live: ___.",
      choices: ["ik woon hier", "ik heb dit nodig", "woon je hier"],
      accepted: ["ik woon hier"],
      distractors: [{ answer: "ik heb dit nodig", misconception: "need-not-place" }, { answer: "woon je hier", misconception: "question-not-statement" }],
      feedback: "Use ik woon hier to say where you live: Ik woon hier.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
  grammarCompanion: { id: "a0-regular-present", contentVersion: 1, patternId: "a0-regular-present" },
};

export const inversionLesson: Lesson = {
  id: "a0-woon-je-hier", contentVersion: 1, pathway: "home-and-work", order: 2,
  cefr: "A0", title: "A0 · Woon je hier?", durationMinutes: 3,
  pattern: "Woon je hier?", patternText: "Woon je hier", patternExplanation: "In a simple yes-or-no question, put the finite verb first. Before jij or je, the verb loses -t; before u, the reviewed -t stays.",
  lines: [
    { dutch: "Je woont nu in Utrecht. Woon je hier al lang?", english: "You live in Utrecht now. Have you lived here long?", telugu: "నువ్వు ఇప్పుడు ఉట్రెహ్ట్‌లో నివసిస్తున్నావు. నువ్వు ఇక్కడ చాలా కాలంగా ఉంటున్నావా?" },
    { dutch: "Ja, ik woon hier sinds kort en ik werk in de buurt.", english: "Yes, I have lived here for a short time and I work nearby.", telugu: "అవును, నేను కొద్దికాలంగా ఇక్కడ ఉంటున్నాను మరియు దగ్గరలో పని చేస్తున్నాను." },
    { dutch: "Werk je vandaag in het café? Nee, ik leer thuis.", english: "Are you working in the cafe today? No, I am learning at home.", telugu: "నువ్వు ఈరోజు కేఫేలో పని చేస్తున్నావా? లేదు, నేను ఇంట్లో నేర్చుకుంటున్నాను." },
    { dutch: "Werkt u morgen in de winkel?", english: "Are you working in the shop tomorrow?", telugu: "మీరు రేపు దుకాణంలో పని చేస్తున్నారా?" },
    { dutch: "Ja, ik werk morgen. Wij wonen dichtbij en gaan samen.", english: "Yes, I am working tomorrow. We live nearby and go together.", telugu: "అవును, నేను రేపు పని చేస్తున్నాను. మేము దగ్గరలో ఉంటాము మరియు కలిసి వెళ్తాము." },
  ],
  candidates: [
    { id: "woon-je-hier", dutch: "woon je hier", english: "do you live here", telugu: "నువ్వు ఇక్కడ నివసిస్తున్నావా", kind: "chunk" },
    { id: "werk-je-vandaag", dutch: "werk je vandaag", english: "are you working today", telugu: "నువ్వు ఈరోజు పని చేస్తున్నావా", kind: "chunk" },
    { id: "werkt-u-morgen", dutch: "werkt u morgen", english: "are you working tomorrow", telugu: "మీరు రేపు పని చేస్తున్నారా", kind: "chunk" },
    { id: "in-de-buurt", dutch: "in de buurt", english: "nearby", telugu: "దగ్గరలో", kind: "chunk" },
  ],
  practice: [
    { candidateId: "woon-je-hier", dimension: "recognition" }, { candidateId: "werk-je-vandaag", dimension: "recall" },
    { candidateId: "werkt-u-morgen", dimension: "recognition" }, { candidateId: "in-de-buurt", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a0-woon-je-hier", {
    candidateId: "woon-je-hier", phrase: "woon je hier", chooseContext: "Ask your neighbour whether they live here: ___.", chooseDistractors: ["ik woon hier", "werkt u morgen"],
    repairContext: "Repair the yes-or-no question.", repairCorrect: "Woon je hier?", repairDistractors: ["Je woont hier?", "Hier je woont?"], orderContext: "Ask whether someone lives here.", orderSentence: "Woon je hier?",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "guided",
    outcome: { primary: "Ask whether someone lives here.", supporting: ["Recognize verb-first yes-or-no questions about home and work."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a0-woon-je-hier-transfer",
      primitive: "choose-meaning",
      candidateId: "woon-je-hier",
      prompt: "You meet a neighbour. Choose the Dutch yes-or-no question about living here.",
      context: "Ask whether the person lives here: ___.",
      choices: ["woon je hier", "ik woon hier", "werkt u morgen"],
      accepted: ["woon je hier"],
      distractors: [{ answer: "ik woon hier", misconception: "statement-not-question" }, { answer: "werkt u morgen", misconception: "wrong-meaning" }],
      feedback: "Use woon je hier to ask whether someone lives here: Woon je hier?",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
  grammarCompanion: { id: "a0-yes-no-inversion", contentVersion: 1, patternId: "a0-yes-no-inversion" },
};

export const repetitionLesson: Lesson = {
  id: "a1-kunt-u-dat-herhalen", contentVersion: 1, pathway: "first-conversations", order: 2,
  cefr: "A1", title: "A1 · Kunt u dat herhalen?", durationMinutes: 3,
  pattern: "Kunt u dat herhalen?", patternText: "Kunt u dat herhalen", patternExplanation: "Use Kunt u dat herhalen? as a polite way to ask someone to say something again.",
  lines: [
    { dutch: "Sorry, ik begrijp het niet helemaal.", english: "Sorry, I do not understand it completely.", telugu: "క్షమించండి, నాకు అది పూర్తిగా అర్థం కాలేదు." },
    { dutch: "Geen probleem. Kunt u dat herhalen, alstublieft?", english: "No problem. Could you repeat that, please?", telugu: "సమస్య లేదు. దయచేసి మీరు దాన్ని మళ్లీ చెప్పగలరా?" },
    { dutch: "Natuurlijk. De trein vertrekt van spoor vier.", english: "Of course. The train leaves from platform four.", telugu: "తప్పకుండా. రైలు నాలుగో ప్లాట్‌ఫారం నుంచి బయలుదేరుతుంది." },
    { dutch: "Dank u. Kunt u dat herhalen als ik het vergeet?", english: "Thank you. Could you repeat that if I forget it?", telugu: "ధన్యవాదాలు. నేను మర్చిపోతే మీరు దాన్ని మళ్లీ చెప్పగలరా?" },
    { dutch: "Ja hoor: spoor vier, aan de rechterkant.", english: "Certainly: platform four, on the right-hand side.", telugu: "అవును: నాలుగో ప్లాట్‌ఫారం, కుడి వైపున." },
  ],
  candidates: [
    { id: "kunt-u-dat-herhalen", dutch: "kunt u dat herhalen", english: "could you repeat that", telugu: "మీరు దాన్ని మళ్లీ చెప్పగలరా", kind: "chunk" },
    { id: "alstublieft", dutch: "alstublieft", english: "please", telugu: "దయచేసి", kind: "word" },
    { id: "ik-begrijp-het-niet", dutch: "ik begrijp het niet", english: "I do not understand it", telugu: "నాకు అది అర్థం కాదు", kind: "chunk" },
    { id: "geen-probleem", dutch: "geen probleem", english: "no problem", telugu: "సమస్య లేదు", kind: "chunk" },
  ],
  practice: [
    { candidateId: "kunt-u-dat-herhalen", dimension: "recognition" }, { candidateId: "alstublieft", dimension: "recall" },
    { candidateId: "ik-begrijp-het-niet", dimension: "recognition" }, { candidateId: "geen-probleem", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-kunt-u-dat-herhalen", {
    candidateId: "kunt-u-dat-herhalen", phrase: "kunt u dat herhalen", chooseContext: "You did not understand the platform number. Ask politely: ___.", chooseDistractors: ["ik wil graag", "met pin betalen"],
    repairContext: "Repair the polite clarification.", repairCorrect: "Kunt u dat herhalen, alstublieft?", repairDistractors: ["Kunt dat u herhalen, alstublieft?", "U kunt dat herhalen niet?"], orderContext: "Ask someone to repeat the information.", orderSentence: "Kunt u dat herhalen?",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Ask someone to repeat information politely.", supporting: ["Recognize Kunt u dat herhalen? when you need clarification in a conversation."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-kunt-u-dat-herhalen-transfer",
      primitive: "choose-meaning",
      candidateId: "kunt-u-dat-herhalen",
      prompt: "You did not hear the platform number. Choose the polite Dutch request.",
      context: "You ask someone to repeat it: ___, alstublieft.",
      choices: ["kunt u dat herhalen", "ik wil graag", "met pin betalen"],
      accepted: ["kunt u dat herhalen"],
      distractors: [{ answer: "ik wil graag", misconception: "order-not-clarification" }, { answer: "met pin betalen", misconception: "payment-not-clarification" }],
      feedback: "Use Kunt u dat herhalen? to ask politely for repetition.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const cafeOrderLesson: Lesson = {
  id: "a1-ik-wil-graag-bestellen", contentVersion: 1, pathway: "shopping-and-cafes", order: 3,
  cefr: "A1", title: "A1 · Ik wil graag bestellen", durationMinutes: 4,
  pattern: "Ik wil graag…", patternText: "Ik wil graag", patternExplanation: "Use Ik wil graag… to order politely. Say what you want after the phrase.",
  lines: [
    { dutch: "In het café bekijk ik de kaart.", english: "In the cafe, I look at the menu.", telugu: "కేఫేలో నేను మెనూను చూస్తున్నాను." },
    { dutch: "Goedemiddag, wat wilt u drinken?", english: "Good afternoon, what would you like to drink?", telugu: "శుభ మధ్యాహ్నం, మీరు ఏమి తాగాలనుకుంటున్నారు?" },
    { dutch: "Ik wil graag een koffie met melk, alstublieft.", english: "I would like a coffee with milk, please.", telugu: "నాకు పాలతో ఒక కాఫీ కావాలి, దయచేసి." },
    { dutch: "Natuurlijk. Wilt u er ook iets bij?", english: "Of course. Would you like something with it too?", telugu: "తప్పకుండా. దానితో పాటు ఇంకేమైనా కావాలా?" },
    { dutch: "Ja, ik wil graag een broodje kaas.", english: "Yes, I would like a cheese roll.", telugu: "అవును, నాకు ఒక చీజ్ రోల్ కావాలి." },
    { dutch: "Dat komt zo. U kunt straks betalen.", english: "That will come shortly. You can pay in a moment.", telugu: "అది కాసేపట్లో వస్తుంది. మీరు కొద్దిసేపటికి చెల్లించవచ్చు." },
  ],
  candidates: [
    { id: "ik-wil-graag", dutch: "ik wil graag", english: "I would like", telugu: "నాకు కావాలి", kind: "chunk" },
    { id: "een-koffie-met-melk", dutch: "een koffie met melk", english: "a coffee with milk", telugu: "పాలతో ఒక కాఫీ", kind: "chunk" },
    { id: "iets-bij", dutch: "iets bij", english: "something with it", telugu: "దానితో పాటు ఇంకేదైనా", kind: "chunk" },
    { id: "graag", dutch: "graag", english: "please / gladly", telugu: "దయచేసి / ఇష్టంగా", kind: "word" },
  ],
  practice: [
    { candidateId: "ik-wil-graag", dimension: "recognition" }, { candidateId: "een-koffie-met-melk", dimension: "recall" },
    { candidateId: "iets-bij", dimension: "recognition" }, { candidateId: "graag", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-ik-wil-graag-bestellen", {
    candidateId: "ik-wil-graag", phrase: "ik wil graag", chooseContext: "At the café, start your order politely: ___ een koffie.", chooseDistractors: ["kunt u dat herhalen", "met pin betalen"],
    repairContext: "Repair the café order.", repairCorrect: "Ik wil graag een koffie met melk.", repairDistractors: ["Ik graag wil een koffie met melk.", "Ik wil een koffie graag met melk."], orderContext: "Start the polite order.", orderSentence: "Ik wil graag bestellen.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Order a drink or snack politely in a café.", supporting: ["Recognize Ik wil graag… before naming what you want."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-ik-wil-graag-bestellen-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-wil-graag",
      prompt: "You are ready to order in a café. Choose the Dutch phrase to start politely.",
      context: "You order a coffee: ___ een koffie met melk.",
      choices: ["ik wil graag", "kunt u dat herhalen", "met pin betalen"],
      accepted: ["ik wil graag"],
      distractors: [{ answer: "kunt u dat herhalen", misconception: "clarification-not-order" }, { answer: "met pin betalen", misconception: "payment-not-order" }],
      feedback: "Use Ik wil graag before saying what you would like to order.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const cardPaymentLesson: Lesson = {
  id: "a1-kan-ik-met-pin-betalen", contentVersion: 1, pathway: "shopping-and-cafes", order: 4,
  cefr: "A1", title: "A1 · Kan ik met pin betalen?", durationMinutes: 3,
  pattern: "Kan ik met pin betalen?", patternText: "met pin betalen", patternExplanation: "Use Kan ik met pin betalen? to ask whether you can pay by debit card.",
  lines: [
    { dutch: "Na het eten vraag ik om de rekening.", english: "After eating, I ask for the bill.", telugu: "తిన్న తర్వాత నేను బిల్లు అడుగుతాను." },
    { dutch: "Natuurlijk. Wilt u contant of met pin betalen?", english: "Of course. Would you like to pay with cash or by card?", telugu: "తప్పకుండా. మీరు నగదుతో లేదా కార్డుతో చెల్లించాలనుకుంటున్నారా?" },
    { dutch: "Kan ik met pin betalen? Ik heb geen contant geld.", english: "Can I pay by debit card? I do not have cash.", telugu: "నేను డెబిట్ కార్డుతో చెల్లించవచ్చా? నా దగ్గర నగదు లేదు." },
    { dutch: "Ja, u kunt met pin betalen. Houd uw pas hier even tegenaan.", english: "Yes, you can pay by debit card. Hold your card against the reader for a moment.", telugu: "అవును, మీరు డెబిట్ కార్డుతో చెల్లించవచ్చు. మీ కార్డును క్షణం ఇక్కడ తాకించండి." },
    { dutch: "Dank u. De betaling is gelukt.", english: "Thank you. The payment worked.", telugu: "ధన్యవాదాలు. చెల్లింపు విజయవంతమైంది." },
  ],
  candidates: [
    { id: "met-pin-betalen", dutch: "met pin betalen", english: "to pay by debit card", telugu: "డెబిట్ కార్డుతో చెల్లించడం", kind: "chunk" },
    { id: "contant-geld", dutch: "contant geld", english: "cash", telugu: "నగదు", kind: "chunk" },
    { id: "de-rekening", dutch: "de rekening", english: "the bill", telugu: "బిల్లు", kind: "word" },
    { id: "is-gelukt", dutch: "is gelukt", english: "worked", telugu: "విజయవంతమైంది", kind: "chunk" },
  ],
  practice: [
    { candidateId: "met-pin-betalen", dimension: "recognition" }, { candidateId: "contant-geld", dimension: "recall" },
    { candidateId: "de-rekening", dimension: "recognition" }, { candidateId: "is-gelukt", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-kan-ik-met-pin-betalen", {
    candidateId: "met-pin-betalen", phrase: "met pin betalen", chooseContext: "The cashier asks how you will pay: Ik wil ___.", chooseDistractors: ["graag bestellen", "dat herhalen"],
    repairContext: "Repair the payment question.", repairCorrect: "Kan ik met pin betalen?", repairDistractors: ["Kan met pin ik betalen?", "Ik kan met pin betalen?"], orderContext: "Ask whether you can pay by debit card.", orderSentence: "Kan ik met pin betalen?",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Ask whether you can pay by debit card.", supporting: ["Recognize met pin betalen in a practical payment exchange."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-kan-ik-met-pin-betalen-transfer",
      primitive: "choose-meaning",
      candidateId: "met-pin-betalen",
      prompt: "The café asks how you will pay. Choose the Dutch phrase about paying by debit card.",
      context: "You say you will pay by card: Ik wil ___ .",
      choices: ["met pin betalen", "ik wil graag", "kunt u dat herhalen"],
      accepted: ["met pin betalen"],
      distractors: [{ answer: "ik wil graag", misconception: "ordering-not-payment" }, { answer: "kunt u dat herhalen", misconception: "clarification-not-payment" }],
      feedback: "Use met pin betalen to say that you will pay by debit card.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const transferLesson: Lesson = {
  id: "a1-waar-moet-ik-overstappen", contentVersion: 1, pathway: "transport", order: 5,
  cefr: "A1", title: "A1 · Waar moet ik overstappen?", durationMinutes: 3,
  pattern: "Waar moet ik overstappen?", patternText: "moet ik overstappen", patternExplanation: "Use moet ik overstappen to ask where you need to change trains.",
  lines: [
    { dutch: "Op station Utrecht Centraal kijk ik naar het bord.", english: "At Utrecht Central station, I look at the board.", telugu: "ఉట్రెహ్ట్ సెంట్రల్ స్టేషన్‌లో నేను బోర్డును చూస్తున్నాను." },
    { dutch: "Excuseer, waar moet ik overstappen voor de trein naar Rotterdam?", english: "Excuse me, where do I need to change for the train to Rotterdam?", telugu: "క్షమించండి, రోటర్‌డామ్‌కు వెళ్లే రైలు కోసం నేను ఎక్కడ మారాలి?" },
    { dutch: "U moet op spoor acht overstappen.", english: "You need to change at platform eight.", telugu: "మీరు ఎనిమిదో ప్లాట్‌ఫారమ్‌లో మారాలి." },
    { dutch: "Moet ik overstappen als ik daar aankom?", english: "Do I need to change when I get there?", telugu: "నేను అక్కడికి చేరుకున్నప్పుడు మారాలా?" },
    { dutch: "Nee, de aansluiting vertrekt over vijf minuten.", english: "No, the connecting train leaves in five minutes.", telugu: "లేదు, కనెక్షన్ రైలు ఐదు నిమిషాల్లో బయలుదేరుతుంది." },
    { dutch: "Dank u, dan loop ik snel naar spoor acht.", english: "Thank you, then I will walk quickly to platform eight.", telugu: "ధన్యవాదాలు, నేను త్వరగా ఎనిమిదో ప్లాట్‌ఫారమ్‌కు వెళ్తాను." },
  ],
  candidates: [
    { id: "waar-moet-ik-overstappen", dutch: "waar moet ik overstappen", english: "where do I need to change", telugu: "నేను ఎక్కడ మారాలి", kind: "chunk" },
    { id: "overstappen", dutch: "overstappen", english: "to change trains", telugu: "రైలు మారడం", kind: "word" },
    { id: "spoor-acht", dutch: "spoor acht", english: "platform eight", telugu: "ఎనిమిదో ప్లాట్‌ఫారమ్", kind: "chunk" },
    { id: "de-aansluiting", dutch: "de aansluiting", english: "the connection", telugu: "కనెక్షన్", kind: "chunk" },
  ],
  practice: [
    { candidateId: "waar-moet-ik-overstappen", dimension: "recognition" }, { candidateId: "overstappen", dimension: "recall" },
    { candidateId: "spoor-acht", dimension: "recognition" }, { candidateId: "de-aansluiting", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-waar-moet-ik-overstappen", {
    candidateId: "waar-moet-ik-overstappen", phrase: "waar moet ik overstappen", chooseContext: "At the station, ask where you need to change: ___.", chooseDistractors: ["mijn trein is vertraagd", "spoor acht"],
    repairContext: "Repair the transport question.", repairCorrect: "Waar moet ik overstappen?", repairDistractors: ["Waar ik moet overstappen?", "Waar moet overstappen ik?"], orderContext: "Ask where you need to change trains.", orderSentence: "Waar moet ik overstappen?",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Ask where to change trains at a station.", supporting: ["Recognize the key transport question in a real platform exchange."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-waar-moet-ik-overstappen-transfer",
      primitive: "choose-meaning",
      candidateId: "waar-moet-ik-overstappen",
      prompt: "You need to change trains but do not know where. Choose the Dutch question.",
      context: "At the station, ask where you need to change: ___.",
      choices: ["waar moet ik overstappen", "mijn trein is vertraagd", "spoor acht"],
      accepted: ["waar moet ik overstappen"],
      distractors: [{ answer: "mijn trein is vertraagd", misconception: "delay-not-change-location" }, { answer: "spoor acht", misconception: "platform-answer-not-question" }],
      feedback: "Use waar moet ik overstappen to ask where you need to change trains.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const delayedTrainLesson: Lesson = {
  id: "a1-mijn-trein-is-vertraagd", contentVersion: 1, pathway: "transport", order: 6,
  cefr: "A1", title: "A1 · Mijn trein is vertraagd", durationMinutes: 3,
  pattern: "Mijn trein is vertraagd.", patternText: "trein is vertraagd", patternExplanation: "Use mijn trein is vertraagd to explain that your train is late.",
  lines: [
    { dutch: "Op het perron wacht ik op de trein naar Amsterdam.", english: "On the platform, I am waiting for the train to Amsterdam.", telugu: "ప్లాట్‌ఫారమ్‌పై నేను ఆమ్స్టర్డామ్‌కు వెళ్లే రైలు కోసం ఎదురు చూస్తున్నాను." },
    { dutch: "Op het scherm staat dat mijn trein is vertraagd.", english: "The screen says that my train is delayed.", telugu: "నా రైలు ఆలస్యం అయిందని తెరపై ఉంది." },
    { dutch: "De trein is vertraagd door een storing op het spoor.", english: "The train is delayed because of a disruption on the track.", telugu: "పట్టాలపై అంతరాయం వల్ల రైలు ఆలస్యం అయింది." },
    { dutch: "Hoe laat vertrekt hij nu?", english: "What time does it leave now?", telugu: "ఇప్పుడు అది ఎప్పుడు బయలుదేరుతుంది?" },
    { dutch: "Hij vertrekt twintig minuten later van spoor drie.", english: "It leaves twenty minutes later from platform three.", telugu: "అది ఇరవై నిమిషాల తర్వాత మూడో ప్లాట్‌ఫారమ్ నుంచి బయలుదేరుతుంది." },
    { dutch: "Bedankt, dan stuur ik mijn collega een bericht.", english: "Thank you, then I will send my colleague a message.", telugu: "ధన్యవాదాలు, నేను నా సహోద్యోగికి సందేశం పంపుతాను." },
  ],
  candidates: [
    { id: "mijn-trein-is-vertraagd", dutch: "mijn trein is vertraagd", english: "my train is delayed", telugu: "నా రైలు ఆలస్యం అయింది", kind: "chunk" },
    { id: "een-storing", dutch: "een storing", english: "a disruption", telugu: "అంతరాయం", kind: "chunk" },
    { id: "twintig-minuten-later", dutch: "twintig minuten later", english: "twenty minutes later", telugu: "ఇరవై నిమిషాల తర్వాత", kind: "chunk" },
    { id: "een-bericht", dutch: "een bericht", english: "a message", telugu: "సందేశం", kind: "chunk" },
  ],
  practice: [
    { candidateId: "mijn-trein-is-vertraagd", dimension: "recognition" }, { candidateId: "een-storing", dimension: "recall" },
    { candidateId: "twintig-minuten-later", dimension: "recognition" }, { candidateId: "een-bericht", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-mijn-trein-is-vertraagd", {
    candidateId: "mijn-trein-is-vertraagd", phrase: "mijn trein is vertraagd", chooseContext: "Tell your colleague about the train: ___.", chooseDistractors: ["waar moet ik overstappen", "een bericht"],
    repairContext: "Repair the delay report.", repairCorrect: "Mijn trein is vertraagd.", repairDistractors: ["Mijn trein zijn vertraagd.", "Mijn vertraagd trein is."], orderContext: "Report that your train is delayed.", orderSentence: "Mijn trein is vertraagd.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Tell someone that your train is delayed.", supporting: ["Recognize a simple delay report and respond with the next practical detail."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-mijn-trein-is-vertraagd-transfer",
      primitive: "choose-meaning",
      candidateId: "mijn-trein-is-vertraagd",
      prompt: "The station screen shows a delay. Choose the Dutch sentence to report it.",
      context: "Tell your colleague about the train: ___.",
      choices: ["mijn trein is vertraagd", "waar moet ik overstappen", "een bericht"],
      accepted: ["mijn trein is vertraagd"],
      distractors: [{ answer: "waar moet ik overstappen", misconception: "change-location-not-delay" }, { answer: "een bericht", misconception: "object-not-delay-report" }],
      feedback: "Use mijn trein is vertraagd to report that your train is delayed.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const appointmentLesson: Lesson = {
  id: "a1-een-afspraak-maken", contentVersion: 2, pathway: "appointments-and-healthcare", order: 7,
  cefr: "A1", title: "A1 · Een afspraak maken", durationMinutes: 4,
  pattern: "Ik wil graag…", patternText: "Ik wil graag", patternExplanation: "Use Ik wil graag… to make a polite request. The verb stays in its normal position after ik.",
  lines: [
    { dutch: "Receptionist: Goedemorgen. Waarmee kan ik u helpen?", english: "Receptionist: Good morning. How can I help you?", telugu: "రిసెప్షనిస్ట్: శుభోదయం. నేను మీకు ఎలా సహాయం చేయగలను?" },
    { dutch: "Ik wil graag een afspraak maken met de huisarts.", english: "I would like to make an appointment with the GP.", telugu: "నేను కుటుంబ వైద్యుడితో అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను." },
    { dutch: "Natuurlijk. Wanneer kunt u langskomen?", english: "Of course. When can you come by?", telugu: "తప్పకుండా. మీరు ఎప్పుడు రావచ్చు?" },
    { dutch: "Ik wil graag dinsdagmiddag, als het kan.", english: "I would like Tuesday afternoon, if possible.", telugu: "వీలైతే, నాకు మంగళవారం మధ్యాహ్నం కావాలి." },
    { dutch: "Dinsdag om drie uur is nog vrij.", english: "Tuesday at three o'clock is still free.", telugu: "మంగళవారం మూడు గంటలకు ఇంకా ఖాళీగా ఉంది." },
    { dutch: "Dat is goed. Bedankt en tot dinsdag.", english: "That is good. Thank you and see you Tuesday.", telugu: "అది బాగుంది. ధన్యవాదాలు, మంగళవారం కలుద్దాం." },
  ],
  candidates: [
    { id: "ik-wil-graag", dutch: "ik wil graag", english: "I would like", telugu: "నేను కోరుకుంటున్నాను", kind: "chunk" },
    { id: "afspraak", dutch: "de afspraak", english: "the appointment", telugu: "అపాయింట్‌మెంట్", kind: "word" },
    { id: "afspraak-maken", dutch: "een afspraak maken", english: "to make an appointment", telugu: "అపాయింట్‌మెంట్ తీసుకోవడం", kind: "chunk" },
    { id: "als-het-kan", dutch: "als het kan", english: "if possible", telugu: "వీలైతే", kind: "chunk" },
  ],
  practice: [
    { candidateId: "ik-wil-graag", dimension: "recognition" }, { candidateId: "afspraak-maken", dimension: "recall" },
    { candidateId: "als-het-kan", dimension: "recognition" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-een-afspraak-maken", {
    candidateId: "ik-wil-graag", phrase: "ik wil graag", chooseContext: "At the GP reception, make a polite request: ___ een afspraak maken.", chooseDistractors: ["ik heb last van", "mijn trein is vertraagd"],
    repairContext: "Repair the appointment request.", repairCorrect: "Ik wil graag een afspraak maken.", repairDistractors: ["Ik wil een afspraak graag maken.", "Ik graag wil een afspraak maken."], orderContext: "Ask to make an appointment.", orderSentence: "Ik wil graag een afspraak maken.",
  }),
  contrastCompanion: { id: "contrast.main_clause_inversion", contentVersion: 1 },
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Make a polite request for an appointment.", supporting: ["Recognize ik wil graag in a short reception-desk exchange."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-een-afspraak-maken-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-wil-graag",
      prompt: "You are calling a clinic. Choose the Dutch phrase to make a polite request.",
      context: "Ask politely for an appointment: ___ een afspraak maken.",
      choices: ["ik wil graag", "ik heb last van", "mijn trein is vertraagd"],
      accepted: ["ik wil graag"],
      distractors: [{ answer: "ik heb last van", misconception: "symptom-not-request" }, { answer: "mijn trein is vertraagd", misconception: "transport-not-request" }],
      feedback: "Use ik wil graag to make a polite request: Ik wil graag een afspraak maken.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

export const symptomsLesson: Lesson = {
  id: "a1-ik-heb-last-van", contentVersion: 1, pathway: "appointments-and-healthcare", order: 8,
  cefr: "A1", title: "A1 · Ik heb last van…", durationMinutes: 3,
  pattern: "Ik heb last van…", patternText: "Ik heb last van", patternExplanation: "Use ik heb last van… to describe a symptom when arranging care, without needing to explain its cause.",
  lines: [
    { dutch: "Goedemiddag, ik wil graag een afspraak maken bij de huisarts.", english: "Good afternoon, I would like to make an appointment with the GP.", telugu: "శుభ మధ్యాహ్నం, నేను కుటుంబ వైద్యుడితో అపాయింట్‌మెంట్ తీసుకోవాలనుకుంటున్నాను." },
    { dutch: "Wat is er aan de hand?", english: "What is the matter?", telugu: "ఏమైంది?" },
    { dutch: "Ik heb last van mijn keel en ik voel mij niet goed.", english: "I have trouble with my throat and I do not feel well.", telugu: "నాకు గొంతు నొప్పిగా ఉంది మరియు నాకు బాగా అనిపించడం లేదు." },
    { dutch: "Ik heb last van hoofdpijn sinds gisteren.", english: "I have had a headache since yesterday.", telugu: "నిన్నటి నుంచి నాకు తలనొప్పి ఉంది." },
    { dutch: "De huisarts kan u morgen bellen.", english: "The GP can call you tomorrow.", telugu: "కుటుంబ వైద్యుడు రేపు మీకు ఫోన్ చేయవచ్చు." },
    { dutch: "Dank u, dat is fijn.", english: "Thank you, that is good.", telugu: "ధన్యవాదాలు, అది బాగుంది." },
  ],
  candidates: [
    { id: "ik-heb-last-van", dutch: "ik heb last van", english: "I have trouble with", telugu: "నాకు ఇబ్బంది ఉంది", kind: "chunk" },
    { id: "mijn-keel", dutch: "mijn keel", english: "my throat", telugu: "నా గొంతు", kind: "chunk" },
    { id: "hoofdpijn", dutch: "hoofdpijn", english: "headache", telugu: "తలనొప్పి", kind: "word" },
    { id: "de-huisarts", dutch: "de huisarts", english: "the GP", telugu: "కుటుంబ వైద్యుడు", kind: "chunk" },
  ],
  practice: [
    { candidateId: "ik-heb-last-van", dimension: "recognition" }, { candidateId: "mijn-keel", dimension: "recall" },
    { candidateId: "hoofdpijn", dimension: "recognition" }, { candidateId: "de-huisarts", dimension: "recall" },
  ],
  practiceExercises: createLessonPracticeExercises("a1-ik-heb-last-van", {
    candidateId: "ik-heb-last-van", phrase: "ik heb last van", chooseContext: "Tell the GP receptionist about your throat: ___ mijn keel.", chooseDistractors: ["ik wil graag", "de huisarts"],
    repairContext: "Repair the symptom description.", repairCorrect: "Ik heb last van mijn keel.", repairDistractors: ["Ik heb mijn keel last van.", "Ik last heb van mijn keel."], orderContext: "Describe trouble with your throat.", orderSentence: "Ik heb last van mijn keel.",
  }),
  review: { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true },
  practiceEnvelope: {
    contentVersion: 1,
    support: "reduced",
    outcome: { primary: "Describe a symptom when arranging care.", supporting: ["Recognize ik heb last van without guessing a diagnosis or cause."] },
    coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
    transfer: {
      id: "a1-ik-heb-last-van-transfer",
      primitive: "choose-meaning",
      candidateId: "ik-heb-last-van",
      prompt: "You are speaking to the GP receptionist. Choose the Dutch phrase to describe a symptom.",
      context: "Say that you have trouble with your throat: ___ mijn keel.",
      choices: ["ik heb last van", "ik wil graag", "de huisarts"],
      accepted: ["ik heb last van"],
      distractors: [{ answer: "ik wil graag", misconception: "request-not-symptom" }, { answer: "de huisarts", misconception: "person-not-symptom-report" }],
      feedback: "Use ik heb last van to describe a symptom without adding an unsupported diagnosis.",
    },
    accessibility: lessonPracticeAccessibility,
    migration: lessonPracticeMigration,
    review: lessonPracticeReview,
  },
};

const reviewed = { dutch: true, english: true, telugu: true, cefr: true, cultural: true, practicalUse: true } as const;
export const brokenThingLesson: Lesson = { id: "a1-er-is-iets-kapot", contentVersion: 1, pathway: "home", order: 9, cefr: "A1", title: "A1 · Er is iets kapot", durationMinutes: 3, pattern: "Er is iets kapot.", patternText: "Er is iets kapot", patternExplanation: "Use er is iets kapot to report that something is broken.", lines: [
  { dutch: "In mijn keuken doet de kraan het niet meer.", english: "In my kitchen, the tap no longer works.", telugu: "నా వంటగదిలో కుళాయి ఇక పనిచేయడం లేదు." }, { dutch: "Er is iets kapot in de keuken.", english: "Something is broken in the kitchen.", telugu: "వంటగదిలో ఏదో పాడైంది." }, { dutch: "De verhuurder vraagt wat er precies kapot is.", english: "The landlord asks what exactly is broken.", telugu: "ఏమి పాడైందో యజమాని అడుగుతారు." }, { dutch: "Er is iets kapot aan de kraan, hij lekt.", english: "Something is broken with the tap; it leaks.", telugu: "కుళాయికి ఏదో పాడైంది; అది కారుతోంది." }, { dutch: "Morgen komt iemand kijken en het repareren.", english: "Someone will come tomorrow to look at it and repair it.", telugu: "రేపు ఎవరో వచ్చి చూసి మరమ్మతు చేస్తారు." },
], candidates: [{ id: "er-is-iets-kapot", dutch: "er is iets kapot", english: "something is broken", telugu: "ఏదో పాడైంది", kind: "chunk" }, { id: "de-kraan", dutch: "de kraan", english: "the tap", telugu: "కుళాయి", kind: "word" }, { id: "het-lekt", dutch: "het lekt", english: "it leaks", telugu: "అది కారుతోంది", kind: "chunk" }, { id: "repareren", dutch: "repareren", english: "to repair", telugu: "మరమ్మతు చేయడం", kind: "word" }], practice: [{ candidateId: "er-is-iets-kapot", dimension: "recognition" }, { candidateId: "de-kraan", dimension: "recall" }, { candidateId: "het-lekt", dimension: "recognition" }, { candidateId: "repareren", dimension: "recall" }], practiceExercises: createLessonPracticeExercises("a1-er-is-iets-kapot", { candidateId: "er-is-iets-kapot", phrase: "er is iets kapot", chooseContext: "Tell your landlord about the kitchen: ___.", chooseDistractors: ["ik ben beschikbaar", "wat moet ik meenemen"], repairContext: "Repair the report about the broken item.", repairCorrect: "Er is iets kapot.", repairDistractors: ["Er iets is kapot.", "Er is kapot iets."], orderContext: "Report the problem.", orderSentence: "Er is iets kapot." }), review: reviewed, practiceEnvelope: {
  contentVersion: 1, support: "reduced",
  outcome: { primary: "Report that something is broken at home.", supporting: ["Recognize er is iets kapot and give a simple repair context."] },
  coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
  transfer: { id: "a1-er-is-iets-kapot-transfer", primitive: "choose-meaning", candidateId: "er-is-iets-kapot", prompt: "You need to tell your landlord about a broken item. Choose the Dutch sentence.", context: "Report the problem in your kitchen: ___ .", choices: ["er is iets kapot", "ik ben beschikbaar", "wat moet ik meenemen"], accepted: ["er is iets kapot"], distractors: [{ answer: "ik ben beschikbaar", misconception: "availability-not-breakage" }, { answer: "wat moet ik meenemen", misconception: "bring-question-not-breakage" }], feedback: "Use er is iets kapot to report that something is broken." },
  accessibility: lessonPracticeAccessibility,
  migration: lessonPracticeMigration,
  review: lessonPracticeReview,
} };
export const availabilityLesson: Lesson = { id: "a1-ik-ben-beschikbaar-op", contentVersion: 1, pathway: "work-and-study", order: 10, cefr: "A1", title: "A1 · Ik ben beschikbaar op…", durationMinutes: 3, pattern: "Ik ben beschikbaar op…", patternText: "Ik ben beschikbaar", patternExplanation: "Use ik ben beschikbaar to say when you are free.", lines: [
  { dutch: "Mijn collega vraagt wanneer ik kan werken.", english: "My colleague asks when I can work.", telugu: "నేను ఎప్పుడు పని చేయగలనో నా సహోద్యోగి అడుగుతారు." }, { dutch: "Ik ben beschikbaar op maandag en woensdag.", english: "I am available on Monday and Wednesday.", telugu: "నేను సోమవారం మరియు బుధవారం అందుబాటులో ఉన్నాను." }, { dutch: "Ben je ook in de middag beschikbaar?", english: "Are you also available in the afternoon?", telugu: "మీరు మధ్యాహ్నం కూడా అందుబాటులో ఉన్నారా?" }, { dutch: "Ja, ik ben beschikbaar vanaf twee uur.", english: "Yes, I am available from two o'clock.", telugu: "అవును, నేను రెండు గంటల నుంచి అందుబాటులో ఉన్నాను." }, { dutch: "Prima, dan zetten we je op het rooster.", english: "Great, then we will put you on the schedule.", telugu: "బాగుంది, అప్పుడు మిమ్మల్ని షెడ్యూల్‌లో పెడతాము." },
], candidates: [{ id: "ik-ben-beschikbaar", dutch: "ik ben beschikbaar", english: "I am available", telugu: "నేను అందుబాటులో ఉన్నాను", kind: "chunk" }, { id: "vanaf-twee-uur", dutch: "vanaf twee uur", english: "from two o'clock", telugu: "రెండు గంటల నుంచి", kind: "chunk" }, { id: "de-middag", dutch: "de middag", english: "the afternoon", telugu: "మధ్యాహ్నం", kind: "word" }, { id: "het-rooster", dutch: "het rooster", english: "the schedule", telugu: "షెడ్యూల్", kind: "word" }], practice: [{ candidateId: "ik-ben-beschikbaar", dimension: "recognition" }, { candidateId: "vanaf-twee-uur", dimension: "recall" }, { candidateId: "de-middag", dimension: "recognition" }, { candidateId: "het-rooster", dimension: "recall" }], practiceExercises: createLessonPracticeExercises("a1-ik-ben-beschikbaar-op", { candidateId: "ik-ben-beschikbaar", phrase: "ik ben beschikbaar", chooseContext: "Tell your colleague when you can work: ___.", chooseDistractors: ["er is iets kapot", "wat moet ik meenemen"], repairContext: "Repair the availability statement.", repairCorrect: "Ik ben beschikbaar op maandag.", repairDistractors: ["Ik beschikbaar ben op maandag.", "Ik ben beschikbaar maandag op."], orderContext: "Say that you are available.", orderSentence: "Ik ben beschikbaar." }), review: reviewed, practiceEnvelope: {
  contentVersion: 1, support: "reduced",
  outcome: { primary: "Say when you are available for work or study.", supporting: ["Recognize ik ben beschikbaar in a short scheduling exchange."] },
  coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
  transfer: { id: "a1-ik-ben-beschikbaar-op-transfer", primitive: "choose-meaning", candidateId: "ik-ben-beschikbaar", prompt: "A colleague asks when you can work. Choose the Dutch sentence.", context: "Say that you are available on Monday: ___ .", choices: ["ik ben beschikbaar", "er is iets kapot", "wat moet ik meenemen"], accepted: ["ik ben beschikbaar"], distractors: [{ answer: "er is iets kapot", misconception: "breakage-not-availability" }, { answer: "wat moet ik meenemen", misconception: "bring-question-not-availability" }], feedback: "Use ik ben beschikbaar before adding the day or time." },
  accessibility: lessonPracticeAccessibility,
  migration: lessonPracticeMigration,
  review: lessonPracticeReview,
} };
export const bringLesson: Lesson = { id: "a1-wat-moet-ik-meenemen", contentVersion: 1, pathway: "work-and-study", order: 11, cefr: "A1", title: "A1 · Wat moet ik meenemen?", durationMinutes: 3, pattern: "Wat moet ik meenemen?", patternText: "meenemen", patternExplanation: "Use meenemen in wat moet ik meenemen to ask what you need to bring.", lines: [
  { dutch: "Morgen begin ik met een cursus Nederlands.", english: "Tomorrow I start a Dutch course.", telugu: "రేపు నేను డచ్ కోర్సు ప్రారంభిస్తాను." }, { dutch: "Wat moet ik meenemen naar de les?", english: "What do I need to bring to class?", telugu: "తరగతికి నేను ఏమి తీసుకురావాలి?" }, { dutch: "Je moet een pen en je identiteitsbewijs meenemen.", english: "You need to bring a pen and your identity document.", telugu: "మీరు ఒక పెన్ మరియు గుర్తింపు పత్రం తీసుకురావాలి." }, { dutch: "Moet ik ook mijn laptop meenemen?", english: "Do I also need to bring my laptop?", telugu: "నేను నా ల్యాప్‌టాప్ కూడా తీసుకురావాలా?" }, { dutch: "Nee, een schrift is genoeg voor de eerste les.", english: "No, a notebook is enough for the first lesson.", telugu: "లేదు, మొదటి తరగతికి ఒక నోట్‌బుక్ చాలు." },
], candidates: [{ id: "wat-moet-ik-meenemen", dutch: "wat moet ik meenemen", english: "what do I need to bring", telugu: "నేను ఏమి తీసుకురావాలి", kind: "chunk" }, { id: "een-pen", dutch: "een pen", english: "a pen", telugu: "ఒక పెన్", kind: "chunk" }, { id: "mijn-identiteitsbewijs", dutch: "mijn identiteitsbewijs", english: "my identity document", telugu: "నా గుర్తింపు పత్రం", kind: "chunk" }, { id: "een-schrift", dutch: "een schrift", english: "a notebook", telugu: "ఒక నోట్‌బుక్", kind: "chunk" }], practice: [{ candidateId: "wat-moet-ik-meenemen", dimension: "recognition" }, { candidateId: "een-pen", dimension: "recall" }, { candidateId: "mijn-identiteitsbewijs", dimension: "recognition" }, { candidateId: "een-schrift", dimension: "recall" }], practiceExercises: createLessonPracticeExercises("a1-wat-moet-ik-meenemen", { candidateId: "wat-moet-ik-meenemen", phrase: "wat moet ik meenemen", chooseContext: "Ask what to bring to class: ___.", chooseDistractors: ["ik ben beschikbaar", "er is iets kapot"], repairContext: "Repair the question about what to bring.", repairCorrect: "Wat moet ik meenemen?", repairDistractors: ["Wat ik moet meenemen?", "Wat moet meenemen ik?"], orderContext: "Ask what you need to bring.", orderSentence: "Wat moet ik meenemen?" }), review: reviewed, practiceEnvelope: {
  contentVersion: 1, support: "reduced",
  outcome: { primary: "Ask what you need to bring to class.", supporting: ["Recognize wat moet ik meenemen in a practical study situation."] },
  coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
  transfer: { id: "a1-wat-moet-ik-meenemen-transfer", primitive: "choose-meaning", candidateId: "wat-moet-ik-meenemen", prompt: "You are starting a course and need to ask what to bring. Choose the Dutch question.", context: "Ask what you need to bring to class: ___ .", choices: ["wat moet ik meenemen", "ik ben beschikbaar", "er is iets kapot"], accepted: ["wat moet ik meenemen"], distractors: [{ answer: "ik ben beschikbaar", misconception: "availability-not-bring-question" }, { answer: "er is iets kapot", misconception: "breakage-not-bring-question" }], feedback: "Use wat moet ik meenemen to ask what you need to bring." },
  accessibility: lessonPracticeAccessibility,
  migration: lessonPracticeMigration,
  review: lessonPracticeReview,
} };
export const letterLesson: Lesson = { id: "a2-wat-staat-er-in-deze-brief", contentVersion: 1, pathway: "official-life", order: 12, cefr: "A2", title: "A2 · Wat staat er in deze brief?", durationMinutes: 4, pattern: "Wat staat er in deze brief?", patternText: "in deze brief", patternExplanation: "Use wat staat er in deze brief to ask for help understanding a letter.", lines: [
  { dutch: "Ik krijg een brief van de gemeente en begrijp hem niet goed.", english: "I receive a letter from the municipality and do not understand it well.", telugu: "నాకు మున్సిపాలిటీ నుంచి ఒక లేఖ వచ్చింది, అది నాకు బాగా అర్థం కావడం లేదు." }, { dutch: "Weet je wat er in deze brief staat?", english: "Do you know what this letter says?", telugu: "ఈ లేఖలో ఏమి ఉందో మీకు తెలుసా?" }, { dutch: "Er staat dat je een afspraak kunt maken.", english: "It says that you can make an appointment.", telugu: "మీరు అపాయింట్‌మెంట్ తీసుకోవచ్చని అందులో ఉంది." }, { dutch: "Staat er in deze brief ook een datum?", english: "Does this letter also state a date?", telugu: "ఈ లేఖలో తేదీ కూడా ఉందా?" }, { dutch: "Ja, maar vraag hulp als iets niet duidelijk is.", english: "Yes, but ask for help if something is unclear.", telugu: "అవును, కానీ ఏదైనా స్పష్టంగా లేకపోతే సహాయం అడగండి." },
], candidates: [{ id: "wat-staat-er-in-deze-brief", dutch: "wat staat er in deze brief", english: "what does this letter say", telugu: "ఈ లేఖలో ఏమి ఉంది", kind: "chunk" }, { id: "de-gemeente", dutch: "de gemeente", english: "the municipality", telugu: "మున్సిపాలిటీ", kind: "word" }, { id: "niet-duidelijk", dutch: "niet duidelijk", english: "not clear", telugu: "స్పష్టంగా లేదు", kind: "chunk" }, { id: "hulp-vragen", dutch: "hulp vragen", english: "to ask for help", telugu: "సహాయం అడగడం", kind: "chunk" }], practice: [{ candidateId: "wat-staat-er-in-deze-brief", dimension: "recognition" }, { candidateId: "de-gemeente", dimension: "recall" }, { candidateId: "niet-duidelijk", dimension: "recognition" }, { candidateId: "hulp-vragen", dimension: "recall" }], practiceExercises: createLessonPracticeExercises("a2-wat-staat-er-in-deze-brief", { candidateId: "wat-staat-er-in-deze-brief", phrase: "wat staat er in deze brief", chooseContext: "Ask what the municipality letter says: ___.", chooseDistractors: ["niet duidelijk", "hulp vragen"], repairContext: "Repair the letter-help question.", repairCorrect: "Wat staat er in deze brief?", repairDistractors: ["Wat er staat in deze brief?", "Wat staat in er deze brief?"], orderContext: "Ask what the letter says.", orderSentence: "Wat staat er in deze brief?" }), review: reviewed, practiceEnvelope: {
  contentVersion: 1, support: "reduced",
  outcome: { primary: "Ask for help understanding an official letter.", supporting: ["Recognize the key question in a municipality letter-help exchange."] },
  coverage: { understand: true, guidedAction: true, reducedSupportRetrieval: true, safeApplication: true },
  transfer: { id: "a2-wat-staat-er-in-deze-brief-transfer", primitive: "choose-meaning", candidateId: "wat-staat-er-in-deze-brief", prompt: "A letter from the municipality is unclear. Choose the Dutch question to ask for help.", context: "Ask what the letter says: ___.", choices: ["wat staat er in deze brief", "niet duidelijk", "hulp vragen"], accepted: ["wat staat er in deze brief"], distractors: [{ answer: "niet duidelijk", misconception: "description-not-question" }, { answer: "hulp vragen", misconception: "action-not-letter-question" }], feedback: "Use wat staat er in deze brief to ask what an official letter says.", },
  accessibility: lessonPracticeAccessibility,
  migration: lessonPracticeMigration,
  review: lessonPracticeReview,
} };

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
