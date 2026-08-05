# Feature 023 — Practical Dutch

**Codename:** `practical-dutch`  
**Branch:** `feature/023-practical-dutch`  
**User-facing area:** `Practical Dutch`  
**Pilot:** `Supermarket and shopping`  
**Parent pathway:** `shopping-and-cafes`  
**Status:** Planning complete; awaiting spec approval  
**Prepared:** 2026-08-05

## Decision summary

Practical Dutch adds an authored A1/A2 topic format to the existing Lessons
surface. The supermarket pilot is one Practical Dutch topic inside the existing
`shopping-and-cafes` Practical life pathway. It does not create a new tab,
course, mastery model, scheduler, or content backend.

The feature extends Feature 021's bundled content catalog with one typed,
versioned `practical-dutch` package per topic. A package contains shared topic
metadata and two stable lesson payloads. A topic is released only when both
levels are structurally valid and human-reviewed, but A1 and A2 remain
separately playable and directly selectable.

Existing curated mini-lessons, Saved items, lesson progress, rhythm, grammar,
contrast, Verb Journey evidence, and backups remain compatible. A browser-store
update must not clear, rename, reinterpret, or replace the existing
`dutchmate.learningRecord.v2` record.

## Shared domain model

- **Practical Dutch** is the user-facing Lessons category containing existing
  curated mini-lessons and new Practical Dutch topics.
- A **Practical life pathway** groups related everyday tasks. The pilot reuses
  the stable `shopping-and-cafes` pathway.
- A **Practical Dutch topic** is one reviewed A1/A2 pair inside a pathway.
- A **Practical Dutch lesson** is the richer additive lesson format for one
  level of a topic.
- Existing **Curated mini-lessons** remain their current format and contract;
  they are not mass-converted for this pilot.
- **Published authored content** remains separate from learner-owned local
  records and evidence.

## Learner experience

The Lessons hub renames the existing `Practical Stories` entry to `Practical
Dutch`. The existing 15 lessons remain available through a compatibility
adapter. The pilot adds one topic card showing both levels and their status.

The topic view:

- shows A1 and A2 together;
- recommends A1 first without locking A2;
- promotes A2 after A1 completion;
- keeps each lesson's progress and content version separate; and
- never starts a lesson automatically.

The first-completion flow is approximately five to seven minutes:

```text
Topic overview
  → lesson overview
  → contextual input
  → useful sentences
  → selected phrases and vocabulary
  → one language focus
  → six core exercises
  → choose useful Saved candidates
  → completion
  → optional extra practice
```

Every stage and exercise can be resumed. Finishing core practice without
making the keep decision reopens at keep and does not complete the lesson.

## Additive content contract

Each Practical Dutch lesson contains:

- three to five observable outcomes;
- a brief situation explanation;
- four to eight contextual lines with reviewed Dutch, English, and Telugu;
- eight to twelve independently useful Dutch sentences;
- four to eight reusable chunks;
- eight to fifteen relevant vocabulary items;
- exactly one primary language focus and at most one supporting observation;
- exactly six core exercises;
- six to ten optional extra exercises;
- three to five evidence-supported completion claims; and
- authoring, provenance, version, and review metadata.

The six core exercises are the required first path. Extra exercises support
later review and do not change completion or rhythm counts.

Exercises remain deterministic and click-, tap-, or keyboard-operated. The
pilot reuses existing choice and token-order controls plus the smallest
feature-specific choice variants needed for vocabulary, chunks, dialogue,
substitution, and practical response. It does not implement free typing,
drag-and-drop, audio, images as a requirement, runtime AI, or external
sentence databases.

## Content catalog boundary

The package uses the existing catalog envelope and manifest. The new package
family is typed as `practical-dutch`; it is not a second `content/` tree or a
parallel runtime catalog.

The package owns shared topic metadata and two stable lesson IDs. The package
version controls atomic release; each lesson also carries the content version
used by its own learner-progress key. Stable IDs are never reused for a
different meaning. A meaning-changing edit to Dutch, accepted answers, target
references, exercise semantics, or evidence meaning requires a new content
version.

Production inclusion requires:

- supported package and payload schema versions;
- valid topic and lesson identities;
- both A1 and A2 siblings;
- all references resolving within the package;
- exact content quantities and exercise coverage;
- one unambiguous accepted answer per exercise unless explicitly supported;
- complete reviewed Dutch/English/Telugu learner content;
- original-content provenance; and
- approved Dutch, English, Telugu, and exercise review metadata.

An invalid or unapproved pair is excluded as a whole from the production
manifest. Local authoring/testing may inspect drafts. The released extension
remains bundled and offline-first.

## Runtime and persistence seams

The feature gets a feature-owned session and renderer module, with only a thin
top-level popup route and navigation integration. It reuses the existing
content catalog loader, deterministic answer checking, feedback conventions,
Saved-item merge, rhythm activity, Today/resume selection, and local learning
record boundary.

Practical Dutch progress is an additive optional section in the existing
`dutchmate.learningRecord.v2` record. The storage key is unchanged. A missing
section is treated as empty. Existing `lessonProgress`, Saved items, mastery,
rhythm, grammar, contrast, and Verb Journey evidence are preserved on every
read and write.

Progress is keyed by stable lesson identity plus lesson content version. A new
meaning-changing version creates safe new work while leaving the old record
readable. A1 and A2 do not share completion state.

Backup behavior is additive:

- existing backup versions remain importable;
- new exports include Practical Dutch progress without dropping existing data;
- importing a backup merges newer progress without overwriting unrelated local
  records; and
- a failed parse or migration leaves the prior stored record untouched.

Saving a candidate that already exists from a webpage or another lesson merges
the source and context into the existing learner-owned item. It never creates a
duplicate and never resets mastery.

