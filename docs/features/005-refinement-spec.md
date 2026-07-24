# 005-refinement: Learning reliability and popup refinement

**Feature code:** `005-refinement`

**Branch:** `feature-005-refinement`

**Artifact convention:** every feature-specific artifact uses the `005-refinement-` prefix. The branch uses hyphens because this repository already has a `feature` ref, which prevents a `feature/005-refinement` branch name.

## Problem Statement

DutchMate's learning loop has the right core model—local learning items, contextual review, Daily Five, mini-lessons, and a learning-rhythm heatmap—but several visible gaps make it feel less trustworthy than the model promises. Review answers need to communicate the Dutch item, its helper meanings, pronunciation support, and context without becoming a tall card. Learners also need their saved learning record and activity history to survive normal extension lifecycle events and appear reliably after restart.

The current popup needs a clearer way to revisit Saved vocabulary, practise the whole saved collection deliberately, orient the learner while a focused lesson or review is open, and filter the compact lesson library. Page context must be retained whenever a webpage learning item is saved, because context is necessary for an honest contextual review card. These improvements must preserve DutchMate's Dutch-learning scope, local-first privacy posture, canonical learning record, restrained black/white/orange popup design, and existing Daily Five semantics.

## Solution

Deliver one cohesive refinement of the local learning loop:

- enrich review answers with Dutch, English and Telugu meanings, simple Telugu phonetics, and the saved Dutch context with its English and Telugu translations captured by an explicit save-time translation request;
- generate simple Telugu phonetics locally from Telugu helper text, without a Telugu-learning mode or translation-provider call;
- preserve the local learning record on extension upgrade and re-enable, with visible Saved-tab Export and Import as the recovery path after a true uninstall;
- add `Quiz Saved`, a shuffled all-items focused practice pass that records mastery and activity evidence without completing or replacing Daily Five;
- add functional Lesson filters for readiness status and CEFR level, with an in-progress row showing its current lesson stage;
- make the activity ledger durable and correctly rendered after restart and import, counting completed reviews, new saved items, and completed lessons;
- keep the originating popup tab visible and selected, but locked, during a focused lesson, Daily Five, or Saved Quiz;
- make the local-only, no-account boundary visible in the primary Today and Saved views;
- save original page context at the shared webpage-capture boundary and preserve it through canonical merges and backup round-trips.

## User Stories

1. As a Dutch learner, I want a compact review answer that keeps the Dutch learning item visually primary, so that I can focus on the language I am learning.
2. As a Dutch learner, I want English and Telugu meanings shown after reveal, so that I can confirm meaning in either helper language.
3. As a learner who cannot read Telugu script, I want a simple English-letter phonetic guide beside Telugu helper text, so that I can sound it out.
4. As a learner, I want phonetics written as plain letters with syllable breaks and no scholarly symbols, so that the guide feels approachable.
5. As a learner, I want the saved Dutch context displayed with its English and Telugu translations after reveal, so that I can understand the sense in which I saved the item.
6. As a learner with an older context-less item, I want DutchMate to say context is unavailable rather than invent a sentence, so that my record remains trustworthy.
7. As a learner, I want every new webpage save to retain its original context sentence, so that later review remains contextual.
8. As a learner, I want a repeated save of the same item to enrich rather than erase its existing contexts, so that useful history is retained.
9. As a learner, I want upgrades and re-enables to preserve my local learning record, so that routine extension maintenance does not lose vocabulary or progress.
10. As a learner, I want Export and Import directly reachable from Saved, so that local recovery is discoverable where my learning items are.
11. As a learner who has truly uninstalled the extension, I want to restore a previously exported record through Import, so that recovery does not require an account or cloud sync.
12. As a learner, I want importing to merge learning items, contexts, mastery, lessons, and activity rather than overwrite newer local learning, so that recovery is safe.
13. As a learner, I want `Quiz Saved` to test the entire saved collection in a shuffled order, so that I can deliberately revisit all vocabulary.
14. As a learner, I want Quiz Saved to use the same reveal, Again, and Got it interaction as other practice, so that I do not need to learn a second practice mechanic.
15. As a learner, I want Quiz Saved results to update real mastery and activity evidence, so that meaningful practice is not discarded.
16. As a learner, I want Quiz Saved not to complete or replace Daily Five, so that the daily goal remains honest and predictable.
17. As a learner, I want to exit a Saved Quiz explicitly, so that an all-items session never traps me in the popup.
18. As a learner, I want focused practice to retain the originating active tab as an orientation marker, so that I know where I am in the popup.
19. As a learner, I want that visible tab marker locked during focused work, so that I do not accidentally abandon a lesson or review through tab navigation.
20. As a keyboard user, I want focused flows to retain a clear Exit action and logical focus order, so that locked tabs do not block navigation.
21. As a learner, I want functional Lesson readiness chips for `All`, `Ready`, `Continue`, and `Completed`, so that I can quickly find an appropriate lesson state.
22. As a learner, I want CEFR level filters such as A0, A1, and A2, so that I can choose a suitable difficulty.
23. As a learner, I want an in-progress lesson row to state its stage, such as `Continue · Notice`, so that I can resume without global stage filters.
24. As a learner, I want a durable heatmap of reviews, new saves, and completed lessons, so that I can see real learning activity after reopening the extension.
25. As a learner, I want each heatmap day to explain its review, save, and lesson counts, so that a colored cell has a clear meaning.
26. As a learner, I do not want opening or abandoning a lesson to create activity, so that the heatmap represents completed learning actions.
27. As a learner, I want Quiz Saved reviews included in the activity ledger, so that the heatmap reflects all completed practice.
28. As a privacy-conscious learner, I want all refinement data to remain in the local learning record and backup, so that the feature adds no account, cloud profile, or background telemetry.
29. As a Chrome or Firefox user, I want the same Saved, Quiz, Lesson, and activity behavior, so that my learning record is portable across DutchMate's supported browsers.
30. As a learner, I want to see that my learning stays local and needs no account, so that the privacy boundary is clear before I save vocabulary.

