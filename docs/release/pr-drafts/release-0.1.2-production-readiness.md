# Release 0.1.2 Production Readiness

## Summary

This PR prepares DutchMate for the next release-hardening version after the `0.1.1` release. It keeps the work focused on release consistency, verification notes, and deployment readiness, without changing product behavior.

## Version Target

Target version: `0.1.2`

## Why

The `0.1.1` release is the stable baseline. Before adding larger learning features such as saved vocabulary, flashcards, or spaced repetition, the release path should be boring and reproducible across browsers.

This PR records the production-readiness cleanup work in one branch so the project history shows what changed between `0.1.1` and the next version.

## What Changed

- Generated the missing Chrome `0.1.1` release package from source.
- Verified the Chrome package manifest reports version `0.1.1`.
- Documented the current release artifact status.
- Clarified that Edge can reuse the Chromium Chrome package unless a separate Edge package is created.

## What Did Not Change

- No new extension behavior.
- No new backend provider.
- No account system.
- No sync.
- No permissions change.
- No broad refactor.

## Verification

- [x] `corepack pnpm package:chrome`
- [x] Inspected `release/dutchmate-chrome-0.1.1.zip` manifest and confirmed version `0.1.1`
- [x] `corepack pnpm test`
- [x] `corepack pnpm build`
- [x] TypeScript check through `corepack pnpm build`
- [ ] Browser smoke test, if relevant

## Privacy / Store Impact

No privacy-policy, store-copy, permission, or screenshot changes are expected from this PR. The work is release-readiness documentation and packaging hygiene.

## Follow-Up

The next focused PR should either:

- complete `0.1.2` release verification with browser smoke-test evidence; or
- start the first `0.2.0` saved-vocabulary design/data-model branch after the release path is confirmed.
