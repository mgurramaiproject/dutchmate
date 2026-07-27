# DutchMate Grammar Learning — Review and Implementation Plan

## Purpose

Use this document as the working brief for reviewing the existing DutchMate browser extension and building its next learning layer.

The goal is to add:

1. **Verb Gym** — focused practice for verb forms and fast retrieval.
2. **Sentence Forge** — controlled sentence construction and transformation.
3. **Grammar Minute** — the short daily session that combines both.

The implementation should make DutchMate tangibly improve a learner’s Dutch. It should not reward activity as if it were mastery, and it should not use an LLM at runtime in the initial production version.

Before changing code, inspect the repository and adapt this plan to the current architecture. Preserve working v0.4.0 behavior unless a change is explicitly required here.

---

## Product summary

DutchMate v0.4.0 already provides three useful parts of a learning loop:

- **Today** supports a daily habit and vocabulary review.
- **Lessons** provides short, practical Dutch stories.
- **Saved** connects learning to words encountered while browsing.

The missing step is active production: helping users move from recognizing a word to forming a correct Dutch sentence with it.

The intended learning loop is:

> Encounter Dutch → understand it → save it → practise it → produce it → retain it

The new grammar features should remain compact, useful in a browser popup, and resumable after the popup closes.

### Learning promise

DutchMate should help learners gain reliable control over high-value Dutch grammar patterns through short, repeated, progressively harder practice.

### Honest boundaries

- DutchMate may report progress within its own grammar curriculum.
- It must not claim that a user “is A1/A2/B1” based only on grammar exercises.
- Prefer language such as: **“6 of 8 foundation skills are secure”** or **“68% of the DutchMate A2 grammar path is secure.”**
- Completion, streaks, and repeated exposure are not evidence of mastery by themselves.

---

## Core product model

Keep these concepts separate:

| Component | Responsibility |
|---|---|
| **Curriculum** | Defines useful abilities, prerequisites, progression, and mastery evidence |
| **Verb Gym** | Trains verb forms, agreement, tense, auxiliaries, separability, and retrieval |
| **Sentence Forge** | Trains sentence construction, word order, inversion, and transformations |
| **Grammar Minute** | Selects a coherent 1–2 minute daily sequence from both practice systems |

Verb Gym and Sentence Forge are practice modes using the same curriculum and content records. They are not two independent courses.

---

## Product and pedagogical principles

1. **Organize around usable abilities, not a flat grammar catalogue.**
   A unit should be framed as something the learner can do, such as “ask a basic question” or “describe a daily routine.”

2. **Use CEFR as an approximate outcome tag.**
   CEFR primarily describes communicative ability, not a universal Dutch grammar checklist. Use ranges such as `A1`, `A1–A2`, or `A2–B1`.

3. **Use a prerequisite graph and spiral progression.**
   A grammar pattern should reappear in harder contexts rather than being taught once and marked complete.

4. **Prefer active retrieval and transformation.**
   The learner should select, build, move, or produce an answer more often than merely read an explanation.

5. **Teach through contrast.**
   For example:

   - `Jij werkt vandaag thuis.`
   - `Werk jij vandaag thuis?`
   - `Morgen werk jij thuis.`

6. **Keep feedback short and error-specific.**
   Explain the exact misconception using one rule and one corrected contrast.

7. **Include spacing and delayed proof from the start.**
   A correct answer today should return later in a new lexical context.

8. **Measure transfer, not sentence memorization.**
   Mastery requires correct use with unseen or recombined material.

9. **Use meaningful play.**
   Smooth chip movement, brief celebrations, progress, and gentle combos are welcome. Avoid lives, punishment, fake urgency, and distracting game economies.

10. **Remain deterministic and inspectable.**
    The same item and answer must produce the same judgment and feedback.

---

## Scope for the first release

Build one complete vertical slice before attempting a Pre-A1–B1 course.

### In scope

- 6–8 tightly connected foundation skills
- 20–30 high-frequency verbs
- Present tense
- Essential irregular verbs such as `zijn` and `hebben`
- A small set of modal verbs
- Subject–verb agreement
- `jij` inversion
- Yes/no questions
- Time-first inversion
- Separable verbs in main clauses
- Separable verbs after a modal
- Verb Gym
- Sentence Forge
- Grammar Minute
- Local progress, error history, and review scheduling
- Approximately 120–160 reviewed exercise instances or validated template expansions
- Deterministic validation and answer checking
- Content sources and licence metadata

### Explicitly out of scope

