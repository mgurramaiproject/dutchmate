# Release Notes

## 0.2.0

Target: first saved-vocabulary learning release after `0.1.2`.

Changes:

- Added local saved-vocabulary storage for intentional selected single-word saves.
- Added background messages for saving, listing, deleting, and clearing saved vocabulary.
- Added a Save action to successful selected single-word translation tooltips.
- Added an Options page saved-vocabulary view with count, empty state, delete, and clear-all controls.
- Updated privacy, store, manual-testing, and release documentation for saved vocabulary.

Verification:

- `git diff --check`
- `corepack pnpm test`
- `corepack pnpm package:extensions`
- inspected Chrome and Firefox package manifests for version `0.2.0`

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
