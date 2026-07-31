# Engineering Implementation Plan

## Operating principles

1. Inspect before designing architecture.
2. Preserve the current UI and design system.
3. Deliver one thin vertical slice before broad content.
4. Keep runtime behaviour deterministic.
5. Separate content, learning logic, progress and presentation.
6. Make every phase independently testable and commit-sized.

## Phase 0 — Repository discovery

Codex must inspect and record:

- framework, language, build tooling and browser-extension manifest version;
- popup/options/content-script entry points;
- existing Today, Lessons, Saved and heatmap implementations;
- router/navigation/state-management pattern;
- design tokens, primitives and reusable components;
- content/lesson schemas and loaders;
- local persistence and migration strategy;
- existing translation/localisation conventions;
- test commands and CI checks;
- accessibility patterns;
- extension size/performance constraints;
- repository-specific instructions and feature-document numbering.

Create a short discovery note in the repository’s established feature-doc location. Do not invent a parallel docs convention if one already exists.

### Discovery gate

Before implementation, produce:

- proposed files/modules to touch;
- existing components to reuse;
- persistence migration proposal;
- unclear decisions or risks;
- confirmation that no unrelated UI replacement is planned.

Ask the user only about decisions that materially affect behaviour or scope.

## Phase 1 — Architecture and feature boundary

Define boundaries that match the repository:

```text
Authored content
    ↓ validated loader
Journey/domain selectors
    ↓
Existing state/persistence
    ↓
Existing UI components/screens
```

Recommended conceptual modules; names and locations must follow the repo:

- verb content types/schema;
- content pack loader and validator;
- journey selection/progression service;
- deterministic exercise evaluator;
- progress repository/selectors;
- UI routes/views integrated into Lessons;
- optional feature flag.

Avoid a large generic “learning engine” upfront. Extract abstractions only after the werken slice proves them.

### Architecture gate

Write or update a brief ADR covering:

- authored-data versus generated-data decision;
- progress granularity;
- content versioning;
- feature flag strategy;
- how existing design primitives will be reused.

## Phase 2 — Schema and validation

Implement types/schemas for:

- verb metadata;
- eight Dutch-form records;
- 12 English-comparison records;
- journeys and story lines;
- exercise definitions;
- feedback and repair mappings;
- content-pack version;
- progress attempts and derived mastery.

Validation must fail during development/build for:

- duplicate IDs;
- dangling references;
- missing required Dutch forms;
- missing English comparison patterns;
- invalid tense/priority enums;
- exercises without correct answers or feedback;
- repair links to missing exercises;
- answer tokens that cannot produce the expected sequence;
- unknown skill IDs;
- a journey requiring a reference-only form at an inappropriate level.

Prefer the project’s existing validation library. Do not add a dependency if a small typed validator or existing tool suffices.

## Phase 3 — Authored werken content

Create a versioned content pack for **werken**:

- all eight canonical Dutch-form records;
- all 12 English comparison records;
- OTT, VTT and OVT story journeys;
- at least five core exercises per journey;
- maximum two repair exercises per targeted weakness;
- authored explanations and distractor rationales;
- CEFR and teaching-priority metadata.

Content needs human language/grammar review before release. Automated structural validation is necessary but not sufficient.

## Phase 4 — Domain logic

Implement pure, deterministic logic for:

- resolving a journey and ordered story steps;
- evaluating select, multi-select, token-order and match answers;
- mapping attempts to skills;
- selecting repair questions using stable authored mappings;
- capping a run at the configured number of questions;
- deriving mastery/status;
- selecting the next unfinished journey;
- generating a Today review set from due/weak skills.

Use seeded or stable selection where variation is desired so tests are reproducible.

No LLM, network call or heuristic language parsing may decide correctness.

## Phase 5 — Progress persistence and migration

Add progress records through the existing storage abstraction.

Requirements:

- preserve all existing data;
- version new records;
- support idempotent migration;
- handle unknown/deleted content IDs safely;
- support content-pack version changes;
- avoid marking a form mastered after recognition alone;
- allow a learner to repeat a completed journey.