- Runtime LLM calls
- Free-form AI grammar evaluation
- Automatic generation from arbitrary webpages or every saved word
- Complete A1–B1 curriculum implementation
- Perfect tense, simple past, and subordinate clauses unless needed only as non-assessed previews
- Speech recognition or pronunciation scoring
- Declaring a user’s overall CEFR level
- A new top-level popup tab
- Copying the archived Valley Trail verb list without confirmed reuse rights

---

## First curriculum slice

The exact order may be adjusted after content review, but dependencies must remain explicit.

| Order | Skill | Learner outcome | Main practice |
|---:|---|---|---|
| 1 | `ik` and plural present forms | Say what I and other people do | Verb Gym |
| 2 | `jij/hij/zij` present forms | Describe another person’s action | Verb Gym |
| 3 | `jij werkt` vs. `werk jij` | Turn a statement into a yes/no question | Both |
| 4 | Questions with `zijn` and `hebben` | Ask and answer basic personal questions | Both |
| 5 | Time-first inversion | Say when something happens without breaking verb-second order | Sentence Forge |
| 6 | Modal + infinitive | Express ability, intention, and obligation | Both |
| 7 | Separable verbs in main clauses | Describe everyday routines naturally | Both |
| 8 | Separable verbs after modals | Keep the separable infinitive together after a modal | Both |

Each skill must define:

- a learner-facing can-do outcome;
- approximate CEFR range;
- prerequisites;
- target patterns;
- reviewed examples;
- known learner errors;
- applicable exercise types;
- transfer items;
- mastery requirements;
- source and review metadata.

### Example skill record

```text
Skill: Talk about a daily routine using separable verbs
CEFR range: A1–A2

Can do:
I can say when I get up, start work, and come home.

Prerequisites:
- Subject pronouns
- Present-tense agreement
- Main-clause verb-second position

Target patterns:
- Ik sta om zeven uur op.
- Morgen sta ik later op.
- Ik wil morgen later opstaan.

Common errors:
- Ik opsta om zeven uur.
- Morgen ik sta later op.
- Ik wil morgen later sta op.

Transfer evidence:
- Correctly build a new routine sentence with an unseen compatible verb.
```

---

## Required repository review

Do not start implementation until this review is complete.

### Inspect

- Repository instructions, contribution rules, and existing plans
- Manifest version and Firefox/extension architecture
- Popup entry points, routing, and the Today/Lessons/Saved tab implementation
- State management and persistence
- Existing vocabulary review and scheduling logic
- Data and content formats
- Localization and language-display support
- Test runner, linting, formatting, build, and packaging commands
- Accessibility patterns
- Popup width, height, scrolling, and close/reopen behavior
- Existing analytics or telemetry, if any
- Current uncommitted changes; preserve unrelated user work

### Produce a short review note before coding

Record:

1. Relevant architecture and files
2. Existing components or utilities that can be reused
3. Data migrations required
4. Risks or contradictions with this plan
5. Proposed file-level implementation sequence
6. Commands that will verify the work

Do not perform a large framework refactor merely to add these features. Prefer small extensions of the existing architecture.

---

## Popup integration

Preserve the existing top-level tabs: **Today**, **Lessons**, and **Saved**.

### Today

Add one compact card:

```text
Grammar Minute
2 reviews · 1 new pattern
About 2 minutes

[Start]
```

If a session is interrupted:

```text
Grammar Minute
2 of 5 completed

[Continue]
```

The daily sequence should normally contain:

1. One retrieval item from a previously learned skill
2. One contrast that introduces or reinforces a rule
3. One controlled practice item
4. One transformation
5. One transfer item using a new verb or context

Do not assemble five unrelated questions merely to reach a daily count.

### Lessons

Add an internal switch:

```text
Stories | Grammar
```

Group grammar skills by functional goals:

- Introduce yourself
- Talk about your day
- Ask questions
- Make plans
- Talk about yesterday
- Explain why

Only the first implemented group(s) need to be active. Future groups may be visible as clearly labelled upcoming content only if that is consistent with the current design.

### Saved

For the first release:

- Recognize a saved word as a verb only when it matches the curated verb lexicon.
- Show a compact `VERB` label and principal information already available.
- Offer **Practice verb** only if a compatible implemented skill and reviewed exercise content exist.
- Do not generate an exercise from an arbitrary saved item.

---

## Exercise primitives

Implement a small set of reusable, deterministic primitives.

### Verb Gym

1. **Choose the form**
   `Jij ___ vandaag thuis. (werken)`

2. **Fill one controlled blank**
   Use explicit accepted answers, not fuzzy semantic judgment.

3. **Contrast**
   `Jij werkt` versus `werk jij?`

4. **Find the form error**
   Use distractors tied to a known misconception.

5. **Change the subject**
   `Ik werk` → `Wij werken`

