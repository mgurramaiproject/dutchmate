# Specification 012: Grammar Content Packs

**Code name:** `grammar-packs`

**Status:** proposed; implementation requires explicit approval after this
specification and its ticket tree are reviewed.

**Source plan:** [012-grammar-packs-plan.md](./012-grammar-packs-plan.md)

## Problem statement

DutchMate already ships four reviewed A0 grammar patterns and a deterministic
click-only exercise model. The risk is not a missing grammar destination. The
risk is that content, feedback, selection, accessibility, and release checks
drift as the patterns are reused across Lessons and Daily Five.

Feature 012 makes that existing slice trustworthy and reviewable without adding
another product surface, scheduler, answer model, or progress system.

## Solution

Treat the four existing A0 pattern IDs as one reviewed grammar content pack.
Audit their current runtime contracts, close only proven content or validation
gaps, and qualify the same exercises through the existing Lessons, Today, and
mixed Daily Five flows.

The learner sees a practical goal and a bounded click-only task. A first scored
result uses the existing grammar evidence path once. Retry, Reveal, and Skip
retain their current behavior. Selection follows the existing due, delayed
evidence, and recent-exercise rules.

`Verb Gym`, `Sentence Forge`, and `Grammar Minute` remain internal names for
authoring or packaging. They are not destinations, tabs, queues, schedulers, or
learner progress records.

## User stories

1. As a beginner, I want to practise a useful Dutch pattern from the existing
   lesson flow, so that I do not need to understand a grammar curriculum.
2. As a learner, I want one clear controlled decision per exercise, so that the
   activity feels like practice rather than a completion click.
3. As a learner, I want to revise my choice before Check where supported, so
   that an accidental first selection is not treated as final.
4. As a learner, I want wrong feedback to name the relevant form or order rule,
   so that I understand the correction.
5. As a learner, I want a valid alternative to be accepted when the exercise
   author has reviewed it, so that I am not marked wrong for a defensible answer.
6. As a learner, I want grammar practice to appear alongside vocabulary in the
   existing Daily Five, so that one habit remains enough.
7. As a learner, I want grammar not to crowd out vocabulary or duplicate a task
   already selected today, so that the daily mix stays useful.
8. As a learner, I want grammar progress to remain honest and bounded, so that
   a few clicks are not presented as fluent production or certification.
9. As a keyboard user, I want every exercise action to be operable and visible,
   so that pointer input is not required.
10. As a learner, I want the feature to work offline with bundled reviewed
    content, so that practice does not depend on a provider request.
11. As a maintainer, I want every released exercise to have explicit review and
    provenance metadata, so that content can be audited before shipping.
12. As a maintainer, I want the existing learning record and lesson contracts
    preserved, so that the pack cannot silently fork scheduling or mastery.

## Functional requirements

### FR-1 — Stable pattern identity

The pack MUST retain these pattern IDs and their existing content-version and
storage compatibility contracts:

- `a0-zijn-present`;
- `a0-hebben-present`;
- `a0-regular-present`;
- `a0-yes-no-inversion`.

The pack MUST NOT introduce a new pattern ID, taxonomy, or A1/A2 content.

### FR-2 — Finite deterministic exercises

Every released exercise MUST declare:

- one existing pattern ID and primitive;
- one concise prompt and bounded context;
- finite choices or explicitly enumerated tokens;
- all accepted answers;
- all released distractors and their misconception codes;
- exact positive and correction feedback;
- evidence eligibility;
- review metadata and provenance.

Runtime code MUST select from bundled authored content. It MUST NOT generate
sentences, distractors, explanations, translations, or grading decisions.

### FR-3 — Controlled interaction

The first release MUST remain click-, tap-, or keyboard-only. It MUST NOT add a
text input, free-form Dutch answer, typed cloze, fuzzy normalisation, or generic
parser.

An exercise with multiple valid Dutch answers MUST enumerate those answers or
use a prompt with one defensible target. An unresolvable ambiguity is a content
failure and must not ship.

### FR-4 — Canonical evidence

The first scored result MUST pass through the existing grammar learning-result
contract and increment the existing evidence revision once. Duplicate, stale,
retry, Reveal, and Skip actions MUST retain the current non-duplicating
semantics.

