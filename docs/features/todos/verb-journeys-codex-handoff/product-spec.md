# Product Specification — Verb Journeys

## 1. Product statement

DutchMate Verb Journeys are staged, verb-centred learning paths. Each journey introduces a useful first-person verb meaning in a short natural context, helps the learner notice the form, places it in a complete Dutch Verb Map, and tests it with deterministic click-only exercises.

The complete eight-form Dutch system is always available as a reference. A separate English comparison explains how all 12 English tense patterns map to natural Dutch. Progress is tracked per verb, form and skill.

## 2. User problem

Learners who think in English often:

- memorise isolated conjugations without knowing when to use them;
- assume the 12 English tense patterns map one-to-one to Dutch;
- confuse VTT and OVT because both can translate as English simple past;
- recognise a participle such as *gewerkt* but cannot construct *ik heb gewerkt*;
- lack a structured route from an encountered word to active use.

Verb Journeys should create this loop:

> See in context → notice the change → place it in the map → retrieve it → contrast it → review it later.

## 3. Information architecture

Do not add a new top-level popup tab.

### Lessons

Add **Verb Journeys** alongside existing lesson categories using the repository’s current category/navigation pattern.

The existing Continue Learning area should remain a single universal resume action. It resumes the most recently meaningful unfinished activity, whether that is a Practical Story, Verb Journey or Grammar Pack.

### Today

Add a compact Grammar Minute/review entry using the existing card pattern. It shows:

- activity/verb;
- skill or form;
- approximate duration or question count;
- one action button.

Do not show an unfinished exercise sentence on the Today card.

### Saved

If the current data model can reliably resolve a saved form to a lemma, offer **View verb** or **Practise verb**. This is optional for the first slice if lemma resolution does not already exist. Do not build speculative NLP into the MVP.

## 4. Verb destination

Each verb has one canonical destination containing:

- lemma and translations already supported by DutchMate;
- CEFR level and verb characteristics;
- mastery summary;
- staged journeys;
- entry to the eight-form Verb Map;
- entry to the 12-form English comparison;
- saved examples, if supported by existing data.

The verb is not represented as a single `completed: true` lesson.

## 5. Journey model

For **werken**, show complete coverage through staged learning:

| Journey | Dutch forms | Priority |
|---|---|---|
| What I normally do | OTT | Core A1 |
| What I completed | VTT | Core A1–A2 |
| Past routines and stories | OVT | Core A2 |
| What had already happened | VVT | A2 |
| Plans, predictions and possibilities | OTTT + OVTT | A2–B1/reference |
| Completed future and unreal past | VTTT + VVTT | Advanced/reference |

Do not manufacture eight equal stories merely to match eight forms. Coverage is complete, but teaching emphasis is unequal.

Each core journey follows:

1. Goal and target meaning.
2. Short first-person context/story.
3. One pattern-noticing interaction.
4. The canonical Verb Map with the current form highlighted.
5. Five click-only core questions.
6. One or two deterministic repair questions for detected weaknesses.
7. Meaningful skill summary and scheduled review.

## 6. Eight-form Dutch Verb Map

Use a stable two-column system rather than a decorative linear timeline.

| Viewpoint | Onvoltooid | Voltooid |
|---|---|---|
| Present | OTT — *Ik werk thuis.* | VTT — *Ik heb thuis gewerkt.* |
| Past | OVT — *Ik werkte thuis.* | VVT — *Ik had thuis gewerkt.* |
| Future | OTTT — *Ik zal thuis werken.* | VTTT — *Ik zal thuis gewerkt hebben.* |
| Future-from-past / conditional | OVTT — *Ik zou thuis werken.* | VVTT — *Ik zou thuis gewerkt hebben.* |

Every cell includes:

- abbreviation and full Dutch name;
- canonical Dutch sentence;
- natural English meaning;
- short usage meaning;
- status: mastered, learning, needs practice, later or reference;
- optional everyday Dutch alternative;
- learning priority.

There is one map per verb. Journeys reuse it and highlight their target form.

## 7. Twelve-form English comparison

Show all 12 English tense patterns, grouped into Present, Past and Future sections. Each record contains:

- English tense name;
- English example;
- meaning-preserving Dutch;
- common everyday Dutch;
- actual Dutch form or construction;
- mismatch/usage note.

The screen teaches mapping, not equivalence. It must explicitly demonstrate that several English patterns can map to the same Dutch form.

Examples:

| English pattern | English | Common Dutch | Dutch analysis |
|---|---|---|---|
| Present simple | I work at home. | Ik werk thuis. | OTT |
| Present continuous | I am working at home now. | Ik werk nu thuis. | OTT |
| Present perfect continuous | I have been working for two hours. | Ik werk al twee uur. | OTT |
| Past simple | I worked at home yesterday. | Ik heb gisteren thuis gewerkt. | Often VTT in conversation |
| Future simple | I will work tomorrow. | Morgen werk ik. | OTT with future marker |

The full authored dataset, not these abbreviated examples, is required before release.

## 8. Exercise system

All learner answers are click/tap-only.

Required core exercise families:

1. Meaning recognition.
2. Tap-to-fill construction.
3. Contextual English-to-Dutch choice.
4. Sentence ordering or repair.
5. Form contrast or Verb Map placement.

Permitted interactions:

- select one or multiple options;
- tap tokens into ordered slots;
- reorder tokens using buttons and accessible controls;
- match pairs;
- place a sentence in a labelled map cell.

Do not require typing, drag-only interaction or runtime generative evaluation.

English-to-Dutch prompts should ask for the **most natural Dutch sentence in the stated situation**, not claim an exact tense conversion.

## 9. Deterministic remediation

Every exercise maps to one or more skills. On an error:

- show an authored explanation;
- record the skill attempt;
- select one or two authored repair questions for that skill;
- avoid an unbounded adaptive loop.

Suggested rule for MVP:

- five base questions;
- maximum two repair questions;
- no more than seven questions in one journey practice run.

## 10. Progress

Track:

> verb + form/skill + exercise family

Do not track only:

> verb completed

Minimum skill examples:

- `recognise-usage`
- `construct-verb-phrase`
- `choose-natural-translation`
- `verb-second-word-order`
- `contrast-vtt-ovt`
- `identify-dutch-form`

Progress states may be derived from attempts:

- not started;
- learning;
- needs practice;
- demonstrated;
- review due.

Use the project’s existing persistence layer. Schema changes must be versioned/migrated and must not erase existing learner data.

## 11. Accessibility and extension constraints

- Keyboard operation must be possible for all exercises.
- Visible focus styles must use existing design tokens.
- Do not use colour as the only mastery/status indicator.
- Respect reduced-motion preferences.
- Fit the existing popup/extension viewport and existing scrolling convention.
- Avoid remote code, runtime AI and unnecessary permissions.
- Content must be bundled or loaded through the extension’s existing safe content mechanism.

## 12. Non-goals

The feature does not:

- redesign DutchMate;
- replace Today, Lessons, Saved, Options or current heatmaps;
- introduce a new top-level tab;
- implement every planned DutchMate learning feature;
- add runtime AI;
- grade free text;
- build a general Dutch conjugation engine unless repository analysis proves one already exists and is trustworthy;
- require mastery of advanced forms from A1 learners;
- add gamification such as coins, lives or meaningless celebrations.

## 13. Success signals

Instrument only if DutchMate already has a privacy-compatible analytics pattern. Otherwise retain local metrics.

Useful signals:

- journey started/completed;
- average core questions per completion;
- repair-question rate by skill;
- review completion;
- learner can distinguish VTT from OVT after review;
- no regression in existing popup performance or navigation.

