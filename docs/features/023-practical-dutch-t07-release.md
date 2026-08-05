## Parent

[#185 — Feature 023: Practical Dutch](https://github.com/mgurramaiproject/dutchmate/issues/185)

**Issue:** [#192](https://github.com/mgurramaiproject/dutchmate/issues/192)

## What to build

Release-qualify the complete Practical Dutch pilot as one offline-first feature while proving content quality, installed-user history safety, accessibility, browser parity, and legacy behavior.

## Acceptance criteria

- [x] The complete supermarket A1/A2 pair passes structural validation, original-content checks, independent Dutch/English/Telugu review, and exercise review.
- [x] Invalid or draft content remains excluded from production builds, while the approved pair is bundled deterministically in Chrome and Firefox without a content network request.
- [x] Upgrade-safety fixtures prove existing installed-user records and old backups survive the feature update and new export/import behavior.
- [x] Keyboard, focus, narrow-popup, Telugu wrapping, error recovery, and legacy curated mini-lesson regressions pass.
- [x] The full relevant test suite, typecheck, browser builds, and release verification pass together.

## Blocked by

- [#186 — Establish the atomic Practical Dutch catalog and topic overview](https://github.com/mgurramaiproject/dutchmate/issues/186)
- [#187 — Protect installed-user history and persist a resumable Practical Dutch lesson](https://github.com/mgurramaiproject/dutchmate/issues/187)
- [#188 — Deliver the supermarket A1 context and language-focus path](https://github.com/mgurramaiproject/dutchmate/issues/188)
- [#189 — Complete the A1 core practice and intentional Saved flow](https://github.com/mgurramaiproject/dutchmate/issues/189)
- [#190 — Deliver the A2 companion and level progression](https://github.com/mgurramaiproject/dutchmate/issues/190)
- [#191 — Add optional extra practice and Today continuation](https://github.com/mgurramaiproject/dutchmate/issues/191)

**Status:** implemented on `feature/023-practical-dutch`
