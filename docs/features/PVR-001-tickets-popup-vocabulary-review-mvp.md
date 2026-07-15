# PVR-001 Tickets: Popup Vocabulary Review MVP

Parent issue: [#20](https://github.com/mgurramaiproject/dutchmate/issues/20)

Source plan: [PVR-001-plan-popup-vocabulary-review.md](./PVR-001-plan-popup-vocabulary-review.md)

Source spec: [PVR-001-spec-popup-vocabulary-review-mvp.md](./PVR-001-spec-popup-vocabulary-review-mvp.md)

These tickets build the local popup vocabulary review MVP. Work the frontier: begin with T01, then take any ticket whose blockers are complete.

## PVR-001-T01: Show canonical vocabulary summary in the popup

GitHub issue: [#21](https://github.com/mgurramaiproject/dutchmate/issues/21)

**What to build:** Add the popup Learn entry point and show a usable vocabulary summary. Existing saved translation pairs must be grouped into canonical review cards, preserving partial meanings and showing total cards, due count, new count, recent cards, empty states, and review actions.

**Blocked by:** None — can start immediately.

- [ ] The popup is included in the Chrome and Firefox extension builds and opens on Learn by default.
- [ ] Existing Dutch-English-Telugu translation pairs are grouped into one canonical card per Dutch learning word.
- [ ] Partial cards preserve available meanings and expose an explicit unavailable state for missing meanings.
- [ ] Learn shows total cards, due cards, new cards, recently saved cards, and the three review actions.
- [ ] The canonical-card migration and popup summary behavior have focused tests.

## PVR-001-T02: Practice new cards end-to-end

GitHub issue: [#22](https://github.com/mgurramaiproject/dutchmate/issues/22)

**What to build:** Make Practice New Words launch an in-popup flashcard session. The learner sees the Dutch prompt, reveals the answer, rates the card, advances through a queue snapshot, and leaves persisted review metadata behind.

**Blocked by:** [PVR-001-T01 / #21](https://github.com/mgurramaiproject/dutchmate/issues/21)

- [x] Practice New Words selects only never-rated cards and creates a stable queue snapshot.
- [x] The front shows progress, the Dutch word, and Show Answer.
- [x] The back shows Dutch, English, Telugu, optional available page context, and the four rating actions.
- [x] Again and Hard schedule 24 hours later, Good schedules 3 days later, and Easy schedules 7 days later.
- [x] Every rating persists review metadata and advances to the next card or a completion state.
- [x] New-card queue, schedule, rating, and popup state transitions have focused tests.

## PVR-001-T03: Review due and all cards with badge updates

GitHub issue: [#23](https://github.com/mgurramaiproject/dutchmate/issues/23)

**What to build:** Add the scheduled due-review and all-card flows, plus the toolbar badge. The learner can review cards whose due time has arrived, study every card on demand, and see the due count reflected in the extension toolbar.

**Blocked by:** [PVR-001-T02 / #22](https://github.com/mgurramaiproject/dutchmate/issues/22)

- [x] Review Due Words selects only previously reviewed cards whose due time has arrived.
- [x] Review All Words includes every canonical card without changing the due/new classification.
- [x] Due cards are ordered by earliest due time and new/all cards use oldest creation time first.
- [x] The badge initializes from local vocabulary state and shows the count of reviewed due cards.
- [x] The badge updates after vocabulary saves and ratings, and is hidden when the count is zero.
- [x] Due/all queue behavior and initialization/mutation badge behavior have focused tests.

## PVR-001-T04: Add review settings and page context

GitHub issue: [#24](https://github.com/mgurramaiproject/dutchmate/issues/24)

**What to build:** Complete the popup Settings tab and connect review preferences to saving and flashcard presentation. The learner can control automatic saving, page-context visibility, badge visibility, and card direction while the MVP language roles remain fixed.

**Blocked by:** [PVR-001-T02 / #22](https://github.com/mgurramaiproject/dutchmate/issues/22)

- [x] Settings shows Dutch as the learning language and English/Telugu as fixed helper languages.
- [x] Auto-save selected words is off by default and saves only eligible single-word selections when enabled.
- [x] A reliable sentence containing a saved word is stored locally with a maximum length of 240 characters; unreliable context is omitted.
- [x] Show example sentence is on by default and controls display without deleting stored context.
- [x] Daily review badge is on by default and disabling it hides the badge.
- [x] Card direction defaults to Dutch-to-helpers and reverse mode presents English-to-Dutch.
- [x] Settings normalization, page-context extraction, auto-save gating, and direction behavior have focused tests.

## PVR-001-T05: Import, export, and clear local vocabulary

GitHub issue: [#25](https://github.com/mgurramaiproject/dutchmate/issues/25)

**What to build:** Add safe local vocabulary file management in Settings. The learner can export a versioned backup, merge an import without losing local review state, and clear all vocabulary after confirmation.

**Blocked by:** [PVR-001-T03 / #23](https://github.com/mgurramaiproject/dutchmate/issues/23), [PVR-001-T04 / #24](https://github.com/mgurramaiproject/dutchmate/issues/24)

- [x] Export produces versioned JSON containing canonical cards, meanings, page context, and review metadata.
- [x] Export excludes provider credentials and unrelated extension settings.
- [x] Import rejects malformed or unsupported documents with a clear error.
- [x] Import merges by canonical card ID and preserves existing local review metadata on conflicts.
- [x] Clear requires confirmation and removes cards, review metadata, and page context.
- [x] Import and clear update the toolbar badge correctly.
- [x] Import/export/clear behavior has focused tests.

## PVR-001-T06: Cross-browser hardening and release verification

GitHub issue: [#26](https://github.com/mgurramaiproject/dutchmate/issues/26)

**What to build:** Finish the MVP as a releasable extension slice. Verify both browser builds, the generated manifests, popup usability, accessibility, responsive behavior, and the complete regression suite.

**Blocked by:** [PVR-001-T01 / #21](https://github.com/mgurramaiproject/dutchmate/issues/21), [PVR-001-T02 / #22](https://github.com/mgurramaiproject/dutchmate/issues/22), [PVR-001-T03 / #23](https://github.com/mgurramaiproject/dutchmate/issues/23), [PVR-001-T04 / #24](https://github.com/mgurramaiproject/dutchmate/issues/24), [PVR-001-T05 / #25](https://github.com/mgurramaiproject/dutchmate/issues/25)

- [ ] Chrome and Firefox builds include popup, background, content, Options, icons, and correct browser-specific background declarations.
- [ ] Focused tests, typecheck, and the full test suite pass.
- [ ] The popup remains usable at browser popup dimensions, preserves the Direction A composition at a 390x844 baseline, and remains usable at narrow viewport widths.
- [ ] Keyboard navigation, focus states, labels, and button states are accessible.
- [ ] Generated manifests and packaged outputs are inspected for the expected entry points.
- [ ] A standards/spec review finds no unresolved MVP gaps.
