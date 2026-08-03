import { gaanPack } from "./gaan-content";
import { contentCatalog } from "../content-catalog";

export const VERB_JOURNEY_SCHEMA_VERSION = 1;
export const VERB_JOURNEY_CONTENT_VERSION = "015-1";
export const VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION = "015-2";
export const ZIJN_VERB_JOURNEY_CONTENT_VERSION = "016-1";
export const ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION = "016-2";
export const HEBBEN_VERB_JOURNEY_CONTENT_VERSION = "017-1";
export const HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION = "017-2";
export const ENGLISH_COMPARISON_CONTENT_VERSION = "019-1";
export const GAAN_VERB_JOURNEY_CONTENT_VERSION = "020-1";
export const GAAN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION = "020-2";
export type VerbJourneyContentVersion =
  | typeof VERB_JOURNEY_CONTENT_VERSION
  | typeof VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION
  | typeof ZIJN_VERB_JOURNEY_CONTENT_VERSION
  | typeof ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION
  | typeof HEBBEN_VERB_JOURNEY_CONTENT_VERSION
  | typeof HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION
  | typeof ENGLISH_COMPARISON_CONTENT_VERSION
  | typeof GAAN_VERB_JOURNEY_CONTENT_VERSION
  | typeof GAAN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION;

export type DutchTense = "OTT" | "OVT" | "VTT" | "VVT" | "OTTT" | "OVTT" | "VTTT" | "VVTT";
export type TeachingPriority = "core" | "later" | "reference";
export type JourneyStatus = "mastered" | "learning" | "next" | "later" | "reference";
export type JourneyKind = "core" | "later" | "reference";
export type LocalizedVerbSentence = { nl: string; en: string; te: string };
export type EnglishTense =
  | "present-simple"
  | "present-continuous"
  | "present-perfect"
  | "present-perfect-continuous"
  | "past-simple"
  | "past-continuous"
  | "past-perfect"
  | "past-perfect-continuous"
  | "future-simple"
  | "future-continuous"
  | "future-perfect"
  | "future-perfect-continuous";
export type EnglishComparisonCueKind =
  | "frequency"
  | "current-time"
  | "current-period"
  | "duration"
  | "past-time"
  | "past-reference"
  | "sequence"
  | "future-time"
  | "deadline"
  | "compound";
export type EnglishComparisonCue = {
  display: string;
  shortMeaning: string;
  kind: EnglishComparisonCueKind;
  tokens: string[];
};
export type EnglishComparisonVariant = LocalizedVerbSentence & { form: DutchTense };

export type VerbFormRecord = {
  id: string;
  dutchTense: DutchTense;
  viewpoint: "present" | "past" | "future" | "future-from-past";
  completion: "onvoltooid" | "voltooid";
  fullNameNl: string;
  sentence: string;
  naturalEnglish: string;
  usageMeaning: string;
  formula: string;
  commonUsage: string;
  learnerLabelEn: string;
  canonicalExample: LocalizedVerbSentence;
  commonUsageExample: LocalizedVerbSentence;
  cefrLevel: "A1" | "A2" | "reference";
  teachingPriority: TeachingPriority;
  status: JourneyStatus;
};

export type EnglishMapRecord = {
  id: string;
  englishTense: EnglishTense;
  group: "present" | "past" | "future";
  english: string;
  situation: string;
  meaningPreservingDutch: string;
  commonEverydayDutch: string;
  dutchAnalysis: {
    primaryForm?: DutchTense;
    construction?: string;
    alternativeForms?: DutchTense[];
  };
  mismatchNote: string;
  meaningPreserving?: EnglishComparisonVariant;
  everyday?: EnglishComparisonVariant;
  cue?: EnglishComparisonCue;
  howDutchExpressesIt?: string;
  whyTheyDiffer?: string;
  cefrLevel: "A1" | "A2" | "reference";
  teachingPriority: TeachingPriority;
};
type EnglishComparisonContent = {
  meaningPreserving: EnglishComparisonVariant;
  everyday: EnglishComparisonVariant;
  cue: EnglishComparisonCue;
  howDutchExpressesIt: string;
  whyTheyDiffer: string;
};

function withEnglishComparisonContent(
  records: readonly EnglishMapRecord[],
  content: Record<EnglishTense, EnglishComparisonContent>,
): EnglishMapRecord[] {
  return records.map((record) => ({ ...record, ...content[record.englishTense] }));
}

export type StoryTarget = { text: string; skillIds: string[] };
export type StoryLine = { id: string; nl: string; english: string; telugu: string; targets: StoryTarget[] };
export type NoticeContent = {
  id: string;
  title: string;
  subtitle: string;
  comparison: Array<{ label: string; tense: DutchTense; sentence: string; meaning: string }>;
  formula: string;
  formulaNote: string;
  valuableContrast: string;
};

export type JourneyRecord = {
  id: string;
  verbId: string;
  title: string;
  subtitle: string;
  level: "A1" | "A2" | "reference";
  kind: JourneyKind;
  status: JourneyStatus;
  targetForms: DutchTense[];
  targetSkills: string[];
  learningGoal: string;
  estimatedMinutes: number;
  storyTitle?: string;
  story: StoryLine[];
  notice?: NoticeContent;
};

export type VerbJourneyPack = {
  schemaVersion: typeof VERB_JOURNEY_SCHEMA_VERSION;
  contentVersion: VerbJourneyContentVersion;
  verb: { id: string; lemma: string; english: string; level: "A1"; tags: string[]; auxiliary: "hebben" | "zijn" };
  dutchForms: VerbFormRecord[];
  englishComparison: EnglishMapRecord[];
  journeys: JourneyRecord[];
};

const vttNotice: NoticeContent = {
  id: "notice.werken.vtt-completed",
  title: "The completed event",
  subtitle: "Compare a routine with a completed fact.",
  comparison: [
    { label: "OTT", tense: "OTT", sentence: "Ik werk meestal thuis.", meaning: "routine / present situation" },
    { label: "VTT", tense: "VTT", sentence: "Ik heb gisteren thuis gewerkt.", meaning: "completed conversational event" },
  ],
  formula: "ik + heb + … + gewerkt",
  formulaNote: "Use hebben with werken. The participle is gewerkt.",
  valuableContrast: "Ik heb gisteren gewerkt is common when reporting one completed fact. Ik werkte vroeger thuis is common for past habits or story background.",
};

const ottNotice: NoticeContent = {
  id: "notice.werken.ott-routine",
  title: "The routine",
  subtitle: "Notice the present form for a routine or current situation.",
  comparison: [
    { label: "OTT", tense: "OTT", sentence: "Ik werk meestal thuis.", meaning: "routine / present situation" },
    { label: "VTT", tense: "VTT", sentence: "Ik heb gisteren thuis gewerkt.", meaning: "completed event" },
  ],
  formula: "ik + werk",
  formulaNote: "With ik, the regular weak verb werken uses the stem werk.",
  valuableContrast: "Ik werk meestal thuis describes what is usual. Ik heb gisteren thuis gewerkt reports one completed event.",
};

const ovtNotice: NoticeContent = {
  id: "notice.werken.ovt-background",
  title: "The past background",
  subtitle: "Compare a past habit with one completed conversational fact.",
  comparison: [
    { label: "VTT", tense: "VTT", sentence: "Ik heb gisteren thuis gewerkt.", meaning: "completed conversational event" },
    { label: "OVT", tense: "OVT", sentence: "Ik werkte vroeger thuis.", meaning: "past habit / story background" },
  ],
  formula: "ik + werkte",
  formulaNote: "The regular past singular of werken is werkte.",
  valuableContrast: "Ik werkte vroeger thuis sets the background or describes a habit. Ik heb gisteren gewerkt reports a completed fact.",
};

const vvtNotice: NoticeContent = {
  id: "notice.werken.vvt-earlier-past",
  title: "The earlier past",
  subtitle: "Notice how VVT places one completed event before another past event.",
  comparison: [
    { label: "VVT", tense: "VVT", sentence: "Ik had al thuis gewerkt voordat de vergadering begon.", meaning: "earlier completed event" },
    { label: "VTT", tense: "VTT", sentence: "Ik heb gisteren thuis gewerkt.", meaning: "completed fact from the present viewpoint" },
    { label: "OVT", tense: "OVT", sentence: "Ik werkte vroeger thuis.", meaning: "past habit / story background" },
  ],
  formula: "ik + had + … + gewerkt",
  formulaNote: "VVT uses the past auxiliary had plus gewerkt to show an earlier completed event.",
  valuableContrast: "Ik had al thuis gewerkt voordat de vergadering begon places one completed action before another past event. Ik heb gisteren gewerkt reports a completed fact from the present viewpoint.",
};

const futurePossibilityNotice: NoticeContent = {
  id: "notice.werken.future-possibility",
  title: "Plans and possibilities",
  subtitle: "Compare a future plan with a conditional possibility.",
  comparison: [
    { label: "OTTT", tense: "OTTT", sentence: "Morgen zal ik thuis werken.", meaning: "future plan or prediction" },
    { label: "OVTT", tense: "OVTT", sentence: "Als het regent, zou ik thuis werken.", meaning: "conditional possibility" },
    { label: "OTT", tense: "OTT", sentence: "Morgen werk ik thuis.", meaning: "ordinary everyday future" },
  ],
  formula: "ik + zal / zou + … + werken",
  formulaNote: "Zal marks an explicit future; zou frames the action as conditional or hypothetical.",
  valuableContrast: "Morgen zal ik thuis werken makes the future explicit. Als het regent, zou ik thuis werken depends on a condition; everyday Dutch often uses OTT for a straightforward future plan.",
};

const completedFutureNotice: NoticeContent = {
  id: "notice.werken.reference-completed-future",
  title: "Completion from another viewpoint",
  subtitle: "Notice how the same completed action can be viewed from the future or a hypothetical past.",
  comparison: [
    { label: "VTTT", tense: "VTTT", sentence: "Voor het einde van de dag zal ik acht uur gewerkt hebben.", meaning: "completed before a future point" },
    { label: "VVTT", tense: "VVTT", sentence: "Als ik meer tijd had gehad, zou ik langer gewerkt hebben.", meaning: "unreal completed result" },
    { label: "VTT", tense: "VTT", sentence: "Ik heb vandaag acht uur gewerkt.", meaning: "completed fact from the present viewpoint" },
  ],
  formula: "ik + zal / zou + … + gewerkt hebben",
  formulaNote: "The auxiliary pair zal hebben or zou hebben frames gewerkt as completed from another viewpoint.",
  valuableContrast: "VTTT looks forward to a completed result before a future point. VVTT imagines a completed result that did not happen; everyday Dutch often chooses a simpler construction instead.",
};

const englishComparisonBase: EnglishMapRecord[] = [
  {
    id: "english.werken.present-simple", englishTense: "present-simple", group: "present", english: "I work at home every Monday.", situation: "A repeated routine or fact.", meaningPreservingDutch: "Ik werk elke maandag thuis.", commonEverydayDutch: "Ik werk elke maandag thuis.", dutchAnalysis: { primaryForm: "OTT" }, mismatchNote: "This is a direct mapping for routines, facts, and repeated actions.", cefrLevel: "A1", teachingPriority: "core",
  },
  {
    id: "english.werken.present-continuous", englishTense: "present-continuous", group: "present", english: "I am working at home right now.", situation: "An activity happening now.", meaningPreservingDutch: "Ik ben nu thuis aan het werken.", commonEverydayDutch: "Ik werk nu thuis.", dutchAnalysis: { primaryForm: "OTT", construction: "OTT + nu" }, mismatchNote: "Dutch has no separate continuous tense; ordinary OTT plus nu is often enough.", cefrLevel: "A1", teachingPriority: "core",
  },
  {
    id: "english.werken.present-perfect", englishTense: "present-perfect", group: "present", english: "I have worked at home three times this week.", situation: "Completed events connected to the current period.", meaningPreservingDutch: "Ik heb deze week drie keer thuis gewerkt.", commonEverydayDutch: "Ik heb deze week drie keer thuis gewerkt.", dutchAnalysis: { primaryForm: "VTT" }, mismatchNote: "VTT presents completed events as relevant to the current period.", cefrLevel: "A1", teachingPriority: "core",
  },
  {
    id: "english.werken.present-perfect-continuous", englishTense: "present-perfect-continuous", group: "present", english: "I have been working for two hours.", situation: "An activity started earlier and is still continuing.", meaningPreservingDutch: "Ik ben al twee uur aan het werken.", commonEverydayDutch: "Ik werk al twee uur.", dutchAnalysis: { primaryForm: "OTT", construction: "OTT + al + duration" }, mismatchNote: "Because the activity continues now, Dutch treats it as a present situation with al and a duration.", cefrLevel: "A2", teachingPriority: "core",
  },
  {
    id: "english.werken.past-simple", englishTense: "past-simple", group: "past", english: "I worked at home yesterday.", situation: "One completed fact in a past conversation.", meaningPreservingDutch: "Gisteren werkte ik thuis.", commonEverydayDutch: "Ik heb gisteren thuis gewerkt.", dutchAnalysis: { primaryForm: "VTT", alternativeForms: ["OVT"] }, mismatchNote: "English simple past often maps to VTT for a standalone completed fact; OVT is common for narrative background or habits.", cefrLevel: "A2", teachingPriority: "core",
  },
  {
    id: "english.werken.past-continuous", englishTense: "past-continuous", group: "past", english: "I was working when she called.", situation: "An ongoing past activity interrupted by another event.", meaningPreservingDutch: "Ik was aan het werken toen ze belde.", commonEverydayDutch: "Ik zat te werken toen ze belde.", dutchAnalysis: { primaryForm: "OVT", construction: "OVT + aan het / zitten te" }, mismatchNote: "Dutch supplies ongoing meaning with aan het or a position verb such as zitten te.", cefrLevel: "A2", teachingPriority: "core",
  },
  {
    id: "english.werken.past-perfect", englishTense: "past-perfect", group: "past", english: "I had already worked at home before the meeting began.", situation: "An earlier completed event viewed from a past reference point.", meaningPreservingDutch: "Ik had al thuis gewerkt voordat de vergadering begon.", commonEverydayDutch: "Ik had al thuis gewerkt voordat de vergadering begon.", dutchAnalysis: { primaryForm: "VVT" }, mismatchNote: "VVT explicitly marks the earlier of two past events.", cefrLevel: "A2", teachingPriority: "later",
  },
  {
    id: "english.werken.past-perfect-continuous", englishTense: "past-perfect-continuous", group: "past", english: "I had been working for two hours when she called.", situation: "A continuing activity measured up to a past reference point.", meaningPreservingDutch: "Ik was al twee uur aan het werken toen ze belde.", commonEverydayDutch: "Ik zat al twee uur te werken toen ze belde.", dutchAnalysis: { primaryForm: "OVT", construction: "OVT + al + duration" }, mismatchNote: "The past reference point and al twee uur carry the had been meaning; Dutch normally does not need VVT here.", cefrLevel: "reference", teachingPriority: "reference",
  },
  {
    id: "english.werken.future-simple", englishTense: "future-simple", group: "future", english: "I will work at home tomorrow.", situation: "A planned or predicted future event.", meaningPreservingDutch: "Ik zal morgen thuis werken.", commonEverydayDutch: "Morgen werk ik thuis.", dutchAnalysis: { primaryForm: "OTT", construction: "OTT + future time marker", alternativeForms: ["OTTT"] }, mismatchNote: "English will does not automatically require Dutch zal; a future time word often makes OTT sufficient.", cefrLevel: "A1", teachingPriority: "core",
  },
  {
    id: "english.werken.future-continuous", englishTense: "future-continuous", group: "future", english: "Tomorrow at eight, I will be working.", situation: "An activity in progress at a future time.", meaningPreservingDutch: "Morgen om acht uur zal ik aan het werken zijn.", commonEverydayDutch: "Morgen om acht uur ben ik aan het werken.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + aan het werken", alternativeForms: ["OTTT"] }, mismatchNote: "The future time phrase and progressive expression carry both the future and ongoing meaning.", cefrLevel: "reference", teachingPriority: "reference",
  },
  {
    id: "english.werken.future-perfect", englishTense: "future-perfect", group: "future", english: "By Friday, I will have worked at home three times.", situation: "A completed amount measured before a future deadline.", meaningPreservingDutch: "Tegen vrijdag zal ik drie keer thuis gewerkt hebben.", commonEverydayDutch: "Uiterlijk vrijdag heb ik drie keer thuis gewerkt.", dutchAnalysis: { primaryForm: "VTTT", alternativeForms: ["VTT"] }, mismatchNote: "VTTT explicitly marks completion before a future point; everyday Dutch may let the deadline carry the future meaning.", cefrLevel: "reference", teachingPriority: "reference",
  },
  {
    id: "english.werken.future-perfect-continuous", englishTense: "future-perfect-continuous", group: "future", english: "Tomorrow at eight, I will have been working for two hours.", situation: "A continuing activity measured at a future time.", meaningPreservingDutch: "Morgen om acht uur zal ik al twee uur aan het werken zijn.", commonEverydayDutch: "Morgen om acht uur ben ik al twee uur aan het werken.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + al + duration", alternativeForms: ["OTTT"] }, mismatchNote: "The activity is still ongoing at the future point, so Dutch normally avoids a completed VTTT form.", cefrLevel: "reference", teachingPriority: "reference",
  },
];

