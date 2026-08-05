# Release Notes

## 0.5.0

Target: the next minor release after `0.4.0`, consolidating the grammar,
sentence-practice, Verb Journey, content-catalog, and public-face work shipped
since the last GitHub release.

Changes:

- Added grammar practice, sentence exercises, short Lessons, Daily Five, and
  Verb Journeys for `werken`, `zijn`, `hebben`, and `gaan`.
- Added English comparisons and multilingual form references across verb
  learning.
- Added the typed, versioned content catalog for reviewed Lessons, grammar,
  contrast, and Verb Journey packages while preserving learner history.
- Refreshed the public homepage with current product copy and three-browser
  availability states; Safari is intentionally deferred.
- Tightened store-ready host permissions while keeping local-testing access
  explicit.

Verification:

- `corepack pnpm verify`
- `corepack pnpm package:extensions`
- `node scripts/verify-extension-release.mjs`
- `git diff --check`

Notes:

- GitHub Release assets are packaged for Chrome and Firefox; store submission
  remains manual and separate.
- Learning data remains local-only, with no account or cloud sync.

## 0.4.0

Target: the first minor release after the `0.3.0` LearnLoop baseline, adding Context Missions, learning-loop refinements, and source-aware cross-language capture.

Changes:

- Added optional Context Missions for deliberate webpage selections, including first-encounter reconstruction and saved-item recognition or recall without a popup tab.
- Added contextual review refinements: Telugu phonetic helpers, Saved recovery controls, Quiz Saved, lesson filters, focused-flow orientation, durable local activity, Daily Five continuity, and lifecycle hardening.
- Added source-aware Dutch, English, and Telugu selection and hover behavior, including canonical Dutch saves, Seen-before matching, and no self-translation.
- Added provenance-aware Saved and review contexts with up to three recent contexts, helper translations, explicit unavailable states, and legacy-language handling.

Verification:

- `corepack pnpm test`
- `corepack pnpm typecheck`
- `corepack pnpm build:chrome`
- `corepack pnpm build:firefox`
- `corepack pnpm verify:release`
- `git diff --check`
- Chrome 149.0.7827.114 and Firefox 152.0.6 manual validation confirmed on 2026-07-25.

Notes:

- No new browser permissions, account, cloud sync, or backend provider change.
- Learning data remains local to the browser; Context Mission state remains ephemeral and experimental.
- Store submissions remain manual after the GitHub Release is published.

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
