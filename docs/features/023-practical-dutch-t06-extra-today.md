## Parent

[#185 — Feature 023: Practical Dutch](https://github.com/mgurramaiproject/dutchmate/issues/185)

**Issue:** [#191](https://github.com/mgurramaiproject/dutchmate/issues/191)

## What to build

Give completed learners optional deterministic extra practice and make Today/resume continue the most recently updated incomplete Practical Dutch activity without auto-starting or double-counting completion.

## Acceptance criteria

- [x] Extra practice offers vocabulary, sentence, situation, or equivalent reviewed variants after completion.
- [x] Extra practice is resumable, deterministic, and never awards a second lesson completion or duplicate rhythm activity.
- [x] Today/resume selects the most recently updated incomplete Practical Dutch activity before the recommended next lesson.
- [x] The learner can return from extra practice to the existing Lessons flow without losing A1/A2 progress or legacy lesson access.
- [x] Continuation, extra-practice rotation, and completion-count behavior is covered by focused tests.

## Blocked by

- [#190 — Deliver the A2 companion and level progression](https://github.com/mgurramaiproject/dutchmate/issues/190)

**Status:** implemented on `feature/023-practical-dutch`