const werkenEnglishComparisonContent: Record<EnglishTense, EnglishComparisonContent> = {
  "present-simple": {
    meaningPreserving: { nl: "Ik werk elke maandag thuis.", en: "I work at home every Monday.", te: "నేను ప్రతి సోమవారం ఇంటి నుంచి పని చేస్తాను.", form: "OTT" },
    everyday: { nl: "Ik werk elke maandag thuis.", en: "I work at home every Monday.", te: "నేను ప్రతి సోమవారం ఇంటి నుంచి పని చేస్తాను.", form: "OTT" },
    cue: { display: "elke maandag", shortMeaning: "repeated routine", kind: "frequency", tokens: ["elke maandag"] },
    howDutchExpressesIt: "Meaning-preserving: OTT + frequency cue. Everyday: OTT + frequency cue.",
    whyTheyDiffer: "This is a direct mapping for a repeated routine or habit.",
  },
  "present-continuous": {
    meaningPreserving: { nl: "Ik ben nu thuis aan het werken.", en: "I am working at home right now.", te: "నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను.", form: "OTT" },
    everyday: { nl: "Ik werk nu thuis.", en: "I am working at home right now.", te: "నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను.", form: "OTT" },
    cue: { display: "nu", shortMeaning: "happening now", kind: "current-time", tokens: ["nu"] },
    howDutchExpressesIt: "Meaning-preserving: OTT progressive. Everyday: OTT + nu.",
    whyTheyDiffer: "Dutch can express an action in progress with ordinary OTT when nu makes the current meaning clear.",
  },
  "present-perfect": {
    meaningPreserving: { nl: "Ik heb deze week drie keer thuis gewerkt.", en: "I have worked at home three times this week.", te: "నేను ఈ వారం మూడు సార్లు ఇంటి నుంచి పని చేశాను.", form: "VTT" },
    everyday: { nl: "Ik heb deze week drie keer thuis gewerkt.", en: "I have worked at home three times this week.", te: "నేను ఈ వారం మూడు సార్లు ఇంటి నుంచి పని చేశాను.", form: "VTT" },
    cue: { display: "deze week", shortMeaning: "completed events in the current period", kind: "current-period", tokens: ["deze week"] },
    howDutchExpressesIt: "Meaning-preserving: VTT + current-period cue. Everyday: VTT + current-period cue.",
    whyTheyDiffer: "VTT presents completed events as relevant to the current period.",
  },
  "present-perfect-continuous": {
    meaningPreserving: { nl: "Ik ben al twee uur aan het werken.", en: "I have been working for two hours.", te: "నేను రెండు గంటలుగా పని చేస్తున్నాను.", form: "OTT" },
    everyday: { nl: "Ik werk al twee uur.", en: "I have been working for two hours.", te: "నేను రెండు గంటలుగా పని చేస్తున్నాను.", form: "OTT" },
    cue: { display: "al twee uur", shortMeaning: "duration continuing now", kind: "duration", tokens: ["al", "twee uur"] },
    howDutchExpressesIt: "Meaning-preserving: OTT progressive + duration. Everyday: OTT + al + duration.",
    whyTheyDiffer: "Because the activity continues now, Dutch treats it as a present situation with al and a duration.",
  },
  "past-simple": {
    meaningPreserving: { nl: "Gisteren werkte ik thuis.", en: "I worked at home yesterday.", te: "నేను నిన్న ఇంటి నుంచి పని చేశాను.", form: "OVT" },
    everyday: { nl: "Ik heb gisteren thuis gewerkt.", en: "I worked at home yesterday.", te: "నేను నిన్న ఇంటి నుంచి పని చేశాను.", form: "VTT" },
    cue: { display: "gisteren", shortMeaning: "completed past fact", kind: "past-time", tokens: ["gisteren"] },
    howDutchExpressesIt: "Meaning-preserving: OVT for a past fact. Everyday: VTT + past-time cue.",
    whyTheyDiffer: "English simple past often maps to VTT for a standalone completed fact; OVT is common for narrative background or habits.",
  },
  "past-continuous": {
    meaningPreserving: { nl: "Ik was aan het werken toen ze belde.", en: "I was working when she called.", te: "ఆమె ఫోన్ చేసినప్పుడు నేను పని చేస్తున్నాను.", form: "OVT" },
    everyday: { nl: "Ik zat te werken toen ze belde.", en: "I was working when she called.", te: "ఆమె ఫోన్ చేసినప్పుడు నేను పని చేస్తున్నాను.", form: "OVT" },
    cue: { display: "toen ze belde", shortMeaning: "ongoing action around a past event", kind: "past-reference", tokens: ["toen ze belde"] },
    howDutchExpressesIt: "Meaning-preserving: OVT + aan het. Everyday: zitten te + past reference.",
    whyTheyDiffer: "Dutch supplies ongoing meaning with aan het or a position verb such as zitten te.",
  },
  "past-perfect": {
    meaningPreserving: { nl: "Ik had al thuis gewerkt voordat de vergadering begon.", en: "I had already worked at home before the meeting began.", te: "సమావేశం ప్రారంభమయ్యే ముందు నేను ఇప్పటికే ఇంటి నుంచి పని చేశాను.", form: "VVT" },
    everyday: { nl: "Ik had al thuis gewerkt voordat de vergadering begon.", en: "I had already worked at home before the meeting began.", te: "సమావేశం ప్రారంభమయ్యే ముందు నేను ఇప్పటికే ఇంటి నుంచి పని చేశాను.", form: "VVT" },
    cue: { display: "al … voordat", shortMeaning: "completed before another past event", kind: "compound", tokens: ["al", "voordat"] },
    howDutchExpressesIt: "Meaning-preserving: VVT + al + voordat. Everyday: VVT + al + voordat.",
    whyTheyDiffer: "VVT explicitly marks the earlier of two past events.",
  },
  "past-perfect-continuous": {
    meaningPreserving: { nl: "Ik was al twee uur aan het werken toen ze belde.", en: "I had been working for two hours when she called.", te: "ఆమె ఫోన్ చేసినప్పుడు నేను రెండు గంటలుగా పని చేస్తున్నాను.", form: "OVT" },
    everyday: { nl: "Ik zat al twee uur te werken toen ze belde.", en: "I had been working for two hours when she called.", te: "ఆమె ఫోన్ చేసినప్పుడు నేను రెండు గంటలుగా పని చేస్తున్నాను.", form: "OVT" },
    cue: { display: "al twee uur … toen", shortMeaning: "duration continuing up to a past point", kind: "compound", tokens: ["al", "twee uur", "toen"] },
    howDutchExpressesIt: "Meaning-preserving: OVT progressive + duration. Everyday: zitten te + al + duration.",
    whyTheyDiffer: "The past reference point and al twee uur carry the had been meaning; Dutch normally does not need VVT here.",
  },
  "future-simple": {
    meaningPreserving: { nl: "Ik zal morgen thuis werken.", en: "I will work at home tomorrow.", te: "నేను రేపు ఇంటి నుంచి పని చేస్తాను.", form: "OTTT" },
    everyday: { nl: "Morgen werk ik thuis.", en: "I will work at home tomorrow.", te: "నేను రేపు ఇంటి నుంచి పని చేస్తాను.", form: "OTT" },
    cue: { display: "morgen", shortMeaning: "future supplied by context", kind: "future-time", tokens: ["morgen"] },
    howDutchExpressesIt: "Meaning-preserving: OTTT + future-time cue. Everyday: OTT + future-time cue.",
    whyTheyDiffer: "English will does not automatically require Dutch zal; a future time word often makes OTT sufficient.",
  },
  "future-continuous": {
    meaningPreserving: { nl: "Morgen om acht uur zal ik aan het werken zijn.", en: "Tomorrow at eight, I will be working.", te: "రేపు ఎనిమిది గంటలకు నేను పని చేస్తూ ఉంటాను.", form: "OTTT" },
    everyday: { nl: "Morgen om acht uur ben ik aan het werken.", en: "Tomorrow at eight, I will be working.", te: "రేపు ఎనిమిది గంటలకు నేను పని చేస్తూ ఉంటాను.", form: "OTT" },
    cue: { display: "morgen om acht uur", shortMeaning: "action in progress at a future point", kind: "future-time", tokens: ["morgen", "om acht uur"] },
    howDutchExpressesIt: "Meaning-preserving: OTTT + aan het werken. Everyday: OTT + future-time cue + aan het werken.",
    whyTheyDiffer: "The future time phrase and progressive expression carry both the future and ongoing meaning.",
  },
  "future-perfect": {
    meaningPreserving: { nl: "Tegen vrijdag zal ik drie keer thuis gewerkt hebben.", en: "By Friday, I will have worked at home three times.", te: "శుక్రవారం నాటికి నేను ఇంటి నుంచి మూడు సార్లు పని చేసి ఉంటాను.", form: "VTTT" },
    everyday: { nl: "Uiterlijk vrijdag heb ik drie keer thuis gewerkt.", en: "By Friday, I will have worked at home three times.", te: "శుక్రవారం నాటికి నేను ఇంటి నుంచి మూడు సార్లు పని చేసి ఉంటాను.", form: "VTT" },
    cue: { display: "tegen/uiterlijk vrijdag", shortMeaning: "completed by a future deadline", kind: "deadline", tokens: ["vrijdag"] },
    howDutchExpressesIt: "Meaning-preserving: VTTT + deadline. Everyday: VTT + deadline.",
    whyTheyDiffer: "VTTT explicitly marks completion before a future point; everyday Dutch may let the deadline carry the future meaning.",
  },
  "future-perfect-continuous": {
    meaningPreserving: { nl: "Morgen om acht uur zal ik al twee uur aan het werken zijn.", en: "Tomorrow at eight, I will have been working for two hours.", te: "రేపు ఎనిమిది గంటలకు నేను రెండు గంటలుగా పని చేస్తూ ఉంటాను.", form: "OTTT" },
    everyday: { nl: "Morgen om acht uur ben ik al twee uur aan het werken.", en: "Tomorrow at eight, I will have been working for two hours.", te: "రేపు ఎనిమిది గంటలకు నేను రెండు గంటలుగా పని చేస్తూ ఉంటాను.", form: "OTT" },
    cue: { display: "morgen om acht uur + al twee uur", shortMeaning: "duration continuing at a future point", kind: "compound", tokens: ["morgen", "om acht uur", "al twee uur"] },
    howDutchExpressesIt: "Meaning-preserving: OTTT + al + duration. Everyday: OTT + future-time cue + al + duration.",
    whyTheyDiffer: "The activity is still ongoing at the future point, so Dutch normally avoids a completed VTTT form.",
  },
};

const englishComparison = withEnglishComparisonContent(englishComparisonBase, werkenEnglishComparisonContent);