### Sentence Forge

1. **Build**
   Tap or arrange chunks into one natural neutral sentence.

2. **Transform**
   Change a statement into a question or move a time phrase to the front.

3. **Repair**
   Move or replace the incorrect chunk.

4. **Split**
   Place both parts of a separable verb.

5. **Recombine**
   Keep a separable infinitive together after a modal.

### Answer-design rules

- Every exercise must declare its accepted answer or accepted alternatives.
- If several Dutch word orders are grammatical but only one is the target, say: **“Build one natural neutral sentence.”**
- Do not mark a valid alternative wrong merely because it differs from the displayed model.
- Avoid open typed sentences until the project can explicitly enumerate and test valid alternatives.
- Distractors must map to meaningful error codes, not random wrong strings.

---

## Deterministic content architecture

Adapt names and file locations to the repository, but maintain separation between curriculum, lexical data, content, runtime selection, and user progress.

### Suggested domain types

```ts
type GrammarSkill = {
  id: string;
  title: string;
  cefrRange: string;
  canDo: string;
  prerequisites: string[];
  targetPatternIds: string[];
  commonErrorCodes: string[];
  exerciseSetIds: string[];
  masteryRequirements: MasteryRequirement[];
  sources: SourceReference[];
  contentVersion: number;
};

type VerbEntry = {
  id: string;
  infinitive: string;
  meanings: {
    en: string[];
    te?: string[];
  };
  stem: string;
  presentForms: Record<string, string>;
  classification: Array<
    "regular" | "strong" | "irregular" | "modal" | "separable" | "reflexive"
  >;
  separablePrefix?: string;
  compatiblePatternIds: string[];
  examples: string[];
  sources: SourceReference[];
  contentVersion: number;
};

type ExerciseDefinition = {
  id: string;
  skillId: string;
  mode: "verb-gym" | "sentence-forge";
  primitive: string;
  prompt: LocalizedText;
  content: unknown;
  acceptedAnswers: AcceptedAnswer[];
  distractors?: Distractor[];
  feedbackByErrorCode: Record<string, LocalizedText>;
  lexicalContextId: string;
  isTransferItem: boolean;
  contentVersion: number;
};

type ExerciseAttempt = {
  exerciseId: string;
  skillId: string;
  answeredAt: string;
  correct: boolean;
  errorCode?: string;
  responseTimeMs?: number;
  contentVersion: number;
};
```

Do not adopt these interfaces blindly. First check existing conventions, serialization constraints, TypeScript settings, and extension storage limits.

### Content approach

Use a hybrid of:

- manually reviewed exercise instances for linguistically sensitive cases;
- bounded templates for safe variations;
- a build-time validator that expands or checks all permitted outputs.

Templates must declare compatible subjects, verbs, time phrases, objects, word orders, and accepted alternatives. Every possible release output should be inspectable before packaging.

### Sources and licensing

- Maintain source and licence metadata in content records or a dedicated content manifest.
- The archived Valley Trail list may guide research but must not be copied without establishing reuse rights.
- OpenTaal can support spelling validation under its stated licence, but it is not a ready-made teaching curriculum.
- Prefer an original, reviewed DutchMate verb dataset.
- Arrange review by a qualified Dutch/NT2 teacher before calling the curriculum production-ready.

---

## Error-specific feedback

Represent misconceptions with stable error codes, for example:

```text
PRESENT_MISSING_T
PRESENT_WRONG_PLURAL
JIJ_INVERSION_EXTRA_T
MAIN_CLAUSE_V2_AFTER_FRONTING
SEPARABLE_PREFIX_NOT_SPLIT
SEPARABLE_INFINITIVE_WRONGLY_SPLIT
MODAL_SECOND_VERB_NOT_INFINITIVE
```

Each distractor should map to one error code and concise feedback.

Example:

```text
Chosen: Vandaag ik werk thuis.
Error: MAIN_CLAUSE_V2_AFTER_FRONTING

Feedback:
When a time phrase comes first, the finite verb stays in second position:
Vandaag werk ik thuis.
```

Store error history so later reviews can target recurring misconceptions.

---

## Progress, scheduling, and mastery

### Skill states

```text
Not started → Introduced → Practising → Retained → Secure
```

### Minimum evidence

A skill should not become **Secure** until the learner has:

- answered correctly in at least two exercise primitives;
- succeeded in at least three lexical contexts;
- succeeded across more than one session;
- answered a delayed review correctly after at least seven days;
- passed at least one transfer item not shown during initial teaching.

Tune exact thresholds using tests and later learning data, but do not weaken the distinction between completion and retention.

### Queue priority

