export const VERB_JOURNEY_SCHEMA_VERSION = 1;
export const VERB_JOURNEY_CONTENT_VERSION = "015-1";

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
  contentVersion: typeof VERB_JOURNEY_CONTENT_VERSION;
  verb: { id: string; lemma: string; english: string; level: "A1"; tags: string[]; auxiliary: "hebben" };
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
        { id: "story.werken.ott.1", nl: "Het team werkt meestal samen op kantoor.", english: "The team usually works together at the office.", telugu: "బృందం సాధారణంగా కార్యాలయంలో కలిసి పని చేస్తుంది.", targets: [{ text: "werkt", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.2", nl: "Op maandag werkt de groep aan een nieuw plan.", english: "On Mondays the group works on a new plan.", telugu: "సోమవారాల్లో సమూహం ఒక కొత్త ప్రణాళికపై పని చేస్తుంది.", targets: [{ text: "werkt", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.3", nl: "In de ochtend werken de collega's rustig.", english: "In the morning the colleagues work calmly.", telugu: "ఉదయం సహోద్యోగులు ప్రశాంతంగా పని చేస్తారు.", targets: [{ text: "werken", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.4", nl: "Na de lunch werkt iedereen verder aan het project.", english: "After lunch everyone continues working on the project.", telugu: "మధ్యాహ్న భోజనం తర్వాత అందరూ ప్రాజెక్ట్‌పై పని కొనసాగిస్తారు.", targets: [{ text: "werkt", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.5", nl: "Aan het einde van de dag werkt het team aan de laatste punten.", english: "At the end of the day the team works on the final points.", telugu: "రోజు చివర్లో బృందం చివరి అంశాలపై పని చేస్తుంది.", targets: [{ text: "werkt", skillIds: ["skill.werken.ott-routine"] }] },
      ], notice: ottNotice,
    },
    {
      id: "journey.werken.vtt-completed", verbId: "verb.werken", title: "What I completed", subtitle: "VTT · completed events", level: "A1", kind: "core", status: "learning", targetForms: ["VTT"], targetSkills: ["skill.werken.vtt-completed"], learningGoal: "Report one completed work event from a recent situation.", estimatedMinutes: 3, storyTitle: "Een drukke werkdag",
      story: [
        { id: "story.werken.vtt.1", nl: "Gisteren heeft het team op kantoor gewerkt.", english: "Yesterday the team worked at the office.", telugu: "నిన్న బృందం కార్యాలయంలో పని చేసింది.", targets: [{ text: "heeft", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.2", nl: "Het team heeft met de nieuwe groep gewerkt.", english: "The team worked with the new group.", telugu: "బృందం కొత్త సమూహంతో కలిసి పని చేసింది.", targets: [{ text: "heeft", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.3", nl: "De collega's hebben aan een nieuw project gewerkt.", english: "The colleagues worked on a new project.", telugu: "సహోద్యోగులు ఒక కొత్త ప్రాజెక్ట్‌పై పని చేశారు.", targets: [{ text: "hebben", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.4", nl: "Na de lunch heeft de groep nog twee uur gewerkt.", english: "After lunch the group worked for another two hours.", telugu: "మధ్యాహ్న భోజనం తర్వాత సమూహం మరో రెండు గంటలు పని చేసింది.", targets: [{ text: "heeft", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.5", nl: "Aan het einde heeft het team nog een uur gewerkt.", english: "At the end the team worked for another hour.", telugu: "చివర్లో బృందం మరో గంట పని చేసింది.", targets: [{ text: "heeft", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
      ], notice: vttNotice,
    },
    {
      id: "journey.werken.ovt-background", verbId: "verb.werken", title: "How I worked before", subtitle: "OVT · habits and stories", level: "A2", kind: "core", status: "next", targetForms: ["OVT"], targetSkills: ["skill.werken.ovt-background"], learningGoal: "Describe a past habit or story background.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ovt.1", nl: "Vroeger werkte het team vaak in een kleine ruimte.", english: "The team used to work in a small room.", telugu: "గతంలో బృందం తరచుగా ఒక చిన్న గదిలో పని చేసేది.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.2", nl: "Elke zaterdag werkte de groep samen.", english: "The group worked together every Saturday.", telugu: "ప్రతి శనివారం సమూహం కలిసి పని చేసేది.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.3", nl: "Tijdens de winter werkte het team rustig binnen.", english: "During the winter the team worked quietly indoors.", telugu: "చలికాలంలో బృందం ఇంటి లోపల ప్రశాంతంగా పని చేసేది.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.4", nl: "In die periode werkte iedereen aan hetzelfde plan.", english: "During that period everyone worked on the same plan.", telugu: "ఆ కాలంలో అందరూ ఒకే ప్రణాళికపై పని చేసేవారు.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.5", nl: "Na de lunch werkte de groep verder.", english: "After lunch the group continued working.", telugu: "మధ్యాహ్న భోజనం తర్వాత సమూహం పని కొనసాగించేది.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
      ], notice: ovtNotice,
    },
    {
      id: "journey.werken.vvt-earlier-past", verbId: "verb.werken", title: "What had already happened", subtitle: "VVT · earlier past", level: "A2", kind: "later", status: "later", targetForms: ["VVT"], targetSkills: ["skill.werken.vvt-earlier-past"], learningGoal: "Place an earlier completed event before another past event.", estimatedMinutes: 3, storyTitle: "Voordat de vergadering begon",
      story: [
        { id: "story.werken.vvt.1", nl: "Het team had al gewerkt voordat de vergadering begon.", english: "The team had already worked before the meeting began.", telugu: "సమావేశం ప్రారంభమయ్యే ముందు బృందం ఇప్పటికే పని చేసింది.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.2", nl: "Voordat de bezoekers kwamen, had de groep rustig gewerkt.", english: "Before the visitors arrived, the group had worked quietly.", telugu: "సందర్శకులు రాకముందు సమూహం ప్రశాంతంగా పని చేసింది.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.3", nl: "Toen de bel ging, had het team al twee uur gewerkt.", english: "When the bell rang, the team had already worked for two hours.", telugu: "గంట మోగినప్పుడు బృందం ఇప్పటికే రెండు గంటలు పని చేసింది.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.4", nl: "De groep had thuis gewerkt voordat het kantoor openging.", english: "The group had worked at home before the office opened.", telugu: "కార్యాలయం తెరవకముందు సమూహం ఇంటి వద్ద పని చేసింది.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
        { id: "story.werken.vvt.5", nl: "Voordat de deadline kwam, had iedereen aan het project gewerkt.", english: "Before the deadline arrived, everyone had worked on the project.", telugu: "గడువు రాకముందు అందరూ ప్రాజెక్ట్‌పై పని చేశారు.", targets: [{ text: "had", skillIds: ["skill.werken.vvt-earlier-past"] }, { text: "gewerkt", skillIds: ["skill.werken.vvt-earlier-past"] }] },
      ], notice: vvtNotice,
    },
    {
      id: "journey.werken.future-possibility", verbId: "verb.werken", title: "Plans and possibilities", subtitle: "OTTT + OVTT · future and conditional", level: "reference", kind: "later", status: "later", targetForms: ["OTTT", "OVTT"], targetSkills: ["skill.werken.future-possibility"], learningGoal: "Distinguish an explicit future plan from a conditional possibility.", estimatedMinutes: 3, storyTitle: "Een plan voor morgen",
      story: [
        { id: "story.werken.future.1", nl: "Morgen zal het team thuis werken.", english: "Tomorrow the team will work at home.", telugu: "రేపు బృందం ఇంటి వద్ద పని చేస్తుంది.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.2", nl: "Als het regent, zou de groep thuis werken.", english: "If it rains, the group would work at home.", telugu: "వర్షం పడితే, సమూహం ఇంటి వద్ద పని చేస్తుంది.", targets: [{ text: "zou", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.3", nl: "Na de lunch zal het team aan het project werken.", english: "After lunch the team will work on the project.", telugu: "మధ్యాహ్న భోజనం తర్వాత బృందం ప్రాజెక్ట్‌పై పని చేస్తుంది.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.4", nl: "Volgende week zal de groep met een nieuwe planning werken.", english: "Next week the group will work with a new schedule.", telugu: "వచ్చే వారం సమూహం కొత్త షెడ్యూల్‌తో పని చేస్తుంది.", targets: [{ text: "zal", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
        { id: "story.werken.future.5", nl: "Bij slecht weer zou het team in een rustige ruimte werken.", english: "In bad weather the team would work in a quiet room.", telugu: "చెడు వాతావరణంలో బృందం ప్రశాంతమైన గదిలో పని చేస్తుంది.", targets: [{ text: "zou", skillIds: ["skill.werken.future-possibility"] }, { text: "werken", skillIds: ["skill.werken.future-possibility"] }] },
      ], notice: futurePossibilityNotice,
    },
    {
      id: "journey.werken.reference-completed-future", verbId: "verb.werken", title: "Completed future and unreal past", subtitle: "VTTT + VVTT · advanced completion", level: "reference", kind: "reference", status: "reference", targetForms: ["VTTT", "VVTT"], targetSkills: ["skill.werken.reference-completed-future"], learningGoal: "Recognise a completed result viewed from a future or hypothetical point.", estimatedMinutes: 3, storyTitle: "Voor het einde van de dag",
      story: [
        { id: "story.werken.completed-future.1", nl: "Voor het einde van de dag zal het team acht uur gewerkt hebben.", english: "By the end of the day, the team will have worked for eight hours.", telugu: "రోజు ముగిసే సమయానికి బృందం ఎనిమిది గంటలు పని చేసి ఉంటుంది.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.2", nl: "Als er meer tijd was geweest, zou de groep langer gewerkt hebben.", english: "If there had been more time, the group would have worked longer.", telugu: "మరింత సమయం ఉండి ఉంటే, సమూహం ఎక్కువసేపు పని చేసి ఉండేది.", targets: [{ text: "zou", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.3", nl: "Om vijf uur zal het team al acht uur gewerkt hebben.", english: "At five o'clock, the team will already have worked for eight hours.", telugu: "ఐదు గంటలకు బృందం ఇప్పటికే ఎనిమిది గంటలు పని చేసి ఉంటుంది.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.4", nl: "Voor de deadline zal iedereen aan het project gewerkt hebben.", english: "Before the deadline, everyone will have worked on the project.", telugu: "గడువుకు ముందు అందరూ ప్రాజెక్ట్‌పై పని చేసి ఉంటారు.", targets: [{ text: "zal", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
        { id: "story.werken.completed-future.5", nl: "Als de planning anders was geweest, zou het team langer gewerkt hebben.", english: "If the schedule had been different, the team would have worked longer.", telugu: "షెడ్యూల్ భిన్నంగా ఉండి ఉంటే, బృందం ఎక్కువసేపు పని చేసి ఉండేది.", targets: [{ text: "zou", skillIds: ["skill.werken.reference-completed-future"] }, { text: "gewerkt hebben", skillIds: ["skill.werken.reference-completed-future"] }] },
      ], notice: completedFutureNotice,
    },
  ],
};

const tenseValues = new Set<DutchTense>(["OTT", "OVT", "VTT", "VVT", "OTTT", "OVTT", "VTTT", "VVTT"]);
const englishTenseValues = new Set<EnglishTense>(["present-simple", "present-continuous", "present-perfect", "present-perfect-continuous", "past-simple", "past-continuous", "past-perfect", "past-perfect-continuous", "future-simple", "future-continuous", "future-perfect", "future-perfect-continuous"]);
const stableId = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;

export function validateVerbJourneyPack(pack: VerbJourneyPack): string[] {
  const errors: string[] = [];
  if (pack.schemaVersion !== VERB_JOURNEY_SCHEMA_VERSION) errors.push("schemaVersion: unsupported version");
  if (pack.contentVersion !== VERB_JOURNEY_CONTENT_VERSION) errors.push("contentVersion: unsupported version");
  if (pack.verb.id !== "verb.werken" || pack.verb.lemma !== "werken" || pack.verb.auxiliary !== "hebben") errors.push("verb: expected the reviewed werken record");
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
  if (pack.journeys.length < 6) errors.push("journeys: expected core and later/reference coverage");
  if (skills.size === 0) errors.push("journeys: expected stable skill identifiers");
  return errors;
}

export function isVerbJourneyContentAvailable(): boolean {
  return validateVerbJourneyPack(verbJourneyPack).length === 0;
}

export function getVerbJourney(id: string): JourneyRecord | null {
  return verbJourneyPack.journeys.find((journey) => journey.id === id) ?? null;
}

export function getVerbForm(tense: DutchTense): VerbFormRecord | null {
  return verbJourneyPack.dutchForms.find((form) => form.dutchTense === tense) ?? null;
}

export function isVerbJourneyPlayable(journey: JourneyRecord): boolean {
  return journey.story.length > 0 && Boolean(journey.notice);
}
