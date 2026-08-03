# Feature 021: Content Catalog Tickets

Parent: [Feature 021: Content Catalog](https://github.com/mgurramaiproject/dutchmate/issues/168)

All child issues are labeled `ready-for-agent`. Blocking references are recorded
in each issue body. The first slice is the only immediate frontier; the family
migrations can proceed after it, and final source retirement waits for every
migration slice.

## 01 — Establish the content catalog seam with one lesson

**Issue:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**Blocked by:** None — can start immediately.

**What it delivers:** A typed catalog envelope, deterministic manifest, shared
loader, validators, and one catalog-backed curated mini-lesson through the
existing Lessons, practice, popup, and local-learning-record behavior.

**Status:** complete

- [x] Typed catalog envelope and manifest identify the released lesson package.
- [x] Shared loader returns the existing lesson runtime shape.
- [x] The tracer mini-lesson is bundled from JSON and remains behaviorally equivalent.
- [x] Invalid package shape, identity, version, or review state fails validation.
- [x] Existing lesson and learner-record contracts remain unchanged.

## 02 — Migrate the curated mini-lesson family

**Issue:** [#170](https://github.com/mgurramaiproject/dutchmate/issues/170)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** All currently shipped curated mini-lessons as typed,
versioned, release-qualified catalog packages while preserving micro-stories,
candidates, practice, companions, and learner behavior.

**Status:** complete

- [x] All 15 current curated mini-lessons have versioned release-qualified JSON packages.
- [x] Micro-stories, candidates, practice, transfer content, and companions retain their behavior and references.
- [x] Lessons uses the catalog-backed content through the shared loader.
- [x] Lesson progress and Saved-item behavior remain compatible.
- [x] Migrated packages pass structural validation and existing content-review checks.

## 03 — Migrate grammar and contrast packs

**Issue:** [#171](https://github.com/mgurramaiproject/dutchmate/issues/171)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** Catalog-backed grammar and contrast content with the
existing deterministic practice, companion references, evidence, repair, and
review behavior intact.

**Status:** complete

- [x] Four grammar patterns and the contrast pack are versioned release-qualified catalog packages.
- [x] Existing grammar and contrast validation and companion references remain intact.
- [x] Deterministic practice, accepted answers, feedback, evidence, and repair behavior are preserved.
- [x] Grammar and contrast learner records and backup behavior remain compatible.

## 04 — Migrate the `werken` Verb Journey pack

**Issue:** [#172](https://github.com/mgurramaiproject/dutchmate/issues/172)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** The existing `werken` pack through the catalog while
preserving stories, forms, comparisons, practice, qualification, popup routes,
Daily Five eligibility, and verb evidence.

**Status:** complete

- [x] The `werken` pack is a versioned release-qualified catalog package.
- [x] Existing stories, forms, comparisons, and stable Verb Journey IDs are preserved.
- [x] Practice, qualification, popup routes, Daily Five eligibility, and verb evidence remain compatible.
- [x] Existing `werken` content validation and learner-history checks pass through the catalog-backed runtime shape.

## 05 — Migrate the `zijn` Verb Journey pack

**Issue:** [#173](https://github.com/mgurramaiproject/dutchmate/issues/173)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** The existing `zijn` pack through the catalog while
preserving stable identity, multilingual content, comparison behavior, popup
integration, and learner evidence.

**Status:** complete

- [x] The `zijn` pack is a versioned release-qualified catalog package.
- [x] Stable identity, multilingual forms, comparisons, stories, and journey IDs are preserved.
- [x] Practice, popup integration, qualification, and learner evidence remain compatible.
- [x] Existing `zijn` content validation and learner-history checks pass through the catalog-backed runtime shape.

## 06 — Migrate the `hebben` Verb Journey pack

**Issue:** [#174](https://github.com/mgurramaiproject/dutchmate/issues/174)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** The existing `hebben` pack through the catalog while
preserving its bounded auxiliary examples, multilingual content, practice,
qualification, popup integration, and learner evidence.

**Status:** complete

- [x] The `hebben` pack is a versioned release-qualified catalog package.
- [x] Bounded auxiliary examples, multilingual content, stories, and journey IDs are preserved.
- [x] Practice, popup integration, qualification, and learner evidence remain compatible.
- [x] Existing `hebben` content validation and learner-history checks pass through the catalog-backed runtime shape.

## 07 — Migrate the `gaan` Verb Journey pack

**Issue:** [#175](https://github.com/mgurramaiproject/dutchmate/issues/175)

**Blocked by:** [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)

**What it delivers:** The existing `gaan` pack through the catalog while
preserving its bounded movement/auxiliary boundary, multilingual content,
practice, qualification, popup integration, and learner evidence.

**Status:** complete

- [x] The `gaan` pack is a versioned release-qualified catalog package.
- [x] Its bounded movement/auxiliary boundary, multilingual content, stories, and journey IDs are preserved.
- [x] Practice, popup integration, qualification, and learner evidence remain compatible.
- [x] Existing `gaan` content validation and learner-history checks pass through the catalog-backed runtime shape.

## 08 — Retire legacy content sources and qualify the complete catalog

**Issue:** [#176](https://github.com/mgurramaiproject/dutchmate/issues/176)

**Blocked by:** [#170](https://github.com/mgurramaiproject/dutchmate/issues/170),
[#171](https://github.com/mgurramaiproject/dutchmate/issues/171),
[#172](https://github.com/mgurramaiproject/dutchmate/issues/172),
[#173](https://github.com/mgurramaiproject/dutchmate/issues/173),
[#174](https://github.com/mgurramaiproject/dutchmate/issues/174), and
[#175](https://github.com/mgurramaiproject/dutchmate/issues/175).

**What it delivers:** The qualified catalog becomes the single runtime source;
duplicate legacy registries are retired; full catalog validation,
learner-history compatibility, offline behavior, Chrome/Firefox packaging, and
release qualification pass together.
