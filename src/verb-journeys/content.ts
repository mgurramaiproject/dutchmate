export const VERB_JOURNEY_SCHEMA_VERSION = 1;
export const VERB_JOURNEY_CONTENT_VERSION = "015-1";
export const ZIJN_VERB_JOURNEY_CONTENT_VERSION = "016-1";
export type VerbJourneyContentVersion = typeof VERB_JOURNEY_CONTENT_VERSION | typeof ZIJN_VERB_JOURNEY_CONTENT_VERSION;

export type DutchTense = "OTT" | "OVT" | "VTT" | "VVT" | "OTTT" | "OVTT" | "VTTT" | "VVTT";
export type TeachingPriority = "core" | "later" | "reference";
export type JourneyStatus = "mastered" | "learning" | "next" | "later" | "reference";
export type JourneyKind = "core" | "later" | "reference";
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
  cefrLevel: "A1" | "A2" | "reference";
  teachingPriority: TeachingPriority;
};

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

const englishComparison: EnglishMapRecord[] = [
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
    id: "english.werken.future-continuous", englishTense: "future-continuous", group: "future", english: "Tomorrow at eight, I will be working.", situation: "An activity in progress at a future time.", meaningPreservingDutch: "Morgen om acht uur zal ik aan het werken zijn.", commonEverydayDutch: "Morgen om acht uur ben ik aan het werk.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + aan het werk", alternativeForms: ["OTTT"] }, mismatchNote: "The future time phrase and progressive expression carry both the future and ongoing meaning.", cefrLevel: "reference", teachingPriority: "reference",
  },
  {
    id: "english.werken.future-perfect", englishTense: "future-perfect", group: "future", english: "By Friday, I will have worked forty hours.", situation: "A completed amount measured before a future deadline.", meaningPreservingDutch: "Tegen vrijdag zal ik veertig uur gewerkt hebben.", commonEverydayDutch: "Tegen vrijdag heb ik veertig uur gewerkt.", dutchAnalysis: { primaryForm: "VTTT", alternativeForms: ["VTT"] }, mismatchNote: "VTTT explicitly marks completion before a future point; everyday Dutch may let the deadline carry the future meaning.", cefrLevel: "reference", teachingPriority: "reference",
  },
  {
    id: "english.werken.future-perfect-continuous", englishTense: "future-perfect-continuous", group: "future", english: "Tomorrow at eight, I will have been working for two hours.", situation: "A continuing activity measured at a future time.", meaningPreservingDutch: "Morgen om acht uur zal ik al twee uur aan het werken zijn.", commonEverydayDutch: "Morgen om acht uur ben ik al twee uur aan het werk.", dutchAnalysis: { primaryForm: "OTT", construction: "future time + al + duration", alternativeForms: ["OTTT"] }, mismatchNote: "The activity is still ongoing at the future point, so Dutch normally avoids a completed VTTT form.", cefrLevel: "reference", teachingPriority: "reference",
  },
];

