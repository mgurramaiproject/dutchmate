export type VerbPracticeKind = "choice" | "token-slots" | "map-placement" | "token-order";
export type VerbPracticePhase = "core" | "repair";
export type VerbPracticeAnswer = string | string[];

export type VerbPracticeQuestion = {
  id: string;
  verbId: string;
  journeyId: VerbPracticeJourneyId;
  formOrSkillId: string;
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

export type VerbPracticeJourneyId = "journey.werken.ott-routine" | "journey.werken.vtt-completed" | "journey.werken.ovt-background" | "journey.werken.vvt-earlier-past" | "journey.werken.future-possibility" | "journey.werken.reference-completed-future" | "journey.zijn.ott-identity" | "journey.zijn.ott-questions" | "journey.zijn.ovt-state" | "journey.zijn.vtt-experience" | "journey.zijn.future-conditional" | "journey.zijn.reference-completed" | "journey.hebben.ott-possession" | "journey.hebben.ott-expressions" | "journey.hebben.ovt-possession" | "journey.hebben.vtt-experience" | "journey.hebben.vtt-auxiliary" | "journey.hebben.future-reference";
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

const vvtQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.vvt.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence show?", context: "Ik had al thuis gewerkt voordat de vergadering begon.",
    choices: ["An earlier completed event before another past event", "A present work routine", "A future possibility"], accepted: ["An earlier completed event before another past event"], feedback: "Correct. VVT places the completed work before another past reference point.", incorrectFeedback: "Voordat and had gewerkt show that the work happened earlier in the past.", repairIds: ["exercise.werken.vvt.repair-auxiliary", "exercise.werken.vvt.repair-order"],
  },
  {
    id: "exercise.werken.vvt.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the earlier-past phrase with taps.", context: "Complete: Ik ___ al thuis ___.", tokens: ["had", "gewerkt"], accepted: ["had gewerkt"], feedback: "Correct. VVT uses had plus gewerkt.", incorrectFeedback: "Use the past auxiliary had before the participle gewerkt.",
  },
  {
    id: "exercise.werken.vvt.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the sentence that means: I had already worked at home before the meeting began.", context: "A past story has two events.", choices: ["Ik had al thuis gewerkt voordat de vergadering begon.", "Ik heb gisteren thuis gewerkt.", "Ik werkte vroeger thuis."], accepted: ["Ik had al thuis gewerkt voordat de vergadering begon."], feedback: "Correct. The earlier event uses VVT.", incorrectFeedback: "For the event that happened before another past event, choose Ik had al thuis gewerkt voordat de vergadering begon.",
  },
  {
    id: "exercise.werken.vvt.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik had al thuis gewerkt voordat de vergadering begon.", choices: ["VVT · voltooid verleden tijd", "VTT · voltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "OTT · onvoltooid tegenwoordige tijd"], accepted: ["VVT · voltooid verleden tijd"], feedback: "Correct. Had gewerkt is VVT: voltooid verleden tijd.", incorrectFeedback: "Had gewerkt is VVT: voltooid verleden tijd.",
  },
  {
    id: "exercise.werken.vvt.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the earlier event: Voordat de vergadering begon, …", tokens: ["Voordat", "de", "vergadering", "begon,", "had", "ik", "al", "thuis", "gewerkt."], accepted: ["Voordat de vergadering begon, had ik al thuis gewerkt."], feedback: "Correct. After the subordinate clause, had comes before ik.", incorrectFeedback: "After Voordat de vergadering begon, put had before ik: Voordat de vergadering begon, had ik al thuis gewerkt.",
  },
];

const vvtRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.werken.vvt.repair-auxiliary", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the earlier-past phrase.", context: "Ik ___ al gewerkt voordat zij belde.", choices: ["had", "heb", "zal"], accepted: ["had"], feedback: "Correct. Use had for an earlier past reference point.", incorrectFeedback: "Use had before gewerkt when the reference point is in the past." },
  { id: "exercise.werken.vvt.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.vvt-earlier-past", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a past clause.", context: "Voordat zij belde, …", tokens: ["Voordat", "zij", "belde,", "had", "ik", "gewerkt."], accepted: ["Voordat zij belde, had ik gewerkt."], feedback: "Correct. Dutch keeps the finite verb before the subject after the opening clause.", incorrectFeedback: "After Voordat zij belde, put had before ik: Voordat zij belde, had ik gewerkt." },
];

const futurePossibilityQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.future.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence express?", context: "Als het regent, zou ik thuis werken.",
    choices: ["A conditional possibility", "An earlier completed event", "A past habit"], accepted: ["A conditional possibility"], feedback: "Correct. Zou frames the work as conditional or hypothetical.", incorrectFeedback: "Als and zou signal a condition: this is a possible situation, not a completed event.", repairIds: ["exercise.werken.future.repair-auxiliary", "exercise.werken.future.repair-order"],
  },
  {
    id: "exercise.werken.future.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the explicit future phrase with taps.", context: "Complete: Morgen ___ ik thuis ___.", tokens: ["zal", "zou", "werken"], accepted: ["zal werken"], feedback: "Correct. Zal plus werken marks an explicit future plan.", incorrectFeedback: "For an explicit future plan, use zal before werken.",
  },
  {
    id: "exercise.werken.future.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the explicit future plan.", context: "A colleague asks about tomorrow.", choices: ["Morgen zal ik thuis werken.", "Als het regent, zou ik thuis werken.", "Vroeger werkte ik thuis."], accepted: ["Morgen zal ik thuis werken."], feedback: "Correct. Zal makes the future plan explicit.", incorrectFeedback: "For a clear plan about tomorrow, choose Morgen zal ik thuis werken.",
  },
  {
    id: "exercise.werken.future.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this conditional sentence belong?", context: "Als het regent, zou ik thuis werken.", choices: ["OVTT · onvoltooid verleden toekomende tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd", "VTTT · voltooid tegenwoordige toekomende tijd", "VVTT · voltooid verleden toekomende tijd"], accepted: ["OVTT · onvoltooid verleden toekomende tijd"], feedback: "Correct. Zou werken is OVTT: an uncompleted conditional future-from-past form.", incorrectFeedback: "Zou werken is OVTT: onvoltooid verleden toekomende tijd.",
  },
  {
    id: "exercise.werken.future.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the condition: Als het regent, …", tokens: ["Als", "het", "regent,", "zou", "ik", "thuis", "werken."], accepted: ["Als het regent, zou ik thuis werken."], feedback: "Correct. After the condition, zou comes before ik.", incorrectFeedback: "After Als het regent, put zou before ik: Als het regent, zou ik thuis werken.",
  },
];

const futurePossibilityRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.werken.future.repair-auxiliary", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the conditional phrase.", context: "Als het regent, ___ ik thuis werken.", choices: ["zou", "zal", "had"], accepted: ["zou"], feedback: "Correct. Use zou for a conditional possibility.", incorrectFeedback: "With Als het regent, use zou to express the possibility." },
  { id: "exercise.werken.future.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.future-possibility", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a condition.", context: "Als het regent, …", tokens: ["Als", "het", "regent,", "zou", "ik", "werken."], accepted: ["Als het regent, zou ik werken."], feedback: "Correct. Put zou before ik after the opening condition.", incorrectFeedback: "After Als het regent, put zou before ik: Als het regent, zou ik werken." },
];

const completedFutureQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.werken.completed-future.meaning", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence show?", context: "Voor het einde van de dag zal ik acht uur gewerkt hebben.",
    choices: ["Work completed before a future point", "A current work routine", "A conditional possibility"], accepted: ["Work completed before a future point"], feedback: "Correct. Zal ... gewerkt hebben looks forward to a completed result.", incorrectFeedback: "Voor het einde van de dag sets a future reference point; zal ... gewerkt hebben shows completion before it.", repairIds: ["exercise.werken.completed-future.repair-auxiliary", "exercise.werken.completed-future.repair-order"],
  },
  {
    id: "exercise.werken.completed-future.construct", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the completed-future phrase with taps.", context: "Complete: Ik ___ acht uur ___ ___.", tokens: ["zal", "gewerkt", "hebben"], accepted: ["zal gewerkt hebben"], feedback: "Correct. VTTT uses zal plus gewerkt hebben.", incorrectFeedback: "Use zal before gewerkt hebben to place completion before a future point.",
  },
  {
    id: "exercise.werken.completed-future.natural-translation", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the completed-future sentence.", context: "By Friday, I will have worked forty hours.", choices: ["Tegen vrijdag zal ik veertig uur gewerkt hebben.", "Tegen vrijdag werk ik veertig uur.", "Als ik tijd had, zou ik langer werken."], accepted: ["Tegen vrijdag zal ik veertig uur gewerkt hebben."], feedback: "Correct. The sentence marks completion before Friday.", incorrectFeedback: "For ‘will have worked’, choose Tegen vrijdag zal ik veertig uur gewerkt hebben.",
  },
  {
    id: "exercise.werken.completed-future.map-placement", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Voor het einde van de dag zal ik acht uur gewerkt hebben.", choices: ["VTTT · voltooid tegenwoordige toekomende tijd", "VVTT · voltooid verleden toekomende tijd", "VTT · voltooid tegenwoordige tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd"], accepted: ["VTTT · voltooid tegenwoordige toekomende tijd"], feedback: "Correct. Zal ... gewerkt hebben is VTTT.", incorrectFeedback: "Zal ... gewerkt hebben is VTTT: voltooid tegenwoordige toekomende tijd.",
  },
  {
    id: "exercise.werken.completed-future.word-order", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the condition: Als ik meer tijd had gehad, …", tokens: ["Als", "ik", "meer", "tijd", "had", "gehad,", "zou", "ik", "langer", "gewerkt", "hebben."], accepted: ["Als ik meer tijd had gehad, zou ik langer gewerkt hebben."], feedback: "Correct. Zou comes before the subject in the main clause, with gewerkt hebben at the end.", incorrectFeedback: "After Als ik meer tijd had gehad, use zou ik langer gewerkt hebben.",
  },
];

const completedFutureRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.werken.completed-future.repair-auxiliary", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the completed-future phrase.", context: "Tegen vrijdag ___ ik veertig uur gewerkt hebben.", choices: ["zal", "zou", "had"], accepted: ["zal"], feedback: "Correct. Use zal for completion before a future point.", incorrectFeedback: "For ‘will have worked’, use zal before gewerkt hebben." },
  { id: "exercise.werken.completed-future.repair-order", verbId: "verb.werken", formOrSkillId: "skill.werken.reference-completed-future", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the completed-future word order.", context: "Tegen vrijdag …", tokens: ["Tegen", "vrijdag", "zal", "ik", "gewerkt", "hebben."], accepted: ["Tegen vrijdag zal ik gewerkt hebben."], feedback: "Correct. The finite auxiliary zal stays before ik.", incorrectFeedback: "After Tegen vrijdag, put zal before ik: Tegen vrijdag zal ik gewerkt hebben." },
];

const zijnIdentityQuestions: AuthoredVerbPracticeQuestion[] = [
  {
    id: "exercise.zijn.ott-identity.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Ik ben vandaag rustig.", choices: ["A present state", "A completed past experience", "A conditional possibility"], accepted: ["A present state"], feedback: "Correct. Ben describes a present state with ik.", incorrectFeedback: "Vandaag and ben show a present state: Ik ben vandaag rustig.", repairIds: ["exercise.zijn.ott-identity.repair-person", "exercise.zijn.ott-identity.repair-order"],
  },
  {
    id: "exercise.zijn.ott-identity.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the present phrase with taps.", context: "Complete: Ik ___ vandaag rustig.", tokens: ["ben", "bent", "is"], accepted: ["ben"], feedback: "Correct. Ik takes ben.", incorrectFeedback: "With ik, use ben: Ik ben vandaag rustig.",
  },
  {
    id: "exercise.zijn.ott-identity.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday answer.", context: "A friend asks how you feel today.", choices: ["Ik ben vandaag rustig.", "Ik was gisteren rustig.", "Ik zou rustig zijn."], accepted: ["Ik ben vandaag rustig."], feedback: "Correct. The present form ben fits today’s state.", incorrectFeedback: "For a state today, choose Ik ben vandaag rustig.",
  },
  {
    id: "exercise.zijn.ott-identity.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik ben vandaag rustig.", choices: ["OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VTT · voltooid tegenwoordige tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd"], accepted: ["OTT · onvoltooid tegenwoordige tijd"], feedback: "Correct. Ben is the present form in this sentence.", incorrectFeedback: "Ik ben vandaag rustig is OTT: a present state.",
  },
  {
    id: "exercise.zijn.ott-identity.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Vandaag …", tokens: ["Vandaag", "ben", "ik", "hier."], accepted: ["Vandaag ben ik hier."], feedback: "Correct. After Vandaag, ben comes before ik.", incorrectFeedback: "Keep the finite verb in second position: Vandaag ben ik hier.",
  },
];

const zijnIdentityRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.ott-identity.repair-person", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "repair-person", kind: "choice", prompt: "Repair the present form.", context: "Ik ___ vandaag rustig.", choices: ["ben", "bent", "is"], accepted: ["ben"], feedback: "Correct. Ik takes ben.", incorrectFeedback: "The present form after ik is ben." },
  { id: "exercise.zijn.ott-identity.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order.", context: "Vandaag …", tokens: ["Vandaag", "ben", "ik", "hier."], accepted: ["Vandaag ben ik hier."], feedback: "Correct. Ben stays before ik after Vandaag.", incorrectFeedback: "Use second-position word order: Vandaag ben ik hier." },
];

const zijnQuestionQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.ott-questions.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "meaning", kind: "choice", prompt: "What does this question ask?", context: "Ben je vandaag thuis?", choices: ["Whether someone is at home today", "Whether someone was at home yesterday", "Whether someone has been at home before"], accepted: ["Whether someone is at home today"], feedback: "Correct. Ben je asks about a present state with jij.", incorrectFeedback: "Vandaag and ben je make this a present question.", repairIds: ["exercise.zijn.ott-questions.repair-form", "exercise.zijn.ott-questions.repair-order"] },
  { id: "exercise.zijn.ott-questions.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the question with taps.", context: "Complete: ___ vandaag thuis?", tokens: ["ben", "je", "vandaag", "thuis?"], accepted: ["ben je vandaag thuis?"], feedback: "Correct. Ben comes before je in a direct question.", incorrectFeedback: "Put ben before je: Ben je vandaag thuis?" },
  { id: "exercise.zijn.ott-questions.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the natural present question.", context: "Are you ready today?", choices: ["Ben je vandaag klaar?", "Was je gisteren klaar?", "Ben je klaar geweest?"], accepted: ["Ben je vandaag klaar?"], feedback: "Correct. Ben je asks about the present.", incorrectFeedback: "For a present question, choose Ben je vandaag klaar?" },
  { id: "exercise.zijn.ott-questions.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this question belong?", context: "Ben je vandaag thuis?", choices: ["OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VTT · voltooid tegenwoordige tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd"], accepted: ["OTT · onvoltooid tegenwoordige tijd"], feedback: "Correct. Ben je asks about a present state.", incorrectFeedback: "Ben je vandaag thuis? belongs to OTT." },
  { id: "exercise.zijn.ott-questions.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the question in the correct order.", context: "Ask about today: …", tokens: ["Ben", "je", "vandaag", "thuis?"], accepted: ["Ben je vandaag thuis?"], feedback: "Correct. The finite verb comes before the subject in a direct question.", incorrectFeedback: "Start with Ben, then je: Ben je vandaag thuis?" },
];

const zijnQuestionRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.ott-questions.repair-form", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "repair-form", kind: "choice", prompt: "Repair the question form.", context: "___ je vandaag thuis?", choices: ["Ben", "Was", "Zijn"], accepted: ["Ben"], feedback: "Correct. Ben je is the present question with jij.", incorrectFeedback: "Use Ben for a present question with je." },
  { id: "exercise.zijn.ott-questions.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-questions", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the question order.", context: "Ask about today: …", tokens: ["Ben", "je", "thuis?"], accepted: ["Ben je thuis?"], feedback: "Correct. Put Ben before je.", incorrectFeedback: "In a direct question, use Ben je thuis?" },
];

const zijnPastStateQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.ovt-state.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Ik was gisteren thuis.", choices: ["A past location", "A present location", "A future plan"], accepted: ["A past location"], feedback: "Correct. Was places the state in the past.", incorrectFeedback: "Gisteren and was show a past location." },
  { id: "exercise.zijn.ovt-state.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the past-state phrase.", context: "Ik ___ gisteren thuis.", tokens: ["was", "waren", "gisteren", "thuis"], accepted: ["was"], feedback: "Correct. Ik takes was in this past-state sentence.", incorrectFeedback: "With ik in the past, use was: Ik was gisteren thuis." },
  { id: "exercise.zijn.ovt-state.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the natural past sentence.", context: "We were tired yesterday.", choices: ["Wij waren gisteren moe.", "Wij zijn vandaag moe.", "Wij zullen morgen moe zijn."], accepted: ["Wij waren gisteren moe."], feedback: "Correct. Waren is the plural past form.", incorrectFeedback: "For we were, choose Wij waren gisteren moe." },
  { id: "exercise.zijn.ovt-state.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik was gisteren thuis.", choices: ["OVT · onvoltooid verleden tijd", "OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "VVT · voltooid verleden tijd"], accepted: ["OVT · onvoltooid verleden tijd"], feedback: "Correct. Was is the OVT form here.", incorrectFeedback: "Ik was gisteren thuis describes a past state: OVT." },
  { id: "exercise.zijn.ovt-state.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the past sentence in order.", context: "Start with the time phrase: Gisteren …", tokens: ["Gisteren", "was", "ik", "thuis."], accepted: ["Gisteren was ik thuis."], feedback: "Correct. Was stays before ik after Gisteren.", incorrectFeedback: "Keep the finite verb in second position: Gisteren was ik thuis." },
];

const zijnPastStateRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.ovt-state.repair-form", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "repair-form", kind: "choice", prompt: "Repair the past form.", context: "Ik ___ gisteren thuis.", choices: ["was", "ben", "waren"], accepted: ["was"], feedback: "Correct. Ik was is the singular past form.", incorrectFeedback: "Use was after ik for a past state." },
  { id: "exercise.zijn.ovt-state.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ovt-state", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the past word order.", context: "Gisteren …", tokens: ["Gisteren", "was", "ik", "thuis."], accepted: ["Gisteren was ik thuis."], feedback: "Correct. Was comes before ik after Gisteren.", incorrectFeedback: "Use Gisteren was ik thuis." },
];

const zijnPastExperienceQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.vtt-experience.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence report?", context: "Ik ben al eens in dit museum geweest.", choices: ["A completed experience", "A current location", "A future plan"], accepted: ["A completed experience"], feedback: "Correct. Ben geweest reports an experience from the present viewpoint.", incorrectFeedback: "Al eens and geweest point to a completed experience.", repairIds: ["exercise.zijn.vtt-experience.repair-auxiliary", "exercise.zijn.vtt-experience.repair-order"] },
  { id: "exercise.zijn.vtt-experience.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the completed-experience phrase.", context: "Ik ___ al eens hier ___.", tokens: ["ben", "is", "geweest"], accepted: ["ben geweest"], feedback: "Correct. Ik uses ben plus geweest.", incorrectFeedback: "Use ben before geweest with ik: Ik ben hier geweest." },
  { id: "exercise.zijn.vtt-experience.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the natural experience sentence.", context: "I have been there twice already.", choices: ["Ik ben daar al twee keer geweest.", "Ik was daar gisteren.", "Ik ben daar nu."], accepted: ["Ik ben daar al twee keer geweest."], feedback: "Correct. The VTT phrase reports the completed experience.", incorrectFeedback: "For ‘have been there’, choose Ik ben daar al twee keer geweest." },
  { id: "exercise.zijn.vtt-experience.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik ben al eens in dit museum geweest.", choices: ["VTT · voltooid tegenwoordige tijd", "OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["VTT · voltooid tegenwoordige tijd"], feedback: "Correct. Ben geweest is VTT.", incorrectFeedback: "Ben geweest is voltooid tegenwoordige tijd: VTT." },
  { id: "exercise.zijn.vtt-experience.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the experience sentence in order.", context: "Start with the place: In dit museum …", tokens: ["In", "dit", "museum", "ben", "ik", "al", "eens", "geweest."], accepted: ["In dit museum ben ik al eens geweest."], feedback: "Correct. After the opening phrase, ben comes before ik and geweest closes the phrase.", incorrectFeedback: "Use In dit museum ben ik al eens geweest." },
];

const zijnPastExperienceRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.vtt-experience.repair-auxiliary", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the experience phrase.", context: "Ik ___ daar al geweest.", choices: ["ben", "was", "zal"], accepted: ["ben"], feedback: "Correct. Ik uses ben in this VTT phrase.", incorrectFeedback: "For Ik ... geweest, use ben to report the experience now." },
  { id: "exercise.zijn.vtt-experience.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.vtt-experience", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the phrase order.", context: "In dit museum …", tokens: ["ben", "ik", "geweest."], accepted: ["ben ik geweest."], feedback: "Correct. After the opening phrase, ben comes before ik.", incorrectFeedback: "Use In dit museum ben ik geweest." },
];

const zijnFutureConditionalQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.future-conditional.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence express?", context: "Morgen zal ik thuis zijn.", choices: ["An explicit future plan", "A past state", "A completed experience"], accepted: ["An explicit future plan"], feedback: "Correct. Zal zijn makes the future state explicit.", incorrectFeedback: "Morgen and zal ik ... zijn point to an explicit future plan.", repairIds: ["exercise.zijn.future-conditional.repair-auxiliary", "exercise.zijn.future-conditional.repair-order"] },
  { id: "exercise.zijn.future-conditional.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the explicit future phrase.", context: "Morgen ___ ik thuis ___.", tokens: ["zal", "zou", "zijn"], accepted: ["zal zijn"], feedback: "Correct. Zal plus zijn marks the explicit future.", incorrectFeedback: "Use zal before zijn for the explicit future plan." },
  { id: "exercise.zijn.future-conditional.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the conditional possibility.", context: "If it rains, I would be at home.", choices: ["Als het regent, zou ik thuis zijn.", "Morgen zal ik thuis zijn.", "Ik was gisteren thuis."], accepted: ["Als het regent, zou ik thuis zijn."], feedback: "Correct. Zou zijn expresses the conditional possibility.", incorrectFeedback: "With Als het regent, choose zou ik thuis zijn." },
  { id: "exercise.zijn.future-conditional.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does the explicit future form belong?", context: "Morgen zal ik thuis zijn.", choices: ["OTTT · onvoltooid tegenwoordige toekomende tijd", "OVTT · onvoltooid verleden toekomende tijd", "OTT · onvoltooid tegenwoordige tijd", "VTTT · voltooid tegenwoordige toekomende tijd"], accepted: ["OTTT · onvoltooid tegenwoordige toekomende tijd"], feedback: "Correct. Zal zijn is OTTT.", incorrectFeedback: "Zal zijn is onvoltooid tegenwoordige toekomende tijd: OTTT." },
  { id: "exercise.zijn.future-conditional.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the conditional sentence in order.", context: "Start with the condition: Als het regent, …", tokens: ["Als", "het", "regent,", "zou", "ik", "thuis", "zijn."], accepted: ["Als het regent, zou ik thuis zijn."], feedback: "Correct. Zou comes before ik after the condition.", incorrectFeedback: "Use Als het regent, zou ik thuis zijn." },
];

const zijnFutureConditionalRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.future-conditional.repair-auxiliary", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the conditional phrase.", context: "Als het regent, ___ ik thuis zijn.", choices: ["zou", "zal", "was"], accepted: ["zou"], feedback: "Correct. Zou frames the state as conditional.", incorrectFeedback: "After Als het regent, use zou for the possibility." },
  { id: "exercise.zijn.future-conditional.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.future-conditional", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the conditional order.", context: "Als het regent, …", tokens: ["zou", "ik", "thuis", "zijn."], accepted: ["zou ik thuis zijn."], feedback: "Correct. Zou comes before ik.", incorrectFeedback: "Use zou ik thuis zijn after the condition." },
];

const zijnReferenceCompletedQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.reference-completed.meaning", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence show?", context: "Voor het einde van de dag zal ik thuis geweest zijn.", choices: ["A state completed before a future point", "A current location", "A simple conditional plan"], accepted: ["A state completed before a future point"], feedback: "Correct. Zal geweest zijn looks forward to a completed state.", incorrectFeedback: "Voor het einde van de dag sets a future reference point." , repairIds: ["exercise.zijn.reference-completed.repair-auxiliary", "exercise.zijn.reference-completed.repair-order"] },
  { id: "exercise.zijn.reference-completed.construct", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the future-completed phrase.", context: "Ik ___ thuis ___ ___.", tokens: ["zal", "geweest", "zijn"], accepted: ["zal geweest zijn"], feedback: "Correct. Zal frames geweest zijn before a future point.", incorrectFeedback: "Use zal geweest zijn for the future-completed reference." },
  { id: "exercise.zijn.reference-completed.natural-translation", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the hypothetical completed state.", context: "I would have been on time.", choices: ["Ik zou op tijd geweest zijn.", "Ik zal op tijd zijn.", "Ik was op tijd."], accepted: ["Ik zou op tijd geweest zijn."], feedback: "Correct. Zou geweest zijn marks the hypothetical completed state.", incorrectFeedback: "For ‘would have been’, choose Ik zou op tijd geweest zijn." },
  { id: "exercise.zijn.reference-completed.map-placement", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this earlier-past phrase belong?", context: "Ik was al op het station geweest voordat de trein kwam.", choices: ["VVT · voltooid verleden tijd", "VTTT · voltooid tegenwoordige toekomende tijd", "VVTT · voltooid verleden toekomende tijd", "VTT · voltooid tegenwoordige tijd"], accepted: ["VVT · voltooid verleden tijd"], feedback: "Correct. Was geweest is VVT.", incorrectFeedback: "Was geweest places a completed state before a past event: VVT." },
  { id: "exercise.zijn.reference-completed.word-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the future-completed phrase in order.", context: "Voor het einde van de dag …", tokens: ["zal", "ik", "thuis", "geweest", "zijn."], accepted: ["zal ik thuis geweest zijn."], feedback: "Correct. The finite auxiliary zal comes before ik; geweest zijn closes the phrase.", incorrectFeedback: "Use zal ik thuis geweest zijn." },
];

const zijnReferenceCompletedRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.zijn.reference-completed.repair-auxiliary", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the future-completed phrase.", context: "Voor het einde van de dag ___ ik thuis geweest zijn.", choices: ["zal", "zou", "was"], accepted: ["zal"], feedback: "Correct. Zal frames the completion before a future point.", incorrectFeedback: "Use zal for the future-completed reference." },
  { id: "exercise.zijn.reference-completed.repair-order", verbId: "verb.zijn", formOrSkillId: "skill.zijn.reference-completed", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the completed phrase order.", context: "Voor het einde van de dag …", tokens: ["zal", "ik", "geweest", "zijn."], accepted: ["zal ik geweest zijn."], feedback: "Correct. Zal comes before ik and geweest zijn stays together at the end.", incorrectFeedback: "Use zal ik geweest zijn after the time phrase." },
];

const hebbenPossessionQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ott-possession.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Ik heb vandaag genoeg tijd.", choices: ["I have enough time today.", "I had enough time yesterday.", "I will have enough time tomorrow."], accepted: ["I have enough time today."], feedback: "Correct. Heb describes present possession or availability.", incorrectFeedback: "Heb is present: Ik heb vandaag genoeg tijd.", repairIds: ["exercise.hebben.ott-possession.repair-form", "exercise.hebben.ott-possession.repair-order"] },
  { id: "exercise.hebben.ott-possession.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the present phrase with taps.", context: "Complete: ___ genoeg tijd.", tokens: ["ik", "heb", "vandaag", "genoeg", "tijd."], accepted: ["ik heb vandaag genoeg tijd."], feedback: "Correct. With ik, the present form is heb.", incorrectFeedback: "Use ik + heb for present possession: Ik heb vandaag genoeg tijd." },
  { id: "exercise.hebben.ott-possession.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday answer.", context: "A friend asks whether you can talk now.", choices: ["Ik heb een moment voor je.", "Ik had een moment voor je.", "Ik zal een moment voor je gehad hebben."], accepted: ["Ik heb een moment voor je."], feedback: "Correct. Heb is the natural present form for what you have now.", incorrectFeedback: "For a current available moment, choose Ik heb een moment voor je." },
  { id: "exercise.hebben.ott-possession.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik heb vandaag genoeg tijd.", choices: ["OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VTT · voltooid tegenwoordige tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd"], accepted: ["OTT · onvoltooid tegenwoordige tijd"], feedback: "Correct. Heb is the present form of hebben.", incorrectFeedback: "The present form heb belongs to OTT." },
  { id: "exercise.hebben.ott-possession.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Vandaag …", tokens: ["Vandaag", "heb", "ik", "genoeg", "tijd."], accepted: ["Vandaag heb ik genoeg tijd."], feedback: "Correct. After Vandaag, the finite verb heb comes before ik.", incorrectFeedback: "After Vandaag, put heb before ik: Vandaag heb ik genoeg tijd." },
];

const hebbenPossessionRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ott-possession.repair-form", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "repair-form", kind: "choice", prompt: "Repair the present phrase.", context: "Ik ___ vandaag tijd.", choices: ["heb", "hebt", "heeft"], accepted: ["heb"], feedback: "Correct. With ik, use heb.", incorrectFeedback: "With ik, use heb: Ik heb vandaag tijd." },
  { id: "exercise.hebben.ott-possession.repair-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-possession", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the word order after a time phrase.", context: "Vandaag …", tokens: ["Vandaag", "heb", "ik", "tijd."], accepted: ["Vandaag heb ik tijd."], feedback: "Correct. The finite verb stays in second position.", incorrectFeedback: "After Vandaag, use Vandaag heb ik tijd." },
];

const hebbenExpressionsQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ott-expressions.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Ik heb honger na mijn werk.", choices: ["A current feeling", "A past possession", "A future plan"], accepted: ["A current feeling"], feedback: "Correct. Heb expresses a current state in this everyday expression.", incorrectFeedback: "Ik heb honger describes a feeling now: a current state.", repairIds: ["exercise.hebben.ott-expressions.repair-form", "exercise.hebben.ott-expressions.repair-order"] },
  { id: "exercise.hebben.ott-expressions.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the question with taps.", context: "Complete: ___ jij tijd voor een korte wandeling?", tokens: ["Heb", "heb", "heeft", "jij", "tijd", "voor", "een", "korte", "wandeling?"], accepted: ["Heb jij tijd voor een korte wandeling?"], feedback: "Correct. A present question begins with Heb before jij.", incorrectFeedback: "Use Heb before jij: Heb jij tijd voor een korte wandeling?" },
  { id: "exercise.hebben.ott-expressions.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday answer.", context: "My sister feels like having coffee.", choices: ["Mijn zus heeft zin in koffie.", "Mijn zus had zin in koffie.", "Mijn zus zal zin in koffie hebben."], accepted: ["Mijn zus heeft zin in koffie."], feedback: "Correct. Heeft fits a current feeling or desire with mijn zus.", incorrectFeedback: "For a current desire with mijn zus, choose Mijn zus heeft zin in koffie." },
  { id: "exercise.hebben.ott-expressions.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Wij hebben vandaag weinig tijd.", choices: ["OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VTT · voltooid tegenwoordige tijd", "OTTT · onvoltooid tegenwoordige toekomende tijd"], accepted: ["OTT · onvoltooid tegenwoordige tijd"], feedback: "Correct. Hebben is the present plural form: OTT.", incorrectFeedback: "Wij hebben vandaag weinig tijd is present: OTT." },
  { id: "exercise.hebben.ott-expressions.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Vandaag …", tokens: ["Vandaag", "hebben", "wij", "weinig", "tijd."], accepted: ["Vandaag hebben wij weinig tijd."], feedback: "Correct. After Vandaag, hebben comes before wij.", incorrectFeedback: "Keep the finite verb in second position: Vandaag hebben wij weinig tijd." },
];

const hebbenExpressionsRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ott-expressions.repair-form", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "repair-form", kind: "choice", prompt: "Repair the expression.", context: "Mijn zus ___ zin in koffie.", choices: ["heeft", "heb", "hebben"], accepted: ["heeft"], feedback: "Correct. Mijn zus takes heeft.", incorrectFeedback: "With mijn zus, use heeft: Mijn zus heeft zin in koffie." },
  { id: "exercise.hebben.ott-expressions.repair-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ott-expressions", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the question order.", context: "___ jij tijd?", tokens: ["Heb", "jij", "tijd?"], accepted: ["Heb jij tijd?"], feedback: "Correct. Heb comes before jij in the question.", incorrectFeedback: "Use Heb jij tijd? for the present question." },
];

const hebbenPastPossessionQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ovt-possession.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence describe?", context: "Gisteren had ik meer tijd.", choices: ["A past possession or state", "A current feeling", "A future prediction"], accepted: ["A past possession or state"], feedback: "Correct. Had places the available time in the past.", incorrectFeedback: "Gisteren and had show a past state: a past possession or availability.", repairIds: ["exercise.hebben.ovt-possession.repair-form", "exercise.hebben.ovt-possession.repair-order"] },
  { id: "exercise.hebben.ovt-possession.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the past phrase with taps.", context: "Complete: Ik ___ toen geen fiets.", tokens: ["had", "heb", "hadden", "toen", "geen", "fiets."], accepted: ["had"], feedback: "Correct. The past singular form with ik is had.", incorrectFeedback: "Use had with ik: Ik had toen geen fiets." },
  { id: "exercise.hebben.ovt-possession.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best story-background sentence.", context: "My father used to have a small shop.", choices: ["Vroeger had mijn vader een kleine winkel.", "Vroeger heeft mijn vader een kleine winkel.", "Morgen zal mijn vader een kleine winkel hebben."], accepted: ["Vroeger had mijn vader een kleine winkel."], feedback: "Correct. Vroeger and had describe past background possession.", incorrectFeedback: "For ‘used to have’, choose Vroeger had mijn vader een kleine winkel." },
  { id: "exercise.hebben.ovt-possession.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Gisteren had ik meer tijd.", choices: ["OVT · onvoltooid verleden tijd", "OTT · onvoltooid tegenwoordige tijd", "VTT · voltooid tegenwoordige tijd", "VVT · voltooid verleden tijd"], accepted: ["OVT · onvoltooid verleden tijd"], feedback: "Correct. Had is the OVT form for a past state.", incorrectFeedback: "Gisteren had ik meer tijd is OVT: a past, uncompleted state." },
  { id: "exercise.hebben.ovt-possession.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Gisteren …", tokens: ["Gisteren", "had", "ik", "meer", "tijd."], accepted: ["Gisteren had ik meer tijd."], feedback: "Correct. After Gisteren, had comes before ik.", incorrectFeedback: "Keep the finite verb in second position: Gisteren had ik meer tijd." },
];

const hebbenPastPossessionRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.ovt-possession.repair-form", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "repair-form", kind: "choice", prompt: "Repair the past phrase.", context: "Ik ___ toen geen fiets.", choices: ["had", "heb", "hadden"], accepted: ["had"], feedback: "Correct. With ik in the past, use had.", incorrectFeedback: "Use had: Ik had toen geen fiets." },
  { id: "exercise.hebben.ovt-possession.repair-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.ovt-possession", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the past word order.", context: "Gisteren …", tokens: ["Gisteren", "had", "ik", "tijd."], accepted: ["Gisteren had ik tijd."], feedback: "Correct. Had stays before ik after Gisteren.", incorrectFeedback: "Use Gisteren had ik tijd." },
];

const hebbenCompletedExperienceQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.vtt-experience.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence show?", context: "Ik heb vandaag genoeg tijd gehad.", choices: ["A completed experience connected to now", "A present resource only", "A past background state"], accepted: ["A completed experience connected to now"], feedback: "Correct. Heb gehad reports a completed experience in a time period that still matters.", incorrectFeedback: "Heb gehad is completed experience; Ik heb tijd is present availability and Ik had tijd is past background.", repairIds: ["exercise.hebben.vtt-experience.repair-participle", "exercise.hebben.vtt-experience.repair-contrast"] },
  { id: "exercise.hebben.vtt-experience.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the completed-experience phrase with taps.", context: "Complete: Ik ___ vandaag genoeg tijd ___.", tokens: ["heb", "had", "gehad"], accepted: ["heb gehad"], feedback: "Correct. VTT uses present heb plus gehad.", incorrectFeedback: "Use heb before gehad: Ik heb vandaag genoeg tijd gehad." },
  { id: "exercise.hebben.vtt-experience.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday sentence.", context: "We have had a pleasant day together.", choices: ["We hebben samen een fijne dag gehad.", "We hadden samen een fijne dag.", "We hebben samen een fijne dag."], accepted: ["We hebben samen een fijne dag gehad."], feedback: "Correct. Hebben gehad marks the completed experience.", incorrectFeedback: "For ‘have had’, choose We hebben samen een fijne dag gehad." },
  { id: "exercise.hebben.vtt-experience.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik heb vandaag genoeg tijd gehad.", choices: ["VTT · voltooid tegenwoordige tijd", "OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["VTT · voltooid tegenwoordige tijd"], feedback: "Correct. Heb gehad is VTT: a completed present-linked experience.", incorrectFeedback: "Heb gehad is voltooid tegenwoordige tijd: VTT." },
  { id: "exercise.hebben.vtt-experience.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Vandaag …", tokens: ["Vandaag", "heb", "ik", "genoeg", "tijd", "gehad."], accepted: ["Vandaag heb ik genoeg tijd gehad."], feedback: "Correct. Heb comes before ik and gehad closes the phrase.", incorrectFeedback: "Use Vandaag heb ik genoeg tijd gehad." },
];

const hebbenCompletedExperienceRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.vtt-experience.repair-participle", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "repair-participle", kind: "choice", prompt: "Repair the completed phrase.", context: "Ik heb genoeg tijd ___.", choices: ["gehad", "had", "hebben"], accepted: ["gehad"], feedback: "Correct. Gehad is the participle of hebben.", incorrectFeedback: "After heb, use the participle gehad: Ik heb genoeg tijd gehad." },
  { id: "exercise.hebben.vtt-experience.repair-contrast", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-experience", exerciseFamily: "repair-contrast", kind: "choice", prompt: "Choose the completed experience.", context: "I have had a busy day.", choices: ["Ik heb een drukke dag gehad.", "Ik heb een drukke dag.", "Ik had een drukke dag."], accepted: ["Ik heb een drukke dag gehad."], feedback: "Correct. Heb gehad expresses the completed experience.", incorrectFeedback: "Choose Ik heb een drukke dag gehad for ‘have had’." },
];

const hebbenAuxiliaryQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.vtt-auxiliary.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence show?", context: "Ik heb vandaag gewerkt.", choices: ["A completed action using hebben", "A present possession", "A past background state"], accepted: ["A completed action using hebben"], feedback: "Correct. Heb is the auxiliary before gewerkt in this authored perfect phrase.", incorrectFeedback: "Ik heb vandaag gewerkt is a completed action with hebben as auxiliary.", repairIds: ["exercise.hebben.vtt-auxiliary.repair-auxiliary", "exercise.hebben.vtt-auxiliary.repair-contrast"] },
  { id: "exercise.hebben.vtt-auxiliary.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the completed-action phrase with taps.", context: "Complete: Ik ___ vandaag ___.", tokens: ["heb", "ben", "gewerkt", "gegaan"], accepted: ["heb gewerkt"], feedback: "Correct. This common action phrase uses heb plus gewerkt.", incorrectFeedback: "Use heb gewerkt for this completed action: Ik heb vandaag gewerkt." },
  { id: "exercise.hebben.vtt-auxiliary.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the best everyday sentence.", context: "She has written a long letter.", choices: ["Zij heeft een lange brief geschreven.", "Zij is een lange brief geschreven.", "Zij had een lange brief schrijven."], accepted: ["Zij heeft een lange brief geschreven."], feedback: "Correct. This authored completed action uses heeft plus geschreven.", incorrectFeedback: "For ‘has written’, choose Zij heeft een lange brief geschreven." },
  { id: "exercise.hebben.vtt-auxiliary.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this sentence belong?", context: "Ik heb vandaag gewerkt.", choices: ["VTT · voltooid tegenwoordige tijd", "OTT · onvoltooid tegenwoordige tijd", "OVT · onvoltooid verleden tijd", "VVT · voltooid verleden tijd"], accepted: ["VTT · voltooid tegenwoordige tijd"], feedback: "Correct. Heb gewerkt is VTT.", incorrectFeedback: "Heb gewerkt is voltooid tegenwoordige tijd: VTT." },
  { id: "exercise.hebben.vtt-auxiliary.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the words in the correct order.", context: "Start with the time phrase: Gisteren …", tokens: ["Gisteren", "heb", "ik", "thuis", "gewerkt."], accepted: ["Gisteren heb ik thuis gewerkt."], feedback: "Correct. Heb comes before ik and gewerkt closes the phrase.", incorrectFeedback: "Use Gisteren heb ik thuis gewerkt." },
];

const hebbenAuxiliaryRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.vtt-auxiliary.repair-auxiliary", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the auxiliary choice.", context: "Ik ___ vandaag gewerkt.", choices: ["heb", "ben", "had"], accepted: ["heb"], feedback: "Correct. This authored completed action uses heb.", incorrectFeedback: "Use heb in Ik heb vandaag gewerkt." },
  { id: "exercise.hebben.vtt-auxiliary.repair-contrast", verbId: "verb.hebben", formOrSkillId: "skill.hebben.vtt-auxiliary", exerciseFamily: "repair-contrast", kind: "choice", prompt: "Choose the authored movement contrast.", context: "I went home early.", choices: ["Ik ben vroeg naar huis gegaan.", "Ik heb vroeg naar huis gewerkt.", "Ik had vroeg naar huis gegaan."], accepted: ["Ik ben vroeg naar huis gegaan."], feedback: "Correct. This selected movement phrase uses zijn.", incorrectFeedback: "For the authored movement contrast, choose Ik ben vroeg naar huis gegaan." },
];

