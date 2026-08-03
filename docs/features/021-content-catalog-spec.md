# Feature 021: Content Catalog

## Problem Statement

DutchMate's learner-facing content is growing, but authored lessons,
micro-stories, grammar packs, and Verb Journey packs are currently encoded as
TypeScript definitions and registries. Adding more reviewed content therefore
requires editing feature code and manually preserving several runtime seams.

This is different from the learner's data. Saved items, local learning history,
lesson progress, rhythm, encounters, and verb evidence already belong to a
versioned local learning record. The problem is the absence of a systematic
published authored-content catalog, not the absence of a learner-data database.

Without a catalog boundary, content expansion risks duplicated registries,
broken references, accidental evidence changes, inconsistent review status,
and learner-history incompatibility. A future public remote catalog may be
useful, but introducing it now would add hosting, caching, integrity,
rollback, privacy, and release obligations before the bundled content contract
is stable.

## Solution

Create an offline-first content catalog made of typed, versioned JSON packages
and a deterministic manifest. The catalog will contain published authored
content, not learner-owned records. TypeScript will define the package
contracts, loader, validators, compatibility rules, and existing runtime
interfaces.

The extension will bundle only release-qualified packages and consume them
through one shared catalog seam. Existing Lessons, Verb Journey, grammar,
contrast, practice, Today/Daily Five, popup, backup/import, and learner-history
behavior will continue to use their existing contracts.

All currently shipped authored content will migrate family by family behind the
catalog seam. Stable IDs, content versions, evidence keys, accepted-answer
semantics, exports/imports, and upgrade-safe learner history will remain
compatible. New content will be additive; meaning-changing content changes
will require explicit version and compatibility handling.

## User Stories

1. As a DutchMate learner, I want existing Lessons to behave exactly as they do today after the catalog migration, so that a content architecture change does not disrupt my learning.
2. As a DutchMate learner, I want existing Verb Journeys to retain their stable identities and progress meaning, so that an extension update does not reset or reinterpret my verb evidence.
3. As a DutchMate learner, I want existing Saved items, contexts, encounters, and mastery to remain local and readable, so that published-content migration does not turn my private learning record into shared content.
4. As a content author, I want to add a new curated mini-lesson as a versioned data package, so that I do not need to modify popup behavior for every new lesson.
5. As a content author, I want to add a new Verb Journey pack as a versioned data package, so that I can expand the Verb Path through authored records rather than a new code path per verb.
6. As a content author, I want each content package to declare its typed family, stable identity, schema version, and content version, so that the runtime can distinguish compatible content from incompatible content.
7. As a content author, I want a micro-story to remain owned by its lesson or Verb Journey, so that story context stays coherent and the catalog does not create unrelated reusable examples prematurely.
8. As a content author, I want typed content families for lessons, Verb Journey packs, grammar packs, and contrast packs, so that each family can retain the fields and validation rules its learner experience requires.
9. As a content author, I want a deterministic manifest to list available packages and versions, so that the extension can discover content without scattered hardcoded registries.
10. As a content reviewer, I want draft packages excluded from the runtime manifest, so that incomplete or unreviewed content cannot appear to learners accidentally.
11. As a content reviewer, I want every released package to include author, reviewer, review date, sources, provenance, and release status, so that linguistic and instructional quality remains auditable.
12. As a content reviewer, I want automated validation to identify duplicate IDs and broken references before review is complete, so that human reviewers spend time on language and pedagogy rather than avoidable structural errors.
13. As a content reviewer, I want validation to inspect story targets, practice targets, accepted answers, distractors, feedback, and evidence references, so that authored content remains safe for existing deterministic interactions.
14. As a content author, I want new records to be additive by default, so that adding a lesson, journey, story, form, or exercise does not alter existing learner evidence.
15. As a content maintainer, I want stable IDs never to be reused for a different meaning, so that old local records cannot resolve to semantically unrelated content.
16. As a content maintainer, I want meaning-changing edits to require a new content version, so that accepted answers, targets, and evidence semantics cannot change silently.
17. As a content maintainer, I want removed or retired content to remain represented enough for old local records to be read safely, so that content cleanup does not make learner history unreadable.
18. As a DutchMate learner, I want the catalog to be bundled with the extension, so that Lessons and Verb Journeys remain available offline and do not depend on a remote service.
19. As a DutchMate learner, I want the extension to include only release-qualified content, so that content quality does not depend on runtime network availability or an account.
20. As a DutchMate maintainer, I want the catalog loader to expose the existing runtime content contracts, so that the UI, practice, evidence, and navigation code do not each learn a new storage format.
21. As a DutchMate maintainer, I want to migrate authored content family by family, so that each migration slice can be qualified independently and the repository does not require an unsafe big-bang rewrite.
22. As a DutchMate maintainer, I want the old code-defined source removed only after its catalog replacement is verified, so that the repository does not contain competing sources of truth.
23. As a DutchMate maintainer, I want the catalog build to fail clearly when a package is malformed or unsupported, so that invalid content cannot silently ship.
24. As a DutchMate maintainer, I want Chrome and Firefox builds to consume the same qualified catalog contract, so that browser packaging does not create different content behavior.
25. As a DutchMate maintainer, I want a future public remote catalog to be able to serve the same package and manifest shape, so that later content delivery can be added without redesigning the authored-content domain.
26. As a DutchMate learner, I want public remote content, if introduced later, to be usable without creating an account, so that content delivery and private learner-data synchronization remain separate choices.
27. As a DutchMate maintainer, I want private learner-data synchronization to remain outside this catalog feature, so that introducing published content does not create unapproved identity, privacy, deletion, or account obligations.
28. As a content author, I want runtime content generation and runtime grading to remain excluded, so that every released learning interaction remains deterministic and reviewable.
29. As a DutchMate maintainer, I want automated content-batch authoring to remain a later option, so that the catalog schema and review process can stabilize before an authoring CLI or LLM adapter hardens them.
30. As a DutchMate maintainer, I want catalog validation and migration checks to be runnable in the normal repository verification flow, so that content expansion is protected by the same delivery discipline as code changes.