export const verbJourneyPack: VerbJourneyPack = {
  schemaVersion: VERB_JOURNEY_SCHEMA_VERSION,
  contentVersion: VERB_JOURNEY_CONTENT_VERSION,
  verb: { id: "verb.werken", lemma: "werken", english: "to work", level: "A1", tags: ["regular", "weak"], auxiliary: "hebben" },
  dutchForms: [
    { id: "form.werken.ott", dutchTense: "OTT", viewpoint: "present", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige tijd", sentence: "Ik werk thuis.", naturalEnglish: "I work at home.", usageMeaning: "routine, fact, present situation, or a scheduled future with a time word", formula: "ik + present stem", commonUsage: "Ik werk thuis. / Morgen werk ik thuis.", cefrLevel: "A1", teachingPriority: "core", status: "mastered" },
    { id: "form.werken.vtt", dutchTense: "VTT", viewpoint: "present", completion: "voltooid", fullNameNl: "voltooid tegenwoordige tijd", sentence: "Ik heb thuis gewerkt.", naturalEnglish: "I have worked at home.", usageMeaning: "completed fact, experience, or result presented from the present viewpoint", formula: "ik + heb + … + gewerkt", commonUsage: "Ik heb gisteren thuis gewerkt.", cefrLevel: "A1", teachingPriority: "core", status: "learning" },
    { id: "form.werken.ovt", dutchTense: "OVT", viewpoint: "past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden tijd", sentence: "Ik werkte thuis.", naturalEnglish: "I worked at home.", usageMeaning: "past habit, story background, or connected past sequence", formula: "ik + werkte", commonUsage: "Vroeger werkte ik thuis.", cefrLevel: "A2", teachingPriority: "core", status: "next" },
    { id: "form.werken.vvt", dutchTense: "VVT", viewpoint: "past", completion: "voltooid", fullNameNl: "voltooid verleden tijd", sentence: "Ik had thuis gewerkt.", naturalEnglish: "I had worked at home.", usageMeaning: "an earlier completed event viewed from a past reference point", formula: "ik + had + … + gewerkt", commonUsage: "Ik had al thuis gewerkt voordat de vergadering begon.", cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.werken.ottt", dutchTense: "OTTT", viewpoint: "future", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis werken.", naturalEnglish: "I will work at home.", usageMeaning: "future prediction, promise, offer, or emphatic future", formula: "ik + zal + … + werken", commonUsage: "Morgen werk ik thuis. / Ik ga morgen thuis werken.", cefrLevel: "reference", teachingPriority: "later", status: "later" },
    { id: "form.werken.vttt", dutchTense: "VTTT", viewpoint: "future", completion: "voltooid", fullNameNl: "voltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis gewerkt hebben.", naturalEnglish: "I will have worked at home.", usageMeaning: "completion before a future reference point", formula: "ik + zal + … + gewerkt hebben", commonUsage: "Tegen vrijdag heb ik veertig uur gewerkt.", cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
    { id: "form.werken.ovtt", dutchTense: "OVTT", viewpoint: "future-from-past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden toekomende tijd", sentence: "Ik zou thuis werken.", naturalEnglish: "I would work at home.", usageMeaning: "future viewed from the past or a hypothetical / conditional situation", formula: "ik + zou + … + werken", commonUsage: "Ik zou thuis werken als dat kon.", cefrLevel: "reference", teachingPriority: "later", status: "later" },
    { id: "form.werken.vvtt", dutchTense: "VVTT", viewpoint: "future-from-past", completion: "voltooid", fullNameNl: "voltooid verleden toekomende tijd", sentence: "Ik zou thuis gewerkt hebben.", naturalEnglish: "I would have worked at home.", usageMeaning: "an unreal or unrealised completed result", formula: "ik + zou + … + gewerkt hebben", commonUsage: "Ik zou thuis gewerkt hebben als dat mogelijk was.", cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
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

const tenseValues = new Set<DutchTense>(["OTT", "OVT", "VTT", "VVT", "OTTT", "OVTT", "VTTT", "VVTT"]);
const englishTenseValues = new Set<EnglishTense>(["present-simple", "present-continuous", "present-perfect", "present-perfect-continuous", "past-simple", "past-continuous", "past-perfect", "past-perfect-continuous", "future-simple", "future-continuous", "future-perfect", "future-perfect-continuous"]);
const stableId = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;

const zijnEnglishComparison: EnglishMapRecord[] = [
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

const zijnPack: VerbJourneyPack = {
  schemaVersion: VERB_JOURNEY_SCHEMA_VERSION,
  contentVersion: ZIJN_VERB_JOURNEY_CONTENT_VERSION,
  verb: { id: "verb.zijn", lemma: "zijn", english: "to be", level: "A1", tags: ["irregular", "copular"], auxiliary: "zijn" },
  dutchForms: [
    { id: "form.zijn.ott", dutchTense: "OTT", viewpoint: "present", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige tijd", sentence: "Ik ben thuis.", naturalEnglish: "I am at home.", usageMeaning: "identity, state, location, or description now", formula: "ik ben / jij bent / hij is / wij zijn", commonUsage: "Ik ben thuis. / Wij zijn klaar.", cefrLevel: "A1", teachingPriority: "core", status: "learning" },
    { id: "form.zijn.vtt", dutchTense: "VTT", viewpoint: "present", completion: "voltooid", fullNameNl: "voltooid tegenwoordige tijd", sentence: "Ik ben thuis geweest.", naturalEnglish: "I have been at home.", usageMeaning: "a completed experience or state viewed from now", formula: "ik ben + … + geweest", commonUsage: "Ik ben daar al geweest.", cefrLevel: "A2", teachingPriority: "core", status: "next" },
    { id: "form.zijn.ovt", dutchTense: "OVT", viewpoint: "past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden tijd", sentence: "Ik was thuis.", naturalEnglish: "I was at home.", usageMeaning: "a past state, identity, or location", formula: "ik was / wij waren", commonUsage: "Ik was gisteren thuis.", cefrLevel: "A1", teachingPriority: "core", status: "later" },
    { id: "form.zijn.vvt", dutchTense: "VVT", viewpoint: "past", completion: "voltooid", fullNameNl: "voltooid verleden tijd", sentence: "Ik was thuis geweest.", naturalEnglish: "I had been at home.", usageMeaning: "a completed state before another past reference point", formula: "ik was + … + geweest", commonUsage: "Ik was al thuis geweest voordat zij belde.", cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.ottt", dutchTense: "OTTT", viewpoint: "future", completion: "onvoltooid", fullNameNl: "onvoltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis zijn.", naturalEnglish: "I will be at home.", usageMeaning: "an explicit future state, promise, or prediction", formula: "ik zal + … + zijn", commonUsage: "Morgen zal ik thuis zijn.", cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.vttt", dutchTense: "VTTT", viewpoint: "future", completion: "voltooid", fullNameNl: "voltooid tegenwoordige toekomende tijd", sentence: "Ik zal thuis geweest zijn.", naturalEnglish: "I will have been at home.", usageMeaning: "a completed state before a future reference point", formula: "ik zal + … + geweest zijn", commonUsage: "Voor de lunch zal ik thuis geweest zijn.", cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
    { id: "form.zijn.ovtt", dutchTense: "OVTT", viewpoint: "future-from-past", completion: "onvoltooid", fullNameNl: "onvoltooid verleden toekomende tijd", sentence: "Ik zou thuis zijn.", naturalEnglish: "I would be at home.", usageMeaning: "a conditional or hypothetical future state", formula: "ik zou + … + zijn", commonUsage: "Als ik vrij was, zou ik thuis zijn.", cefrLevel: "A2", teachingPriority: "later", status: "later" },
    { id: "form.zijn.vvtt", dutchTense: "VVTT", viewpoint: "future-from-past", completion: "voltooid", fullNameNl: "voltooid verleden toekomende tijd", sentence: "Ik zou thuis geweest zijn.", naturalEnglish: "I would have been at home.", usageMeaning: "an unreal or hypothetical completed state", formula: "ik zou + … + geweest zijn", commonUsage: "Als ik kon, zou ik thuis geweest zijn.", cefrLevel: "reference", teachingPriority: "reference", status: "reference" },
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
  }],
};

export const verbJourneyPacks: VerbJourneyPack[] = [verbJourneyPack, zijnPack];

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
  if (pack.contentVersion !== VERB_JOURNEY_CONTENT_VERSION && pack.contentVersion !== ZIJN_VERB_JOURNEY_CONTENT_VERSION) errors.push("contentVersion: unsupported version");
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
