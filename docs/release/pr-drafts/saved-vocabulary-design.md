# Add Local Saved Vocabulary

## Summary

This PR adds DutchMate `0.2.0`, the first saved-vocabulary release. It starts with the approved plan, then implements local saved-word storage, a save action for selected words, and an Options page view for managing saved vocabulary.

## Version Target

Target version: `0.2.0`

## Why

DutchMate `0.1.x` proved the core lookup loop. The next value step is to let learners intentionally save words they notice while reading, so DutchMate can grow toward flashcards and spaced repetition later.

Planning the boundary first keeps the feature local, privacy-conscious, and easy to implement in small branches.

## What Changed

- Added the saved vocabulary `0.2.0` feature plan.
- Documented saved vocabulary as separate from the translation cache.
- Added local saved-vocabulary storage.
- Added a save action for successful selected single-word translations.
- Added an Options page view for saved vocabulary.
- Updated privacy, store, release, and manual testing docs as needed.

## What Did Not Change

- No new browser permissions.
- No backend provider change.
- No account system.
- No sync.
- No flashcards or spaced repetition yet.

## Verification

- [x] `git diff --check`
- [ ] `corepack pnpm test`
- [ ] `corepack pnpm build`
- [ ] Browser smoke test, if relevant

## Privacy / Store Impact

Saved vocabulary is local-only browser data. Privacy and store copy should state that selected single words the user chooses to save are stored locally in the browser and are not sent to an account or synced across devices.

## Follow-Up

After merge, start the next feature branch for local flashcard review planning or implementation.