Suggested data flow:

```text
Answer submitted
  → deterministic evaluation
  → attempt stored
  → mastery derived/updated
  → next base or repair exercise selected
  → Today review eligibility updated
```

## Phase 6 — UI integration

Use the existing design system and components.

### Lessons

- Add Verb Journeys in the existing lesson-browse pattern.
- Keep one universal Continue action.
- Show Werken and progress using existing card/list primitives.

### Werken overview

- Show journey list and mastery.
- Link to the Verb Map and English comparison.
- Display advanced/reference material without making it a beginner requirement.

### Story and notice

- Reuse current lesson/story presentation if it exists.
- Highlight targets accessibly.
- Keep explanations concise.

### Eight-form Verb Map

- Use the repository’s responsive table/card primitives.
- Preserve the 4×2 conceptual matrix at wide widths.
- At narrow popup width, stack each viewpoint as an onvoltooid/voltooid pair; do not destroy the pairing.
- Provide abbreviation, full name, example, meaning and status.
- Make details expandable if necessary.

### Twelve-form English comparison

- Group Present, Past and Future into expandable sections.
- Show four records per group.
- Clearly label common Dutch versus meaning-preserving Dutch.
- Keep mismatch notes accessible without forcing all detail into one dense viewport.

### Exercises

- No typing.
- No drag-only controls.
- Use existing buttons/chips/cards and focus behaviour.
- Announce correctness and updated prompt state accessibly.

### Completion and Today

- Summarise demonstrated and weak skills.
- Schedule or expose review.
- Keep the Today card compact; do not show an exercise before entry.

## Phase 7 — Tests

Implement tests described in `acceptance-and-test-plan.md`:

- schema/fixture validation;
- evaluator unit tests;
- mastery/progress tests;
- persistence migration tests;
- integration tests for the full werken path;
- UI/accessibility tests;
- regression tests for existing tabs, heatmaps and Options;
- build/package checks.

## Phase 8 — Visual and behavioural QA

Compare the implementation against:

1. existing DutchMate UI/design system — visual source of truth;
2. feature mockup — intended behaviour and information architecture;
3. product spec — acceptance source of truth.

Check at the actual popup viewport and any supported expanded/options view.

Capture before/after screenshots of existing Today, Lessons, Saved and Options. Any unrelated visual change is a regression unless explicitly approved.

## Phase 9 — Expansion

Only after werken is accepted:

1. refine schema based on real implementation friction;
2. add the remaining MVP verbs:
   - zijn
   - hebben
   - gaan
   - doen
   - wonen
   - komen
   - willen
3. tailor irregular/auxiliary verbs rather than forcing the werken template;
4. add Saved-to-verb linking only if lemma/form resolution is reliable;
5. add more journeys/forms based on learning priority.

## Suggested commit sequence

Use repository conventions, but keep commits conceptually narrow:

1. `docs: specify verb journeys vertical slice`
2. `feat: add verb journey content schema and validation`
3. `content: add validated werken content pack`
4. `feat: add deterministic exercise and mastery logic`
5. `feat: persist verb skill progress`
6. `feat: integrate werken journey into lessons`
7. `feat: add dutch verb map and english comparison`
8. `feat: add today verb review`
9. `test: cover verb journey integration and regressions`

Do not commit generated build output unless the repo already does.

## Rollback

Prefer a feature flag or isolated entry-point guard for the initial slice. Disabling the feature must:

- remove new entry points;
- leave existing screens unchanged;
- retain stored progress safely for later re-enable;
- require no destructive migration rollback.

## Explicit stop conditions

Pause and ask the user if:

- the repo has no Lessons concept and adding one would reshape navigation;
- implementing universal Continue requires changing established behaviour for other content;
- a storage migration could risk existing learner data;
- the design system lacks primitives needed for a usable dense map and a new component family is proposed;
- the mockup conflicts materially with shipped product behaviour;
- lemma resolution from Saved would require new NLP or external services.