const legacyVerbJourneyPack: VerbJourneyPack = {
  schemaVersion: VERB_JOURNEY_SCHEMA_VERSION,
  contentVersion: ENGLISH_COMPARISON_CONTENT_VERSION,
  verb: { id: "verb.werken", lemma: "werken", english: "to work", level: "A1", tags: ["regular", "weak"], auxiliary: "hebben" },
  dutchForms: [
    { id: "form.werken.ott", dutchTense: "OTT", viewpoint: "present", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige tijd", sentence: "Ik werk thuis.", naturalEnglish: "I work at home.", usageMeaning: "routine, fact, present situation, or a scheduled future with a time word", formula: "ik + present stem", commonUsage: "Ik werk thuis. / Morgen werk ik thuis.", learnerLabelEn: "Present", canonicalExample: { nl: "Ik werk vandaag thuis.", en: "I am working at home today.", te: "నేను ఈరోజు ఇంటి నుంచి పని చేస్తున్నాను." }, commonUsageExample: { nl: "Morgen werk ik thuis.", en: "I will work at home tomorrow.", te: "రేపు నేను ఇంటి వద్ద పని చేస్తాను." }, cefrLevel: "A1", teachingPriority: "core", status: "mastered" },
    { id: "form.werken.vtt", dutchTense: "VTT", viewpoint: "present", completion: "voltooid", fullNameNl: "voltooid tegenwoordige tijd", sentence: "Ik heb thuis gewerkt.", naturalEnglish: "I have worked at home.", usageMeaning: "completed fact, experience, or result presented from the present viewpoint", formula: "ik + heb + … + gewerkt", commonUsage: "Ik heb gisteren thuis gewerkt.", learnerLabelEn: "Completed present / perfect", canonicalExample: { nl: "Ik heb vandaag thuis gewerkt.", en: "I have worked at home today.", te: "నేను ఈరోజు ఇంటి నుంచి పని చేశాను." }, commonUsageExample: { nl: "Ik heb gisteren thuis gewerkt.", en: "I worked at home yesterday.", te: "నేను నిన్న ఇంటి వద్ద పని చేశాను." }, cefrLevel: "A1", teachingPriority: "core", status: "learning" },
    { id: "form.werken.ovt", dutchTense: "OVT", viewpoint: "past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden tijd", sentence: "Ik werkte thuis.", naturalEnglish: "I worked at home.", usageMeaning: "past habit, story background, or connected past sequence", formula: "ik + werkte", commonUsage: "Vroeger werkte ik thuis.", learnerLabelEn: "Past", canonicalExample: { nl: "Ik werkte gisteren thuis.", en: "I worked at home yesterday.", te: "నేను నిన్న ఇంటి నుంచి పని చేశాను." }, commonUsageExample: { nl: "Vroeger werkte ik thuis.", en: "I used to work at home.", te: "గతంలో నేను ఇంటి వద్ద పని చేసేవాడిని." }, cefrLevel: "A2", teachingPriority: "core", status: "next" },
    { id: "form.werken.vvt", dutchTense: "VVT", viewpoint: "past", completion: "voltooid", fullNameNl: "voltooid verleden tijd", sentence: "Ik had thuis gewerkt.", naturalEnglish: "I had worked at home.", usageMeaning: "an earlier completed event viewed from a past reference point", formula: "ik + had + … + gewerkt", commonUsage: "Ik had al thuis gewerkt voordat de vergadering begon.", learnerLabelEn: "Completed past", canonicalExample: { nl: "Ik had al thuis gewerkt.", en: "I had already worked at home.", te: "నేను అప్పటికే ఇంటి నుంచి పని చేసి ఉన్నాను." }, commonUsageExample: { nl: "Ik had al thuis gewerkt voordat de vergadering begon.", en: "I had already worked at home before the meeting began.", te: "సమావేశం మొదలయ్యే ముందు నేను ఇంటి వద్ద పని చేసి ఉన్నాను." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.werken.ottt", dutchTense: "OTTT", viewpoint: "future", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis werken.", naturalEnglish: "I will work at home.", usageMeaning: "future prediction, promise, offer, or emphatic future", formula: "ik + zal + … + werken", commonUsage: "Morgen werk ik thuis. / Ik ga morgen thuis werken.", learnerLabelEn: "Future viewed from the present", canonicalExample: { nl: "Ik zal morgen thuis werken.", en: "I will work at home tomorrow.", te: "నేను రేపు ఇంటి నుంచి పని చేస్తాను." }, commonUsageExample: { nl: "Morgen zal ik thuis werken.", en: "Tomorrow I will work at home.", te: "రేపు నేను ఇంటి వద్ద పని చేస్తాను." }, cefrLevel: "reference", teachingPriority: "later", status: "later" },
    { id: "form.werken.vttt", dutchTense: "VTTT", viewpoint: "future", completion: "voltooid", fullNameNl: "voltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis gewerkt hebben.", naturalEnglish: "I will have worked at home.", usageMeaning: "completion before a future reference point", formula: "ik + zal + … + gewerkt hebben", commonUsage: "Tegen vrijdag heb ik veertig uur gewerkt.", learnerLabelEn: "Completed future viewed from the present", canonicalExample: { nl: "Ik zal tegen die tijd thuis gewerkt hebben.", en: "I will have worked at home by then.", te: "అప్పటికి నేను ఇంటి నుంచి పని చేసి ఉంటాను." }, commonUsageExample: { nl: "Tegen vrijdag zal ik veertig uur gewerkt hebben.", en: "By Friday, I will have worked forty hours.", te: "శుక్రవారం నాటికి నేను నలభై గంటలు పని చేసి ఉంటాను." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
    { id: "form.werken.ovtt", dutchTense: "OVTT", viewpoint: "future-from-past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden toekomende tijd", sentence: "Ik zou thuis werken.", naturalEnglish: "I would work at home.", usageMeaning: "future viewed from the past or a hypothetical / conditional situation", formula: "ik + zou + … + werken", commonUsage: "Ik zou thuis werken als dat kon.", learnerLabelEn: "Future viewed from the past / conditional", canonicalExample: { nl: "Ik zou thuis werken.", en: "I would work at home.", te: "నేను ఇంటి నుంచి పని చేసేవాడిని." }, commonUsageExample: { nl: "Ik zou thuis werken als dat kon.", en: "I would work at home if that were possible.", te: "అది సాధ్యమైతే నేను ఇంటి వద్ద పని చేసేవాడిని." }, cefrLevel: "reference", teachingPriority: "later", status: "later" },
    { id: "form.werken.vvtt", dutchTense: "VVTT", viewpoint: "future-from-past", completion: "voltooid", fullNameNl: "voltooid verleden toekomende tijd", sentence: "Ik zou thuis gewerkt hebben.", naturalEnglish: "I would have worked at home.", usageMeaning: "an unreal or unrealised completed result", formula: "ik + zou + … + gewerkt hebben", commonUsage: "Ik zou thuis gewerkt hebben als dat mogelijk was.", learnerLabelEn: "Completed future viewed from the past / conditional perfect", canonicalExample: { nl: "Ik zou thuis gewerkt hebben.", en: "I would have worked at home.", te: "నేను ఇంటి నుంచి పని చేసి ఉండేవాడిని." }, commonUsageExample: { nl: "Ik zou thuis gewerkt hebben als dat mogelijk was.", en: "I would have worked at home if that had been possible.", te: "అది సాధ్యమై ఉంటే నేను ఇంటి వద్ద పని చేసి ఉండేవాడిని." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
  ],
  englishComparison,
  journeys: [
    {
      id: "journey.werken.ott-routine", verbId: "verb.werken", title: "What I normally do", subtitle: "OTT · present and routine", level: "A1", kind: "core", status: "mastered", targetForms: ["OTT"], targetSkills: ["skill.werken.ott-routine"], learningGoal: "Describe a routine or present work situation.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ott.1", nl: "Ik werk meestal samen op kantoor.", english: "I usually work together with others at the office.", telugu: "నేను సాధారణంగా కార్యాలయంలో ఇతరులతో కలిసి పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.2", nl: "Op maandag werk ik aan een nieuw plan.", english: "On Mondays I work on a new plan.", telugu: "సోమవారాల్లో నేను ఒక కొత్త ప్రణాళికపై పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.3", nl: "In de ochtend werk ik rustig.", english: "In the morning I work calmly.", telugu: "ఉదయం నేను ప్రశాంతంగా పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.4", nl: "Na de lunch werk ik verder aan het project.", english: "After lunch I continue working on the project.", telugu: "మధ్యాహ్న భోజనం తర్వాత నేను ప్రాజెక్ట్‌పై పని కొనసాగిస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.5", nl: "Aan het einde van de dag werk ik aan de laatste punten.", english: "At the end of the day I work on the final points.", telugu: "రోజు చివర్లో నేను చివరి అంశాలపై పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
      ], notice: ottNotice,
    },
    {
      id: "journey.werken.vtt-completed", verbId: "verb.werken", title: "What I completed", subtitle: "VTT · completed events", level: "A1", kind: "core", status: "learning", targetForms: ["VTT"], targetSkills: ["skill.werken.vtt-completed"], learningGoal: "Report one completed work event from a recent situation.", estimatedMinutes: 3, storyTitle: "Een drukke werkdag",
      story: [
        { id: "story.werken.vtt.1", nl: "Gisteren heb ik op kantoor gewerkt.", english: "Yesterday I worked at the office.", telugu: "నిన్న నేను కార్యాలయంలో పని చేశాను.", targets: [{ text: "heb ik", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.2", nl: "Ik heb met een nieuw team gewerkt.", english: "I worked with a new team.", telugu: "నేను ఒక కొత్త బృందంతో కలిసి పని చేశాను.", targets: [{ text: "Ik heb", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.3", nl: "Ik heb aan een nieuw project gewerkt.", english: "I worked on a new project.", telugu: "నేను ఒక కొత్త ప్రాజెక్ట్‌పై పని చేశాను.", targets: [{ text: "Ik heb", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.4", nl: "Na de lunch heb ik nog twee uur gewerkt.", english: "After lunch I worked for another two hours.", telugu: "మధ్యాహ్న భోజనం తర్వాత నేను మరో రెండు గంటలు పని చేశాను.", targets: [{ text: "heb ik", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.5", nl: "Aan het einde heb ik nog een uur gewerkt.", english: "At the end I worked for another hour.", telugu: "చివర్లో నేను మరో గంట పని చేశాను.", targets: [{ text: "heb ik", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
      ], notice: vttNotice,
    },
    {
      id: "journey.werken.ovt-background", verbId: "verb.werken", title: "How I worked before", subtitle: "OVT · habits and stories", level: "A2", kind: "core", status: "next", targetForms: ["OVT"], targetSkills: ["skill.werken.ovt-background"], learningGoal: "Describe a past habit or story background.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ovt.1", nl: "Vroeger werkte ik vaak in een kleine ruimte.", english: "I used to work in a small room.", telugu: "గతంలో నేను తరచుగా ఒక చిన్న గదిలో పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.2", nl: "Elke zaterdag werkte ik samen.", english: "I worked together with others every Saturday.", telugu: "ప్రతి శనివారం నేను ఇతరులతో కలిసి పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.3", nl: "Tijdens de winter werkte ik rustig binnen.", english: "During the winter I worked quietly indoors.", telugu: "చలికాలంలో నేను ఇంటి లోపల ప్రశాంతంగా పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.4", nl: "In die periode werkte ik aan hetzelfde plan.", english: "During that period I worked on the same plan.", telugu: "ఆ కాలంలో నేను అదే ప్రణాళికపై పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.5", nl: "Na de lunch werkte ik verder.", english: "After lunch I continued working.", telugu: "మధ్యాహ్న భోజనం తర్వాత నేను పని కొనసాగించేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
      ], notice: ovtNotice,
    },
    {
      id: "journey.werken.vvt-earlier-past", verbId: "verb.werken", title: "What had already happened", subtitle: "VVT · earlier past", level: "A2", kind: "later", status: "later", targetForms: ["VVT"], targetSkills: ["skill.werken.vvt-earlier-past"], learningGoal: "Place an earlier completed event before another past event.", estimatedMinutes: 3, storyTitle: "Voordat de vergadering begon",
      story: [
        { id: "story.werken.vvt.1", nl: "Ik had al gewerkt voordat de vergadering begon.", english: "I had already worked before the meeting began.", telugu: "సమావేశం ప్రారంభమయ్యే ముందు నేను ఇప్పటికే పని చేశాను.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.2", nl: "Voordat ik naar kantoor ging, had ik rustig gewerkt.", english: "Before I went to the office, I had worked quietly.", telugu: "నేను కార్యాలయానికి వెళ్లే ముందు ప్రశాంతంగా పని చేశాను.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.3", nl: "Toen de bel ging, had ik al twee uur gewerkt.", english: "When the bell rang, I had already worked for two hours.", telugu: "గంట మోగినప్పుడు నేను ఇప్పటికే రెండు గంటలు పని చేశాను.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.4", nl: "Ik had thuis gewerkt voordat het kantoor openging.", english: "I had worked at home before the office opened.", telugu: "కార్యాలయం తెరవకముందు నేను ఇంటి వద్ద పని చేశాను.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.5", nl: "Voordat de deadline kwam, had ik aan het project gewerkt.", english: "Before the deadline arrived, I had worked on the project.", telugu: "గడువు రాకముందు నేను ప్రాజెక్ట్‌పై పని చేశాను.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
      ], notice: vvtNotice,
    },
    {
      id: "journey.werken.future-possibility", verbId: "verb.werken", title: "Plans and possibilities", subtitle: "OTTT + OVTT · future and conditional", level: "reference", kind: "later", status: "later", targetForms: ["OTTT", "OVTT"], targetSkills: ["skill.werken.future-possibility"], learningGoal: "Distinguish an explicit future plan from a conditional possibility.", estimatedMinutes: 3, storyTitle: "Een plan voor morgen",
      story: [
        { id: "story.werken.future.1", nl: "Morgen zal ik thuis werken.", english: "Tomorrow I will work at home.", telugu: "రేపు నేను ఇంటి వద్ద పని చేస్తాను.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.2", nl: "Als het regent, zou ik thuis werken.", english: "If it rains, I would work at home.", telugu: "వర్షం పడితే, నేను ఇంటి వద్ద పని చేస్తాను.", targets: [{ text: "zou", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.3", nl: "Na de lunch zal ik aan het project werken.", english: "After lunch I will work on the project.", telugu: "మధ్యాహ్న భోజనం తర్వాత నేను ప్రాజెక్ట్‌పై పని చేస్తాను.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.4", nl: "Volgende week zal ik met een nieuwe planning werken.", english: "Next week I will work with a new schedule.", telugu: "వచ్చే వారం నేను కొత్త షెడ్యూల్‌తో పని చేస్తాను.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.5", nl: "Bij slecht weer zou ik in een rustige ruimte werken.", english: "In bad weather I would work in a quiet room.", telugu: "చెడు వాతావరణంలో నేను ప్రశాంతమైన గదిలో పని చేస్తాను.", targets: [{ text: "zou", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
      ], notice: futurePossibilityNotice,
    },
    {
      id: "journey.werken.reference-completed-future", verbId: "verb.werken", title: "Completed future and unreal past", subtitle: "VTTT + VVTT · advanced completion", level: "reference", kind: "reference", status: "reference", targetForms: ["VTTT", "VVTT"], targetSkills: ["skill.werken.reference-completed-future"], learningGoal: "Recognise a completed result viewed from a future or hypothetical point.", estimatedMinutes: 3, storyTitle: "Voor het einde van de dag",
      story: [
        { id: "story.werken.completed-future.1", nl: "Voor het einde van de dag zal ik acht uur gewerkt hebben.", english: "By the end of the day, I will have worked for eight hours.", telugu: "రోజు ముగిసే సమయానికి నేను ఎనిమిది గంటలు పని చేసి ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.2", nl: "Als ik meer tijd had gehad, zou ik langer gewerkt hebben.", english: "If I had had more time, I would have worked longer.", telugu: "నాకు మరింత సమయం ఉండి ఉంటే, నేను ఎక్కువసేపు పని చేసి ఉండేవాడిని.", targets: [{ text: "zou", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.3", nl: "Om vijf uur zal ik al acht uur gewerkt hebben.", english: "At five o'clock, I will already have worked for eight hours.", telugu: "ఐదు గంటలకు నేను ఇప్పటికే ఎనిమిది గంటలు పని చేసి ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.4", nl: "Voor de deadline zal ik aan het project gewerkt hebben.", english: "Before the deadline, I will have worked on the project.", telugu: "గడువుకు ముందు నేను ప్రాజెక్ట్‌పై పని చేసి ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.5", nl: "Als de planning anders was geweest, zou ik langer gewerkt hebben.", english: "If the schedule had been different, I would have worked longer.", telugu: "షెడ్యూల్ భిన్నంగా ఉండి ఉంటే, నేను ఎక్కువసేపు పని చేసి ఉండేవాడిని.", targets: [{ text: "zou", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
      ], notice: completedFutureNotice,
    },
  ],
};

export const verbJourneyPack: VerbJourneyPack = contentCatalog.getVerbJourneyPack("verb.werken") ?? legacyVerbJourneyPack;

const tenseValues = new Set<DutchTense>(["OTT", "OVT", "VTT", "VVT", "OTTT", "OVTT", "VTTT", "VVTT"]);
const englishTenseValues = new Set<EnglishTense>(["present-simple", "present-continuous", "present-perfect", "present-perfect-continuous", "past-simple", "past-continuous", "past-perfect", "past-perfect-continuous", "future-simple", "future-continuous", "future-perfect", "future-perfect-continuous"]);
const stableId = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const multilingualContentVersions = new Set<VerbJourneyContentVersion>([
  VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
  ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
  HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
  GAAN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
]);
const englishComparisonContentVersions = new Set<VerbJourneyContentVersion>([ENGLISH_COMPARISON_CONTENT_VERSION, GAAN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION]);
const englishComparisonCueKinds = new Set<EnglishComparisonCueKind>([
  "frequency", "current-time", "current-period", "duration", "past-time",
  "past-reference", "sequence", "future-time", "deadline", "compound",
]);

const zijnEnglishComparisonBase: EnglishMapRecord[] = [
  { id: "english.zijn.present-simple", englishTense: "present-simple", group: "present", english: "I am at home today.", situation: "A present state or location.", meaningPreservingDutch: "Ik ben vandaag thuis.", commonEverydayDutch: "Ik ben vandaag thuis.", dutchAnalysis: { primaryForm: "OTT" }, mismatchNote: "Dutch uses the present form ben for a current state or location.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.zijn.present-continuous", englishTense: "present-continuous", group: "present", english: "I am being patient right now.", situation: "A quality or state at this moment.", meaningPreservingDutch: "Ik ben nu geduldig.", commonEverydayDutch: "Ik ben nu geduldig.", dutchAnalysis: { primaryForm: "OTT" }, mismatchNote: "English continuous be does not create a separate Dutch tense for a state.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.zijn.present-perfect", englishTense: "present-perfect", group: "present", english: "I have been at home today.", situation: "A completed or experienced state connected to now.", meaningPreservingDutch: "Ik ben vandaag thuis geweest.", commonEverydayDutch: "Ik ben vandaag thuis geweest.", dutchAnalysis: { primaryForm: "VTT" }, mismatchNote: "Zijn forms its perfect with zijn: ben geweest.", cefrLevel: "A2", teachingPriority: "core" },
  { id: "english.zijn.present-perfect-continuous", englishTense: "present-perfect-continuous", group: "present", english: "I have been tired all morning.", situation: "A state continuing through the current period.", meaningPreservingDutch: "Ik ben de hele ochtend moe geweest.", commonEverydayDutch: "Ik ben de hele ochtend moe.", dutchAnalysis: { primaryForm: "OTT", alternativeForms: ["VTT"] }, mismatchNote: "Dutch often uses OTT for a current state; VTT is possible when the period is presented as completed.", cefrLevel: "A2", teachingPriority: "core" },
  { id: "english.zijn.past-simple", englishTense: "past-simple", group: "past", english: "I was at home yesterday.", situation: "A past state or location.", meaningPreservingDutch: "Ik was gisteren thuis.", commonEverydayDutch: "Ik was gisteren thuis.", dutchAnalysis: { primaryForm: "OVT" }, mismatchNote: "Was is the singular past form of zijn for a past state or location.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.zijn.past-continuous", englishTense: "past-continuous", group: "past", english: "I was being careful.", situation: "A quality or state in a past situation.", meaningPreservingDutch: "Ik was voorzichtig.", commonEverydayDutch: "Ik was voorzichtig.", dutchAnalysis: { primaryForm: "OVT" }, mismatchNote: "Dutch normally uses the simple past form was for this state.", cefrLevel: "A2", teachingPriority: "core" },
  { id: "english.zijn.past-perfect", englishTense: "past-perfect", group: "past", english: "I had been at home before noon.", situation: "An earlier past state or location.", meaningPreservingDutch: "Ik was voor de middag thuis geweest.", commonEverydayDutch: "Ik was voor de middag thuis geweest.", dutchAnalysis: { primaryForm: "VVT" }, mismatchNote: "Was geweest places the completed state before another past reference point.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.zijn.past-perfect-continuous", englishTense: "past-perfect-continuous", group: "past", english: "I had been tired for hours.", situation: "A continuing past state measured to a past point.", meaningPreservingDutch: "Ik was al uren moe.", commonEverydayDutch: "Ik was al uren moe.", dutchAnalysis: { primaryForm: "OVT", construction: "OVT + al + duration" }, mismatchNote: "Dutch commonly expresses the continuing state with was and a duration instead of VVT.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.zijn.future-simple", englishTense: "future-simple", group: "future", english: "I will be at home tomorrow.", situation: "A future state or location.", meaningPreservingDutch: "Ik zal morgen thuis zijn.", commonEverydayDutch: "Morgen ben ik thuis.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + OTT", alternativeForms: ["OTTT"] }, mismatchNote: "Dutch often uses OTT with a future time word; zal zijn makes the future explicit.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.zijn.future-continuous", englishTense: "future-continuous", group: "future", english: "Tomorrow at eight, I will be at home.", situation: "A state or location at a future time.", meaningPreservingDutch: "Morgen om acht uur zal ik thuis zijn.", commonEverydayDutch: "Morgen om acht uur ben ik thuis.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + OTT", alternativeForms: ["OTTT"] }, mismatchNote: "The future time phrase carries much of the future meaning in everyday Dutch.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.zijn.future-perfect", englishTense: "future-perfect", group: "future", english: "By Friday, I will have been at home for a week.", situation: "A completed period of being somewhere before a future point.", meaningPreservingDutch: "Vrijdag zal ik een week thuis geweest zijn.", commonEverydayDutch: "Vrijdag ben ik een week thuis geweest.", dutchAnalysis: { primaryForm: "VTTT", alternativeForms: ["VTT"] }, mismatchNote: "VTTT is explicit and formal; everyday Dutch often uses VTT with the deadline as context.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.zijn.future-perfect-continuous", englishTense: "future-perfect-continuous", group: "future", english: "By Friday, I will have been tired for a week.", situation: "A continuing state measured at a future point.", meaningPreservingDutch: "Vrijdag ben ik al een week moe.", commonEverydayDutch: "Vrijdag ben ik al een week moe.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + al + duration", alternativeForms: ["VTTT"] }, mismatchNote: "Dutch normally keeps the state in OTT and uses a duration rather than a separate perfect continuous tense.", cefrLevel: "reference", teachingPriority: "reference" },
];

const localizedEnglishComparison = (nl: string, te: string, form: DutchTense): Omit<EnglishComparisonVariant, "en"> => ({ nl, te, form });
type LocalizedEnglishComparisonContent = {
  meaningPreserving: Omit<EnglishComparisonVariant, "en">;
  everyday: Omit<EnglishComparisonVariant, "en">;
  cue: EnglishComparisonCue;
  howDutchExpressesIt: string;
  whyTheyDiffer: string;
};

function withLocalizedEnglishComparisonContent(records: readonly EnglishMapRecord[], content: Record<EnglishTense, LocalizedEnglishComparisonContent>): EnglishMapRecord[] {
  return records.map((record) => ({
    ...record,
    meaningPreserving: { ...content[record.englishTense].meaningPreserving, en: record.english },
    everyday: { ...content[record.englishTense].everyday, en: record.english },
    cue: content[record.englishTense].cue,
    howDutchExpressesIt: content[record.englishTense].howDutchExpressesIt,
    whyTheyDiffer: content[record.englishTense].whyTheyDiffer,
  }));
}

const zijnEnglishComparison: EnglishMapRecord[] = withLocalizedEnglishComparisonContent(zijnEnglishComparisonBase, {
  "present-simple": { meaningPreserving: localizedEnglishComparison("Ik ben vandaag thuis.", "నేను ఈ రోజు ఇంట్లో ఉన్నాను.", "OTT"), everyday: localizedEnglishComparison("Ik ben vandaag thuis.", "నేను ఈ రోజు ఇంట్లో ఉన్నాను.", "OTT"), cue: { display: "vandaag", shortMeaning: "current day", kind: "current-period", tokens: ["vandaag"] }, howDutchExpressesIt: "Meaning-preserving and everyday: OTT ben + a current-day cue.", whyTheyDiffer: "Dutch uses the present form ben for a current state or location." },
  "present-continuous": { meaningPreserving: localizedEnglishComparison("Ik ben nu geduldig.", "నేను ఇప్పుడు ఓపికగా ఉన్నాను.", "OTT"), everyday: localizedEnglishComparison("Ik ben nu geduldig.", "నేను ఇప్పుడు ఓపికగా ఉన్నాను.", "OTT"), cue: { display: "nu", shortMeaning: "state at this moment", kind: "current-time", tokens: ["nu"] }, howDutchExpressesIt: "Both roles use OTT ben with nu; Dutch has no separate continuous form for this state.", whyTheyDiffer: "English continuous be does not create a separate Dutch tense for a state." },
  "present-perfect": { meaningPreserving: localizedEnglishComparison("Ik ben vandaag thuis geweest.", "నేను ఈ రోజు ఇంట్లో ఉండి వచ్చాను.", "VTT"), everyday: localizedEnglishComparison("Ik ben vandaag thuis geweest.", "నేను ఈ రోజు ఇంట్లో ఉండి వచ్చాను.", "VTT"), cue: { display: "vandaag", shortMeaning: "experience connected to now", kind: "current-period", tokens: ["vandaag"] }, howDutchExpressesIt: "Both roles use VTT with ben geweest.", whyTheyDiffer: "Zijn forms its perfect with zijn: ben geweest." },
  "present-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Ik ben de hele ochtend moe geweest.", "నేను ఉదయం అంతా అలసిపోయి ఉన్నాను.", "VTT"), everyday: localizedEnglishComparison("Ik ben de hele ochtend moe.", "నేను ఉదయం అంతా అలసిపోయి ఉన్నాను.", "OTT"), cue: { display: "de hele ochtend", shortMeaning: "state through the current period", kind: "duration", tokens: ["de hele ochtend"] }, howDutchExpressesIt: "Meaning-preserving: VTT ben geweest. Everyday: OTT ben + the duration phrase.", whyTheyDiffer: "Dutch often uses OTT for a current state; VTT is possible when the period is presented as completed." },
  "past-simple": { meaningPreserving: localizedEnglishComparison("Ik was gisteren thuis.", "నేను నిన్న ఇంట్లో ఉన్నాను.", "OVT"), everyday: localizedEnglishComparison("Ik was gisteren thuis.", "నేను నిన్న ఇంట్లో ఉన్నాను.", "OVT"), cue: { display: "gisteren", shortMeaning: "completed past state", kind: "past-time", tokens: ["gisteren"] }, howDutchExpressesIt: "Both roles use OVT was + a past-time cue.", whyTheyDiffer: "Was is the singular past form of zijn for a past state or location." },
  "past-continuous": { meaningPreserving: localizedEnglishComparison("Ik was voorzichtig toen ik de straat overstak.", "నేను రోడ్డు దాటుతున్నప్పుడు జాగ్రత్తగా ఉన్నాను.", "OVT"), everyday: localizedEnglishComparison("Ik was voorzichtig toen ik de straat overstak.", "నేను రోడ్డు దాటుతున్నప్పుడు జాగ్రత్తగా ఉన్నాను.", "OVT"), cue: { display: "toen", shortMeaning: "past situation in progress", kind: "past-reference", tokens: ["toen"] }, howDutchExpressesIt: "Both roles use OVT was; toen supplies the surrounding past situation.", whyTheyDiffer: "Dutch normally uses the simple past form was for this state." },
  "past-perfect": { meaningPreserving: localizedEnglishComparison("Ik was voor de middag thuis geweest.", "మధ్యాహ్నానికి ముందు నేను ఇంట్లో ఉండి వచ్చాను.", "VVT"), everyday: localizedEnglishComparison("Ik was voor de middag thuis geweest.", "మధ్యాహ్నానికి ముందు నేను ఇంట్లో ఉండి వచ్చాను.", "VVT"), cue: { display: "voor de middag", shortMeaning: "earlier past reference", kind: "past-reference", tokens: ["voor de middag"] }, howDutchExpressesIt: "Both roles use VVT was geweest before the past reference point.", whyTheyDiffer: "Was geweest places the completed state before another past reference point." },
  "past-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Ik was al uren moe.", "నేను ఇప్పటికే గంటలుగా అలసిపోయి ఉన్నాను.", "OVT"), everyday: localizedEnglishComparison("Ik was al uren moe.", "నేను ఇప్పటికే గంటలుగా అలసిపోయి ఉన్నాను.", "OVT"), cue: { display: "al uren", shortMeaning: "duration up to a past point", kind: "duration", tokens: ["al uren"] }, howDutchExpressesIt: "Both roles use OVT was + al + duration.", whyTheyDiffer: "Dutch commonly expresses the continuing state with was and a duration instead of VVT." },
  "future-simple": { meaningPreserving: localizedEnglishComparison("Ik zal morgen thuis zijn.", "నేను రేపు ఇంట్లో ఉంటాను.", "OTTT"), everyday: localizedEnglishComparison("Morgen ben ik thuis.", "రేపు నేను ఇంట్లో ఉంటాను.", "OTT"), cue: { display: "morgen", shortMeaning: "future state", kind: "future-time", tokens: ["morgen"] }, howDutchExpressesIt: "Meaning-preserving: OTTT zal zijn. Everyday: OTT ben + a future-time cue.", whyTheyDiffer: "Dutch often uses OTT with a future time word; zal zijn makes the future explicit." },
  "future-continuous": { meaningPreserving: localizedEnglishComparison("Morgen om acht uur zal ik thuis zijn.", "రేపు ఎనిమిది గంటలకు నేను ఇంట్లో ఉంటాను.", "OTTT"), everyday: localizedEnglishComparison("Morgen om acht uur ben ik thuis.", "రేపు ఎనిమిది గంటలకు నేను ఇంట్లో ఉంటాను.", "OTT"), cue: { display: "morgen om acht uur", shortMeaning: "state at a future time", kind: "future-time", tokens: ["morgen", "om acht uur"] }, howDutchExpressesIt: "Meaning-preserving: OTTT zal zijn. Everyday: OTT ben + the future-time cue.", whyTheyDiffer: "The future time phrase carries much of the future meaning in everyday Dutch." },
  "future-perfect": { meaningPreserving: localizedEnglishComparison("Vrijdag zal ik een week thuis geweest zijn.", "శుక్రవారం నాటికి నేను ఒక వారం ఇంట్లో ఉండి ఉంటాను.", "VTTT"), everyday: localizedEnglishComparison("Vrijdag ben ik een week thuis geweest.", "శుక్రవారం నాటికి నేను ఒక వారం ఇంట్లో ఉండి వచ్చాను.", "VTT"), cue: { display: "vrijdag", shortMeaning: "completed period by a deadline", kind: "deadline", tokens: ["Vrijdag"] }, howDutchExpressesIt: "Meaning-preserving: VTTT geweest zijn. Everyday: VTT geweest + the deadline.", whyTheyDiffer: "VTTT is explicit and formal; everyday Dutch often uses VTT with the deadline as context." },
  "future-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Vrijdag zal ik al een week moe zijn.", "శుక్రవారం నాటికి నేను ఇప్పటికే ఒక వారం అలసిపోయి ఉంటాను.", "OTTT"), everyday: localizedEnglishComparison("Vrijdag ben ik al een week moe.", "శుక్రవారం నాటికి నేను ఇప్పటికే ఒక వారం అలసిపోయి ఉన్నాను.", "OTT"), cue: { display: "vrijdag + al een week", shortMeaning: "continuing state at a future point", kind: "compound", tokens: ["Vrijdag", "al een week"] }, howDutchExpressesIt: "Meaning-preserving: OTTT zal zijn + duration. Everyday: OTT ben + duration.", whyTheyDiffer: "Dutch normally keeps the state in OTT and uses a duration rather than a separate future-perfect-continuous form." },
});

const zijnPack: VerbJourneyPack = {
  schemaVersion: VERB_JOURNEY_SCHEMA_VERSION,
  contentVersion: ENGLISH_COMPARISON_CONTENT_VERSION,
  verb: { id: "verb.zijn", lemma: "zijn", english: "to be", level: "A1", tags: ["irregular", "copular"], auxiliary: "zijn" },
  dutchForms: [
    { id: "form.zijn.ott", dutchTense: "OTT", viewpoint: "present", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige tijd", sentence: "Ik ben thuis.", naturalEnglish: "I am at home.", usageMeaning: "identity, state, location, or description now", formula: "ik ben / jij bent / hij is / wij zijn", commonUsage: "Ik ben thuis. / Wij zijn klaar.", learnerLabelEn: "Present state or location", canonicalExample: { nl: "Ik ben thuis.", en: "I am at home.", te: "నేను ఇంట్లో ఉన్నాను." }, commonUsageExample: { nl: "Vandaag ben ik thuis.", en: "I am at home today.", te: "ఈ రోజు నేను ఇంట్లో ఉన్నాను." }, cefrLevel: "A1", teachingPriority: "core", status: "learning" },
    { id: "form.zijn.vtt", dutchTense: "VTT", viewpoint: "present", completion: "voltooid", fullNameNl: "voltooid tegenwoordige tijd", sentence: "Ik ben thuis geweest.", naturalEnglish: "I have been at home.", usageMeaning: "a completed experience or state viewed from now", formula: "ik ben + … + geweest", commonUsage: "Ik ben daar al geweest.", learnerLabelEn: "Completed experience from now", canonicalExample: { nl: "Ik ben thuis geweest.", en: "I have been at home.", te: "నేను ఇంట్లో ఉండి వచ్చాను." }, commonUsageExample: { nl: "Ik ben daar al geweest.", en: "I have already been there.", te: "నేను ఇప్పటికే అక్కడికి వెళ్లి వచ్చాను." }, cefrLevel: "A2", teachingPriority: "core", status: "next" },
    { id: "form.zijn.ovt", dutchTense: "OVT", viewpoint: "past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden tijd", sentence: "Ik was thuis.", naturalEnglish: "I was at home.", usageMeaning: "a past state, identity, or location", formula: "ik was / wij waren", commonUsage: "Ik was gisteren thuis.", learnerLabelEn: "Past state or location", canonicalExample: { nl: "Ik was thuis.", en: "I was at home.", te: "నేను ఇంట్లో ఉన్నాను." }, commonUsageExample: { nl: "Ik was gisteren thuis.", en: "I was at home yesterday.", te: "నేను నిన్న ఇంట్లో ఉన్నాను." }, cefrLevel: "A1", teachingPriority: "core", status: "later" },
    { id: "form.zijn.vvt", dutchTense: "VVT", viewpoint: "past", completion: "voltooid", fullNameNl: "voltooid verleden tijd", sentence: "Ik was thuis geweest.", naturalEnglish: "I had been at home.", usageMeaning: "a completed state before another past reference point", formula: "ik was + … + geweest", commonUsage: "Ik was al thuis geweest voordat zij belde.", learnerLabelEn: "Earlier completed state", canonicalExample: { nl: "Ik was thuis geweest.", en: "I had been at home.", te: "నేను ఇంట్లో ఉండి వచ్చాను." }, commonUsageExample: { nl: "Ik was al thuis geweest voordat zij belde.", en: "I had already been at home before she called.", te: "ఆమె ఫోన్ చేయడానికి ముందు నేను ఇంట్లో ఉండి వచ్చాను." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.ottt", dutchTense: "OTTT", viewpoint: "future", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis zijn.", naturalEnglish: "I will be at home.", usageMeaning: "an explicit future state, promise, or prediction", formula: "ik zal + … + zijn", commonUsage: "Morgen zal ik thuis zijn.", learnerLabelEn: "Explicit future state", canonicalExample: { nl: "Ik zal thuis zijn.", en: "I will be at home.", te: "నేను ఇంట్లో ఉంటాను." }, commonUsageExample: { nl: "Morgen zal ik thuis zijn.", en: "Tomorrow I will be at home.", te: "రేపు నేను ఇంట్లో ఉంటాను." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.vttt", dutchTense: "VTTT", viewpoint: "future", completion: "voltooid", fullNameNl: "voltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis geweest zijn.", naturalEnglish: "I will have been at home.", usageMeaning: "a completed state before a future reference point", formula: "ik zal + … + geweest zijn", commonUsage: "Voor de lunch zal ik thuis geweest zijn.", learnerLabelEn: "Completed before a future point", canonicalExample: { nl: "Ik zal thuis geweest zijn.", en: "I will have been at home.", te: "నేను ఇంట్లో ఉండి ఉంటాను." }, commonUsageExample: { nl: "Voor de lunch zal ik thuis geweest zijn.", en: "By lunch, I will have been at home.", te: "మధ్యాహ్న భోజనానికి ముందు నేను ఇంట్లో ఉండి ఉంటాను." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
    { id: "form.zijn.ovtt", dutchTense: "OVTT", viewpoint: "future-from-past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden toekomende tijd", sentence: "Ik zou thuis zijn.", naturalEnglish: "I would be at home.", usageMeaning: "a conditional or hypothetical future state", formula: "ik zou + … + zijn", commonUsage: "Als ik vrij was, zou ik thuis zijn.", learnerLabelEn: "Conditional future state", canonicalExample: { nl: "Ik zou thuis zijn.", en: "I would be at home.", te: "నేను ఇంట్లో ఉండేవాడిని." }, commonUsageExample: { nl: "Als ik vrij was, zou ik thuis zijn.", en: "If I were free, I would be at home.", te: "నేను ఖాళీగా ఉంటే, ఇంట్లో ఉండేవాడిని." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.vvtt", dutchTense: "VVTT", viewpoint: "future-from-past", completion: "voltooid", fullNameNl: "voltooid verleden toekomende tijd", sentence: "Ik zou thuis geweest zijn.", naturalEnglish: "I would have been at home.", usageMeaning: "an unreal or hypothetical completed state", formula: "ik zou + … + geweest zijn", commonUsage: "Als ik kon, zou ik thuis geweest zijn.", learnerLabelEn: "Unreal completed state", canonicalExample: { nl: "Ik zou thuis geweest zijn.", en: "I would have been at home.", te: "నేను ఇంట్లో ఉండి ఉండేవాడిని." }, commonUsageExample: { nl: "Als ik kon, zou ik thuis geweest zijn.", en: "If I could, I would have been at home.", te: "నేను వెళ్లగలిగితే, ఇంట్లో ఉండి ఉండేవాడిని." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
  ],
  englishComparison: zijnEnglishComparison,
  journeys: [{
    id: "journey.zijn.ott-identity", verbId: "verb.zijn", title: "Who I am today", subtitle: "OTT · identity, state, and description", level: "A1", kind: "core", status: "next", targetForms: ["OTT"], targetSkills: ["skill.zijn.ott-identity"], learningGoal: "Use ben, bent, is, and zijn for a present identity, state, or description.", estimatedMinutes: 3, storyTitle: "Een rustige dag",
    story: [
      { id: "story.zijn.ott.1", nl: "Ik ben vandaag rustig.", english: "I am calm today.", telugu: "ఈ రోజు నేను ప్రశాంతంగా ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-identity"] }] },
      { id: "story.zijn.ott.2", nl: "Ik ben thuis en ik ben klaar.", english: "I am at home and I am ready.", telugu: "నేను ఇంట్లో ఉన్నాను మరియు సిద్ధంగా ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-identity"] }] },
      { id: "story.zijn.ott.3", nl: "Ik ben blij met mijn nieuwe kamer.", english: "I am happy with my new room.", telugu: "నా కొత్త గది నాకు సంతోషంగా ఉంది.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-identity"] }] },
      { id: "story.zijn.ott.4", nl: "Vandaag ben ik hier.", english: "Today I am here.", telugu: "ఈ రోజు నేను ఇక్కడ ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-identity"] }] },
      { id: "story.zijn.ott.5", nl: "Ik ben niet alleen; mijn vrienden zijn hier.", english: "I am not alone; my friends are here.", telugu: "నేను ఒంటరిగా లేను; నా స్నేహితులు ఇక్కడ ఉన్నారు.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-identity"] }, { text: "zijn", skillIds: ["skill.zijn.ott-identity"] }] },
    ],
    notice: { id: "notice.zijn.ott-identity", title: "The present forms of zijn", subtitle: "The subject decides which present form belongs in the sentence.", comparison: [
      { label: "ik", tense: "OTT", sentence: "Ik ben vandaag rustig.", meaning: "ben follows ik" },
      { label: "jij", tense: "OTT", sentence: "Jij bent vandaag rustig.", meaning: "bent follows jij" },
      { label: "hij / het", tense: "OTT", sentence: "Hij is vandaag rustig.", meaning: "is follows hij or het" },
      { label: "wij", tense: "OTT", sentence: "Wij zijn vandaag rustig.", meaning: "zijn follows wij" },
    ], formula: "ik ben · jij bent · hij/het is · wij zijn", formulaNote: "Learn this as a bounded present-tense contrast. This journey does not claim full unconstrained production.", valuableContrast: "Ben, bent, is, and zijn are all present forms of zijn. Choose the form from the subject: ik ben, jij bent, hij is, wij zijn." },
  }, {
    id: "journey.zijn.ott-questions", verbId: "verb.zijn", title: "Questions I ask", subtitle: "OTT · questions and inversion", level: "A1", kind: "core", status: "later", targetForms: ["OTT"], targetSkills: ["skill.zijn.ott-questions"], learningGoal: "Recognise ben je?, is het?, and zijn we? in present-tense questions.", estimatedMinutes: 3, storyTitle: "Een vraag voor vandaag",
    story: [
      { id: "story.zijn.questions.1", nl: "Ben je vandaag thuis?", english: "Are you at home today?", telugu: "ఈ రోజు నువ్వు ఇంట్లో ఉన్నావా?", targets: [{ text: "Ben je", skillIds: ["skill.zijn.ott-questions"] }] },
      { id: "story.zijn.questions.2", nl: "Is het hier rustig?", english: "Is it quiet here?", telugu: "ఇక్కడ ప్రశాంతంగా ఉందా?", targets: [{ text: "Is het", skillIds: ["skill.zijn.ott-questions"] }] },
      { id: "story.zijn.questions.3", nl: "Zijn we op tijd?", english: "Are we on time?", telugu: "మనం సమయానికి ఉన్నామా?", targets: [{ text: "Zijn we", skillIds: ["skill.zijn.ott-questions"] }] },
      { id: "story.zijn.questions.4", nl: "Ik vraag of ik klaar ben.", english: "I ask whether I am ready.", telugu: "నేను సిద్ధంగా ఉన్నానా అని అడుగుతున్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.ott-questions"] }] },
      { id: "story.zijn.questions.5", nl: "Ik wil weten of mijn vrienden hier zijn.", english: "I want to know whether my friends are here.", telugu: "నా స్నేహితులు ఇక్కడ ఉన్నారా అని నేను తెలుసుకోవాలనుకుంటున్నాను.", targets: [{ text: "zijn", skillIds: ["skill.zijn.ott-questions"] }] },
    ],
    notice: { id: "notice.zijn.ott-questions", title: "Questions turn the order around", subtitle: "In a direct yes/no question, the finite form comes before the subject.", comparison: [
      { label: "question", tense: "OTT", sentence: "Ben je vandaag thuis?", meaning: "ben comes before je in the question" },
      { label: "past contrast", tense: "OVT", sentence: "Was je gisteren thuis?", meaning: "was places the state in the past" },
      { label: "experience contrast", tense: "VTT", sentence: "Ben je al thuis geweest?", meaning: "ben geweest describes a completed experience" },
    ], formula: "Ben je? · Is het? · Zijn we?", formulaNote: "The finite form moves before the subject in a direct question: Ben je thuis? The embedded question Ik vraag of ik klaar ben keeps ordinary clause order.", valuableContrast: "Ben je vandaag thuis? is a present direct question. Was je gisteren thuis? changes the time to the past, while ben je al thuis geweest? asks about a completed experience." },
  }, {
    id: "journey.zijn.ovt-state", verbId: "verb.zijn", title: "Where I was", subtitle: "OVT · past states and locations", level: "A2", kind: "core", status: "later", targetForms: ["OVT"], targetSkills: ["skill.zijn.ovt-state"], learningGoal: "Use was and waren for a past state, identity, or location.", estimatedMinutes: 3, storyTitle: "Gisteren in de stad",
    story: [
      { id: "story.zijn.ovt.1", nl: "Ik was gisteren rustig.", english: "I was calm yesterday.", telugu: "నిన్న నేను ప్రశాంతంగా ఉన్నాను.", targets: [{ text: "was", skillIds: ["skill.zijn.ovt-state"] }] },
      { id: "story.zijn.ovt.2", nl: "Ik was de hele ochtend thuis.", english: "I was at home all morning.", telugu: "ఉదయం మొత్తం నేను ఇంట్లో ఉన్నాను.", targets: [{ text: "was", skillIds: ["skill.zijn.ovt-state"] }] },
      { id: "story.zijn.ovt.3", nl: "Na de lunch was ik in de stad.", english: "After lunch I was in the city.", telugu: "భోజనం తర్వాత నేను నగరంలో ఉన్నాను.", targets: [{ text: "was", skillIds: ["skill.zijn.ovt-state"] }] },
      { id: "story.zijn.ovt.4", nl: "Mijn vrienden waren ook in de stad.", english: "My friends were also in the city.", telugu: "నా స్నేహితులు కూడా నగరంలో ఉన్నారు.", targets: [{ text: "waren", skillIds: ["skill.zijn.ovt-state"] }] },
      { id: "story.zijn.ovt.5", nl: "Aan het einde waren we moe maar blij.", english: "At the end we were tired but happy.", telugu: "చివరికి మేము అలసిపోయినా సంతోషంగా ఉన్నాము.", targets: [{ text: "waren", skillIds: ["skill.zijn.ovt-state"] }] },
    ],
    notice: { id: "notice.zijn.ovt-state", title: "Was and waren look back", subtitle: "The past forms describe a state or location from a past viewpoint.", comparison: [
      { label: "singular", tense: "OVT", sentence: "Ik was gisteren thuis.", meaning: "was follows ik" },
      { label: "plural", tense: "OVT", sentence: "Wij waren gisteren thuis.", meaning: "waren follows wij" },
      { label: "present contrast", tense: "OTT", sentence: "Ik ben vandaag thuis.", meaning: "ben keeps the state in the present" },
    ], formula: "ik was · jij was · hij was · wij waren", formulaNote: "Was is used with singular subjects in this bounded contrast; waren is used with wij and other plural subjects.", valuableContrast: "Ik was gisteren thuis looks back to yesterday. Ik ben vandaag thuis stays in the present, while wij waren uses the plural past form." },
  }, {
    id: "journey.zijn.vtt-experience", verbId: "verb.zijn", title: "Places I have been", subtitle: "VTT · past experience and being somewhere", level: "A2", kind: "core", status: "later", targetForms: ["VTT"], targetSkills: ["skill.zijn.vtt-experience"], learningGoal: "Use ben geweest and is geweest to talk about a completed experience or being somewhere.", estimatedMinutes: 3, storyTitle: "Een bezoek aan het museum",
    story: [
      { id: "story.zijn.vtt.1", nl: "Ik ben al eens in dit museum geweest.", english: "I have been in this museum once before.", telugu: "నేను ఇంతకుముందు ఈ మ్యూజియంలో ఒకసారి ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.vtt-experience"] }, { text: "geweest", skillIds: ["skill.zijn.vtt-experience"] }] },
      { id: "story.zijn.vtt.2", nl: "Ik ben hier met mijn broer geweest.", english: "I have been here with my brother.", telugu: "నేను నా సోదరుడితో ఇక్కడ ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.vtt-experience"] }, { text: "geweest", skillIds: ["skill.zijn.vtt-experience"] }] },
      { id: "story.zijn.vtt.3", nl: "Ik ben vorige maand in Utrecht geweest.", english: "I was in Utrecht last month.", telugu: "నేను గత నెలలో ఉట్రెక్ట్‌లో ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.vtt-experience"] }, { text: "geweest", skillIds: ["skill.zijn.vtt-experience"] }] },
      { id: "story.zijn.vtt.4", nl: "Ik ben daar al twee keer geweest.", english: "I have been there twice already.", telugu: "నేను ఇప్పటికే అక్కడ రెండుసార్లు ఉన్నాను.", targets: [{ text: "ben", skillIds: ["skill.zijn.vtt-experience"] }, { text: "geweest", skillIds: ["skill.zijn.vtt-experience"] }] },
      { id: "story.zijn.vtt.5", nl: "Mijn broer is er nog nooit geweest.", english: "My brother has never been there.", telugu: "నా సోదరుడు ఎప్పుడూ అక్కడ ఉండలేదు.", targets: [{ text: "is", skillIds: ["skill.zijn.vtt-experience"] }, { text: "geweest", skillIds: ["skill.zijn.vtt-experience"] }] },
    ],
    notice: { id: "notice.zijn.vtt-experience", title: "Being somewhere as a completed experience", subtitle: "Ben geweest and is geweest connect a past experience to the present viewpoint.", comparison: [
      { label: "experience", tense: "VTT", sentence: "Ik ben al eens in dit museum geweest.", meaning: "a completed experience" },
      { label: "past state", tense: "OVT", sentence: "Ik was gisteren in het museum.", meaning: "a past state or location" },
      { label: "present state", tense: "OTT", sentence: "Ik ben nu in het museum.", meaning: "a current location" },
    ], formula: "ik ben geweest · hij is geweest", formulaNote: "With zijn, VTT uses the present auxiliary ben or is plus geweest. This journey keeps the focus on being or having been, not on auxiliary constructions for another verb.", valuableContrast: "Ik ben in het museum geweest reports an experience. Ik was gisteren in het museum describes a past situation, while Ik ben nu in het museum describes the current location." },
  }, {
    id: "journey.zijn.future-conditional", verbId: "verb.zijn", title: "Where I will be", subtitle: "OTTT + OVTT · future and conditional", level: "A2", kind: "later", status: "later", targetForms: ["OTTT", "OVTT"], targetSkills: ["skill.zijn.future-conditional"], learningGoal: "Distinguish an explicit future state from a conditional possibility.", estimatedMinutes: 3, storyTitle: "Een plan voor morgen",
    story: [
      { id: "story.zijn.future.1", nl: "Morgen zal ik thuis zijn.", english: "Tomorrow I will be at home.", telugu: "రేపు నేను ఇంట్లో ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.zijn.future-conditional"] }, { text: "zijn", skillIds: ["skill.zijn.future-conditional"] }] },
      { id: "story.zijn.future.2", nl: "Als het regent, zou ik thuis zijn.", english: "If it rains, I would be at home.", telugu: "వర్షం పడితే, నేను ఇంట్లో ఉంటాను.", targets: [{ text: "zou", skillIds: ["skill.zijn.future-conditional"] }, { text: "zijn", skillIds: ["skill.zijn.future-conditional"] }] },
      { id: "story.zijn.future.3", nl: "Na de afspraak zal ik op kantoor zijn.", english: "After the appointment I will be at the office.", telugu: "అపాయింట్‌మెంట్ తర్వాత నేను కార్యాలయంలో ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.zijn.future-conditional"] }] },
      { id: "story.zijn.future.4", nl: "Als ik meer tijd had, zou ik langer hier zijn.", english: "If I had more time, I would be here longer.", telugu: "నాకు ఎక్కువ సమయం ఉంటే, నేను ఇక్కడ ఎక్కువసేపు ఉండేవాడిని.", targets: [{ text: "zou", skillIds: ["skill.zijn.future-conditional"] }] },
      { id: "story.zijn.future.5", nl: "Volgende week zal ik in Amsterdam zijn.", english: "Next week I will be in Amsterdam.", telugu: "వచ్చే వారం నేను ఆమ్‌స్టర్‌డామ్‌లో ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.zijn.future-conditional"] }] },
    ],
    notice: { id: "notice.zijn.future-conditional", title: "Plans and possibilities", subtitle: "Zal zijn makes a future state explicit; zou zijn frames it as conditional.", comparison: [
      { label: "future", tense: "OTTT", sentence: "Morgen zal ik thuis zijn.", meaning: "an explicit future plan" },
      { label: "conditional", tense: "OVTT", sentence: "Als het regent, zou ik thuis zijn.", meaning: "a conditional possibility" },
      { label: "everyday future", tense: "OTT", sentence: "Morgen ben ik thuis.", meaning: "ordinary Dutch with a future time word" },
    ], formula: "ik zal zijn · ik zou zijn", formulaNote: "Zal points forward explicitly. Zou presents the state as conditional or hypothetical; everyday Dutch can use OTT with a clear future time word.", valuableContrast: "Morgen zal ik thuis zijn states a future plan. Als het regent, zou ik thuis zijn depends on a condition, while Morgen ben ik thuis is a common everyday future." },
  }, {
    id: "journey.zijn.reference-completed", verbId: "verb.zijn", title: "Completed reference points", subtitle: "VVT + VTTT + VVTT · advanced completion", level: "reference", kind: "reference", status: "reference", targetForms: ["VVT", "VTTT", "VVTT"], targetSkills: ["skill.zijn.reference-completed"], learningGoal: "Recognise completed being states viewed from a past, future, or hypothetical reference point.", estimatedMinutes: 3, storyTitle: "Voor en na een afspraak",
    story: [
      { id: "story.zijn.reference.1", nl: "Voordat de trein kwam, was ik al op het station geweest.", english: "Before the train came, I had already been at the station.", telugu: "రైలు రాకముందు నేను ఇప్పటికే స్టేషన్‌లో ఉన్నాను.", targets: [{ text: "was", skillIds: ["skill.zijn.reference-completed"] }, { text: "geweest", skillIds: ["skill.zijn.reference-completed"] }] },
      { id: "story.zijn.reference.2", nl: "Voor het einde van de dag zal ik thuis geweest zijn.", english: "By the end of the day, I will have been at home.", telugu: "రోజు ముగిసేలోపు నేను ఇంట్లో ఉండి ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.zijn.reference-completed"] }, { text: "geweest zijn", skillIds: ["skill.zijn.reference-completed"] }] },
      { id: "story.zijn.reference.3", nl: "Als ik eerder vertrok, zou ik op tijd geweest zijn.", english: "If I left earlier, I would have been on time.", telugu: "నేను ముందుగా బయలుదేరితే, సమయానికి ఉండేవాడిని.", targets: [{ text: "zou", skillIds: ["skill.zijn.reference-completed"] }, { text: "geweest zijn", skillIds: ["skill.zijn.reference-completed"] }] },
      { id: "story.zijn.reference.4", nl: "Ik was al in de zaal geweest voordat de film begon.", english: "I had already been in the hall before the film started.", telugu: "సినిమా ప్రారంభమయ్యే ముందు నేను ఇప్పటికే హాల్‌లో ఉన్నాను.", targets: [{ text: "was", skillIds: ["skill.zijn.reference-completed"] }, { text: "geweest", skillIds: ["skill.zijn.reference-completed"] }] },
      { id: "story.zijn.reference.5", nl: "Tegen de avond zal ik al twee uur op kantoor geweest zijn.", english: "By evening, I will have been at the office for two hours.", telugu: "సాయంత్రానికి నేను కార్యాలయంలో రెండు గంటలు ఉండి ఉంటాను.", targets: [{ text: "zal", skillIds: ["skill.zijn.reference-completed"] }, { text: "geweest zijn", skillIds: ["skill.zijn.reference-completed"] }] },
    ],
    notice: { id: "notice.zijn.reference-completed", title: "Completion from another viewpoint", subtitle: "The same state can be completed before a past, future, or hypothetical reference point.", comparison: [
      { label: "earlier past", tense: "VVT", sentence: "Ik was al op het station geweest voordat de trein kwam.", meaning: "completed before a past event" },
      { label: "future reference", tense: "VTTT", sentence: "Voor het einde van de dag zal ik thuis geweest zijn.", meaning: "completed before a future point" },
      { label: "hypothetical result", tense: "VVTT", sentence: "Ik zou op tijd geweest zijn als ik eerder vertrok.", meaning: "an unreal completed result" },
    ], formula: "was geweest · zal geweest zijn · zou geweest zijn", formulaNote: "These are reference forms for reading and careful comparison. They keep zijn as the main/copular verb and do not introduce zijn as an auxiliary for another lexical verb.", valuableContrast: "Was geweest looks back from a past point. Zal geweest zijn looks forward to completion, while zou geweest zijn describes a hypothetical completed state." },
  }],
};

