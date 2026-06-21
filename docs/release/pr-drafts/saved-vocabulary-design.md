# Add Local Saved Vocabulary

## Summary

This PR adds DutchMate `0.2.0`, the first saved-vocabulary release. It turns saved words into a local, user-controlled learning list, then rounds the feature out with Chrome-safe save behavior, cache/privacy controls, and an Options page users can actually manage comfortably.

## Version Target

Target version: `0.2.0`

## Why

DutchMate `0.1.x` proved the core lookup loop. The next value step is to let learners intentionally save words they notice while reading, so DutchMate can grow toward flashcards and spaced repetition later.

Planning the boundary first kept the feature local, privacy-conscious, and easy to grow in small steps without mixing in flashcards, sync, or account work too early.

## What Changed

- Added the saved vocabulary `0.2.0` feature plan.
- Documented saved vocabulary as separate from the translation cache.
- Added local saved-vocabulary storage.
- Added a save action for successful selected single-word translations.
- Added an Options page view for saved vocabulary.
- Added delete, clear, count, and scroll handling for saved vocabulary management.
- Added privacy copy that explains the difference between saved vocabulary and cached words.
- Added an opt-in setting for caching hovered single-word translations locally.
- Fixed Chrome-specific translation and save issues so multi-language saves work reliably there too.
- Reused cached single-word translations across hover and selection to reduce repeated API calls.
- Updated privacy, store, release, and manual testing docs as needed.

## What Did Not Change

- No new browser permissions.
- No backend provider change.
- No account system.
- No sync.
- No flashcards or spaced repetition yet.
- No saved page URLs or page titles.
- No broad UI refactor outside the saved-vocabulary and privacy sections.

## Verification

- [x] `npm run test`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Browser smoke test during branch development in Firefox and Chrome local extension loads

## Privacy / Store Impact

Saved vocabulary is local-only browser data. Privacy and store copy now state that selected single words the user chooses to save are stored locally in the browser and are not sent to an account or synced across devices. The branch also clarifies that cached translations are a separate local performance layer and are not the same thing as intentional saved vocabulary.

## Follow-Up

After merge, start `0.2.1` vocabulary polish as its own branch so review stays focused on management improvements rather than mixing them into the `0.2.0` MVP feature PR.