## Implementation Decisions

- `005-refinement` extends the canonical local learning record rather than adding a parallel vocabulary, quiz, history, or backup store.
- The typed background learning contract remains the primary persistence boundary. Popup, capture, and Options actions use that contract instead of writing extension storage directly.
- Review presentation uses a compact answer hierarchy: Dutch anchor; English and Telugu meanings; Telugu simple phonetics; saved Dutch context; then its English and Telugu translations. New webpage saves explicitly request and retain context translations; older source data is displayed as unavailable and never fabricated or backfilled.
- Simple Telugu phonetics are deterministic, local transliteration of Telugu helper text using plain English letters and syllable breaks. This is an accessibility helper, not IAST, IPA, speech feedback, or a Telugu-learning mode.
- Webpage capture passes context and explicit save-time English/Telugu context translations through the shared create-or-merge path. Canonical merges preserve existing contexts and add a valid new context subject to the existing cap.
- The local learning record remains authoritative for saved items, mastery, lesson progress, Daily Five state, and the activity ledger. Normal upgrades and re-enables must not clear or replace it. Browser uninstall semantics are outside extension control, so explicit Export and Import are the recovery contract.
- The primary Today and Saved views show a concise local-only, no-account note so the privacy boundary is visible without requiring a settings visit.
- Saved exposes Import and Export as compact secondary controls. Import validates the existing versioned backup formats and uses the established merge behavior; it never replaces the record wholesale.
- Saved becomes the visible label for the learner-controlled collection. `Lesson library` remains the term for bundled curated lessons.
- Quiz Saved is a focused practice session over a shuffled snapshot of all saved learning items. It reuses the existing reveal and binary result interaction, submits canonical practice evidence, increments review activity, and never changes Daily Five completion state.
- The practice-session model records its origin (`today` or `saved`) so focused rendering can keep the appropriate primary tab selected and locked. Exit remains explicit; no hidden resume queue is created for an unfinished quiz.
- Lesson filters are functional state: one readiness filter (`All`, `Ready`, `Continue`, or `Completed`) and an optional CEFR-level filter. Current lesson stage remains row metadata, not a filter taxonomy.
- The activity ledger is updated only by completed review evidence, creation of a new learning item, and completion of a lesson. It persists in the canonical record, survives restart, and merges conservatively on import.
- The popup preserves the DutchMate black, white, and orange system, 44px interactive targets, visible focus, and horizontal containment. Chips are controls, not decorative status clutter.
- The feature keeps its scope Dutch learning with English and Telugu helper languages. It does not introduce a learning-language switch, Telugu course, cloud sync, or new translation-provider behavior.