const hebbenEnglishComparisonBase: EnglishMapRecord[] = [
  { id: "english.hebben.present-simple", englishTense: "present-simple", group: "present", english: "I have enough time today.", situation: "A present possession or available resource.", meaningPreservingDutch: "Ik heb vandaag genoeg tijd.", commonEverydayDutch: "Ik heb vandaag genoeg tijd.", dutchAnalysis: { primaryForm: "OTT" }, mismatchNote: "Dutch uses the present form heb for possession and availability.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.hebben.present-continuous", englishTense: "present-continuous", group: "present", english: "I am having a difficult day.", situation: "A current state described with an English continuous form.", meaningPreservingDutch: "Ik heb vandaag een moeilijke dag.", commonEverydayDutch: "Ik heb vandaag een moeilijke dag.", dutchAnalysis: { primaryForm: "OTT", construction: "OTT + vandaag" }, mismatchNote: "Dutch normally uses OTT for a current state; it does not need a separate continuous tense here.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.hebben.present-perfect", englishTense: "present-perfect", group: "present", english: "I have had enough time this week.", situation: "A completed or accumulated experience connected to the current period.", meaningPreservingDutch: "Ik heb deze week genoeg tijd gehad.", commonEverydayDutch: "Ik heb deze week genoeg tijd gehad.", dutchAnalysis: { primaryForm: "VTT" }, mismatchNote: "The lexical verb hebben uses gehad as its participle in this completed experience.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.hebben.present-perfect-continuous", englishTense: "present-perfect-continuous", group: "present", english: "I have been having trouble for days.", situation: "A current problem continuing from an earlier point.", meaningPreservingDutch: "Ik heb al dagen problemen.", commonEverydayDutch: "Ik heb al dagen problemen.", dutchAnalysis: { primaryForm: "OTT", construction: "OTT + al + duration" }, mismatchNote: "Dutch commonly expresses the continuing state with OTT and a duration phrase rather than a separate continuous perfect.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.hebben.past-simple", englishTense: "past-simple", group: "past", english: "I had time yesterday.", situation: "A past possession or available resource.", meaningPreservingDutch: "Ik had gisteren tijd.", commonEverydayDutch: "Ik had gisteren tijd.", dutchAnalysis: { primaryForm: "OVT" }, mismatchNote: "Had is the past singular form of hebben for a past state or possession.", cefrLevel: "A1", teachingPriority: "core" },
  { id: "english.hebben.past-continuous", englishTense: "past-continuous", group: "past", english: "I was having a difficult day when you called.", situation: "A past state in progress when another event happened.", meaningPreservingDutch: "Ik had een moeilijke dag toen je belde.", commonEverydayDutch: "Ik had een moeilijke dag toen je belde.", dutchAnalysis: { primaryForm: "OVT", construction: "OVT + toen" }, mismatchNote: "Dutch normally uses OVT and context to express this ongoing past state.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.hebben.past-perfect", englishTense: "past-perfect", group: "past", english: "I had already had enough time before the meeting.", situation: "A completed possession before another past reference point.", meaningPreservingDutch: "Ik had al genoeg tijd gehad voordat de vergadering begon.", commonEverydayDutch: "Ik had al genoeg tijd gehad voordat de vergadering begon.", dutchAnalysis: { primaryForm: "VVT" }, mismatchNote: "VVT repeats had as auxiliary plus gehad as participle to place the completed state earlier in the past.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.hebben.past-perfect-continuous", englishTense: "past-perfect-continuous", group: "past", english: "I had been having trouble for days.", situation: "A continuing past problem measured up to a past point.", meaningPreservingDutch: "Ik had al dagen problemen.", commonEverydayDutch: "Ik had al dagen problemen.", dutchAnalysis: { primaryForm: "OVT", construction: "OVT + al + duration" }, mismatchNote: "Dutch normally uses had plus a duration phrase rather than a separate past-perfect-continuous tense.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.hebben.future-simple", englishTense: "future-simple", group: "future", english: "I will have time tomorrow.", situation: "A future possession or available resource.", meaningPreservingDutch: "Ik zal morgen tijd hebben.", commonEverydayDutch: "Morgen heb ik tijd.", dutchAnalysis: { primaryForm: "OTT", alternativeForms: ["OTTT"] }, mismatchNote: "Dutch often uses OTT with a future time marker; zal hebben makes the future explicit.", cefrLevel: "A2", teachingPriority: "later" },
  { id: "english.hebben.future-continuous", englishTense: "future-continuous", group: "future", english: "At eight, I will be having dinner.", situation: "A future activity expressed with an English continuous form.", meaningPreservingDutch: "Om acht uur eet ik.", commonEverydayDutch: "Om acht uur eet ik.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + ordinary activity verb" }, mismatchNote: "Dutch chooses the ordinary activity expression; having in English does not require Dutch zullen hebben.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.hebben.future-perfect", englishTense: "future-perfect", group: "future", english: "By Friday, I will have had the appointment.", situation: "A completed possession or experience before a future deadline.", meaningPreservingDutch: "Tegen vrijdag zal ik de afspraak gehad hebben.", commonEverydayDutch: "Tegen vrijdag heb ik de afspraak gehad.", dutchAnalysis: { primaryForm: "VTT", alternativeForms: ["VTTT"] }, mismatchNote: "VTTT makes the future reference explicit, while everyday Dutch may use VTT with the deadline phrase.", cefrLevel: "reference", teachingPriority: "reference" },
  { id: "english.hebben.future-perfect-continuous", englishTense: "future-perfect-continuous", group: "future", english: "By next month, I will have had this job for a year.", situation: "A possession or situation continuing up to a future point.", meaningPreservingDutch: "Volgende maand heb ik deze baan een jaar.", commonEverydayDutch: "Volgende maand heb ik deze baan een jaar.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + OTT + duration" }, mismatchNote: "Dutch uses a future time phrase and duration with OTT rather than a separate future-perfect-continuous form.", cefrLevel: "reference", teachingPriority: "reference" },
];

