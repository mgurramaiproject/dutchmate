# Tickets: 005-refinement

Tracer-bullet delivery plan for [005-refinement-spec.md](./005-refinement-spec.md) and GitHub parent [#64](https://github.com/mgurramaiproject/dutchmate/issues/64). Work the frontier: any ticket whose blockers are complete.

## [#65](https://github.com/mgurramaiproject/dutchmate/issues/65) — T01 Preserve contextual learning history

**What to build:** A learner who explicitly saves Dutch from a webpage retains the original context sentence plus its English and Telugu translations, and retains saved vocabulary, progress, and activity history through updates, restarts, and additive import.

**Blocked by:** None — can start immediately.

- [x] A new webpage save explicitly captures and stores the original Dutch context and its English/Telugu translations.
- [x] Canonical merge, backup export/import, and upgrade migration retain valid contexts and their translations without overwriting newer local learning.
- [x] The activity ledger persists completed reviews, new saves, and completed lessons across restart and import; abandoned lessons remain uncounted.
- [x] Focused contract, migration, backup, and activity-ledger regression checks pass.

## [#66](https://github.com/mgurramaiproject/dutchmate/issues/66) — T02 Reveal contextual answers with Telugu phonetics

**What to build:** A learner can reveal a compact contextual review answer with Dutch primary, English and Telugu helpers, simple local Telugu phonetics, and real stored context translations; older incomplete items remain honest about what is unavailable.

**Blocked by:** [#65 — T01 Preserve contextual learning history](https://github.com/mgurramaiproject/dutchmate/issues/65).

- [x] The answer hierarchy remains compact, readable, keyboard-accessible, and horizontally contained in the popup.
- [x] Telugu helper text has local plain-English phonetics with syllable breaks and no extra provider request.
- [x] Saved Dutch context and its two stored translations display after reveal when available.
- [x] Missing legacy context or helper data has a clear unavailable state and is never fabricated.
- [x] Popup view and rendered accessibility regression checks pass.

## [#67](https://github.com/mgurramaiproject/dutchmate/issues/67) — T03 Add Saved recovery controls

**What to build:** A learner can find Export and Import in the Saved tab and use the existing versioned local backup to recover safely after a true uninstall, while normal upgrades and re-enables remain non-destructive.

**Blocked by:** [#65 — T01 Preserve contextual learning history](https://github.com/mgurramaiproject/dutchmate/issues/65).

- [ ] The learner-controlled collection is visibly named Saved; Lesson library remains distinct.
- [ ] Saved exposes compact Export and Import controls with clear success and failure feedback.
- [ ] Import validates supported backups and merges records rather than replacing local learning.
- [ ] Backup controls, error states, and update/re-enable preservation regression checks pass.

## [#68](https://github.com/mgurramaiproject/dutchmate/issues/68) — T04 Filter Lessons and preserve focused orientation

**What to build:** A learner can filter the compact Lesson library by readiness and practical life pathway, and stays oriented by a visible locked active tab while completing a Today or Lesson focused flow.

**Blocked by:** None — can start immediately.

- [ ] Lesson filters provide All, Ready, Continue, and practical-life-pathway narrowing as functional controls.
- [ ] An in-progress lesson row states its resumable stage, such as Continue · Notice.
- [ ] Focused Today and Lesson flows retain their selected tab as a non-interactive orientation marker and retain an explicit Exit action.
- [ ] Keyboard behavior, focus visibility, compact popup containment, and Lessons regressions pass.

## [#69](https://github.com/mgurramaiproject/dutchmate/issues/69) — T05 Add Quiz Saved

**What to build:** A learner can start Quiz Saved from Saved and practise a shuffled snapshot of all saved learning items using reveal, Again, and Got it without falsely completing Daily Five.

**Blocked by:** [#65 — T01 Preserve contextual learning history](https://github.com/mgurramaiproject/dutchmate/issues/65); [#67 — T03 Add Saved recovery controls](https://github.com/mgurramaiproject/dutchmate/issues/67); [#68 — T04 Filter Lessons and preserve focused orientation](https://github.com/mgurramaiproject/dutchmate/issues/68).

- [ ] Saved provides a clear Quiz Saved entry point when learning items exist.
- [ ] Quiz Saved uses canonical practice evidence and increments review activity without mutating Daily Five completion.
- [ ] The focused Quiz retains Saved as its visible locked origin and supports explicit Exit.
- [ ] Empty, shuffled, resumed-popup, and error states have focused contract and popup regression coverage.

## [#70](https://github.com/mgurramaiproject/dutchmate/issues/70) — T06 Verify 005-refinement across browser lifecycles

**What to build:** The complete refinement is verified as a reliable Chrome and Firefox learning loop through automated contract checks and real-browser lifecycle, accessibility, and popup-geometry evidence.

**Blocked by:** [#65 — T01 Preserve contextual learning history](https://github.com/mgurramaiproject/dutchmate/issues/65); [#66 — T02 Reveal contextual answers with Telugu phonetics](https://github.com/mgurramaiproject/dutchmate/issues/66); [#67 — T03 Add Saved recovery controls](https://github.com/mgurramaiproject/dutchmate/issues/67); [#68 — T04 Filter Lessons and preserve focused orientation](https://github.com/mgurramaiproject/dutchmate/issues/68); [#69 — T05 Add Quiz Saved](https://github.com/mgurramaiproject/dutchmate/issues/69).

- [ ] Full test suite, typecheck, Chrome build, Firefox build, release verification, and whitespace check pass.
- [ ] Real browser checks confirm update/re-enable preservation, restart heatmap recall, import recovery, narrow-popup containment, keyboard flows, and visible focus.
- [ ] The feature specification and tickets accurately record automated evidence, manual evidence, and any genuine remaining blocker.
