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
        { id: "story.werken.ott.1", nl: "Ik werk meestal thuis.", english: "I usually work at home.", telugu: "నేను సాధారణంగా ఇంటి నుండి పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.2", nl: "Op maandag werk ik op kantoor.", english: "On Mondays I work at the office.", telugu: "సోమవారాల్లో నేను కార్యాలయంలో పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.3", nl: "Ik werk in Groningen.", english: "I work in Groningen.", telugu: "నేను గ్రోనింగెన్‌లో పని చేస్తాను.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
      ], notice: ottNotice,
    },
    {
      id: "journey.werken.vtt-completed", verbId: "verb.werken", title: "What I completed", subtitle: "VTT · completed events", level: "A1", kind: "core", status: "learning", targetForms: ["VTT"], targetSkills: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"], learningGoal: "Report one completed work event from a recent situation.", estimatedMinutes: 3, storyTitle: "Een drukke werkdag",
      story: [
        { id: "story.werken.vtt.1", nl: "Gisteren heb ik op kantoor gewerkt.", english: "Yesterday I worked at the office.", telugu: "నిన్న నేను కార్యాలయంలో పని చేశాను.", targets: [{ text: "heb ik", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.2", nl: "Ik heb met mijn team gewerkt.", english: "I worked with my team.", telugu: "నేను నా బృందంతో కలిసి పని చేశాను.", targets: [{ text: "Ik heb", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.3", nl: "Ik heb aan een nieuw project gewerkt.", english: "I worked on a new project.", telugu: "నేను ఒక కొత్త ప్రాజెక్ట్‌పై పని చేశాను.", targets: [{ text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.4", nl: "Na het werk ben ik naar huis gegaan.", english: "After work, I went home.", telugu: "పని తర్వాత నేను ఇంటికి వెళ్లాను.", targets: [] },
      ], notice: vttNotice,
    },
    {
      id: "journey.werken.ovt-background", verbId: "verb.werken", title: "How I worked before", subtitle: "OVT · habits and stories", level: "A2", kind: "core", status: "next", targetForms: ["OVT"], targetSkills: ["skill.werken.ovt-background"], learningGoal: "Describe a past habit or story background.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ovt.1", nl: "Vroeger werkte ik vaak in een café.", english: "I used to work in a café.", telugu: "గతంలో నేను తరచుగా ఒక కేఫేలో పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.2", nl: "Ik werkte daar elke zaterdag.", english: "I worked there every Saturday.", telugu: "నేను అక్కడ ప్రతి శనివారం పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.3", nl: "Ik werkte naast mijn broer.", english: "I worked next to my brother.", telugu: "నేను నా సోదరుడి పక్కన పని చేసేవాడిని.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
      ], notice: ovtNotice,
    },
    { id: "journey.werken.vvt-earlier-past", verbId: "verb.werken", title: "What had already happened", subtitle: "VVT · earlier past", level: "A2", kind: "later", status: "later", targetForms: ["VVT"], targetSkills: ["skill.werken.vvt-earlier-past"], learningGoal: "Recognise an earlier completed event in a past story.", estimatedMinutes: 2, story: [] },
    { id: "journey.werken.future-possibility", verbId: "verb.werken", title: "Plans and possibilities", subtitle: "OTTT + OVTT", level: "reference", kind: "later", status: "later", targetForms: ["OTTT", "OVTT"], targetSkills: ["skill.werken.future-possibility"], learningGoal: "Recognise future and conditional constructions as later reference material.", estimatedMinutes: 2, story: [] },
    { id: "journey.werken.reference-completed-future", verbId: "verb.werken", title: "Completed future and unreal past", subtitle: "VTTT + VVTT", level: "reference", kind: "reference", status: "reference", targetForms: ["VTTT", "VVTT"], targetSkills: ["skill.werken.reference-completed-future"], learningGoal: "Recognise advanced completed future and unreal past constructions.", estimatedMinutes: 2, story: [] },
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
    if (journey.kind === "core" && (!journey.story.length || !journey.notice)) errors.push(`${journey.id}: core journey requires story and notice content`);
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