const hebbenEnglishComparison: EnglishMapRecord[] = withLocalizedEnglishComparisonContent(hebbenEnglishComparisonBase, {
  "present-simple": { meaningPreserving: localizedEnglishComparison("Ik heb vandaag genoeg tijd.", "నాకు ఈ రోజు తగినంత సమయం ఉంది.", "OTT"), everyday: localizedEnglishComparison("Ik heb vandaag genoeg tijd.", "నాకు ఈ రోజు తగినంత సమయం ఉంది.", "OTT"), cue: { display: "vandaag", shortMeaning: "current availability", kind: "current-period", tokens: ["vandaag"] }, howDutchExpressesIt: "Both roles use OTT heb + a current-day cue.", whyTheyDiffer: "Dutch uses the present form heb for possession and availability." },
  "present-continuous": { meaningPreserving: localizedEnglishComparison("Ik heb vandaag een moeilijke dag.", "నాకు ఈ రోజు కష్టమైన రోజు.", "OTT"), everyday: localizedEnglishComparison("Ik heb vandaag een moeilijke dag.", "నాకు ఈ రోజు కష్టమైన రోజు.", "OTT"), cue: { display: "vandaag", shortMeaning: "current state", kind: "current-period", tokens: ["vandaag"] }, howDutchExpressesIt: "Both roles use OTT heb; vandaag supplies the current-period meaning.", whyTheyDiffer: "Dutch normally uses OTT for a current state; it does not need a separate continuous tense here." },
  "present-perfect": { meaningPreserving: localizedEnglishComparison("Ik heb deze week genoeg tijd gehad.", "ఈ వారం నాకు తగినంత సమయం ఉంది.", "VTT"), everyday: localizedEnglishComparison("Ik heb deze week genoeg tijd gehad.", "ఈ వారం నాకు తగినంత సమయం ఉంది.", "VTT"), cue: { display: "deze week", shortMeaning: "completed current-period experience", kind: "current-period", tokens: ["deze week"] }, howDutchExpressesIt: "Both roles use VTT heb gehad + the current-period cue.", whyTheyDiffer: "The lexical verb hebben uses gehad as its participle in this completed experience." },
  "present-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Ik heb al dagen problemen.", "నాకు ఇప్పటికే రోజులుగా సమస్యలు ఉన్నాయి.", "OTT"), everyday: localizedEnglishComparison("Ik heb al dagen problemen.", "నాకు ఇప్పటికే రోజులుగా సమస్యలు ఉన్నాయి.", "OTT"), cue: { display: "al dagen", shortMeaning: "problem continuing now", kind: "duration", tokens: ["al dagen"] }, howDutchExpressesIt: "Both roles use OTT heb + al + duration.", whyTheyDiffer: "Dutch commonly expresses the continuing state with OTT and a duration phrase rather than a separate continuous perfect." },
  "past-simple": { meaningPreserving: localizedEnglishComparison("Ik had gisteren tijd.", "నాకు నిన్న సమయం ఉంది.", "OVT"), everyday: localizedEnglishComparison("Ik had gisteren tijd.", "నాకు నిన్న సమయం ఉంది.", "OVT"), cue: { display: "gisteren", shortMeaning: "past availability", kind: "past-time", tokens: ["gisteren"] }, howDutchExpressesIt: "Both roles use OVT had + a past-time cue.", whyTheyDiffer: "Had is the past singular form of hebben for a past state or possession." },
  "past-continuous": { meaningPreserving: localizedEnglishComparison("Ik had een moeilijke dag toen je belde.", "నువ్వు ఫోన్ చేసినప్పుడు నాకు కష్టమైన రోజు.", "OVT"), everyday: localizedEnglishComparison("Ik had een moeilijke dag.", "నాకు కష్టమైన రోజు.", "OVT"), cue: { display: "toen je belde", shortMeaning: "past state around another event", kind: "past-reference", tokens: ["toen je belde"] }, howDutchExpressesIt: "Meaning-preserving: OVT had + the past reference. Everyday: OVT had when the surrounding context is already clear.", whyTheyDiffer: "Dutch normally uses OVT and context to express this ongoing past state." },
  "past-perfect": { meaningPreserving: localizedEnglishComparison("Ik had al genoeg tijd gehad voordat de vergadering begon.", "సమావేశం ప్రారంభమయ్యే ముందు నాకు ఇప్పటికే తగినంత సమయం ఉంది.", "VVT"), everyday: localizedEnglishComparison("Ik had al genoeg tijd gehad voordat de vergadering begon.", "సమావేశం ప్రారంభమయ్యే ముందు నాకు ఇప్పటికే తగినంత సమయం ఉంది.", "VVT"), cue: { display: "al … voordat", shortMeaning: "completed before past reference", kind: "compound", tokens: ["al", "voordat"] }, howDutchExpressesIt: "Both roles use VVT had gehad + al + voordat.", whyTheyDiffer: "VVT repeats had as auxiliary plus gehad as participle to place the completed state earlier in the past." },
  "past-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Ik had al dagen problemen.", "నాకు ఇప్పటికే రోజులుగా సమస్యలు ఉన్నాయి.", "OVT"), everyday: localizedEnglishComparison("Ik had al dagen problemen.", "నాకు ఇప్పటికే రోజులుగా సమస్యలు ఉన్నాయి.", "OVT"), cue: { display: "al dagen", shortMeaning: "past problem duration", kind: "duration", tokens: ["al dagen"] }, howDutchExpressesIt: "Both roles use OVT had + al + duration.", whyTheyDiffer: "Dutch normally uses had plus a duration phrase rather than a separate past-perfect-continuous tense." },
  "future-simple": { meaningPreserving: localizedEnglishComparison("Ik zal morgen tijd hebben.", "నాకు రేపు సమయం ఉంటుంది.", "OTTT"), everyday: localizedEnglishComparison("Morgen heb ik tijd.", "రేపు నాకు సమయం ఉంది.", "OTT"), cue: { display: "morgen", shortMeaning: "future availability", kind: "future-time", tokens: ["morgen"] }, howDutchExpressesIt: "Meaning-preserving: OTTT zal hebben. Everyday: OTT heb + the future-time cue.", whyTheyDiffer: "Dutch often uses OTT with a future time marker; zal hebben makes the future explicit." },
  "future-continuous": { meaningPreserving: localizedEnglishComparison("Om acht uur ben ik aan het eten.", "ఎనిమిది గంటలకు నేను భోజనం చేస్తూ ఉంటాను.", "OTT"), everyday: localizedEnglishComparison("Om acht uur eet ik.", "ఎనిమిది గంటలకు నేను భోజనం చేస్తాను.", "OTT"), cue: { display: "om acht uur", shortMeaning: "activity at a future time", kind: "future-time", tokens: ["Om acht uur"] }, howDutchExpressesIt: "Meaning-preserving: OTT aan het eten. Everyday: ordinary activity verb eet + the future-time cue.", whyTheyDiffer: "The English idiom having dinner maps to an activity verb in Dutch; Dutch does not require zullen hebben." },
  "future-perfect": { meaningPreserving: localizedEnglishComparison("Tegen vrijdag zal ik de afspraak gehad hebben.", "శుక్రవారం నాటికి నాకు ఆ అపాయింట్‌మెంట్ అయి ఉంటుంది.", "VTTT"), everyday: localizedEnglishComparison("Tegen vrijdag heb ik de afspraak gehad.", "శుక్రవారం నాటికి నాకు ఆ అపాయింట్‌మెంట్ అయి ఉంటుంది.", "VTT"), cue: { display: "tegen vrijdag", shortMeaning: "completed by a deadline", kind: "deadline", tokens: ["Tegen vrijdag"] }, howDutchExpressesIt: "Meaning-preserving: VTTT gehad hebben. Everyday: VTT gehad + the deadline.", whyTheyDiffer: "VTTT makes the future reference explicit, while everyday Dutch may use VTT with the deadline phrase." },
  "future-perfect-continuous": { meaningPreserving: localizedEnglishComparison("Volgende maand zal ik deze baan een jaar hebben.", "వచ్చే నెలకు నాకు ఈ ఉద్యోగం ఒక సంవత్సరం ఉంటుంది.", "OTTT"), everyday: localizedEnglishComparison("Volgende maand heb ik deze baan een jaar.", "వచ్చే నెలకు నాకు ఈ ఉద్యోగం ఒక సంవత్సరం ఉంటుంది.", "OTT"), cue: { display: "volgende maand", shortMeaning: "duration at a future point", kind: "compound", tokens: ["Volgende maand"] }, howDutchExpressesIt: "Meaning-preserving: OTTT zal hebben + duration. Everyday: OTT heb + future-time cue + duration.", whyTheyDiffer: "Dutch uses a future time phrase and duration with OTT rather than a separate future-perfect-continuous form." },
});

