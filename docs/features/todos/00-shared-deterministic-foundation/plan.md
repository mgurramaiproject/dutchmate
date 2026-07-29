# Plan: Shared deterministic learning foundation

## Handoff status

- Priority: 0
- Runtime AI: prohibited for this phase
- Production backend: not required
- Purpose: audit compatibility with the shipped deterministic foundation and identify only the minimum seams needed by the first vertical slice
- First consumer: Web Sentence Trainer
- First curated-content consumer: existing A0 grammar patterns, later expanded through the consolidated grammar-content plan

## Goal

Confirm that the existing DutchMate contracts can support Web Sentence Trainer without a duplicate saved-encounter model, scheduler, mastery system, or top-level destination. This plan is a compatibility gate, not permission to build a general learning platform or speculative shared infrastructure.

## Non-goals

- A full CEFR curriculum database or new curriculum registry.
- An admin dashboard.
- Cloud accounts, cross-device sync, or remote analytics.
- A Dutch grammar parser or checker.
- Runtime content generation.
- A universal exercise DSL capable of representing unknown future ideas.
- Replacing the current review/SRS implementation if it can be extended safely.
- A new storage backend, migration, telemetry layer, or admin/content tool unless the audit proves an existing gap blocks the approved first slice.

## First action for Codex CLI: compatibility audit

Before editing code:

1. Read repository instructions and relevant product/design documents.
2. Map the current tabs, popup routes, local storage, vocabulary model, review scheduler, lesson loading, test setup, and build/release process.
3. Identify existing IDs and schemas that can be extended instead of duplicated.
4. Trace the existing Save, `LearningContext`, `LearningEncounter`, grammar exercise, Daily Five, and review-result flows.
5. Produce a short compatibility note listing:
   - components to reuse;
   - whether a migration is actually required;
   - the smallest proposed new seam, if any;
   - assumptions or conflicts;
   - exact scope of the Web Sentence Trainer vertical slice;
   - tests that prove existing behavior remains intact.
6. Stop and ask the user before making a decision that changes existing UI placement, storage ownership, or released behavior.
7. Do not implement the later phases below as part of this audit.

## Architectural boundaries

### 1. Curriculum content

Reuse the repository's current grammar content and loading conventions. Do not introduce a new universal content registry or compile pipeline during this audit. Any later authored content must be versioned, reviewed, and approved before it can ship.

### 2. Learner state

Reuse the existing bounded learning records and canonical scheduler/result contracts. In particular, `LearningEncounter` remains deliberate exposure, not mastery; grammar progression remains bounded local evidence; and contextual practice must not create sentence-specific due dates or a second queue.

### 3. Saved learning item and bounded context

Reuse the existing `LearningItem` plus its bounded `LearningContext[]`. The current Save flow may attach one visible, bounded source context when available and may reuse existing English/Telugu helper fields. Do not add `SavedEncounter`, sentence-specific translation fields, URL/title/domain/history storage, or a context picker for the first slice. Removing context must leave the canonical learning item intact.

### 4. Exercise and result seams

Reuse the existing deterministic grammar exercise primitive and canonical learning-result contract. Web Sentence Trainer v1 needs only two click/keyboard exercise forms: meaning recall with reveal and exact reconstruction when conservative eligibility passes. It must not add a general evaluator, free-form grading, sentence mastery, or a second scheduler.

### 5. Delivery surfaces

- `Saved`: the direct entry point for contextual practice on an expanded saved item.
- `Lessons`: browsable curriculum and internal grammar content families; no new grammar tab is implied.
- `Today` / `Daily Five`: existing surfaces and scheduler; new exercises may be eligible through existing contracts without a fixed feature mix.
- Grammar Minute: a later packaging concept inside existing Today/Daily Five, not a separate destination or scheduler.

## Minimum shared contracts

The audit must verify and document the existing contracts before proposing any new type. Reuse these concepts rather than creating parallel versions:

- `LearningItem` for the canonical saved Dutch target;
- bounded `LearningContext` for supporting source context and existing helper renderings;
- `LearningEncounter` for deliberate exposure only;
- existing deterministic grammar exercise instances and click-only result handling;
- existing grammar learning evidence and canonical vocabulary review results;
- existing Daily Five task shape and scheduler.

Only add a discriminated union or source reference when the first approved slice cannot be expressed through these seams. Any new field must name its owner, migration behavior, privacy impact, and deletion behavior.

## Identity and versioning rules

- IDs are stable, readable, and never derived from array position.
- Content updates use semantic content versions.
- Learner state stores the stable content ID plus last-seen version.
- A migration may retire or remap an ID; never silently attach old progress to semantically different content.
- Deprecated content remains resolvable long enough to migrate queued reviews.
- Build output is deterministic and records source-pack version and checksum.

## Storage and content policy