Feature 012 MUST NOT add sentence-specific mastery, grammar percentage, a new
due date model, a second scheduler, raw answers, full attempt history, or
response-time storage.

### FR-5 — Existing surface integration

Exercises MUST remain reachable through the existing `Lessons`, `Today`, and
mixed `Daily Five` surfaces. The feature MUST NOT add a grammar tab, a separate
library, a new top-level navigation item, or a learner-facing Grammar Minute
session.

Today MUST retain one calm primary daily action. Daily Five MUST retain its
existing due-first, bounded grammar, vocabulary-protecting behavior. Grammar
content MUST NOT create a fixed feature mix or duplicate the same learning
target in a snapshot.

### FR-6 — Honest feedback

Correct feedback MUST name the supported form or controlled rule. Wrong
feedback MUST identify one known misconception and a reviewed correction.
Feedback MUST state its scope and MUST NOT claim independent production,
formal CEFR certification, or complete coverage of Dutch grammar.

### FR-7 — Accessibility and layout

Every visible action MUST use a semantic, keyboard-operable control with an
accessible name. Focus MUST remain visible, feedback MUST be announced through
the existing live-region pattern, and the popup MUST remain contained at its
supported narrow width without horizontal clipping.

Reduced-motion behavior and existing focused-flow navigation MUST remain intact.

### FR-8 — Content governance

Draft or unapproved content MUST be excluded from runtime bundles. The release
validator MUST inspect every exercise, accepted alternative, distractor,
feedback string, source, provenance, author, reviewer, review state, and
version. Public content requires explicit second-review metadata according to
the existing grammar content review contract.

Offline operation MUST use the bundled reviewed content. No practice-time
translation or runtime AI request is allowed.

## State and result contract

| Learner action | Visible behavior | Learning evidence |
| --- | --- | --- |
| Change selection before first Check | Current choice changes | None |
| First correct Check | Scoped positive feedback | One canonical success result |
| First incorrect Check | Misconception-coded correction | One canonical incorrect result, per existing semantics |
| Retry after Check | Learner may practise again | No duplicate first-check evidence |
| Reveal | Existing answer/feedback presentation | No success evidence |
| Skip | Existing skip behavior | No success evidence |
| Duplicate or stale submission | Safe no-op | No second mutation |

The exact implementation remains owned by the existing grammar learning and
background message contracts. This table defines the invariant, not a new API.

## Content pack contract

The pack validator MUST prove:

1. all four pattern IDs are present and resolvable;
2. every exercise references an existing pattern and supported primitive;
3. choices are finite and accepted answers are available;
4. accepted answers are not also released as distractors;
5. every distractor has a known misconception and scoped correction;
6. deterministic selection returns stable results for the same input;
7. ambiguous exercises fail validation rather than silently ship;
8. reviewed content metadata is complete;
9. draft or unreviewed entries cannot enter the runtime bundle; and
10. content version and migration checks remain compatible with local records.

## Compatibility requirements

Regression checks MUST preserve:

- all published lesson identities, versions, and completion records;
- existing A0/A1/A2 lesson filters and navigation;
- local vocabulary, mastery, normal translation, Saved, settings, heatmaps,
  export/import, and ordinary review;
- the mixed Daily Five snapshot and its current grammar cap;
- Encounter Coaching and webpage lookup privacy boundaries;
- Chrome and Firefox generated artifacts;
- offline behavior and provider request counts during practice.

## Acceptance gate

Feature 012 is ready for implementation approval only when the plan, this
specification, and the ticket tree agree on:

- the four-pattern A0 boundary;
- existing-surface-only delivery;
- click-only deterministic interaction;
- canonical evidence and scheduling preservation;
- reviewable authored content;
- no runtime AI, new queue, new schema, or new destination; and
- focused, full, packaging, accessibility, privacy, and manual evidence gates.

## Stop conditions

Implementation must stop and return for product direction if any requirement
needs a new learner surface, grading model, scheduler, storage contract,
unreviewed curriculum, runtime provider request, or change to grammar evidence
semantics.
