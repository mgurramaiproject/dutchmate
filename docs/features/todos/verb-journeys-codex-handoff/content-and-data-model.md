# Content and Data Model

This document defines conceptual TypeScript shapes. Codex must adapt naming and validation to the repository’s language and conventions.

## 1. Stable identifiers

Use stable, human-readable IDs. Never derive progress identity from display text.

Examples:

- `verb.werken`
- `journey.werken.ott-routine`
- `exercise.werken.vtt.construct-01`
- `skill.construct-verb-phrase`
- `english.present-perfect-continuous`

## 2. Enumerations

```ts
type CefrLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type DutchTense =
  | "OTT"
  | "OVT"
  | "VTT"
  | "VVT"
  | "OTTT"
  | "OVTT"
  | "VTTT"
  | "VVTT";

type TeachingPriority = "core" | "later" | "reference";

type EnglishTense =
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
```

## 3. Verb pack

```ts
interface VerbJourneyPack {
  schemaVersion: number;
  contentVersion: string;
  locale: {
    target: "nl";
    supports: string[];
  };
  verb: VerbRecord;
  dutchForms: DutchFormRecord[];        // exactly 8 unique forms
  englishComparison: EnglishMapRecord[]; // exactly 12 unique patterns
  journeys: JourneyRecord[];
  exercises: ExerciseRecord[];
}

interface VerbRecord {
  id: string;
  lemma: string;
  meanings: Record<string, string>;
  coreLevel: CefrLevel;
  tags: Array<"regular" | "irregular" | "weak" | "strong" | "auxiliary" | "modal">;
  stem?: string;
  pastSingular?: string;
  pastPlural?: string;
  participle?: string;
  auxiliary?: "hebben" | "zijn" | "context-dependent";
}
```

## 4. Dutch form record

`usageMeaning` is mandatory. A label such as VTT alone is not a usable explanation.

```ts
interface DutchFormRecord {
  id: string;
  dutchTense: DutchTense;
  fullNameNl: string;
  sentence: string;
  naturalEnglish: string;
  literalEnglish?: string;
  usageMeaning: string[];
  timeMarkers: string[];
  everydayAlternative?: {
    sentence: string;
    note: string;
  };
  cefrLevel: CefrLevel;
  teachingPriority: TeachingPriority;
}
```

For werken, all eight records must exist:

```json
[
  {"dutchTense":"OTT","sentence":"Ik werk thuis."},
  {"dutchTense":"OVT","sentence":"Ik werkte thuis."},
  {"dutchTense":"VTT","sentence":"Ik heb thuis gewerkt."},
  {"dutchTense":"VVT","sentence":"Ik had thuis gewerkt."},
  {"dutchTense":"OTTT","sentence":"Ik zal thuis werken."},
  {"dutchTense":"OVTT","sentence":"Ik zou thuis werken."},
  {"dutchTense":"VTTT","sentence":"Ik zal thuis gewerkt hebben."},
  {"dutchTense":"VVTT","sentence":"Ik zou thuis gewerkt hebben."}
]
```

The abbreviated JSON above is illustrative, not release-ready content.

## 5. English comparison record

```ts
interface EnglishMapRecord {
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
  cefrLevel: CefrLevel;
  teachingPriority: TeachingPriority;
}
```

The Dutch analysis may use a construction rather than one of the eight form labels, for example *aan het + infinitive*. Do not force an inaccurate form solely to fill the enum.

## 6. Journey and story

```ts
interface JourneyRecord {
  id: string;
  verbId: string;
  title: string;
  subtitle: string;
  level: CefrLevel;
  teachingPriority: TeachingPriority;
  targetForms: DutchTense[];
  targetSkills: string[];
  learningGoal: string;
  estimatedMinutes: number;
  prerequisites: string[];
  story: StoryLine[];
  noticePrompt: NoticePrompt;
  coreExerciseIds: string[];
  repairRules: RepairRule[];
}

interface StoryLine {
  id: string;
  nl: string;
  supportTranslations: Record<string, string>;
  targetSpans: Array<{
    text: string;
    skillIds: string[];
  }>;
  audioText?: string;
}

interface NoticePrompt {
  prompt: string;
  choices: Choice[];
  correctChoiceIds: string[];
  feedback: AuthoredFeedback;
}
```

## 7. Exercise union