## Testing Decisions

- The typed background learning contract is the primary integration seam. Tests verify record migration, non-destructive read/write paths, context capture and merge, import/export round-trips, activity-ledger merge and restart behavior, and Quiz Saved evidence without changing Daily Five completion.
- Pure popup view and session tests cover compact answer states, missing context, phonetic visibility, source-tab selection and locking, Quiz Saved shuffling/exit behavior, and readiness/CEFR-level Lesson filters.
- Existing capture-boundary tests cover context extraction and create-or-merge requests. Add regression cases for a valid original sentence reaching the canonical record and surviving a repeated save.
- Existing learning-rhythm tests cover per-day review, save, and lesson counts. Extend them for Quiz Saved reviews, persisted reload, and import merges without historical loss.
- Existing backup tests cover current and legacy backup versions, malformed files, contexts, lesson progress, and rhythm. Extend them to prove feature-added fields round-trip and Import remains additive.
- Rendered popup checks cover roles, labels, tab selection and locked interaction during focused practice, keyboard exit, visible focus, compact control labels, saved-context highlighting, local-only copy, narrow width, and no horizontal scroll.
- Manual Chrome and Firefox checks cover update/re-enable preservation with fixture data, browser restart and heatmap recall, Saved Import/Export interaction, focused tab orientation, review-card density, Lesson filters, and keyboard navigation.
- Full verification includes focused tests, typecheck, the full suite, Chrome and Firefox builds, release verification, and whitespace checks.

## T06 verification status (2026-07-24)

The automated gate passed against implementation commit `ba80866`: 92 test files / 532 tests, typecheck, Chrome and Firefox builds, release packaging, and whitespace verification. The required interactive browser pass remains blocked in this environment: disposable Chrome 149 registered the unpacked service worker but its popup target returned `ERR_FILE_NOT_FOUND` with content-verifier errors, and Firefox 152 has no available automation driver. No browser result is claimed; a manual tester must load both generated builds and complete the lifecycle, accessibility, and popup-geometry checklist in `docs/release/manual-testing.md`.

## Firefox feedback follow-up status (2026-07-24)

The popup follow-up adds persistent Today routes for lesson learning and Saved review, replaces pathway chips with readiness plus CEFR-level filters, opens the native browser Save As chooser for Saved Export, highlights each saved Dutch term in its stored context, makes activity totals visually consistent while explaining incomplete legacy history, shows the local-only/no-account boundary in primary views, and makes Telugu phonetics discoverable during answer reveal. Saved now explains how to add another item, and Lesson filters use compact controls. Import continues to use the native JSON file chooser. The focused popup/session checks, full 92-file / 533-test suite, typecheck, Chrome and Firefox builds, release packaging, and whitespace verification pass. Interactive browser lifecycle evidence remains the only outstanding T06 gate.

## Out of Scope

- A Dutch-to-Telugu learning mode, language switcher, Telugu curriculum, audio, speech recognition, pronunciation scoring, text-to-speech, or IPA/academic transliteration.
- Cloud sync, accounts, browser-sync conflict resolution, hidden backups, or recovery after uninstall without a learner-provided export.
- AI-generated context, translation backfill for older items, example sentences, or extra translation-provider calls for phonetics. The explicit save-time context translation request is in scope.
- Typed answers, spelling tests, quiz scores, points, streaks, achievements, leaderboards, or a second scheduling system.
- Arbitrary sentence learning items, full browsing history, raw URLs, or background learning telemetry.
- A lesson search system, global lesson-stage filtering, new lesson content, or changes to the curated starter-library curriculum.

## Further Notes

### Glossary decisions

The feature defines and uses **Telugu phonetic helper**, **Simple Telugu phonetics**, **Context translations**, **Saved Quiz**, **Focused practice flow**, **Lesson filter**, and **Activity ledger** in `CONTEXT.md`.

### Proposed implementation order

1. Stabilize canonical record lifecycle, context capture, activity-ledger persistence, and backup coverage.
2. Add Telugu phonetics and compact contextual review-answer data/presentation.
3. Add Saved Import/Export controls and Quiz Saved using the existing learning contract.
4. Add Lesson filters and focused-tab orientation behavior.
5. Run cross-browser popup, upgrade/re-enable, restart, and import verification.
