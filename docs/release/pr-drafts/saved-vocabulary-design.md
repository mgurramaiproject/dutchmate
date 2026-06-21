# Plan Saved Vocabulary 0.2.0

## Summary

This PR plans DutchMate `0.2.0`, the first saved-vocabulary release. It defines the user-facing behavior, local storage model, privacy boundary, manual testing scope, and implementation PR sequence before product code starts.

## Version Target

Target version: `0.2.0`

## Why

DutchMate `0.1.x` proved the core lookup loop. The next value step is to let learners intentionally save words they notice while reading, so DutchMate can grow toward flashcards and spaced repetition later.

Planning the boundary first keeps the feature local, privacy-conscious, and easy to implement in small branches.

## What Changed

- Added the saved vocabulary `0.2.0` feature plan.
- Documented saved vocabulary as separate from the translation cache.
- Proposed the local storage key and entry shape.
- Defined what gets saved, viewed, managed, and tested.
- Listed the implementation PR sequence for storage, tooltip save action, Options view, and release prep.
- Linked the plan from the docs index.

## What Did Not Change

- No product code.
- No new browser permissions.
- No backend provider change.
- No account system.
- No sync.
- No flashcards or spaced repetition yet.

## Verification

- [x] `git diff --check`
- [ ] Documentation review

## Privacy / Store Impact

No shipped behavior changes in this PR. The plan says `0.2.0` will need privacy and store-copy updates before release because saved vocabulary is visible local user data.

## Follow-Up

Start `feature/saved-vocabulary-storage` to implement the local saved-vocabulary domain model, storage adapter, and unit tests.