## Accessibility and interaction requirements

- Dutch is primary; English and Telugu support wrap naturally in the narrow
  popup.
- Learners can operate every control with keyboard input and see focus.
- Feedback is announced through the existing accessible feedback seam.
- Focus moves predictably after stage, exercise, retry, and completion actions.
- Essential content never depends on hover.
- Dutch and Telugu text use the correct language metadata.
- Translations are not revealed before a check when that would give away the
  answer.

## Pilot content decisions

### A1 — Find products and pay

The learner can locate products, ask simple availability or price questions,
request a quantity, find checkout, pay by card, and handle a basic receipt or
bag question. The primary pattern is a reusable `Waar kan ik ... vinden?`
frame. The lesson avoids detailed complaints, refunds, ingredients, and long
service-desk exchanges.

### A2 — Product information and problem resolution

The learner can ask about ingredients or suitability, compare options, report
an incorrect price or product problem, and request a polite resolution. The
primary pattern is `Kunt u controleren of ...?`; `Ik zie dat ...; kunt u dit
controleren?` is supporting material. The lesson avoids legal claims, medical
advice, aggressive complaints, and B1/B2 argumentation.

The pair must use different outcomes, interaction problems, and primary
patterns. Repeated vocabulary is purposeful and does not make A2 a longer copy
of A1.

## Authoring artifacts

These are the canonical feature-coded artifacts:

- `023-practical-dutch-authoring-guide.md` — content quality and review
  contract for humans and agents;
- `023-practical-dutch-authoring-prompt.md` — draft-only prompt for original
  content generation and self-checking;
- `023-practical-dutch-lesson-template.json` — illustrative atomic package
  skeleton;
- `023-practical-dutch-supermarket-pilot-brief.md` — pilot content brief, not
  final learner copy; and
- this plan — architecture, boundaries, acceptance, and delivery sequencing.

The authoring artifacts must not claim that generated content is approved, must
not describe a second catalog, and must not require application-code edits for
an ordinary future topic.

## Implementation sequence

1. **Catalog contract:** add the typed package shape, deep validator, manifest
   inclusion rules, and representative draft/released fixtures.
2. **Pilot package:** author and independently review the supermarket A1/A2
   pair; validate multilingual content, references, counts, and exercise
   coverage.
3. **Runtime adapter:** expose the package through the existing catalog and
   add the feature-owned session/route without changing legacy lesson identity.
4. **Persistence seam:** add the optional Practical Dutch progress section,
   backup compatibility, non-destructive failure behavior, Saved-item merge,
   and resume/recommendation behavior.
5. **Learning flow:** implement context, sentence, phrase/vocabulary, focus,
   six-core, keep, completion, and optional-extra states with accessible
   controls.
6. **Qualification:** run structural/content checks, upgrade-safety fixtures,
   focused popup tests, typecheck, Chrome/Firefox builds, narrow-popup and
   Telugu review, and legacy regression checks.

Implementation tickets should remain vertical slices. A catalog seam and
upgrade-safety slice should gate the pilot runtime slice; final release
qualification should wait for content, runtime, and compatibility slices.

## Test seams

Tests should exercise behavior at the highest stable seam:

- catalog package validation and atomic release filtering;
- deterministic lookup of the topic and its A1/A2 lessons;
- session stage transitions, resume, retry, answer checking, and completion;
- Saved-item merge when a candidate already exists;
- progress persistence after every stage and core exercise;
- old full learning-record fixture preservation through read/write;
- old backup import and new backup round-trip;
- failed migration leaving the original record intact;
- Today/resume recommendation and A1-to-A2 promotion;
- popup keyboard, focus, wrapping, feedback, and error recovery; and
- Chrome/Firefox bundled offline behavior and legacy lesson regression.

Structural tests cannot prove Dutch naturalness, translation quality, or
pedagogical usefulness. Those remain explicit human review gates.

## Acceptance criteria

- The Lessons hub presents `Practical Dutch` without adding navigation.
- Existing curated mini-lessons remain playable and retain their progress.
- The `shopping-and-cafes` pathway contains an atomic supermarket A1/A2 topic.
- A1 and A2 are visible, separately playable, and independently persisted.
- Draft or invalid topic content cannot enter the production manifest.
- The six-core-plus-optional-extra flow is deterministic and resumable.
- Completion requires core practice plus the keep decision and records rhythm
  once.
- Selected candidates merge into existing Saved items without duplicate mastery.
- Existing installed-user records and backup versions remain readable and
  unchanged in meaning after update.
- A full existing-record fixture proves preservation of all prior sections.
- No runtime AI, external content database, remote catalog, account, or new
  scheduler is introduced.
- The adapted authoring artifacts describe this feature accurately and a future
  topic can follow the package contract without editing popup logic.
- The relevant test suite, typecheck, and browser builds pass.

## Out of scope

- A remote content service, runtime content fetch, or content CDN.
- Accounts, cloud learner-data synchronization, or cross-device progress.
- Bulk conversion of the current 15 curated mini-lessons.
- Rewriting existing shopping-and-cafes lessons or merging their completion
  state with the new topic.
- A new mastery model, practice queue, scheduler, Daily Five task family, or
  learner-facing course destination.
- Runtime-generated content, automatic publishing, or external sentence
  databases.
- Free-text grading, audio, speech recognition, drag-and-drop matching, or
  required images.
- B1/B2 content.

## Approval gates

This branch currently contains the plan, adapted authoring artifacts, and
glossary updates only. Before creating the spec, confirm the test seams in this
plan and explicitly approve `$to-spec`. Before creating or publishing tickets,
review the proposed vertical-slice breakdown and explicitly approve
`$to-tickets`.