const hebbenPack: VerbJourneyPack = {
  schemaVersion: VERB_JOURNEY_SCHEMA_VERSION,
  contentVersion: ENGLISH_COMPARISON_CONTENT_VERSION,
  verb: { id: "verb.hebben", lemma: "hebben", english: "to have", level: "A1", tags: ["irregular", "core"], auxiliary: "hebben" },
  dutchForms: [
    { id: "form.hebben.ott", dutchTense: "OTT", viewpoint: "present", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige tijd", sentence: "Ik heb vandaag genoeg tijd.", naturalEnglish: "I have enough time today.", usageMeaning: "present possession, availability, or a current state", formula: "ik + heb", commonUsage: "Ik heb tijd. / Heb jij tijd?", learnerLabelEn: "Present possession or availability", canonicalExample: { nl: "Ik heb vandaag genoeg tijd.", en: "I have enough time today.", te: "నాకు ఈ రోజు తగినంత సమయం ఉంది." }, commonUsageExample: { nl: "Heb jij tijd voor koffie?", en: "Do you have time for coffee?", te: "నీకు కాఫీకి సమయం ఉందా?" }, cefrLevel: "A1", teachingPriority: "core", status: "next" },
    { id: "form.hebben.vtt", dutchTense: "VTT", viewpoint: "present", completion: "voltooid", fullNameNl: "voltooid tegenwoordige tijd", sentence: "Ik heb vandaag genoeg tijd gehad.", naturalEnglish: "I have had enough time today.", usageMeaning: "a completed possession or experience viewed from the present", formula: "ik + heb + gehad", commonUsage: "Ik heb genoeg tijd gehad.", learnerLabelEn: "Completed possession from now", canonicalExample: { nl: "Ik heb vandaag genoeg tijd gehad.", en: "I have had enough time today.", te: "నాకు ఈ రోజు తగినంత సమయం ఉంది." }, commonUsageExample: { nl: "Ik heb genoeg tijd gehad.", en: "I have had enough time.", te: "నాకు తగినంత సమయం ఉంది." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.hebben.ovt", dutchTense: "OVT", viewpoint: "past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden tijd", sentence: "Ik had gisteren tijd.", naturalEnglish: "I had time yesterday.", usageMeaning: "past possession, availability, or background state", formula: "ik + had", commonUsage: "Ik had gisteren tijd.", learnerLabelEn: "Past possession or availability", canonicalExample: { nl: "Ik had gisteren tijd.", en: "I had time yesterday.", te: "నాకు నిన్న సమయం ఉంది." }, commonUsageExample: { nl: "Ik had gisteren tijd.", en: "I had time yesterday.", te: "నాకు నిన్న సమయం ఉంది." }, cefrLevel: "A1", teachingPriority: "core", status: "later" },
    { id: "form.hebben.vvt", dutchTense: "VVT", viewpoint: "past", completion: "voltooid", fullNameNl: "voltooid verleden tijd", sentence: "Ik had genoeg tijd gehad.", naturalEnglish: "I had had enough time.", usageMeaning: "a completed possession before another past reference point", formula: "ik + had + gehad", commonUsage: "Ik had al genoeg tijd gehad voordat de vergadering begon.", learnerLabelEn: "Earlier completed possession", canonicalExample: { nl: "Ik had genoeg tijd gehad.", en: "I had had enough time.", te: "నాకు తగినంత సమయం ఉండేది." }, commonUsageExample: { nl: "Ik had al genoeg tijd gehad voordat de vergadering begon.", en: "I had already had enough time before the meeting began.", te: "సమావేశం మొదలయ్యే ముందు నాకు ఇప్పటికే తగినంత సమయం ఉండేది." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.hebben.ottt", dutchTense: "OTTT", viewpoint: "future", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige toekomende tijd", sentence: "Ik zal morgen tijd hebben.", naturalEnglish: "I will have time tomorrow.", usageMeaning: "an explicit future possession or prediction", formula: "ik + zal + hebben", commonUsage: "Morgen heb ik tijd. / Ik zal morgen tijd hebben.", learnerLabelEn: "Explicit future possession", canonicalExample: { nl: "Ik zal morgen tijd hebben.", en: "I will have time tomorrow.", te: "నాకు రేపు సమయం ఉంటుంది." }, commonUsageExample: { nl: "Morgen heb ik tijd.", en: "I have time tomorrow.", te: "నాకు రేపు సమయం ఉంది." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.hebben.vttt", dutchTense: "VTTT", viewpoint: "future", completion: "voltooid", fullNameNl: "voltooid tegenwoordige toekomende tijd", sentence: "Ik zal de afspraak gehad hebben.", naturalEnglish: "I will have had the appointment.", usageMeaning: "a completed possession or experience before a future reference point", formula: "ik + zal + gehad hebben", commonUsage: "Tegen vrijdag heb ik de afspraak gehad.", learnerLabelEn: "Completed before a future point", canonicalExample: { nl: "Ik zal de afspraak gehad hebben.", en: "I will have had the appointment.", te: "నాకు ఆ అపాయింట్‌మెంట్ అయి ఉంటుంది." }, commonUsageExample: { nl: "Tegen vrijdag zal ik de afspraak gehad hebben.", en: "By Friday, I will have had the appointment.", te: "శుక్రవారం నాటికి నాకు ఆ అపాయింట్‌మెంట్ అయి ఉంటుంది." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
    { id: "form.hebben.ovtt", dutchTense: "OVTT", viewpoint: "future-from-past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden toekomende tijd", sentence: "Ik zou morgen tijd hebben.", naturalEnglish: "I would have time tomorrow.", usageMeaning: "a conditional or hypothetical possession", formula: "ik + zou + hebben", commonUsage: "Als ik vrij was, zou ik tijd hebben.", learnerLabelEn: "Conditional future possession", canonicalExample: { nl: "Ik zou morgen tijd hebben.", en: "I would have time tomorrow.", te: "నాకు రేపు సమయం ఉండేది." }, commonUsageExample: { nl: "Als ik vrij was, zou ik tijd hebben.", en: "If I were free, I would have time.", te: "నేను ఖాళీగా ఉంటే, నాకు సమయం ఉండేది." }, cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.hebben.vvtt", dutchTense: "VVTT", viewpoint: "future-from-past", completion: "voltooid", fullNameNl: "voltooid verleden toekomende tijd", sentence: "Ik zou genoeg tijd gehad hebben.", naturalEnglish: "I would have had enough time.", usageMeaning: "an unreal or unrealised completed possession", formula: "ik + zou + gehad hebben", commonUsage: "Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben.", learnerLabelEn: "Unreal completed possession", canonicalExample: { nl: "Ik zou genoeg tijd gehad hebben.", en: "I would have had enough time.", te: "నాకు తగినంత సమయం ఉండేది." }, commonUsageExample: { nl: "Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben.", en: "If I had started earlier, I would have had enough time.", te: "నేను ముందుగా ప్రారంభించి ఉంటే, నాకు తగినంత సమయం ఉండేది." }, cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
  ],
  englishComparison: hebbenEnglishComparison,
  journeys: [{
    id: "journey.hebben.ott-possession", verbId: "verb.hebben", title: "What I have and what is available", subtitle: "OTT · possession and availability", level: "A1", kind: "core", status: "next", targetForms: ["OTT"], targetSkills: ["skill.hebben.ott-possession"], learningGoal: "Describe present possession, availability, and relationships with the correct present form of hebben.", estimatedMinutes: 3, storyTitle: "Wat ik vandaag heb",
    story: [
      { id: "story.hebben.ott-possession.1", nl: "Ik heb vandaag genoeg tijd.", english: "I have enough time today.", telugu: "ఈ రోజు నాకు తగినంత సమయం ఉంది.", targets: [{ text: "heb", skillIds: ["skill.hebben.ott-possession"] }] },
      { id: "story.hebben.ott-possession.2", nl: "Mijn broer heeft een nieuwe fiets.", english: "My brother has a new bicycle.", telugu: "నా సోదరుడికి కొత్త సైకిల్ ఉంది.", targets: [{ text: "heeft", skillIds: ["skill.hebben.ott-possession"] }] },
      { id: "story.hebben.ott-possession.3", nl: "Heb jij een moment voor mij?", english: "Do you have a moment for me?", telugu: "నీకు నా కోసం ఒక క్షణం సమయం ఉందా?", targets: [{ text: "Heb", skillIds: ["skill.hebben.ott-possession"] }] },
      { id: "story.hebben.ott-possession.4", nl: "Wij hebben thuis een rustige plek.", english: "We have a quiet place at home.", telugu: "మాకు ఇంట్లో ఒక ప్రశాంతమైన స్థలం ఉంది.", targets: [{ text: "hebben", skillIds: ["skill.hebben.ott-possession"] }] },
      { id: "story.hebben.ott-possession.5", nl: "Ik heb alles voor de afspraak.", english: "I have everything for the appointment.", telugu: "అపాయింట్‌మెంట్ కోసం నా దగ్గర అన్నీ ఉన్నాయి.", targets: [{ text: "heb", skillIds: ["skill.hebben.ott-possession"] }] },
    ],
    notice: { id: "notice.hebben.ott-possession", title: "Who has what?", subtitle: "Notice how present hebben changes with the subject.", comparison: [
      { label: "ik", tense: "OTT", sentence: "Ik heb vandaag genoeg tijd.", meaning: "I have enough time today" },
      { label: "hij/zij", tense: "OTT", sentence: "Mijn broer heeft een nieuwe fiets.", meaning: "my brother has a new bicycle" },
      { label: "wij", tense: "OTT", sentence: "Wij hebben thuis een rustige plek.", meaning: "we have a quiet place at home" },
    ], formula: "ik heb · jij hebt · hij/zij heeft · wij hebben", formulaNote: "The present form changes with the subject. In a question, the finite verb can come first: Heb jij tijd?", valuableContrast: "Ik heb, jij hebt, hij heeft, and wij hebben all describe present possession or availability; the subject decides the form." },
  }, {
    id: "journey.hebben.ott-expressions", verbId: "verb.hebben", title: "What I feel, need, and have time for", subtitle: "OTT · common expressions and questions", level: "A1", kind: "core", status: "next", targetForms: ["OTT"], targetSkills: ["skill.hebben.ott-expressions"], learningGoal: "Use common present hebben expressions and questions for feelings, needs, and available time.", estimatedMinutes: 3, storyTitle: "Een korte pauze",
    story: [
      { id: "story.hebben.ott-expressions.1", nl: "Ik heb honger na mijn werk.", english: "I am hungry after my work.", telugu: "నా పని తర్వాత నాకు ఆకలిగా ఉంది.", targets: [{ text: "heb", skillIds: ["skill.hebben.ott-expressions"] }] },
      { id: "story.hebben.ott-expressions.2", nl: "Heb jij tijd voor een korte wandeling?", english: "Do you have time for a short walk?", telugu: "చిన్న నడకకు నీకు సమయం ఉందా?", targets: [{ text: "Heb", skillIds: ["skill.hebben.ott-expressions"] }] },
      { id: "story.hebben.ott-expressions.3", nl: "Mijn zus heeft zin in koffie.", english: "My sister feels like having coffee.", telugu: "నా సోదరికి కాఫీ తాగాలని ఉంది.", targets: [{ text: "heeft", skillIds: ["skill.hebben.ott-expressions"] }] },
      { id: "story.hebben.ott-expressions.4", nl: "Wij hebben vandaag weinig tijd.", english: "We have little time today.", telugu: "ఈ రోజు మాకు తక్కువ సమయం ఉంది.", targets: [{ text: "hebben", skillIds: ["skill.hebben.ott-expressions"] }] },
      { id: "story.hebben.ott-expressions.5", nl: "Ik heb geen last van de regen.", english: "The rain does not bother me.", telugu: "వర్షం వల్ల నాకు ఇబ్బంది లేదు.", targets: [{ text: "heb", skillIds: ["skill.hebben.ott-expressions"] }] },
    ],
    notice: { id: "notice.hebben.ott-expressions", title: "Present hebben expressions", subtitle: "Common feelings and needs use hebben in the present.", comparison: [
      { label: "statement", tense: "OTT", sentence: "Ik heb honger na mijn werk.", meaning: "a current feeling" },
      { label: "question", tense: "OTT", sentence: "Heb jij tijd voor een korte wandeling?", meaning: "a question about available time" },
      { label: "third person", tense: "OTT", sentence: "Mijn zus heeft zin in koffie.", meaning: "a current desire" },
    ], formula: "ik heb · jij hebt · hij/zij heeft · wij hebben", formulaNote: "Fixed everyday expressions still use the subject's present form. In a question, Heb or Heeft comes before the subject.", valuableContrast: "Ik heb honger and Mijn zus heeft zin in koffie describe current states; Heb jij tijd? asks whether time is available now." },
  }, {
    id: "journey.hebben.ovt-possession", verbId: "verb.hebben", title: "What I had", subtitle: "OVT · past possession and background", level: "A2", kind: "core", status: "later", targetForms: ["OVT"], targetSkills: ["skill.hebben.ovt-possession"], learningGoal: "Describe past possession, availability, and background states with had and hadden.", estimatedMinutes: 3, storyTitle: "Een eerdere dag",
    story: [
      { id: "story.hebben.ovt-possession.1", nl: "Gisteren had ik meer tijd.", english: "Yesterday I had more time.", telugu: "నిన్న నాకు ఎక్కువ సమయం ఉంది.", targets: [{ text: "had", skillIds: ["skill.hebben.ovt-possession"] }] },
      { id: "story.hebben.ovt-possession.2", nl: "Vroeger had mijn vader een kleine winkel.", english: "My father used to have a small shop.", telugu: "గతంలో నా తండ్రికి ఒక చిన్న దుకాణం ఉండేది.", targets: [{ text: "had", skillIds: ["skill.hebben.ovt-possession"] }] },
      { id: "story.hebben.ovt-possession.3", nl: "Ik had toen geen fiets.", english: "I did not have a bicycle then.", telugu: "అప్పుడు నా దగ్గర సైకిల్ లేదు.", targets: [{ text: "had", skillIds: ["skill.hebben.ovt-possession"] }] },
      { id: "story.hebben.ovt-possession.4", nl: "Had jij vroeger een hond?", english: "Did you use to have a dog?", telugu: "గతంలో నీకు కుక్క ఉండేదా?", targets: [{ text: "Had", skillIds: ["skill.hebben.ovt-possession"] }] },
      { id: "story.hebben.ovt-possession.5", nl: "We hadden thuis een grote tafel.", english: "We had a large table at home.", telugu: "మా ఇంట్లో ఒక పెద్ద బల్ల ఉండేది.", targets: [{ text: "hadden", skillIds: ["skill.hebben.ovt-possession"] }] },
    ],
    notice: { id: "notice.hebben.ovt-possession", title: "Looking back with had", subtitle: "Had and hadden place possession or a state in the past.", comparison: [
      { label: "past singular", tense: "OVT", sentence: "Gisteren had ik meer tijd.", meaning: "a past state with ik" },
      { label: "past question", tense: "OVT", sentence: "Had jij vroeger een hond?", meaning: "a past question with jij" },
      { label: "past plural", tense: "OVT", sentence: "We hadden thuis een grote tafel.", meaning: "a past state with we" },
    ], formula: "ik had · jij had · hij/zij had · wij hadden", formulaNote: "The past singular is had; the plural form is hadden. A question can begin with Had: Had jij vroeger een hond?", valuableContrast: "Gisteren had ik meer tijd looks back to a past state. We hadden uses the plural form, while present possession uses heb or hebben." },
  }, {
    id: "journey.hebben.vtt-experience", verbId: "verb.hebben", title: "What I have had", subtitle: "VTT · completed experience and states", level: "A2", kind: "core", status: "later", targetForms: ["VTT"], targetSkills: ["skill.hebben.vtt-experience"], learningGoal: "Describe a completed experience or state with hebben gehad and distinguish it from present possession and past background.", estimatedMinutes: 3, storyTitle: "Een ervaring tot nu toe",
    story: [
      { id: "story.hebben.vtt-experience.1", nl: "Ik heb vandaag genoeg tijd gehad.", english: "I have had enough time today.", telugu: "ఈ రోజు నాకు తగినంత సమయం ఉంది.", targets: [{ text: "heb", skillIds: ["skill.hebben.vtt-experience"] }, { text: "gehad", skillIds: ["skill.hebben.vtt-experience"] }] },
      { id: "story.hebben.vtt-experience.2", nl: "We hebben samen een fijne dag gehad.", english: "We have had a pleasant day together.", telugu: "మేము కలిసి ఒక మంచి రోజును గడిపాము.", targets: [{ text: "hebben", skillIds: ["skill.hebben.vtt-experience"] }, { text: "gehad", skillIds: ["skill.hebben.vtt-experience"] }] },
      { id: "story.hebben.vtt-experience.3", nl: "Heeft zij ooit zo'n lange reis gehad?", english: "Has she ever had such a long journey?", telugu: "ఆమె ఎప్పుడైనా ఇంత పొడవైన ప్రయాణం చేసిందా?", targets: [{ text: "Heeft", skillIds: ["skill.hebben.vtt-experience"] }, { text: "gehad", skillIds: ["skill.hebben.vtt-experience"] }] },
      { id: "story.hebben.vtt-experience.4", nl: "Ik heb een goede ervaring gehad met deze cursus.", english: "I have had a good experience with this course.", telugu: "ఈ కోర్సుతో నాకు మంచి అనుభవం ఉంది.", targets: [{ text: "heb", skillIds: ["skill.hebben.vtt-experience"] }, { text: "gehad", skillIds: ["skill.hebben.vtt-experience"] }] },
      { id: "story.hebben.vtt-experience.5", nl: "Hij heeft vorige week een drukke dag gehad.", english: "He had a busy day last week.", telugu: "గత వారం అతనికి బిజీ రోజు ఉంది.", targets: [{ text: "heeft", skillIds: ["skill.hebben.vtt-experience"] }, { text: "gehad", skillIds: ["skill.hebben.vtt-experience"] }] },
    ],
    notice: { id: "notice.hebben.vtt-experience", title: "Having had the experience", subtitle: "Hebben gehad links a completed experience or state to the present.", comparison: [
      { label: "current", tense: "OTT", sentence: "Ik heb vandaag genoeg tijd.", meaning: "a state or resource now" },
      { label: "completed experience", tense: "VTT", sentence: "Ik heb vandaag genoeg tijd gehad.", meaning: "an experience completed in the current period" },
      { label: "past background", tense: "OVT", sentence: "Ik had gisteren genoeg tijd.", meaning: "a past state viewed as background" },
    ], formula: "ik heb gehad · hij/zij heeft gehad · wij hebben gehad", formulaNote: "VTT uses present hebben plus the lexical participle gehad. The experience can be completed while the time period still matters now.", valuableContrast: "Ik heb tijd describes availability now. Ik heb tijd gehad reports a completed experience, while Ik had tijd looks back to a past state." },
  }, {
    id: "journey.hebben.vtt-auxiliary", verbId: "verb.hebben", title: "What I have done", subtitle: "VTT · common auxiliary hebben", level: "A2", kind: "core", status: "later", targetForms: ["VTT"], targetSkills: ["skill.hebben.vtt-auxiliary"], learningGoal: "Recognise and construct common perfect phrases that use hebben as the auxiliary, with a practical contrast to selected zijn phrases.", estimatedMinutes: 3, storyTitle: "Wat ik vandaag heb gedaan",
    story: [
      { id: "story.hebben.vtt-auxiliary.1", nl: "Ik heb vandaag gewerkt.", english: "I have worked today.", telugu: "నేను ఈ రోజు పని చేశాను.", targets: [{ text: "heb", skillIds: ["skill.hebben.vtt-auxiliary"] }, { text: "gewerkt", skillIds: ["skill.hebben.vtt-auxiliary"] }] },
      { id: "story.hebben.vtt-auxiliary.2", nl: "We hebben samen gekookt.", english: "We have cooked together.", telugu: "మేము కలిసి వంట చేశాము.", targets: [{ text: "hebben", skillIds: ["skill.hebben.vtt-auxiliary"] }, { text: "gekookt", skillIds: ["skill.hebben.vtt-auxiliary"] }] },
      { id: "story.hebben.vtt-auxiliary.3", nl: "Zij heeft een lange brief geschreven.", english: "She has written a long letter.", telugu: "ఆమె ఒక పొడవైన లేఖ రాసింది.", targets: [{ text: "heeft", skillIds: ["skill.hebben.vtt-auxiliary"] }, { text: "geschreven", skillIds: ["skill.hebben.vtt-auxiliary"] }] },
      { id: "story.hebben.vtt-auxiliary.4", nl: "Ik ben vroeg naar huis gegaan.", english: "I went home early.", telugu: "నేను త్వరగా ఇంటికి వెళ్లాను.", targets: [{ text: "ben", skillIds: ["skill.hebben.vtt-auxiliary"] }, { text: "gegaan", skillIds: ["skill.hebben.vtt-auxiliary"] }] },
      { id: "story.hebben.vtt-auxiliary.5", nl: "Mijn broer heeft de deur geopend.", english: "My brother has opened the door.", telugu: "నా సోదరుడు తలుపు తెరిచాడు.", targets: [{ text: "heeft", skillIds: ["skill.hebben.vtt-auxiliary"] }, { text: "geopend", skillIds: ["skill.hebben.vtt-auxiliary"] }] },
    ],
    notice: { id: "notice.hebben.vtt-auxiliary", title: "Choosing the practical auxiliary", subtitle: "Many completed actions use hebben; selected movement or state changes can use zijn.", comparison: [
      { label: "hebben auxiliary", tense: "VTT", sentence: "Ik heb vandaag gewerkt.", meaning: "a completed action" },
      { label: "hebben auxiliary", tense: "VTT", sentence: "Zij heeft een lange brief geschreven.", meaning: "a completed action with a direct object" },
      { label: "practical contrast", tense: "VTT", sentence: "Ik ben vroeg naar huis gegaan.", meaning: "a selected movement example using zijn" },
    ], formula: "ik heb gewerkt · wij hebben gekookt · zij heeft geschreven", formulaNote: "This lesson uses a small high-frequency set. It shows the practical auxiliary choice without teaching every Dutch auxiliary rule or participle pattern.", valuableContrast: "Heb gewerkt and heeft geschreven use hebben for completed actions. Ben gegaan is a selected movement contrast using zijn; learners need the authored phrase, not a universal rule." },
  }, {
    id: "journey.hebben.future-reference", verbId: "verb.hebben", title: "What I will and would have", subtitle: "OTTT · OVTT · VTTT · VVTT · future and conditional reference", level: "A2", kind: "core", status: "later", targetForms: ["OTTT", "OVTT", "VTTT", "VVTT"], targetSkills: ["skill.hebben.future-reference"], learningGoal: "Distinguish future plans and conditional possibilities, then recognise advanced completed variants with zal hebben and zou hebben.", estimatedMinutes: 3, storyTitle: "Later en misschien",
    story: [
      { id: "story.hebben.future-reference.1", nl: "Morgen zal ik meer tijd hebben.", english: "Tomorrow I will have more time.", telugu: "రేపు నాకు ఎక్కువ సమయం ఉంటుంది.", targets: [{ text: "zal", skillIds: ["skill.hebben.future-reference"] }, { text: "hebben", skillIds: ["skill.hebben.future-reference"] }] },
      { id: "story.hebben.future-reference.2", nl: "Als ik vrij ben, zou ik meer tijd hebben.", english: "If I were free, I would have more time.", telugu: "నేను ఖాళీగా ఉంటే, నాకు ఎక్కువ సమయం ఉండేది.", targets: [{ text: "zou", skillIds: ["skill.hebben.future-reference"] }, { text: "hebben", skillIds: ["skill.hebben.future-reference"] }] },
      { id: "story.hebben.future-reference.3", nl: "Tegen vrijdag zal ik de afspraak gehad hebben.", english: "By Friday, I will have had the appointment.", telugu: "శుక్రవారం నాటికి, నాకు ఆ అపాయింట్‌మెంట్ అయి ఉంటుంది.", targets: [{ text: "zal", skillIds: ["skill.hebben.future-reference"] }, { text: "gehad hebben", skillIds: ["skill.hebben.future-reference"] }] },
      { id: "story.hebben.future-reference.4", nl: "Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben.", english: "If I had started earlier, I would have had enough time.", telugu: "నేను ముందుగా ప్రారంభించి ఉంటే, నాకు తగినంత సమయం ఉండేది.", targets: [{ text: "zou", skillIds: ["skill.hebben.future-reference"] }, { text: "gehad hebben", skillIds: ["skill.hebben.future-reference"] }] },
      { id: "story.hebben.future-reference.5", nl: "Volgende maand zal zij een nieuwe baan hebben.", english: "Next month she will have a new job.", telugu: "వచ్చే నెల ఆమెకు కొత్త ఉద్యోగం ఉంటుంది.", targets: [{ text: "zal", skillIds: ["skill.hebben.future-reference"] }, { text: "hebben", skillIds: ["skill.hebben.future-reference"] }] },
    ],
    notice: { id: "notice.hebben.future-reference", title: "Looking ahead with hebben", subtitle: "Zal and zou separate explicit future reference from conditional possibility; advanced perfect variants stay labelled.", comparison: [
      { label: "future plan", tense: "OTTT", sentence: "Morgen zal ik meer tijd hebben.", meaning: "an explicit future possession" },
      { label: "conditional", tense: "OVTT", sentence: "Als ik vrij ben, zou ik meer tijd hebben.", meaning: "a hypothetical possession" },
      { label: "future completion", tense: "VTTT", sentence: "Tegen vrijdag zal ik de afspraak gehad hebben.", meaning: "completion before a future point" },
      { label: "conditional completion", tense: "VVTT", sentence: "Als ik eerder was begonnen, zou ik genoeg tijd gehad hebben.", meaning: "an unreal completed possession" },
    ], formula: "zal hebben · zou hebben · zal gehad hebben · zou gehad hebben", formulaNote: "OTTT and OVTT are the main future or conditional contrast. VTTT and VVTT are advanced reference forms connected to the map; they are labelled for recognition, not taught as a beginner gate.", valuableContrast: "Zal hebben points to an explicit future. Zou hebben depends on a condition. Zal gehad hebben and zou gehad hebben add completion before that future or hypothetical reference point." },
  }],
};

export const verbJourneyPacks: VerbJourneyPack[] = [verbJourneyPack, zijnPack, hebbenPack, gaanPack];

export function getVerbJourneyPack(verbId: string): VerbJourneyPack | null {
  return verbJourneyPacks.find((pack) => pack.verb.id === verbId) ?? null;
}

export function getVerbJourneyContentVersion(verbId: string): VerbJourneyContentVersion | null {
  return getVerbJourneyPack(verbId)?.contentVersion ?? null;
}

export function validateVerbJourneyRegistry(packs: readonly VerbJourneyPack[] = verbJourneyPacks): string[] {
  const errors = packs.flatMap((pack) => validateVerbJourneyPack(pack).map((error) => `${pack.verb.id}: ${error}`));
  const ids = new Set<string>();
  for (const pack of packs) for (const journey of pack.journeys) {
    if (ids.has(journey.id)) errors.push(`${journey.id}: duplicate registry identifier`);
    ids.add(journey.id);
  }
  return errors;
}

export function validateVerbJourneyPack(pack: VerbJourneyPack): string[] {
  const errors: string[] = [];
  if (pack.schemaVersion !== VERB_JOURNEY_SCHEMA_VERSION) errors.push("schemaVersion: unsupported version");
  if (!new Set<VerbJourneyContentVersion>([
    VERB_JOURNEY_CONTENT_VERSION,
    VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
    ZIJN_VERB_JOURNEY_CONTENT_VERSION,
    ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
    HEBBEN_VERB_JOURNEY_CONTENT_VERSION,
    HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
    ENGLISH_COMPARISON_CONTENT_VERSION,
    GAAN_VERB_JOURNEY_CONTENT_VERSION,
    GAAN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION,
  ]).has(pack.contentVersion)) errors.push("contentVersion: unsupported version");
  const requiresMultilingualFormContent = multilingualContentVersions.has(pack.contentVersion);
  const requiresEnglishComparisonContent = englishComparisonContentVersions.has(pack.contentVersion);
  if (!stableId.test(pack.verb.id) || !pack.verb.lemma || !pack.verb.english || !pack.verb.tags.length || !["hebben", "zijn"].includes(pack.verb.auxiliary)) errors.push("verb: incomplete verb record");
  const ids = new Set<string>();
  const addId = (id: string, field: string) => {
    if (!stableId.test(id)) errors.push(`${field}: expected a stable identifier`);
    if (ids.has(id)) errors.push(`${field}: duplicate stable identifier`);
    ids.add(id);
  };
  addId(pack.verb.id, "verb.id");
  if (pack.dutchForms.length !== 8) errors.push("dutchForms: expected exactly eight forms");
  const forms = new Map<DutchTense, VerbFormRecord>();
  for (const [index, form] of pack.dutchForms.entries()) {
    addId(form.id, `dutchForms[${index}].id`);
    if (!tenseValues.has(form.dutchTense)) errors.push(`dutchForms[${index}].dutchTense: unknown tense`);
    if (forms.has(form.dutchTense)) errors.push(`dutchForms[${index}].dutchTense: duplicate tense`);
    forms.set(form.dutchTense, form);
    if (!form.fullNameNl || !form.sentence || !form.naturalEnglish || !form.usageMeaning || !form.formula || !form.commonUsage) errors.push(`dutchForms[${index}]: missing learner-facing map detail`);
    if (requiresMultilingualFormContent) {
      if (!form.learnerLabelEn) errors.push(`dutchForms[${index}].learnerLabelEn: missing localized form detail`);
      for (const [field, record] of [["canonicalExample", form.canonicalExample], ["commonUsageExample", form.commonUsageExample]] as const) {
        if (!record || !record.nl || !record.en || !record.te) errors.push(`dutchForms[${index}].${field}: expected non-empty nl, en, and te values`);
      }
    }
    if (!(["core", "later", "reference"] as string[]).includes(form.teachingPriority)) errors.push(`dutchForms[${index}].teachingPriority: unknown priority`);
  }
  if (forms.size !== 8) errors.push("dutchForms: expected one record for each tense");
  if (pack.englishComparison.length !== 12) errors.push("englishComparison: expected exactly twelve patterns");
  const englishTenses = new Set<EnglishTense>();
  const englishGroups = new Map<string, number>();
  for (const [index, record] of pack.englishComparison.entries()) {
    addId(record.id, `englishComparison[${index}].id`);
    if (!englishTenseValues.has(record.englishTense)) errors.push(`englishComparison[${index}].englishTense: unknown tense`);
    if (englishTenses.has(record.englishTense)) errors.push(`englishComparison[${index}].englishTense: duplicate tense`);
    englishTenses.add(record.englishTense);
    englishGroups.set(record.group, (englishGroups.get(record.group) ?? 0) + 1);
    if (!record.english || !record.situation || !record.meaningPreservingDutch || !record.commonEverydayDutch || !record.mismatchNote) errors.push(`englishComparison[${index}]: missing learner-facing comparison detail`);
    if (requiresEnglishComparisonContent) {
      for (const [role, variant] of [["meaningPreserving", record.meaningPreserving], ["everyday", record.everyday]] as const) {
        if (!variant || !variant.nl || !variant.en || !variant.te) errors.push(`englishComparison[${index}].${role}: expected non-empty nl, en, and te values`);
        if (!variant?.form || !forms.has(variant.form)) errors.push(`englishComparison[${index}].${role}.form: unknown Dutch form`);
      }
      if (!record.cue || !record.cue.display || !record.cue.shortMeaning || !englishComparisonCueKinds.has(record.cue.kind) || !record.cue.tokens.length || record.cue.tokens.some((token) => !token.trim())) errors.push(`englishComparison[${index}].cue: incomplete authored cue`);
      if (!record.howDutchExpressesIt || !record.whyTheyDiffer) errors.push(`englishComparison[${index}]: missing authored comparison explanation`);
    }
    if (!record.dutchAnalysis.primaryForm && !record.dutchAnalysis.construction) errors.push(`englishComparison[${index}].dutchAnalysis: expected a form or construction`);
    if (record.dutchAnalysis.primaryForm && !forms.has(record.dutchAnalysis.primaryForm)) errors.push(`englishComparison[${index}].dutchAnalysis.primaryForm: unknown form`);
    for (const alternative of record.dutchAnalysis.alternativeForms ?? []) if (!forms.has(alternative)) errors.push(`englishComparison[${index}].dutchAnalysis.alternativeForms: unknown form`);
  }
  for (const group of ["present", "past", "future"]) if (englishGroups.get(group) !== 4) errors.push(`englishComparison: expected four ${group} patterns`);
  if (englishTenses.size !== 12) errors.push("englishComparison: expected one record for each English tense");
  const skills = new Set<string>();
  for (const [index, journey] of pack.journeys.entries()) {
    addId(journey.id, `journeys[${index}].id`);
    if (journey.verbId !== pack.verb.id) errors.push(`${journey.id}.verbId: unknown verb`);
    for (const target of journey.targetForms) if (!forms.has(target)) errors.push(`${journey.id}.targetForms: unknown form ${target}`);
    for (const skill of journey.targetSkills) { if (!stableId.test(skill)) errors.push(`${journey.id}.targetSkills: invalid skill identifier`); skills.add(skill); }
    if (!journey.story.length || !journey.notice) errors.push(`${journey.id}: playable journey requires story and notice content`);
    for (const [lineIndex, line] of journey.story.entries()) {
      addId(line.id, `${journey.id}.story[${lineIndex}].id`);
      if (!line.nl || !line.english || !line.telugu) errors.push(`${journey.id}.story[${lineIndex}]: missing story support`);
      for (const [targetIndex, target] of line.targets.entries()) {
        if (!line.nl.includes(target.text)) errors.push(`${journey.id}.story[${lineIndex}].targets[${targetIndex}]: target text is not present in line`);
        if (target.skillIds.some((skill) => !stableId.test(skill))) errors.push(`${journey.id}.story[${lineIndex}].targets[${targetIndex}]: invalid skill identifier`);
      }
    }
    if (journey.notice) {
      addId(journey.notice.id, `${journey.id}.notice.id`);
      if (!journey.notice.title || !journey.notice.subtitle || !journey.notice.formula || !journey.notice.formulaNote || !journey.notice.valuableContrast) errors.push(`${journey.id}.notice: incomplete notice content`);
    }
  }
  if (skills.size === 0) errors.push("journeys: expected stable skill identifiers");
  return errors;
}

export function isVerbJourneyContentAvailable(verbId = "verb.werken"): boolean {
  const pack = getVerbJourneyPack(verbId);
  return pack !== null && validateVerbJourneyPack(pack).length === 0;
}

export function getVerbJourney(id: string): JourneyRecord | null {
  return verbJourneyPacks.flatMap((pack) => pack.journeys).find((journey) => journey.id === id) ?? null;
}

export function getVerbForm(tense: DutchTense, verbId = "verb.werken"): VerbFormRecord | null {
  return getVerbJourneyPack(verbId)?.dutchForms.find((form) => form.dutchTense === tense) ?? null;
}

export function isVerbJourneyPlayable(journey: JourneyRecord): boolean {
  return journey.story.length > 0 && Boolean(journey.notice);
}