The Grammar Minute scheduler should choose, in order:

1. Overdue items associated with weak or repeated error codes
2. Due reviews for recently introduced skills
3. Transfer items for skills approaching Retained or Secure
4. At most one new pattern when prerequisites are satisfied

Use a deterministic scheduler with explicit inputs and testable output. If randomization is used for variety, make it seedable in tests.

### Persistence

Browser popups close easily. Persist after every answer:

- active session ID;
- ordered exercise IDs;
- current position;
- attempts and error codes;
- skill state;
- review due dates;
- content versions.

Reopening the popup must resume the exact unfinished session without duplicating attempts.

Add a versioned migration for existing v0.4.0 users. Never erase Saved vocabulary or existing review progress.

---

## Content authoring and validation

Content quality is the central workload, not a finishing task.

Create validation that fails the build or content test suite for:

- missing skill prerequisites;
- cyclic prerequisites;
- unknown verb, skill, pattern, exercise, or error-code references;
- missing conjugation forms required by an exercise;
- duplicate choices;
- a correct answer duplicated among distractors;
- zero or multiple correct answers where exactly one is promised;
- identical prompt and answer combinations;
- missing feedback for a distractor’s error code;
- malformed chunk solutions;
- unsupported accepted alternatives;
- missing source/licence metadata;
- missing content versions;
- templates that can produce unreviewed or invalid combinations.

Provide a developer-readable content report listing:

- exercises per skill and primitive;
- verbs and lexical contexts per skill;
- transfer-item coverage;
- error-code coverage;
- source and review status;
- all generated sentences or a deterministic sample plus full machine-readable output.

---

## Implementation phases

### Phase 0 — Repository assessment

- Complete the required review.
- Map this product model onto the current code.
- Identify the smallest compatible architecture.
- Record open decisions and migration needs.
- Do not make broad refactors.

**Exit criterion:** a short repository-grounded implementation note exists and no unresolved issue blocks safe work.

### Phase 1 — Domain and content foundation

- Add versioned curriculum, verb, pattern, exercise, and error-code models.
- Author the first 6–8 skills and 20–30 verbs.
- Add content validators and coverage reporting.
- Add unit tests for conjugation data and accepted answers.

**Exit criterion:** all content can be validated without rendering the UI.

### Phase 2 — Progress and deterministic review engine

- Add versioned local progress storage.
- Add migration from v0.4.0.
- Implement attempt recording, skill state, due dates, queue selection, and session resume.
- Test boundary dates, repeated errors, interrupted sessions, content versions, and seeded selection.

**Exit criterion:** a complete Grammar Minute can be selected, interrupted, resumed, and finished in tests.

### Phase 3 — Verb Gym

- Implement the selected Verb Gym primitives.
- Add error-specific feedback and short rule contrasts.
- Add keyboard and screen-reader-friendly interactions.
- Integrate with the common exercise/session engine.

**Exit criterion:** present-tense and inversion practice works end to end using released content only.

### Phase 4 — Sentence Forge

- Implement accessible chunk selection/reordering.
- Support build, transform, repair, split, and recombine where required by the first skill slice.
- Ensure accepted alternatives are handled explicitly.
- Avoid drag-only interaction; provide tap/click and keyboard operation.

**Exit criterion:** all first-slice word-order outcomes can be practised without ambiguous grading.

### Phase 5 — Popup integration

- Add the Grammar Minute card to Today.
- Add `Stories | Grammar` within Lessons.
- Add supported verb recognition and Practice verb entry points within Saved.
- Restore exact in-progress state after popup closure.
- Keep the popup compact and consistent with v0.4.0.

**Exit criterion:** all three entry points use the same curriculum, exercise, and progress data.

### Phase 6 — Quality review and release readiness

- Run unit, integration, accessibility, build, and packaging checks.
- Manually test in Firefox at realistic popup dimensions.
- Review every released sentence and explanation.
- Verify storage migration with representative v0.4.0 data.
- Update user and developer documentation.
- Record known limitations and follow-up work.

**Exit criterion:** every acceptance criterion below passes and all released content has linguistic review status recorded.

---

## Testing requirements

At minimum, test:

- all verb forms used in released exercises;
- every exercise’s accepted answer(s);
- every distractor-to-error-code mapping;
- prerequisite traversal and cycle rejection;
- deterministic Grammar Minute selection;
- review due-date calculation;
- mastery transitions and prevention of premature Secure status;
- transfer-item requirements;
- popup close/reopen resume;
- storage migration from v0.4.0;
- Saved vocabulary preservation;
- content-version changes;
- keyboard completion of Sentence Forge;
- screen-reader labels and focus movement;
- narrow popup layout and long Dutch/English/Telugu strings;
- production build and Firefox extension packaging.

