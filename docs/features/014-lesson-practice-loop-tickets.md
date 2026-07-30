# Feature 014: Lesson Practice Loop tickets

**Code name:** `lesson-practice-loop`

**Feature code:** `014-lesson-practice-loop`

**Branch:** `014-lesson-practice-loop`

**Parent issue:** [#113 — Feature 014: Lesson Practice Loop](https://github.com/mgurramaiproject/dutchmate/issues/113)

**Status:** Published as GitHub issues [#114](https://github.com/mgurramaiproject/dutchmate/issues/114) through [#121](https://github.com/mgurramaiproject/dutchmate/issues/121), each labeled `ready-for-agent`.

**Source plan:** [014-lesson-practice-loop-plan.md](./014-lesson-practice-loop-plan.md)

**Source specification:** [014-lesson-practice-loop-spec.md](./014-lesson-practice-loop-spec.md)

## Dependency map

```text
T01 / #114 ──┬──> T02 / #115 ──┐
             ├──> T03 / #116 ──┤
             ├──> T04 / #117 ──┤
             ├──> T05 / #118 ──┤──> T08 / #121
             ├──> T06 / #119 ──┤
             └──> T07 / #120 ──┘
```

T01 is the only shared prerequisite. T02–T07 are independent catalog slices
after T01 and may be delivered in any order. T08 is the final full-catalog and
future-authoring qualification gate and waits for every backfill slice.

## T01 — Establish the shared lesson-practice contract and A0 tracer

**GitHub:** [#114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**Blocked by:** None — can start immediately.

**What to build:** Give one representative A0 learner a complete lesson-
practice envelope inside the existing lesson flow. The lesson teaches one
practical outcome, interleaves guided action and reduced-support retrieval,
provides guaranteed in-lesson transfer, and records results through existing
evidence and local-history contracts. Establish the shared authored-content and
validation contract for later slices.

- [x] One representative A0 lesson has a reviewed outcome map covering
  understand, guided action, reduced-support retrieval, and guaranteed
  in-lesson transfer.
- [x] The shared deterministic exercise contract routes results through the
  existing typed learning boundary and existing grammar or learning-item
  evidence owner.
- [x] Lesson completion, stage behavior, Daily Five semantics, and Saved
  behavior remain compatible.
- [x] Validation rejects missing coverage, unstable identifiers, unsupported
  answers, unsafe distractors, missing feedback, missing review metadata, and
  incompatible versions before runtime use.
- [x] Compatible extension updates preserve local history; failed migration
  leaves the prior record readable.
- [x] Focused content, learning-record, background, popup, migration,
  accessibility, and provider-isolation tests pass.

## T02 — Backfill the remaining A0 lessons

**GitHub:** [#115](https://github.com/mgurramaiproject/dutchmate/issues/115)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill the remaining three A0 lessons with the shared
lesson-practice envelope. Each remains a stable practical story, selects only
outcome-relevant primitives, and gives every learner safe in-lesson transfer.

- [x] The three remaining A0 lessons have reviewed outcome maps and
  behavior-complete practice coverage.
- [x] A0 practice uses recognition, choosing, ordering, and tightly guided
  controlled application without typed answers.
- [x] Each lesson includes reduced-support retrieval and guaranteed transfer
  without Saved or webpage discovery.
- [x] Existing pattern and learning-item evidence remain the progress owners.
- [x] Identity, completion, versions, Daily Five, export/import, and clear-data
  behavior remain intact.
- [x] Automated validation, independent Dutch review, and focused integration
  checks pass.

## T03 — Backfill A1 conversation and café lessons

**GitHub:** [#116](https://github.com/mgurramaiproject/dutchmate/issues/116)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill `Kunt u dat herhalen?`, `Ik wil graag bestellen`,
and `Kan ik met pin betalen?` with complete A1 lesson-integrated practice.

- [x] All three lessons have reviewed outcome maps and behavior-complete
  practice envelopes.
- [x] A1 practice uses less support and more varied controlled contexts than
  the A0 slice.
- [x] Each lesson includes reduced-support retrieval and guaranteed transfer.
- [x] Existing evidence remains the sole progress owner; no new queue or
  lesson mastery is added.
- [x] Content, feedback, review metadata, migration, accessibility, and
  provider-free behavior pass release checks.

## T04 — Backfill A1 transport lessons

**GitHub:** [#117](https://github.com/mgurramaiproject/dutchmate/issues/117)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill `Waar moet ik overstappen?` and `Mijn trein is
vertraagd` with outcome-aligned practice grounded in reviewed transport
contexts.

- [x] Both lessons have reviewed outcome maps and behavior-complete envelopes.
- [x] Practice uses reduced support, varied contexts, and controlled
  recombination appropriate to the outcomes.
- [x] Each lesson includes guaranteed in-lesson transfer.
- [x] Results update only existing pattern or learning-item evidence.
- [x] Validation, independent Dutch review, persistence, accessibility,
  popup, and provider-isolation checks pass.

## T05 — Backfill A1 appointment and healthcare lessons

**GitHub:** [#118](https://github.com/mgurramaiproject/dutchmate/issues/118)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill `Een afspraak maken` and `Ik heb last van…` with
complete A1 practice. Preserve the existing approved Contrast Repair companion
where its controlled misconception contract makes it useful; ordinary lesson
practice remains complete without it.

- [x] Both lessons have reviewed outcome maps and behavior-complete envelopes.
- [x] The appointment lesson retains its existing contrast identity and shared
  result semantics.
- [x] Healthcare practice does not infer errors from arbitrary text.
- [x] Each lesson includes reduced-support retrieval and guaranteed transfer.
- [x] Grammar, learning-item, contrast, Daily Five, completion, export/import,
  migration, accessibility, and provider-isolation checks pass.

## T06 — Backfill A1 home, work, and study lessons

**GitHub:** [#119](https://github.com/mgurramaiproject/dutchmate/issues/119)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill `Er is iets kapot`, `Ik ben beschikbaar op…`, and
`Wat moet ik meenemen?` with concise everyday practice and safe in-lesson
transfer.

- [x] All three lessons have reviewed outcome maps and behavior-complete
  envelopes.
- [x] Practice uses the A1 support gradient without unrelated primitives or
  fixed exercise counts.
- [x] Each lesson includes reduced-support retrieval and guaranteed transfer.
- [x] Results update existing evidence through the shared contract only.
- [x] Validation, independent Dutch review, identity, completion, Daily Five,
  export/import, upgrade, accessibility, and provider-isolation checks pass.

## T07 — Backfill the A2 official-life lesson

**GitHub:** [#120](https://github.com/mgurramaiproject/dutchmate/issues/120)

**Blocked by:** [T01 / #114](https://github.com/mgurramaiproject/dutchmate/issues/114)

**What to build:** Backfill `Wat staat er in deze brief?` with reduced-support
A2 recombination across the reviewed letter-help context and a practical
transfer action without typed or free-form grading.

- [x] The lesson has a reviewed outcome map and behavior-complete A2 envelope.
- [x] Practice uses reduced support, varied reviewed contexts, and controlled
  recombination appropriate to A2.
- [x] The lesson includes guaranteed in-lesson transfer.
- [x] Results update existing evidence through the shared contract only.
- [x] Validation, independent Dutch review, completion, history, accessibility,
  persistence, and provider-free checks pass.

## T08 — Qualify the full catalog and future-authoring gate

**GitHub:** [#121](https://github.com/mgurramaiproject/dutchmate/issues/121)

**Blocked by:** T02 / #115, T03 / #116, T04 / #117, T05 / #118, T06 / #119,
and T07 / #120.

**What to build:** Qualify the complete 15-lesson catalog and enforce the
future-authoring gate. All four A0, ten A1, and one A2 lessons must meet the
shared standard and preserve local history across extension updates.

- [x] All 15 lessons have outcome maps, behavior coverage, guaranteed transfer,
  stable identifiers, and content-version behavior.
- [x] All learner-visible content passes automated validation and independent
  Dutch review with provenance metadata.
- [x] Future-authoring validation rejects incomplete or unreviewed practice.
- [x] Persistence and backup checks prove compatible updates preserve learning
  items, lesson progress, pattern evidence, Daily Five state, rhythm, and
  bounded contrast evidence.
- [x] No new destination, queue, scheduler, lesson mastery, Verb Timeline,
  runtime AI, provider request, or free-form grading path exists.
- [x] Full relevant tests, typecheck, browser builds/packages, documentation,
  manual keyboard/popup, offline, and provider-isolation evidence pass.
