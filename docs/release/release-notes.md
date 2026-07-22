# Release Notes

## 0.3.0

Target: first local flashcard review release after `0.2.0`.

Changes:

- Added popup Learn review for due, new, and all saved vocabulary.
- Added Dutch-English-Telugu flashcards, review ratings, fixed local schedules, page context, card direction, and a due-review badge.
- Added versioned vocabulary backup import/export and safe clear behavior.
- Added independent hover and selected-word cache controls while keeping translation cache separate from saved vocabulary backups.
- Completed cross-browser popup, saved-vocabulary, Telugu-meaning, and settings UX hardening.
- Added optional Context Missions for deliberate webpage selections: local first-encounter reconstruction and saved-item recognition or recall practice without a popup tab.

Verification:

- `corepack pnpm verify`
- `corepack pnpm verify:release`
- Chrome and Firefox browser smoke testing

Notes:

- No new browser permissions.
- No account, cloud sync, or backend provider change.
- Saved vocabulary and review data remain local-only browser data.
- Context Mission state and history are ephemeral; an eligible saved item can receive at most one canonical local mastery update. Missions add no translation-provider or generative-service request and no background learning telemetry.
- Context Missions are experimental learning support, not a claim of proven learning effect.

## 0.2.0

Target: first saved-vocabulary learning release after `0.1.2`.

Changes:

- Added local saved-vocabulary storage for intentional selected single-word saves.
- Added background messages for saving, listing, deleting, and clearing saved vocabulary.
- Added a Save action to successful selected single-word translation tooltips.
- Added an Options page saved-vocabulary view with count, empty state, delete, and clear-all controls.
- Added a scrollable saved-vocabulary list and clearer privacy copy for cached words versus saved words.
- Added an opt-in hover-word cache setting and reused cached single-word translations across hover and selection.
- Fixed Chrome-specific translation and multi-language save issues so Firefox and Chrome behave consistently.
- Updated privacy, store, manual-testing, and release documentation for saved vocabulary.

Verification:

- `npm run test`
- `npm run typecheck`
- `npm run build`

Notes:

- No new browser permissions.
- No backend provider change.
- No account, sync, flashcards, or spaced repetition yet.
- Saved vocabulary is local-only browser data and does not include page URLs or page titles in this release.

## 0.1.2

Target: production-readiness follow-up after `0.1.1`.

Changes:

- Documented the post-`0.1.1` release-readiness branch and PR plan.
- Recorded Chrome and Firefox `0.1.1` browser smoke-test results.
- Clarified the current browser release artifact set.
- Added a defensive Chrome hover guard so unusual page text ranges are skipped instead of throwing `IndexSizeError`.

Verification:

- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm package:extensions`
- inspected Chrome and Firefox package manifests for version `0.1.2`

Notes:

- No new user-facing product feature.
- No new permissions.
- No backend provider change.
- Browser smoke testing was recorded against `0.1.1`; the Chrome range guard should be manually confirmed during the next browser pass.
