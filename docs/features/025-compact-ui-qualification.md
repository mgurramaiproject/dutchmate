# Feature 025 — Practical Dutch Compact UI qualification

**Feature:** `025-compact-ui`
**Branch:** `feature/025-compact-ui`
**Status:** automated and owner-confirmed browser qualification complete.
**Scope:** Issues #196–#199, with feature-wide PR delivery after owner QA.

This record separates reproducible repository evidence from the manual
Chromium/Firefox and assistive-technology checks that cannot be certified by
the DOM test environment alone.

## Automated evidence

| Boundary | Evidence | Result |
| --- | --- | --- |
| Topic rows | `src/popup/index.test.ts` covers one topic heading, exactly two A1/A2 rows, removed metadata, ready/continue/completed affordances, accessible labels, and refreshed status after completion. | Pass |
| Focused shell and Read | The popup integration tests cover the Practical Dutch back action, CEFR header, hidden global navigation, gated stage rail, full authored Read context, one translation toggle, EN/TE labels, and reset-on-new-session behavior. | Pass |
| Notice, Practise, and Keep | Popup and lesson-session tests cover shared Notice translation visibility, essential Dutch teaching copy, authored exercise answers/feedback, completion, resume, restart, Keep selection, and existing evidence writes. | Pass |
| Design system and layout | `src/popup/styles.test.ts` and `src/design-system/design-system.test.ts` verify the existing `--dm-*` tokens, focus treatment, reduced motion, 390×600 scroll container, 44px targets, compact topic rows, compact rail, and no horizontal overflow contract. | Pass |
| Full repository tests | `corepack pnpm test`: 94 test files, 699 tests passed. | Pass |
| Typecheck | `corepack pnpm typecheck`. | Pass |
| Extension builds | `corepack pnpm build:chrome` and `corepack pnpm build:firefox`. | Pass |
| Build/package verification | `scripts/verify-extension-build.mjs` passed for both targets; `corepack pnpm verify:release` packaged and verified both 0.5.2 extension archives. | Pass |
| Whitespace | `git diff --check`. | Pass |

The Vite builds emit the existing large-chunk warning for background/content
and popup bundles; both builds and package verification still pass.

## Owner-confirmed manual gates

The feature owner confirmed these checks complete in installed Chromium and
Firefox builds:

1. At 390×600 and 80%, 100%, 125%, and 150% zoom, inspect the topic list,
   Read hidden/shown, Notice hidden/shown, Practise unanswered/feedback, and
   Keep. Confirm one main scroll region, no clipping, no horizontal overflow,
   and no content behind fixed navigation.
2. Run pointer and keyboard-only activation for A1/A2 rows, the compact back
   action, translation toggle, stage progression, answers, retry, completion,
   and Keep selection. Confirm visible focus and screen-reader stage/current
   status announcements.
3. Check long topic titles and long EN/TE support strings in both browsers,
   then smoke Today, Saved, Verb Journeys, and the legacy Lesson library for
   neighboring-surface regressions.

| Review | Reviewer / date | Result |
| --- | --- | --- |
| Chromium visual/keyboard/assistive-technology QA | Feature owner / 2026-08-05 | Pass |
| Firefox visual/keyboard/assistive-technology QA | Feature owner / 2026-08-05 | Pass |

## Compatibility and handoff

The implementation reuses the existing popup renderer, lesson session,
LearningRecordStore, content catalog, and design tokens. It adds no storage
key, content migration, scheduler, evidence model, permission, runtime
translation, or parallel scroll container.

Issues #196–#199 are implemented and committed on the feature branch. The
feature-wide PR was merged after owner QA confirmation; the separate code
review was intentionally skipped per the delivery request.