## Implementation Decisions

- Published authored content is the catalog domain. Saved items, local learning
  history, progress, rhythm, encounters, and evidence remain in the existing
  local learning-record domain.
- The catalog uses one envelope with typed collections for lessons, Verb
  Journey packs, grammar packs, and contrast packs. It does not use a generic
  entity/attribute/value record model.
- A micro-story remains nested under its owning lesson or Verb Journey until a
  separate reuse need is demonstrated.
- Each authored lesson or pack is represented by a versioned JSON package. A
  deterministic typed manifest identifies package family, stable identity,
  schema version, content version, and release eligibility.
- TypeScript remains the authoritative contract and runtime compatibility layer.
  It validates parsed packages and exposes the existing typed runtime shapes to
  UI, practice, qualification, evidence, and navigation seams.
- The extension bundles release-qualified packages at build time. The runtime
  does not query a database, make a content-network request, or require an
  account for catalog access.
- The migration follows expand–contract sequencing: introduce the catalog seam
  beside existing sources, migrate each family, qualify behavior and history,
  then remove the old duplicate source.
- Existing stable IDs, content versions, exercise IDs, evidence keys, backup
  formats, and local learner-history contracts remain compatible.
- New packages and records are additive. A stable ID cannot be reused for a
  different meaning. Meaning-changing edits to learner-facing content,
  accepted answers, targets, or evidence semantics require a new content
  version and explicit compatibility handling.
- Retired content must not make existing local records unreadable. The catalog
  must retain enough identity/version information or a compatibility mapping to
  safely interpret old learner records.
- Every runtime package requires release metadata with author, reviewer, review
  date, sources, provenance, and an approved release state. The existing
  independent language/content review requirement remains mandatory.
- Automated validation must cover package shape, supported versions, stable
  IDs, duplicate IDs, references, journey/story ownership, targets, accepted
  answers, distractors, feedback, review metadata, and compatibility with
  existing UI/evidence contracts.
- The remote public catalog and optional learner-data synchronization are
  future capabilities. The package and manifest shape should not prevent them,
  but this feature does not implement hosting, fetching, caching, signing,
  authentication, account creation, sync, or cloud persistence.
- Automated batch authoring, local content-factory commands, and optional LLM
  generation are parked for later and are not part of this implementation.

## Testing Decisions

- Tests should exercise external behavior at the highest stable seams. They
  should verify that valid packages are discoverable and that invalid packages
  are rejected with actionable errors; they should not assert incidental JSON
  file layout or private helper implementation.
- Catalog contract tests will validate each typed family, manifest uniqueness,
  package/version support, release eligibility, and additive/breaking-version
  rules.
- Loader tests will verify deterministic lookup and availability while
  returning the existing runtime contracts expected by Lessons, Verb Journeys,
  grammar, contrast, practice, and popup surfaces.
- Migration qualification tests will compare pre-migration and catalog-backed
  behavior for current authored content, including story targets, practice
  answers, translations, review metadata, form/comparison content, and
  qualification reports.
- Learner-history tests will verify Saved items, lesson progress,
  grammar/contrast evidence, Verb Journey evidence, backup import/export,
  content-version parsing, and stale or retired content behavior.
- Build tests will verify that Chrome and Firefox packages include only
  release-qualified content and do not require a content network request.
- Existing prior art includes lesson-catalog validation, grammar-content
  qualification, Verb Journey registry/content tests, learning-record
  migration tests, backup round-trip tests, popup integration tests, and
  Chrome/Firefox build verification. Feature 021 should extend those seams
  rather than create parallel test conventions.
- Linguistic review remains separate from structural tests. Automated tests may
  prove that Dutch/English/Telugu fields exist and are referenced correctly;
  they cannot prove idiomaticity, translation meaning, or pedagogical quality.

## Out of Scope

- A remote content database, runtime content fetch, or content CDN.
- User accounts, authentication, private learner-data sync, or cloud learner
  profiles.
- A generic record/table model that erases family-specific content contracts.
- A standalone reusable Story domain.
- Runtime-generated stories, lessons, exercises, translations, explanations,
  or grading.
- A content-factory CLI, ChatGPT-Web integration, API-driven LLM authoring, or
  automatic publishing.
- New popup destinations, UI frameworks, schedulers, queues, mastery models,
  evidence stores, or learner-history formats.
- Broad changes to the pedagogical scope or language content of existing
  Lessons and Verb Journeys solely to facilitate extraction.

## Further Notes

- The existing translation backend is not a content backend. Feature 021 must
  not overload its provider boundary with authored learning content.
- The public remote catalog revisit signal is content-release friction combined
  with a stable schema, validator, review process, signed/versioned payload
  design, cache strategy, rollback plan, and reliable bundled fallback.
- The future account decision belongs to private learner-data synchronization,
  not public content delivery. Local-only use remains a supported product
  boundary.
- Feature 021 should end with a clean branch and committed documentation and
  implementation changes. Delivery still requires the repository's normal
  GitHub issue, PR, and Delivery reconciliation workflow.

