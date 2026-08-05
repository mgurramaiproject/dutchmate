## Parent

[#185 — Feature 023: Practical Dutch](https://github.com/mgurramaiproject/dutchmate/issues/185)

**Issue:** [#186](https://github.com/mgurramaiproject/dutchmate/issues/186)

## What to build

Make one atomic Practical Dutch topic discoverable through the bundled authored-content catalog and the existing Lessons surface. The topic must expose its A1 and A2 identities and coexist with the existing curated mini-lessons.

## Acceptance criteria

- [x] A typed, versioned Practical Dutch package can represent shared topic metadata and both stable A1/A2 lesson identities.
- [x] Structural validation rejects malformed, incomplete, duplicate, or unapproved topic content.
- [x] Production lookup excludes the entire topic unless both levels are release-qualified.
- [x] The Practical Dutch topic overview shows both levels without adding navigation, and existing curated mini-lessons remain accessible.
- [x] Catalog and topic-overview behavior is covered by focused tests.

## Blocked by

- None — can start immediately.

**Status:** implemented on `feature/023-practical-dutch`
