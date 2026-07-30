# Plan 014: Lesson Practice Loop

**Code name:** `lesson-practice-loop`

**Feature code:** `014-lesson-practice-loop`

**Branch:** `014-lesson-practice-loop`

**Status:** Grilled plan; specification published as [GitHub issue #113](https://github.com/mgurramaiproject/dutchmate/issues/113); tickets published as [GitHub issues #114–#121](https://github.com/mgurramaiproject/dutchmate/issues/114); implementation is not approved.

**Architecture decision:** [ADR 0007](../adr/0007-014-lesson-practice-uses-shared-envelope-and-evidence.md)

**Specification:** [014-lesson-practice-loop-spec.md](./014-lesson-practice-loop-spec.md), published as [GitHub issue #113](https://github.com/mgurramaiproject/dutchmate/issues/113) with `ready-for-agent`.

**Tickets:** [014-lesson-practice-loop-tickets.md](./014-lesson-practice-loop-tickets.md), published as GitHub issues [#114](https://github.com/mgurramaiproject/dutchmate/issues/114) through [#121](https://github.com/mgurramaiproject/dutchmate/issues/121), each with `ready-for-agent`.

## Product goal

Give a DutchMate learner more durable learning value per minute by making
practice a normal part of every lesson rather than a separate destination.
The learner should understand one practical outcome, make meaningful
controlled decisions, retrieve the idea with less support, and apply it in a
safe Dutch context before leaving the lesson.

Feature 014 covers all fifteen currently bundled lessons—four A0, ten A1, and
one A2—and establishes the
content and validation contract that future lessons must satisfy before
release. It does not claim formal CEFR attainment, independent written
production, or permanent retention.

## Resolved product decisions

- Every lesson receives a lesson practice envelope. The envelope's exercise
  types and quantity follow the lesson outcome; every primitive is not forced
  into every lesson.
- The default lesson remains three to five minutes. Practice is interleaved
  with teaching and replaces passive explanation where it improves the
  outcome.
- Each lesson has one primary practical outcome and limited supporting
  outcomes recorded in a lesson outcome map.
- Coverage is behavioral—understand, guided action, reduced-support retrieval,
  and safe application—not a fixed number of exercises.
- A0, A1, and A2 use one architecture with a practice support gradient:
  tighter controls at A0, controlled transformations and contrasts at A1,
  and more varied recombination at A2.
- Practice updates existing grammar-pattern and learning-item evidence. Lesson
  completion remains its existing record.
- The core lesson sequence is stable. Existing evidence selects optional
  follow-up practice but does not branch or silently skip the lesson.
- Every lesson includes guaranteed in-lesson transfer. Eligible Saved-context,
  Sentence Trainer, and Encounter Coaching paths are optional extensions.
- The shared deterministic exercise contract is reused across Lessons, Daily
  Five, Contrast Repair, Saved-context practice, and Encounter Coaching.
- Practice remains click-, tap-, or keyboard-only, provider-free, and
  inspectable. Runtime AI, arbitrary parsing, typed answers, and free-form
  grading remain out of scope.
- Automated validation and independent Dutch review are release gates for
  every learner-visible practice item.
- Extension updates preserve local learning history. Compatible content is
  additive; incompatible content requires explicit migration; failed
  migration is atomic and leaves the prior record readable.
- Verb Timeline is deferred and recorded as priority 2 in the canonical
  parking lot.

## Current-catalog coverage

The specification must map each of the fifteen published lessons to:

- one primary practical outcome;
- supporting learning items and grammar patterns, where applicable;
- the smallest behavior-complete practice envelope;
- the guaranteed in-lesson transfer action;
- optional eligible links to Saved-context, Sentence Trainer, Contrast
  Repair, or Encounter Coaching;
- accepted answers, distractors, misconception codes, scoped feedback, and
  independent review metadata;
- content-version and history-preservation expectations.

The mapping should identify lessons that need an additive grammar companion,
contrast pack, contextual reconstruction, or no new primitive because the
existing lesson interaction already supplies the required behavior. It must
not rewrite lesson identity or completion history.

## Future-authoring standard

Future lessons must ship with an outcome map and behavior coverage evidence.
Their authored practice content must be deterministic, versioned, fully
enumerated for validation, independently reviewed in Dutch, and compatible
with the shared result and local-record contracts. A new lesson may use fewer
or different primitives when its practical outcome justifies that choice; it
may not omit reduced-support application merely because an external context
is unavailable.

## Proposed testing seams

The highest existing seams are:

1. The lesson/content catalog validator and its authored content report. This
   should reject incomplete outcome maps, unsafe exercise definitions,
   duplicate identifiers, missing accepted answers, unsupported distractors,
   missing feedback, and absent review metadata before runtime use.
2. The existing typed background learning boundary and local learning-record
   store. This should be the single behavior seam for accepted results,
   evidence revision, idempotency, content versions, migration, export/import,
   and clear-data behavior.
3. The existing lesson session and popup renderer. This should verify the
   interleaved stage flow, stable lesson completion semantics, keyboard and
   narrow-popup behavior, guaranteed transfer fallback, and safe optional
   contextual entry points.
4. Existing Daily Five, Contrast Repair, Saved-context, and Encounter
   Coaching tests should prove that shared exercise results retain their
   current scheduling, privacy, and vocabulary-protection behavior.

The preferred implementation seam is the existing typed background contract;
new lower-level seams should be introduced only if the current boundary cannot
represent the agreed behavior.

## Delivery phases to refine into tickets

### Phase 0 — Compatibility and catalog audit

Inventory all fifteen lessons, current lesson stages, grammar companions,
learning-item practice, Daily Five, Contrast Repair, Saved-context, Encounter
Coaching, content validators, migration logic, and existing tests. Produce a
lesson-by-lesson gap map before changing runtime behavior.

### Phase 1 — Establish the shared authoring and validation contract

Represent outcome maps, behavior coverage, guaranteed transfer, review
metadata, and content-version compatibility in the highest existing content
seam. Add deterministic validation and a readable report without creating a
learner-facing destination or new progress record.

### Phase 2 — Deliver a representative end-to-end tracer

Complete one independently reviewable lesson path through authored content,
shared result handling, popup interaction, existing evidence, and upgrade-safe
storage. Select a representative lesson and level only after the audit
identifies the smallest high-value tracer.

### Phase 3 — Backfill the current A0-A2 catalog

Apply the approved standard to all fifteen published lessons in bounded
vertical slices. Each slice keeps the existing lesson identity and completion
record, adds only outcome-justified practice, and records direct content and
manual review evidence.

### Phase 4 — Qualify future-authoring and release safety

Verify that a future lesson cannot bypass the outcome, coverage, validation,
review, migration, accessibility, and transfer requirements. Run the relevant
full suite, typecheck, Chrome/Firefox builds or package checks, documentation
checks, and manual learner-flow evidence.

## Explicitly out of scope

- learner-facing Verb Gym, Sentence Forge, Grammar Minute, or grammar tab;
- Verb Timeline or any second progress visualization;
- a second queue, scheduler, lesson-specific due state, or lesson mastery;
- runtime AI, provider requests during practice, arbitrary webpage parsing,
  automatic page scanning, or generated content/grading;
- typed answers, free-form writing, speech grading, or formal CEFR claims;
- fixed exercise, verb, lesson, or daily grammar quotas;
- branching or silently personalized lesson scripts;
- automatic chunk discovery, social practice, audio/listening, or a Telugu
  learning mode;
- deleting or re-keying existing local learning history.

## Approval gates

1. Approve use of `to-spec` after confirming the proposed seams above.
2. Review and approve the resulting specification and its GitHub parent issue.
3. Approve use of `to-tickets` after the specification is accepted.
4. Review and approve the proposed vertical ticket breakdown and blocking
   edges before publication.
5. Implement only after the approved ticket frontier is explicit.
