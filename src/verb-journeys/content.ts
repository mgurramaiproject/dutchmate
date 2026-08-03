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


function getCatalogVerbJourneyPack(verbId: string): VerbJourneyPack {
  const pack = contentCatalog.getVerbJourneyPack(verbId);
  if (!pack) throw new Error(`Content catalog is missing Verb Journey package: ${verbId}`);
  return pack;
}

export const verbJourneyPack = getCatalogVerbJourneyPack("verb.werken");
const zijnPack = getCatalogVerbJourneyPack("verb.zijn");
const hebbenPack = getCatalogVerbJourneyPack("verb.hebben");

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
