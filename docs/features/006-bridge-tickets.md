# Tickets: 006-bridge cross-language capture

Tracer-bullet implementation tickets for [006-bridge-spec.md](./006-bridge-spec.md) and parent issue [#72](https://github.com/mgurramaiproject/dutchmate/issues/72). Work the frontier: T01 can start immediately; T02 and T03 become available after T01; T04 follows all behavior slices; T05 is the delivery gate.

## [#73 — 006-bridge T01: Preserve source-aware contexts and migration compatibility](https://github.com/mgurramaiproject/dutchmate/issues/73)

**What to build:** Make the local learning record preserve source-aware page contexts and remain compatible with existing DutchMate data. This is the storage contract that later selection, hover, and Saved UI slices rely on.

**Blocked by:** None — can start immediately.

- [x] A learning context can retain optional source-language provenance without changing the Dutch learning-language key.
- [x] Context validity can follow the selected source form rather than requiring Dutch text.
- [x] Contexts merge by normalized text plus source language, retain partial English/Telugu helpers, fill only missing helpers, and retain at most three recent contexts.
- [x] Legacy contexts without provenance remain valid and are never retroactively relabeled.
- [x] Encounters can persist bounded original context plus provenance without requesting helper translations.
- [x] Learning-backup version 2 imports and exports remain compatible with optional new fields.
- [x] Focused learning-record, migration, merge, encounter, and backup tests pass.

**Current T01 state:** Complete on `feature-006-bridge`. Evidence: focused learning-record/background tests (27 tests), full suite (92 files / 538 tests), typecheck, Chrome build, Firefox build, and `git diff --check` all pass. PR #78 is open for review and links issue #73.

## [#74 — 006-bridge T02: Save English and Telugu selections into Dutch learning items](https://github.com/mgurramaiproject/dutchmate/issues/74)

**What to build:** Let a learner deliberately select an English or Telugu single word and save it into the canonical Dutch learning record. The selection path resolves source language, requests Dutch even in one-target mode, retains exact source context when safe, exposes Save only for a safe canonical Dutch word, and merges repeated captures into one item.

**Blocked by:** [#73 — T01](https://github.com/mgurramaiproject/dutchmate/issues/73).

- [x] Explicit source settings and automatic source resolution follow the approved precedence.
- [x] Automatic source detection remains active when target count is one.
- [x] Deliberate English/Telugu selections always obtain Dutch as the required canonical target.
- [x] Unsafe, ambiguous, multi-word, or unresolved-source results remain translatable but do not expose Save.
- [x] Cross-language Save requires the popup Save action and does not use Dutch selection auto-save.
- [x] Exact selected-occurrence context is retained when safe; uncertain context never blocks the word save.
- [x] English/Telugu contexts survive without containing Dutch, preserve provenance, and request only missing helper translations.
- [x] Partial helper failure preserves the word and successful fields; later captures fill only missing fields.
- [x] Repeated captures merge into one Dutch item without duplicate contexts.
- [x] Focused selection, source-resolution, target-request, Save, partial-failure, and merge tests pass.

**Current T02 state:** Complete on `feature-006-bridge`. Evidence: focused selection/source/save/helper tests (50 tests), full suite (92 files / 547 tests), typecheck, Chrome build, Firefox build, and `git diff --check` all pass. PR #78 is open for review and links issue #74.

## [#75 — 006-bridge T03: Recognize Dutch, English, and Telugu forms during hover](https://github.com/mgurramaiproject/dutchmate/issues/75)

**What to build:** Make hover translation and Seen-before behavior source-aware for Dutch, English, and Telugu forms. The popup avoids source self-translation, keeps one-target fallbacks useful, shows a cue only for one confident Saved-item match, and persists only lightweight encounter context.

**Blocked by:** [#73 — T01](https://github.com/mgurramaiproject/dutchmate/issues/73).

- [x] Automatic and explicit source-language behavior matches the approved resolution contract.
- [x] No hover target equals the source language; one-target fallbacks use Dutch for English/Telugu and English for Dutch.
- [x] Telugu hover renders useful Dutch and English results in multi-target mode.
- [x] Successful popup targets remain visible when optional targets fail; failed targets read Unavailable.
- [x] Dutch, English, and Telugu forms can produce Seen before when exactly one Saved item matches.
- [x] Seen before does not require page context and remains truthful when encounter persistence fails.
- [x] Ambiguous helper-form matches do not show Seen before.
- [x] Encounter persistence stores only bounded original context plus provenance and does not request helper translations.
- [x] Focused hover, target fallback, cross-language matching, ambiguity, partial-result, and encounter-failure tests pass.

**Current T03 state:** Complete on `feature-006-bridge`. Evidence: focused hover/Seen-before/encounter tests (47 tests), full suite (92 files / 557 tests), typecheck, Chrome build, Firefox build, and `git diff --check` all pass. PR #78 is open for review and links issue #75.

## [#76 — 006-bridge T04: Present provenance-aware contexts in popup and Saved](https://github.com/mgurramaiproject/dutchmate/issues/76)

**What to build:** Present completed cross-language behavior clearly in the translation popup, Saved tab, and review surfaces. Learners see original context language, helper translations, unavailable states, and up to three recent contexts without regressing existing Dutch review presentation.

**Blocked by:** [#73 — T01](https://github.com/mgurramaiproject/dutchmate/issues/73), [#74 — T02](https://github.com/mgurramaiproject/dutchmate/issues/74), and [#75 — T03](https://github.com/mgurramaiproject/dutchmate/issues/75).

- [x] Popup target rows render successful translations and label failed optional targets Unavailable.
- [x] Popup and Saved surfaces avoid source self-translation and preserve the approved Save/Seen-before states.
- [x] Saved/review labels distinguish Original context · Dutch/English/Telugu from English translation and Telugu translation.
- [x] Legacy contexts without provenance read Original context · Language not detected.
- [x] Missing helper fields read Unavailable.
- [x] Saved presents up to three recent contexts newest-first with source-aware helper rendering.
- [x] Existing context highlighting, Telugu phonetics, Dutch review, mission, privacy, and no-account UI behavior remains intact.
- [x] Focused tooltip, Saved-shelf, review, and regression tests pass.

**Current T04 state:** Complete on `feature-006-bridge`. Evidence: focused popup/Saved/tooltip tests (45 tests), full suite (92 files / 559 tests), typecheck, Chrome build, Firefox build, and `git diff --check` all pass. PR #78 is open for review and links issue #76.

## [#77 — 006-bridge T05: Verify and reconcile the 006-bridge delivery](https://github.com/mgurramaiproject/dutchmate/issues/77)

**What to build:** Complete the 006-bridge delivery gate after the implementation slices land on `feature-006-bridge`. Record the checked-in checklist, run the full automated and packaging gates, complete Chrome and Firefox manual validation, and reconcile GitHub and Delivery state.

**Blocked by:** [#73 — T01](https://github.com/mgurramaiproject/dutchmate/issues/73), [#74 — T02](https://github.com/mgurramaiproject/dutchmate/issues/74), [#75 — T03](https://github.com/mgurramaiproject/dutchmate/issues/75), and [#76 — T04](https://github.com/mgurramaiproject/dutchmate/issues/76).

- [x] T01, T02, T03, and T04 acceptance checklists are complete with direct evidence.
- [x] Focused tests, typecheck, full test suite, Chrome and Firefox builds, release verification, and whitespace checks pass.
- [x] Chrome and Firefox manual checks cover Dutch, English, Telugu selection Save, exact context behavior, Telugu hover, no self-translation, Seen before, partial targets, Saved labels, three contexts, and legacy/unavailable states.
- [x] The checked-in 006-bridge ticket checklist records the evidence and completion state.
- [x] GitHub issue states, labels, PR linkage, and Delivery fields are reconciled according to the repository workflow.
- [x] The feature branch has a clean worktree and a focused delivery commit.

**Current T05 state:** Complete on `feature-006-bridge`. Automated and packaging gates pass: full suite (92 files / 559 tests), typecheck, Chrome and Firefox builds, `verify:release`, and `git diff --check`. On 2026-07-25, the user confirmed the current Chrome 149.0.7827.114 and Firefox 152.0.6 builds pass the complete manual T05 browser checklist. GitHub issue #77 is closed and its Delivery item is `Done`; PR #78 is open for review.