const hebbenFutureReferenceQuestions: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.future-reference.meaning", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "meaning", kind: "choice", prompt: "What does this sentence express?", context: "Morgen zal ik meer tijd hebben.", choices: ["An explicit future possession", "A conditional possibility", "A completed past possession"], accepted: ["An explicit future possession"], feedback: "Correct. Zal hebben makes the future reference explicit.", incorrectFeedback: "Morgen and zal ... hebben express an explicit future possession.", repairIds: ["exercise.hebben.future-reference.repair-auxiliary", "exercise.hebben.future-reference.repair-order"] },
  { id: "exercise.hebben.future-reference.construct", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "construction", kind: "token-slots", prompt: "Build the conditional phrase with taps.", context: "Als ik vrij ben, ___ ik meer tijd ___.", tokens: ["zal", "zou", "ik", "meer", "tijd", "hebben."], accepted: ["zou hebben"], feedback: "Correct. Zou ... hebben expresses the conditional possibility.", incorrectFeedback: "After Als ik vrij ben, use zou ik meer tijd hebben." },
  { id: "exercise.hebben.future-reference.natural-translation", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "natural-translation", kind: "choice", prompt: "Choose the advanced completed-future reference.", context: "By Friday, I will have had the appointment.", choices: ["Tegen vrijdag zal ik de afspraak gehad hebben.", "Tegen vrijdag zou ik de afspraak hebben.", "Gisteren had ik de afspraak."], accepted: ["Tegen vrijdag zal ik de afspraak gehad hebben."], feedback: "Correct. Zal ... gehad hebben places the completed experience before Friday.", incorrectFeedback: "For ‘will have had’, choose Tegen vrijdag zal ik de afspraak gehad hebben." },
  { id: "exercise.hebben.future-reference.map-placement", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "map-placement", kind: "map-placement", prompt: "Where does this conditional completion belong?", context: "Zou ik genoeg tijd gehad hebben.", choices: ["VVTT · voltooid verleden toekomende tijd", "VTTT · voltooid tegenwoordige toekomende tijd", "OVTT · onvoltooid verleden toekomende tijd", "VTT · voltooid tegenwoordige tijd"], accepted: ["VVTT · voltooid verleden toekomende tijd"], feedback: "Correct. Zou ... gehad hebben is VVTT in this reference example.", incorrectFeedback: "Zou ... gehad hebben is voltooid verleden toekomende tijd: VVTT." },
  { id: "exercise.hebben.future-reference.word-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "word-order", delayedOrRecombined: true, kind: "token-order", prompt: "Put the conditional completion in the correct order.", context: "Start with the condition: Als ik eerder was begonnen, …", tokens: ["Als", "ik", "eerder", "was", "begonnen,", "zou", "ik", "genoeg", "tijd", "gehad", "hebben."], accepted: ["Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben."], feedback: "Correct. Zou comes before ik and gehad hebben closes the phrase.", incorrectFeedback: "Use Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben." },
];

const hebbenFutureReferenceRepairs: AuthoredVerbPracticeQuestion[] = [
  { id: "exercise.hebben.future-reference.repair-auxiliary", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "repair-auxiliary", kind: "choice", prompt: "Repair the future or conditional auxiliary.", context: "Morgen ___ ik meer tijd hebben.", choices: ["zal", "zou", "had"], accepted: ["zal"], feedback: "Correct. Morgen zal ik meer tijd hebben is an explicit future.", incorrectFeedback: "Use zal with Morgen for the explicit future: Morgen zal ik meer tijd hebben." },
  { id: "exercise.hebben.future-reference.repair-order", verbId: "verb.hebben", formOrSkillId: "skill.hebben.future-reference", exerciseFamily: "repair-order", kind: "token-order", prompt: "Repair the conditional order.", context: "Als ik vrij ben, …", tokens: ["zou", "ik", "meer", "tijd", "hebben."], accepted: ["zou ik meer tijd hebben."], feedback: "Correct. Zou comes before ik after the condition.", incorrectFeedback: "Use zou ik meer tijd hebben after Als ik vrij ben." },
];

function assignJourneyId(journeyId: VerbPracticeJourneyId, pack: AuthoredVerbPracticePack): VerbPracticePack {
  return { questions: pack.questions.map((question) => ({ ...question, journeyId })), repairs: pack.repairs.map((question) => ({ ...question, journeyId })) };
}

const practicePacks: Record<VerbPracticeJourneyId, VerbPracticePack> = {
  "journey.werken.ott-routine": assignJourneyId("journey.werken.ott-routine", { questions: ottQuestions, repairs: ottRepairs }),
  "journey.werken.vtt-completed": assignJourneyId("journey.werken.vtt-completed", { questions: vttQuestions, repairs: vttRepairs }),
  "journey.werken.ovt-background": assignJourneyId("journey.werken.ovt-background", { questions: ovtQuestions, repairs: ovtRepairs }),
  "journey.werken.vvt-earlier-past": assignJourneyId("journey.werken.vvt-earlier-past", { questions: vvtQuestions, repairs: vvtRepairs }),
  "journey.werken.future-possibility": assignJourneyId("journey.werken.future-possibility", { questions: futurePossibilityQuestions, repairs: futurePossibilityRepairs }),
  "journey.werken.reference-completed-future": assignJourneyId("journey.werken.reference-completed-future", { questions: completedFutureQuestions, repairs: completedFutureRepairs }),
  "journey.zijn.ott-identity": assignJourneyId("journey.zijn.ott-identity", { questions: zijnIdentityQuestions, repairs: zijnIdentityRepairs }),
  "journey.zijn.ott-questions": assignJourneyId("journey.zijn.ott-questions", { questions: zijnQuestionQuestions, repairs: zijnQuestionRepairs }),
  "journey.zijn.ovt-state": assignJourneyId("journey.zijn.ovt-state", { questions: zijnPastStateQuestions, repairs: zijnPastStateRepairs }),
  "journey.zijn.vtt-experience": assignJourneyId("journey.zijn.vtt-experience", { questions: zijnPastExperienceQuestions, repairs: zijnPastExperienceRepairs }),
  "journey.zijn.future-conditional": assignJourneyId("journey.zijn.future-conditional", { questions: zijnFutureConditionalQuestions, repairs: zijnFutureConditionalRepairs }),
  "journey.zijn.reference-completed": assignJourneyId("journey.zijn.reference-completed", { questions: zijnReferenceCompletedQuestions, repairs: zijnReferenceCompletedRepairs }),
  "journey.hebben.ott-possession": assignJourneyId("journey.hebben.ott-possession", { questions: hebbenPossessionQuestions, repairs: hebbenPossessionRepairs }),
  "journey.hebben.ott-expressions": assignJourneyId("journey.hebben.ott-expressions", { questions: hebbenExpressionsQuestions, repairs: hebbenExpressionsRepairs }),
  "journey.hebben.ovt-possession": assignJourneyId("journey.hebben.ovt-possession", { questions: hebbenPastPossessionQuestions, repairs: hebbenPastPossessionRepairs }),
  "journey.hebben.vtt-experience": assignJourneyId("journey.hebben.vtt-experience", { questions: hebbenCompletedExperienceQuestions, repairs: hebbenCompletedExperienceRepairs }),
  "journey.hebben.vtt-auxiliary": assignJourneyId("journey.hebben.vtt-auxiliary", { questions: hebbenAuxiliaryQuestions, repairs: hebbenAuxiliaryRepairs }),
  "journey.hebben.future-reference": assignJourneyId("journey.hebben.future-reference", { questions: hebbenFutureReferenceQuestions, repairs: hebbenFutureReferenceRepairs }),
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