Prefer testing learning-domain logic without UI rendering. Add focused UI tests for interaction and integration.

---

## v0.5 acceptance criteria

The vertical slice is complete only when:

- [ ] The existing Today, Lessons, Saved, translation, vocabulary, and story behavior still works.
- [ ] No runtime LLM or network AI dependency is introduced.
- [ ] The curriculum contains 6–8 connected, prerequisite-aware skills.
- [ ] The curated lexicon contains 20–30 reviewed high-frequency verbs.
- [ ] Verb Gym and Sentence Forge share the same skill and progress model.
- [ ] Today offers a coherent Grammar Minute of about 1–2 minutes.
- [ ] Lessons exposes a Grammar path without adding a fourth top-level tab.
- [ ] Supported Saved verbs can enter compatible reviewed practice.
- [ ] All grading uses explicit deterministic accepted answers.
- [ ] Ambiguous sentences are avoided or have explicit accepted alternatives.
- [ ] Incorrect options produce error-specific feedback.
- [ ] Progress persists after every answer.
- [ ] Closing and reopening the popup resumes the exact unfinished session.
- [ ] Existing v0.4.0 user data survives migration.
- [ ] Secure status requires varied, cross-session, delayed, and transfer evidence.
- [ ] Build-time content validation passes.
- [ ] Every released sentence, explanation, and distractor has review status.
- [ ] Keyboard and screen-reader interaction is supported.
- [ ] Automated tests, production build, and Firefox packaging pass.
- [ ] Documentation explains content authoring, validation, progress logic, and limitations.

---

## Deliverables

The Codex agent should leave:

1. Repository review note
2. Updated, repository-grounded implementation plan if necessary
3. Versioned curriculum and verb content
4. Content validation and coverage report tooling
5. Deterministic exercise, scheduling, progress, and persistence logic
6. Verb Gym UI
7. Sentence Forge UI
8. Today/Lessons/Saved integration
9. Storage migration
10. Automated tests
11. Updated user-facing and developer documentation
12. Final implementation summary containing:
    - what changed;
    - important design decisions;
    - tests and build commands run;
    - content-review status;
    - limitations;
    - recommended next slice.

---

## Risks and decisions to surface early

- Natural Dutch permits multiple valid word orders; rigid grading can teach false rules.
- Curated content and pedagogical review will likely take longer than core UI code.
- A frequency list is not automatically a good teaching sequence.
- CEFR labels are approximate and must not become unsupported proficiency claims.
- Extension storage limits and current schemas may constrain attempt history.
- Popup lifecycle can corrupt or duplicate progress unless every answer is persisted atomically.
- Content changes can invalidate old exercise references unless data and progress are versioned.
- Telugu explanations may require a separate review process; do not auto-translate teaching explanations.
- Saved-word practice must remain bounded to compatible curated data.
- Engagement metrics can look good without learning transfer; delayed correctness is the more meaningful signal.

If a product decision materially changes the learning promise, data migration, privacy behavior, or current v0.4.0 UX, stop and ask the maintainer instead of silently choosing.

---

## Future curriculum direction

Do not implement this now. Use it only to ensure that the first architecture can expand cleanly.

| Approximate stage | Functional goal | Later grammar |
|---|---|---|
| Pre-A1–A1 | Introduce yourself | Pronouns, `zijn`, `hebben`, simple clauses |
| A1 | Describe everyday actions | Regular present and common irregular verbs |
| A1 | Ask and answer questions | Inversion and question words |
| A1–A2 | Express needs and plans | Modals + infinitive |
| A1–A2 | Say what happened | Negation and perfect tense |
| A2 | Describe past experiences | Perfect vs. simple past, strong verbs |
| A2 | Explain reasons and conditions | Subordinate-clause word order |
| A2 | Tell a short connected story | Inversion, conjunctions, sequencing |
| A2–B1 | Express opinions precisely | Relative clauses, `er`, prepositional verbs |
| B1 | Express complex relationships | `te/om te`, passive, multi-verb clusters |

The recommended next slice after v0.5 is the perfect tense only after the initial learning loop, review engine, and content workflow have been validated.

---

## Reference foundations

- Taalunie ERK overview: <https://erk-nederlands.taalunie.org/over-het-erk/>
- CEFR Companion Volume: <https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4>
- OpenTaal word list and licence: <https://github.com/OpenTaal/opentaal-wordlist>
- Onze Taal on `vind je` / `vindt u`: <https://onzetaal.nl/taalloket/vindt-u>
- Spacing in second-language learning: <https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479>