```ts
type ExerciseRecord =
  | SingleChoiceExercise
  | MultiChoiceExercise
  | TokenOrderExercise
  | TapToSlotsExercise
  | MatchPairsExercise
  | MapPlacementExercise;

interface ExerciseBase {
  id: string;
  verbId: string;
  journeyId: string;
  type: string;
  prompt: string;
  situation?: string;
  skillIds: string[];
  difficulty: 1 | 2 | 3;
  feedback: AuthoredFeedback;
}

interface Choice {
  id: string;
  label: string;
}

interface SingleChoiceExercise extends ExerciseBase {
  type: "single-choice";
  choices: Choice[];
  correctChoiceId: string;
}

interface MultiChoiceExercise extends ExerciseBase {
  type: "multi-choice";
  choices: Choice[];
  correctChoiceIds: string[];
}

interface TokenOrderExercise extends ExerciseBase {
  type: "token-order";
  tokens: Array<{id: string; label: string}>;
  correctTokenIds: string[];
}

interface TapToSlotsExercise extends ExerciseBase {
  type: "tap-to-slots";
  template: Array<
    | {type: "text"; value: string}
    | {type: "slot"; id: string}
  >;
  tokens: Array<{id: string; label: string}>;
  correctSlots: Record<string, string>;
}

interface MatchPairsExercise extends ExerciseBase {
  type: "match-pairs";
  left: Choice[];
  right: Choice[];
  correctPairs: Array<[string, string]>;
}

interface MapPlacementExercise extends ExerciseBase {
  type: "map-placement";
  sentence: string;
  availableForms: DutchTense[];
  correctForm: DutchTense;
}

interface AuthoredFeedback {
  correct: string;
  incorrect: string;
  explanation: string;
  distractorNotes?: Record<string, string>;
}

interface RepairRule {
  skillId: string;
  exerciseIds: string[];
  maxToShow: 1 | 2;
}
```

## 8. Example click-only exercise

```json
{
  "id": "exercise.werken.vtt.construct-01",
  "verbId": "verb.werken",
  "journeyId": "journey.werken.vtt-completed-event",
  "type": "tap-to-slots",
  "prompt": "Complete the sentence.",
  "situation": "You are telling a colleague what you did yesterday.",
  "skillIds": ["skill.construct-verb-phrase"],
  "difficulty": 1,
  "template": [
    {"type":"text","value":"Ik "},
    {"type":"slot","id":"aux"},
    {"type":"text","value":" gisteren thuis "},
    {"type":"slot","id":"participle"},
    {"type":"text","value":"."}
  ],
  "tokens": [
    {"id":"heb","label":"heb"},
    {"id":"ben","label":"ben"},
    {"id":"werk","label":"werk"},
    {"id":"werkte","label":"werkte"},
    {"id":"gewerkt","label":"gewerkt"}
  ],
  "correctSlots": {
    "aux":"heb",
    "participle":"gewerkt"
  },
  "feedback": {
    "correct":"Correct: ik heb gewerkt.",
    "incorrect":"Build the completed event with heb + gewerkt.",
    "explanation":"Werken uses hebben as its auxiliary: ik heb gewerkt."
  }
}
```

## 9. Progress model

Persist attempts or compact aggregates using existing project conventions.

```ts
interface SkillProgress {
  schemaVersion: number;
  verbId: string;
  skillId: string;
  exerciseType: ExerciseRecord["type"];
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastAttemptAt: string;
  nextReviewAt?: string;
  state: "learning" | "needs-practice" | "demonstrated";
  contentVersion: string;
}
```

Mastery must be derived from more than one recognition answer. A reasonable MVP rule:

- `demonstrated` requires success in at least two different exercise families relevant to the skill;
- an incorrect later retrieval can move it to `needs-practice`;
- journey completion and skill mastery are separate concepts.

The exact rule should be testable and documented in code.

## 10. Content versioning

- `schemaVersion` changes when the record structure/migration changes.
- `contentVersion` changes when authored learning content changes.
- Stored progress references stable IDs and the content version last seen.
- Removed content must not crash history reads.
- Renamed display text does not change IDs.

## 11. Required validation invariants

For each released verb pack:

- exactly eight unique Dutch tense records;
- exactly 12 unique English tense records;
- all IDs globally unique within the pack;
- all references resolve;
- every exercise has a deterministically evaluable answer;
- every distractor is distinct from the correct answer;
- every exercise has correct and incorrect feedback;
- every journey has five core exercises in the MVP;
- every repair rule is bounded;
- every target skill exists in the skill registry;
- every target span occurs in its story sentence;
- support translations exist for required product languages;
- reference-only forms cannot block an A1 journey.