- Audit the existing storage only; do not select IndexedDB or create a new migration spec without a demonstrated need.
- Preserve existing vocabulary, context, grammar evidence, and export/import behavior.
- Do not add sentence-history, URL/title/domain, raw-answer, response-time, or full-attempt storage.
- Reuse current grammar content and content-version conventions. New authored packs belong in the smallest existing content seam that can validate and load them.
- Never send saved URLs, sentences, contexts, or answers to a server in deterministic mode.

## Validation pipeline

### Structural validation

- Existing content schema and required fields remain valid;
- existing pattern IDs and exercise IDs remain stable;
- only approved authored content enters runtime bundles;
- no empty translations or prompts are introduced;
- no orphan prerequisite or misconception IDs are introduced.

### Deterministic semantic checks

- existing deterministic evaluators remain unambiguous;
- reconstructed Dutch contexts pass conservative eligibility checks;
- exact target text and punctuation handling are deterministic;
- language roles remain explicit: Dutch is the learning language; English/Telugu are helpers only in v1;
- content level and prerequisite references remain coherent.

### Review checks

- draft content cannot enter production bundles;
- approved records require reviewer and review date;
- changed linguistic fields invalidate prior approval unless the change is explicitly non-linguistic;
- source notes distinguish guidance references from copied content;
- all examples are original or appropriately licensed.

## AI-assisted authoring, without runtime AI

Offline AI-assisted authoring remains a future maintainer workflow, not a runtime or Plan 00 implementation requirement. If used later, prompts should require:

- original Dutch examples;
- specified CEFR level and communicative goal;
- English and Telugu translations when requested;
- exact schema;
- notes on uncertain or potentially unnatural choices;
- no claim that content is approved.

Generated files must enter as `draft`. The tooling may reject malformed output, but passing automated validation does not make language content correct.

If content is missing during a later approved content slice, Codex must produce:

1. a content brief;
2. an empty or illustrative draft template;
3. a review checklist;
4. a direct question asking the user to generate/review the requested pack.

## Shared learner scheduling

The audit must confirm that the current scheduler and Daily Five task contract can represent the first approved slice. Do not add a feature-specific queue, fixed five-item composition, new due date, or new mastery mathematics. Contextual presentation is a richer review form for the same canonical learning target.

If a source reference is genuinely required, add the smallest compatible discriminator at the existing seam and prove deterministic tie-breaking, no duplicate target representation, and unchanged due behavior. Otherwise record “no schema change required.”

## Privacy, safety, accessibility, and localization

- Context capture is bounded and occurs through the existing explicit Save flow when visible context is available.
- Do not store more surrounding webpage text than required.
- Allow click-only removal of context while retaining the saved word; do not add typed context editing in v1.
- Treat browsing sentences and URLs as private personal data.
- All interactions are keyboard operable and work within popup dimensions.
- Feedback is not color-only; use text/icons and accessible live regions.
- Dutch examples use correct Unicode and punctuation.
- UI strings are separate from lesson content.
- Translation display must label target/source language and avoid implying word-for-word equivalence.

## Implementation phases

### Phase 0 — compatibility audit only

- Deliver the architecture note and no speculative refactor.
- Identify the exact existing modules and contracts the Web Sentence Trainer will reuse.
- Confirm whether any migration or new field is required; default answer is no.
- Confirm the two click-only exercise forms and conservative Dutch-source eligibility boundary.
- Record the focused verification commands and regression checks for the first feature.

Later contract, content, and learner-state work belongs to the approved feature plan that consumes it. Do not implement those phases from Plan 00.

## Test strategy

- schema unit tests;
- validator failure fixtures;
- deterministic compiler snapshot/checksum tests;
- evaluator normalization and ambiguity tests;
- storage migration tests using realistic existing records;
- scheduler source-mixing tests;
- privacy tests proving no network request is made;
- build tests in Firefox-compatible extension environment;
- regression tests for existing tabs, reviews, heatmaps, options, and saved vocabulary.

## Audit gate

Plan 00 is complete only when:

- the current Save, context, grammar exercise, learning-result, review, and Daily Five seams are documented;
- the Web Sentence Trainer can be scoped without a duplicate item, encounter, scheduler, or translation request;
- Dutch-source-only reconstruction eligibility is defined and testable;
- existing data migration is explicitly marked unnecessary or justified with evidence;
- existing tabs, saved vocabulary, grammar progression, and Daily Five behavior have regression checks identified;
- no network/AI dependency or speculative platform layer is introduced;
- the user approves the revised Web Sentence Trainer slice before implementation.

## Stop-and-ask conditions

Codex must pause for user direction if:

- existing storage cannot hold context safely and a migration choice risks data;
- an existing schema conflicts with the proposed stable-ID model;
- a backend appears necessary;
- a requested exercise cannot be evaluated deterministically;
- curriculum content is needed but has not been reviewed;
- implementing the foundation would require a new top-level tab or removal of current UI.
