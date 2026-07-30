# Feature 013: Contrast Repair tickets

**Code name:** `contrast-repair`

**Feature code:** `013-contrast-repair`

**Branch:** `feature-013-contrast-repair`

**Parent issue:** [#107 — Feature 013: Contrast Repair](https://github.com/mgurramaiproject/dutchmate/issues/107)

**Source plan:** [013-contrast-repair-plan.md](./013-contrast-repair-plan.md)

**Source specification:** [013-contrast-repair-spec.md](./013-contrast-repair-spec.md)

**Status:** T01–T04 implemented and qualified locally; feature PR ready for delivery

## Delivery rules

- Implement one frontier ticket at a time in a fresh implementation session.
- Keep the feature on `feature-013-contrast-repair` unless the delivery
  workflow establishes a ticket-specific branch.
- Do not start a blocked ticket early.
- Update each checklist with direct evidence as its matching issue is
  implemented; a copied checklist is not proof of completion.
- Preserve the four existing grammar pattern IDs and content versions,
  existing lesson/progress/storage semantics, mixed Daily Five behavior, and
  the no-raw-answer privacy boundary.
- Do not add runtime AI, arbitrary webpage diagnosis, typing, free-form
  grading, a second scheduler, a new top-level destination, fixed grammar
  quotas, or formal CEFR claims.
- Run focused checks during development, then the relevant full suite,
  typecheck, browser builds/package checks, documentation checks, and manual
  evidence named by the ticket before handoff.
- Commit every intentional repository change. Finish each ticket handoff with
  a clean worktree, tracker reconciliation when published, and one concrete
  next action naming the relevant skill.

## Dependency map

```text
T01 / #108  ──>  T02 / #109  ──>  T03 / #110  ──>  T04 / #111
```

T04 is the current frontier. T01 establishes the reviewed pilot and voluntary
lesson path. T02 adds the immediate controlled-error offer. T03 adds bounded
delayed selection through Daily Five. T04 is the final release and human
qualification gate.

## T01 — Make the pilot Contrast Pack usable from the A1 appointment lesson

**GitHub:** [#108](https://github.com/mgurramaiproject/dutchmate/issues/108)

**Blocked by:** None — can start immediately.

**What to build:** Make the reviewed time-first main-clause inversion Contrast
Pack usable from the existing A1 appointment lesson companion. A learner can
see the contrast, understand the scoped explanation, complete the finite
click-only choose, repair, and fresh rebuild tasks, and receive the existing
canonical grammar feedback without entering text or leaving the focused lesson
flow.

- [x] The pilot pack is versioned as `contrast.main_clause_inversion` and
  contains the reviewed subject-first example, time-first example, and
  explicitly marked incorrect example.
- [x] The pack uses `MAIN_CLAUSE_NO_INVERSION` only for an authored,
  controlled distractor and keeps `a0-yes-no-inversion` unchanged.
- [x] Every learner-visible example, accepted answer, alternative, distractor,
  explanation, feedback message, fresh repair item, and review field is
  enumerated and passes the release validator.
- [x] Draft, unreviewed, ambiguous, malformed, duplicate, and incorrectly
  pooled content cannot enter the runtime bundle.
- [x] The existing A1 appointment lesson opens the pack through its current
  focused practice route; no new tab, destination, queue, or grammar selector
  appears.
- [x] The learner can complete the supported sequence with click, tap, or
  keyboard controls, visible focus, announced feedback, and readable
  narrow-popup containment.
- [x] The canonical grammar result path records at most one first scored
  result; Reveal, Skip, Retry, duplicate, and stale-result behavior retain
  existing semantics.
- [x] The implementation makes no provider request and stores no raw answer,
  page text, response timing, or full attempt history.
- [x] Focused content, lesson, grammar-learning, popup, background, privacy,
  and compatibility tests pass.

## T02 — Offer immediate repair after a controlled misconception

**GitHub:** [#109](https://github.com/mgurramaiproject/dutchmate/issues/109)

**Blocked by:** [T01 / #108](https://github.com/mgurramaiproject/dutchmate/issues/108)

**What to build:** After the pilot pack is available in the lesson flow,
connect its controlled misconception to an immediate, optional repair offer.
When the learner selects the authored subject-before-finite-verb distractor
after a first-position time phrase, DutchMate records the bounded
misconception and returns the normal correction plus an explicit action to
practise this exact contrast. Accepting opens the pack; declining leaves the
learner in the current flow.

- [x] The shared misconception registry defines
  `MAIN_CLAUSE_NO_INVERSION` with narrow scope, learner description,
  allowlisted source, and associated pack.
- [x] Only the pilot's controlled source action can emit the code; arbitrary
  webpage text, free writing, and unsupported distractors never emit it.
- [x] A first clear error may return an immediate repair offer with concise,
  scoped feedback and no automatic navigation.
- [x] The offer has explicit Accept and Dismiss behavior; Accept starts the
  exact pack and Dismiss preserves the current lesson or review flow.
- [x] The existing canonical result boundary updates evidence once and
  protects against duplicate or stale submissions.
- [x] The typed background boundary rejects unknown codes, pack IDs,
  exercises, content versions, outcomes, and malformed revision values.
- [x] The offer and repair state remain bounded local evidence and do not store
  raw answers, page text, response timing, or a general attempt history.
- [x] Focused content, learning-record, background, popup, accessibility, and
  provider-isolation tests pass.

### T02 evidence

Verified locally on `feature-013-contrast-repair`: the registry allowlists
`MAIN_CLAUSE_NO_INVERSION` to the two authored pilot source exercises; the
learning record clamps and persists only bounded misconception counts; the
typed background contract rejects unknown codes, packs, exercises, versions,
outcomes, and revisions; and the popup test covers normal feedback, explicit
Accept, explicit Dismiss, and no automatic navigation. The full suite passed
with 104 files and 658 tests, plus typecheck, Chrome and Firefox builds,
release packaging, and `git diff --check`. T03 threshold scheduling and T04
manual qualification remain out of scope.

## T03 — Schedule delayed repair in Daily Five

**GitHub:** [#110](https://github.com/mgurramaiproject/dutchmate/issues/110)

**Blocked by:** [T02 / #109](https://github.com/mgurramaiproject/dutchmate/issues/109)

**What to build:** Turn repeated controlled misconception evidence into one
delayed Contrast Repair task inside the existing mixed Daily Five. After two
matching `MAIN_CLAUSE_NO_INVERSION` codes within six relevant controlled
attempts and outside the three-day cooldown, the learner receives a different
reviewed repair item without losing vocabulary protection or entering a second
queue. Completing that delayed repair clears the pending trigger.

- [x] Bounded per-code state supports the six-relevant-attempt window,
  two-occurrence threshold, three-day cooldown, pending trigger, recent repair
  diversity, and successful delayed clearing.
- [x] Attempts outside the relevant controlled scope do not contribute to the
  threshold, and one code cannot dominate practice during cooldown.
- [x] Daily Five can select at most one eligible contrast repair task while
  preserving due-first behavior, vocabulary protection, duplicate-target
  protection, completion accounting, and continuation behavior.
- [x] The Daily Five task references pack identity, content version, and
  exercise identity without copying explanations or sentence text into
  learner state.
- [x] A delayed task uses a different reviewed repair item; if no safe fresh
  item exists, DutchMate omits the delayed offer.
- [x] Reveal and Skip do not count as successful repair evidence; a successful
  delayed repair clears the pending trigger.
- [x] Older local records and backups load with empty repair state, while
  export/import and merge clamp and preserve only approved bounded state.
- [x] Duplicate, stale, unavailable, and malformed Daily Five repair results
  cannot mutate the record twice.
- [x] Focused learning-record, Daily Five, background, popup, persistence,
  privacy, and provider-isolation tests pass.

### T03 evidence

Verified locally on `feature-013-contrast-repair`: the bounded contrast repair
state keeps at most six relevant misconception codes and eight recent repair
exercise IDs, applies the two-match threshold and three-day cooldown, and
selects at most one fresh reviewed repair task through the existing mixed Daily
Five snapshot. Contrast tasks carry only pack, content version, and exercise
identity; the popup uses the bundled exercise at render time. Reveal, Skip,
duplicate, stale, and unavailable results are covered, and successful delayed
repair clears the pending trigger. Older records default to empty repair state,
and backup merge clamps the bounded fields. Focused checks passed with 111
tests; the full suite passed with 104 files and 664 tests, plus typecheck,
Chrome and Firefox builds, release packaging, and `git diff --check`. Manual
browser qualification remains part of T04. The issue remains open and no
feature PR is being opened until T04 is implemented and qualified.

## T04 — Qualify the Contrast Repair pilot for release

**GitHub:** [#111](https://github.com/mgurramaiproject/dutchmate/issues/111)

**Blocked by:** [T03 / #110](https://github.com/mgurramaiproject/dutchmate/issues/110)

**What to build:** Qualify the complete Contrast Repair pilot for a
trustworthy implementation handoff. The finished pilot must be linguistically
reviewed, usable through the existing popup surfaces, deterministic and
provider-free, compatible with existing learning records, and supported by
the repository's automated and release evidence.

**Qualification record:** [013-contrast-repair-validation.md](./013-contrast-repair-validation.md)

- [x] A second fluent Dutch reviewer with grammar-teaching competence confirms
  the pilot examples, explanations, accepted answers, distractors, feedback,
  scope limits, and fresh repair items; reviewer and date are recorded.
- [x] Manual evidence covers the A1 lesson companion, immediate offer and
  dismissal, delayed Daily Five repair, keyboard-only operation, visible
  focus, feedback announcement, narrow-popup containment, Retry, Reveal, Skip,
  Exit, offline practice, and no unexpected provider request.
- [x] Existing lesson identity and completion, four grammar pattern IDs,
  content versions, grammar progress, ordinary review, Daily Five vocabulary
  protection, and export/import compatibility remain intact.
- [x] The full relevant test suite, typecheck, Chrome and Firefox builds or
  package/release checks, documentation consistency checks, and
  `git diff --check` pass.
- [x] The checked-in ticket checklist records direct verification evidence and
  known limitations without claiming formal CEFR mastery or uncued
  production.
- [ ] GitHub issue state and the Delivery project are reconciled when the
  implementation and review evidence are complete.

### T01 evidence

Verified locally on `feature-013-contrast-repair`: `contrast.test.ts` covers
review gating plus duplicate/unknown-diagnosis rejection; the popup test covers
the A1 appointment route, all three pilot exercises, keyboard-ready controls,
announced feedback, retry-safe first-check behavior, and lesson continuation;
learning-record and background tests cover persistence, export/import, stale
revisions, and duplicate results. `corepack pnpm test` passed with 102 files and
651 tests; typecheck, Chrome and Firefox builds, release packaging, and
`git diff --check` also passed. Manual browser qualification was completed as
part of T04; issue and PR reconciliation follows the final delivery step.

### T04 engineering evidence

The qualification record is checked in at
[013-contrast-repair-validation.md](./013-contrast-repair-validation.md).
Repository evidence is complete on the T03 artifact: the full suite passed
with 104 test files and 664 tests; typecheck passed; Chrome and Firefox builds,
release packaging, release verification, documentation consistency tests, and
`git diff --check` passed. The contrast content validator, bounded learning
record, mixed Daily Five, typed background boundary, popup route, persistence,
privacy, and compatibility checks are covered without adding provider calls or
raw-answer storage.

The independent Dutch reviewer record and interactive Chrome/Firefox browser
gate are recorded in the qualification document. Browser versions and
operating-system details were not supplied in chat and remain an evidence
limitation. The combined Feature 013 PR is ready for delivery.

## Implementation handoff

T04 engineering and manual qualification are recorded in
[013-contrast-repair-validation.md](./013-contrast-repair-validation.md).
Open the single combined Feature 013 PR and reconcile issues #107–#111 after
merge. Do not run code review for this handoff.
