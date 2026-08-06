# Changelog

## 0.6.0

### Added

- Added Practical Dutch with a reviewed supermarket topic and A1/A2 lessons.
- Added a compact focused popup flow for Read, Notice, Practise, and Keep.
- Added updated Chrome, Firefox, and Edge-compatible Chromium release materials.

### Fixed

- Made Firefox learning-history migration recoverable when older local records
  are still present.
- Kept failed migrations from replacing the current learning record or marking
  migration complete.

### Changed

- Preserved local learning history while adding Practical Dutch progress and
  compact lesson interaction.
- Kept learning data local, with no account, cloud sync, or new browser
  permission.

## 0.5.1

- Made browser updates safer by preserving the previous learning record when a
  migration cannot complete.
- Kept the translation tooltip open while moving to Save.
- Removed the unused `downloads` permission from store manifests.

## 0.5.0

- Added grammar practice, sentence exercises, Lessons, Daily Five, and Verb
  Journeys for `werken`, `zijn`, `hebben`, and `gaan`.
- Added English comparisons, multilingual form references, and the typed
  versioned content catalog.
- Refreshed the public homepage and tightened store-ready host permissions.
- Added upgrade-safe local learning-data migration while preserving existing
  Saved vocabulary, lesson progress, Verb Journey evidence, backups, and Daily
  Five behavior.

## 0.4.1

- Narrowed store-ready host permissions to the DutchMate backend.
- Kept localhost and wildcard HTTPS access only in explicit local-testing
  builds.

## 0.4.0

- Added optional Context Missions, refined Saved and review workflows, and
  source-aware Dutch-English-Telugu reading support.
- Added provenance-aware Saved and review contexts with Telugu helpers and
  explicit unavailable states.
- Kept learning data local with no account, cloud sync, new permissions, or
  backend provider change.

## 0.3.0

- Added the local LearnLoop with Today, Daily Five, flashcard review, review
  scheduling, lesson progress, and learning rhythm.
- Added versioned learning backups, legacy vocabulary-backup import, and safe
  clear behavior.
- Kept translation cache entries separate from learner-controlled vocabulary.

## 0.2.0

- Added local saved vocabulary with Save, list, delete, and clear controls.
- Reused compatible cached single-word translations while keeping saved
  vocabulary separate from translation cache data.
- Kept saved vocabulary local-only with no account, sync, flashcards, or
  spaced repetition.
