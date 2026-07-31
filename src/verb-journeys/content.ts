export const VERB_JOURNEY_SCHEMA_VERSION = 1;
export const VERB_JOURNEY_CONTENT_VERSION = "015-1";

export type DutchTense = "OTT" | "OVT" | "VTT" | "VVT" | "OTTT" | "OVTT" | "VTTT" | "VVTT";
export type TeachingPriority = "core" | "later" | "reference";
export type JourneyStatus = "mastered" | "learning" | "next" | "later" | "reference";
export type JourneyKind = "core" | "later" | "reference";

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

export type StoryTarget = { text: string; skillIds: string[] };
export type StoryLine = { id: string; nl: string; english: string; targets: StoryTarget[] };
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
  journeys: [
    {
      id: "journey.werken.ott-routine", verbId: "verb.werken", title: "What I normally do", subtitle: "OTT · present and routine", level: "A1", kind: "core", status: "mastered", targetForms: ["OTT"], targetSkills: ["skill.werken.ott-routine"], learningGoal: "Describe a routine or present work situation.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ott.1", nl: "Ik werk meestal thuis.", english: "I usually work at home.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.2", nl: "Op maandag werk ik op kantoor.", english: "On Mondays I work at the office.", targets: [{ text: "werk", skillIds: ["skill.werken.ott-routine"] }] },
        { id: "story.werken.ott.3", nl: "Mijn collega Sara werkt in Groningen.", english: "My colleague Sara works in Groningen.", targets: [{ text: "werkt", skillIds: ["skill.werken.ott-routine"] }] },
      ], notice: ottNotice,
    },
    {
      id: "journey.werken.vtt-completed", verbId: "verb.werken", title: "What I completed", subtitle: "VTT · completed events", level: "A1", kind: "core", status: "learning", targetForms: ["VTT"], targetSkills: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"], learningGoal: "Report one completed work event from a recent situation.", estimatedMinutes: 3, storyTitle: "Een drukke werkdag",
      story: [
        { id: "story.werken.vtt.1", nl: "Gisteren heb ik op kantoor gewerkt.", english: "Yesterday I worked at the office.", targets: [{ text: "heb ik", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.2", nl: "Ik heb met mijn collega Sara gewerkt.", english: "I worked with my colleague Sara.", targets: [{ text: "Ik heb", skillIds: ["skill.werken.vtt-completed"] }, { text: "gewerkt", skillIds: ["skill.werken.vtt-completed", "skill.werken.construct-phrase"] }] },
        { id: "story.werken.vtt.3", nl: "We hebben aan een nieuw project gewerkt.", english: "We worked on a new project.", targets: [{ text: "gewerkt", skillIds: ["skill.werken.vtt-completed"] }] },
        { id: "story.werken.vtt.4", nl: "Na het werk ben ik naar huis gegaan.", english: "After work, I went home.", targets: [] },
      ], notice: vttNotice,
    },
    {
      id: "journey.werken.ovt-background", verbId: "verb.werken", title: "How I worked before", subtitle: "OVT · habits and stories", level: "A2", kind: "core", status: "next", targetForms: ["OVT"], targetSkills: ["skill.werken.ovt-background"], learningGoal: "Describe a past habit or story background.", estimatedMinutes: 3,
      story: [
        { id: "story.werken.ovt.1", nl: "Vroeger werkte ik vaak in een café.", english: "I used to work in a café.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.2", nl: "Ik werkte daar elke zaterdag.", english: "I worked there every Saturday.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
        { id: "story.werken.ovt.3", nl: "Mijn broer werkte naast mij.", english: "My brother worked next to me.", targets: [{ text: "werkte", skillIds: ["skill.werken.ovt-background"] }] },
      ], notice: ovtNotice,
    },
    { id: "journey.werken.vvt-earlier-past", verbId: "verb.werken", title: "What had already happened", subtitle: "VVT · earlier past", level: "A2", kind: "later", status: "later", targetForms: ["VVT"], targetSkills: ["skill.werken.vvt-earlier-past"], learningGoal: "Recognise an earlier completed event in a past story.", estimatedMinutes: 2, story: [] },
    { id: "journey.werken.future-possibility", verbId: "verb.werken", title: "Plans and possibilities", subtitle: "OTTT + OVTT", level: "reference", kind: "later", status: "later", targetForms: ["OTTT", "OVTT"], targetSkills: ["skill.werken.future-possibility"], learningGoal: "Recognise future and conditional constructions as later reference material.", estimatedMinutes: 2, story: [] },
    { id: "journey.werken.reference-completed-future", verbId: "verb.werken", title: "Completed future and unreal past", subtitle: "VTTT + VVTT", level: "reference", kind: "reference", status: "reference", targetForms: ["VTTT", "VVTT"], targetSkills: ["skill.werken.reference-completed-future"], learningGoal: "Recognise advanced completed future and unreal past constructions.", estimatedMinutes: 2, story: [] },
  ],
};

const tenseValues = new Set<DutchTense>(["OTT", "OVT", "VTT", "VVT", "OTTT", "OVTT", "VTTT", "VVTT"]);
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
  const skills = new Set<string>();
  for (const [index, journey] of pack.journeys.entries()) {
    addId(journey.id, `journeys[${index}].id`);
    if (journey.verbId !== pack.verb.id) errors.push(`${journey.id}.verbId: unknown verb`);
    for (const target of journey.targetForms) if (!forms.has(target)) errors.push(`${journey.id}.targetForms: unknown form ${target}`);
    for (const skill of journey.targetSkills) { if (!stableId.test(skill)) errors.push(`${journey.id}.targetSkills: invalid skill identifier`); skills.add(skill); }
    if (journey.kind === "core" && (!journey.story.length || !journey.notice)) errors.push(`${journey.id}: core journey requires story and notice content`);
    for (const [lineIndex, line] of journey.story.entries()) {
      addId(line.id, `${journey.id}.story[${lineIndex}].id`);
      if (!line.nl || !line.english) errors.push(`${journey.id}.story[${lineIndex}]: missing story support`);
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
