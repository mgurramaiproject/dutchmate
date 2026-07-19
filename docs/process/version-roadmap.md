# Post-0.2.0 Version Roadmap

Last updated: 2026-07-19

Use this roadmap after the `0.2.0` release as the planning record for future branches, pull requests, and version changes.

## Working Rule

Treat `0.2.0` as the stable released baseline. The merged PVR-001 work is the planned `0.3.0` flashcard review release.

Each meaningful feature or release-prep step should happen in its own git branch, with one focused pull request and a clear version target. Avoid mixing product features, release cleanup, backend hardening, and broad refactors in the same branch.

For a single product feature, prefer one feature branch with multiple focused commits over many tiny feature branches. The commits preserve the incremental trail, while the pull request tells the full feature story.

## Version Direction

- `0.1.x`: production hardening and release cleanup.
- `0.2.x`: first saved-vocabulary learning features.
- `0.3.x`: local flashcard review.
- `0.4.x`: local spaced repetition and learning progress.
- `0.5.x`: richer context learning.

## Recommended Roadmap

| Version | Theme | Branch | Pull request goal |
| --- | --- | --- | --- |
| `0.1.2` | Release cleanup and production readiness | `release/0.1.2-production-readiness` | Make release artifacts, docs, and verification logs consistent after `0.1.1`. |
| `0.1.3` | Backend reliability and observability | `feature/backend-production-signals` | Improve confidence in live translation health, failures, and rate limits. |
| `0.2.0` | Saved vocabulary MVP | `feature/saved-vocabulary-local` | Let users save selected words locally as a real learning list. |
| `0.2.1` | Vocabulary polish | `feature/vocabulary-management` | Add delete, clear, count, sorting, and privacy-friendly copy. |
| `0.3.0` | Flashcard review MVP | `release/0.3.0-pvr-001` | Package the merged PVR-001 review loop for release. |
| `0.4.0` | Spaced repetition | `feature/spaced-repetition-local` | Add simple review scheduling with choices such as Again, Good, and Easy. |
| `0.5.0` | Context learning | `feature/saved-word-context` | Optionally save short example context for selected words. |

## Current Next Version

The next version should be:

```text
0.3.0
```

Purpose:

```text
Local flashcard review.
```

Suggested scope:

- Add the popup Learn review for due, new, and all saved words.
- Add local flashcard ratings and predictable review scheduling.
- Keep Dutch, English, and Telugu review data local-only and separate from translation cache data.
- Verify Chrome and Firefox packages before creating the GitHub release.

The `0.1.2` production-readiness branch and the PVR-001 learning-loop work have been merged. This release keeps review data local-only and separate from the automatic translation cache.

## Branch Naming

Use branch names that make the work type and product intent obvious:

```text
release/0.1.2-production-readiness
feature/saved-vocabulary-local
feature/local-flashcards
fix/chrome-tooltip-timeout-message
docs/release-playbook-artifacts
```

Prefer:

- `release/...` for version prep and artifact consistency.
- `feature/...` for user-facing capability.
- `fix/...` for focused bug fixes.
- `docs/...` for documentation-only changes.

## Pull Request Titles

Use short titles that say what the PR delivers:

```text
Release 0.1.2 production readiness
Add local saved vocabulary data model
Add saved vocabulary options page view
Add local flashcard review MVP
```

## Pull Request Description Template

```md
## Summary

What this PR changes in plain language.

## Version Target

Target version: `0.1.2`

## Why

Why this matters for DutchMate users or release safety.

## What Changed

- Change 1
- Change 2
- Change 3

## What Did Not Change

- No new backend provider
- No account system
- No sync
- No broad refactor

## Verification

- [ ] `corepack pnpm test`
- [ ] `corepack pnpm typecheck`
- [ ] `corepack pnpm build`
- [ ] Browser smoke test, if relevant

## Privacy / Store Impact

State whether privacy policy, store copy, permissions, or screenshots need updates.

## Follow-Up

What should happen in the next PR, not this one.
```

## Product Boundary For Saved Vocabulary

Saved vocabulary should be separate from the existing translation cache.

The translation cache is a temporary performance feature:

```text
Cache = automatic, temporary, local
```

Saved vocabulary is a user-facing learning feature:

```text
Saved words = intentional, visible, user-controlled
```

That distinction matters for trust, privacy copy, and future product design. Users should be able to see and manage saved vocabulary directly, while the low-level cache should stay bounded and boring.

## Future Product Bets

The strongest next value direction is:

```text
Saved Word List -> Flashcards -> Spaced Repetition
```

This turns DutchMate from a lookup tool into a learning loop while keeping the first implementation local-only and understandable.

Before implementing those features, clarify:

- what exact text is stored;
- whether context snippets are stored;
- whether storage is automatic or user-triggered;
- how users can delete saved data;
- whether privacy policy, store copy, screenshots, or permissions change.
