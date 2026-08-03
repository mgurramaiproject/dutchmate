# Plan 021: Content Catalog

**Codename:** `content-catalog`

**Feature code:** `021-content-catalog`

**Branch:** `feature/021-content-catalog`, created from the clean local `main`
branch on 2026-08-03.

**Status:** Specification and dependency-ordered tickets published.

**Specification:** [021-content-catalog-spec.md](./021-content-catalog-spec.md);
published as [GitHub issue #168](https://github.com/mgurramaiproject/dutchmate/issues/168)
with `ready-for-agent`.

**Tickets:** [021-content-catalog-tickets.md](./021-content-catalog-tickets.md);
published as child GitHub issues [#169](https://github.com/mgurramaiproject/dutchmate/issues/169)
through [#176](https://github.com/mgurramaiproject/dutchmate/issues/176), all
with `ready-for-agent`.

## Goal

Establish a systematic, data-driven content catalog for DutchMate's published
authored content so new lessons, micro-stories, Verb Journey packs, and
authored practice can be added as reviewed records without changing the UI,
learner-history model, or feature code for every content expansion.

The catalog is an offline-first bundled content boundary. It is not a server
database, account system, learner profile, Saved-item store, mastery store, or
second scheduler.

## Shared understanding

- Published authored content is separate from learner-owned local data.
  Lessons, micro-stories, Verb Journey packs, grammar packs, contrast packs,
  and authored exercises belong in the catalog. Saved items, local learning
  history, progress, rhythm, encounters, and evidence remain in the existing
  local learning record.
- The catalog has one envelope and typed content families rather than one
  generic record table. The initial families are lessons, Verb Journey packs,
  grammar packs, and contrast packs.
- A micro-story remains owned by its lesson or Verb Journey until reuse is a
  demonstrated need. The catalog does not invent a standalone story domain.
- Each authored unit or pack is a versioned JSON package. A deterministic typed
  manifest/index identifies packages and content versions.
- TypeScript remains the schema, runtime adapter, validator, and compatibility
  layer. No database engine, ORM, or new runtime dependency is required for the
  bundled catalog.
- The extension bundles only release-qualified catalog packages and works
  without a network connection. Existing UI and learning seams consume the
  catalog through one shared loader/query boundary.
- All currently shipped authored content migrates behind that boundary, family
  by family. The migration preserves stable IDs, content versions, exercise
  semantics, evidence keys, exports/imports, and upgrade-safe learner history.
- Stable IDs are never reused for a different meaning. New content is
  additive. Changes to learner-facing meaning, accepted answers, targets, or
  evidence semantics require a new content version and explicit compatibility
  handling. Removed content must not make existing learner records unreadable.
- Every package has review and release metadata. Automated checks cover schema,
  duplicate IDs, references, targets, accepted answers, content versions, and
  UI/evidence compatibility. Runtime inclusion requires the required second
  language/content review.
- A public remote catalog may be introduced later without accounts when
  content-release friction justifies hosting, signed/versioned payloads,
  caching, rollback, and a reliable bundled fallback. Private learner-data
  synchronization is a separate future capability and remains account/identity
  work only if cross-device recovery becomes necessary.
- Automated content-batch scaffolding, validation, promotion, and optional LLM
  generation are parked for later. Content additions may use the catalog's
  future package contract, but Feature 021 does not include an authoring CLI.

## Migration boundary

The migration uses an expand–contract sequence:

1. Introduce the catalog envelope, typed package contracts, manifest, loader,
   validators, and compatibility tests while preserving the existing runtime
   exports.
2. Migrate each authored family into JSON packages behind the shared loader.
3. Run the existing behavior, content, accessibility, and learner-history
   checks for each migrated family.
4. Remove the old code-defined duplicate only after the catalog package is the
   verified source of truth.

The migration does not alter Saved-item records, local learning-record shape,
verb evidence semantics, scheduler selection, or learner-facing navigation.

## Verification seams proposed for `$to-spec`

1. **Catalog package and manifest validation:** package identity, typed family
   shape, stable IDs, references, release metadata, duplicate detection, and
   additive/breaking content-version rules.
2. **Shared catalog loader:** deterministic availability and lookup for lessons,
   Verb Journey packs, grammar packs, and contrast packs, with no change to the
   existing runtime contracts consumed by UI and practice.
3. **Family migration qualification:** representative and complete migrated
   content retains story ownership, practice targets, accepted answers,
   translations, review provenance, and existing qualification results.
4. **Learner-history compatibility:** existing Saved items, lesson progress,
   grammar/contrast evidence, Verb Journey evidence, backup import/export, and
   versioned records remain readable and behaviorally unchanged.
5. **Bundled extension behavior:** Chrome and Firefox builds include only
   release-qualified catalog content and remain functional without network
   access.

These seams should be confirmed during the `$to-spec` approval review before
the specification is written.

## Out of scope

- A remote content database or runtime content fetch.
- User accounts, authentication, private learner-data sync, or cloud learner
  profiles.
- A generic entity/attribute/value content model.
- A standalone reusable Story domain.
- Runtime-generated lessons, stories, exercises, grading, or translations.
- The automated content-factory CLI and optional LLM authoring adapter.
- New UI surfaces, popup navigation, mastery models, schedulers, queues, or
  evidence systems.
- Changing existing learner-facing content solely to make migration easier.

## Approval gates and next delivery order

1. Commit this plan, glossary decision, ADR, and parking-lot updates. **Done:**
   commit `78ec7f2`.
2. Ask for explicit approval to invoke `$to-spec` and create the canonical
   specification under `docs/features/021-content-catalog-spec.md`. **Done:**
   specification published as GitHub issue #168 with `ready-for-agent`.
3. Review the specification and its proposed verification seams with the user.
   **Done:** the approved verification seams and scope were used for the
   published ticket breakdown.
4. Ask for explicit approval to invoke `$to-tickets` and create the dependency-
   ordered ticket document under `docs/features/021-content-catalog-tickets.md`
   plus the GitHub issue tree. **Done:** the approved breakdown is checked in
   and published as child issues #169–#176, all labeled `ready-for-agent`.
5. Implement the approved migration slices while preserving the existing
   learner-history and UI contracts.
6. Run focused content/catalog checks, typecheck, the full relevant suite,
   Chrome/Firefox builds, diff review, and the complete GitHub/Delivery
   handoff.
