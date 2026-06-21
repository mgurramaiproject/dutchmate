# Release Notes

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

Notes:

- No new user-facing product feature.
- No new permissions.
- No backend provider change.
- Browser smoke testing was recorded against `0.1.1`; the Chrome range guard should be manually confirmed during the next browser pass.
