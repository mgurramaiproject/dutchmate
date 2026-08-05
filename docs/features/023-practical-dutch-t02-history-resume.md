## Parent

[#185 — Feature 023: Practical Dutch](https://github.com/mgurramaiproject/dutchmate/issues/185)

**Issue:** [#187](https://github.com/mgurramaiproject/dutchmate/issues/187)

## What to build

Let an installed DutchMate user begin a Practical Dutch lesson and resume its staged progress while preserving every existing local learning record and backup contract.

## Acceptance criteria

- [x] The existing learning-record storage key and existing record sections remain readable and unchanged in meaning when Practical Dutch progress is absent or added.
- [x] Practical Dutch stage progress is saved through the typed background learning boundary and resumes after popup close/reopen.
- [x] A full existing-record fixture preserves Saved items, mastery, lesson progress, rhythm, grammar, contrast, and Verb Journey evidence through read/write and backup round trips.
- [x] Existing backup versions remain importable, new progress merges additively, and a failed parse or migration leaves the previous record untouched.
- [x] Focused persistence, message, migration, and resume tests pass.

## Blocked by

- [#186 — Establish the atomic Practical Dutch catalog and topic overview](https://github.com/mgurramaiproject/dutchmate/issues/186)

**Status:** implemented on `feature/023-practical-dutch`
