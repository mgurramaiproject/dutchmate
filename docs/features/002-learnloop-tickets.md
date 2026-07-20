# 002-learnloop: Implementation Tickets

Parent specification: [GitHub issue #31](https://github.com/mgurramaiproject/dutchmate/issues/31)

Local specification: [002-learnloop-spec.md](./002-learnloop-spec.md)

Lesson contract: [002-learnloop-mini-lesson-pattern.md](./002-learnloop-mini-lesson-pattern.md)

Approved popup design: [002-learnloop-approved-popup-design.html](./002-learnloop-approved-popup-design.html)

Deferred scope: [002-learnloop-feature-parking-lot.md](./002-learnloop-feature-parking-lot.md)

## Delivery rules

- Implement one frontier ticket at a time in dependency order. A ticket is a frontier only when every ticket in its `Blocked by` field is complete.
- Start each ticket from the live GitHub issue and the source documents above. Treat the issue checklist as live progress tracking and commit completed checklist changes with the implementation.
- Keep the feature on `feature/002-learnloop` unless the approved delivery workflow establishes a different branch or worktree for an individual ticket.
- Preserve local-only learning data, the fixed Dutch learning / English bridge / Telugu native-language roles, the no-typing interaction, and the existing black, white, and orange design system.
- Use the typed background learning contract as the main integration seam, the content capture boundary for webpage behavior, public popup state and view models for UI behavior, one lesson-catalog validator for bundled content, and existing generated-build checks for Chrome and Firefox.
- Use the approved Daily Edition shell for Today and focused review. Use its explicit `Read | Notice | Practise | Keep` rail for focused lessons; do not retain the exploratory variant switcher or losing layouts.
- Run focused tests during development. Before completing a ticket, run `corepack pnpm test`, `corepack pnpm typecheck`, and any browser build or release verification named by that ticket.
- Do not pull parked features into an implementation ticket. In particular, do not add accounts, synchronization, telemetry, typed answers, AI-generated lessons, audio, passive page scanning, full-page highlighting, game economies, or Telugu-as-the-learning-language mode.
- Commit every meaningful completed slice. Stop at ticket boundaries for approval before starting the next ticket.

## Dependency map

```text
T01
├── T02 ── T03 ───────────────┐
│   └──────────────┐           │
└── T04 ── T05 ── T06 ──┬── T07 ──┐
                         ├── T08 ──┤
T02 + T04 + T06 ── T10 ──┤         ├── T12
T02 + T03 + T04 + T06 + T10 ─ T11 ┤
                         └── T09 ──┘
```

After T01, T02 and T04 are independent frontiers. After T06, the three lesson-library batches can be authored and reviewed independently. T01 expands the data model without removing compatibility; T11 contracts the transitional model only after every active consumer has moved.

## T01 — Migrate vocabulary into language-keyed learning records

**GitHub:** [#32](https://github.com/mgurramaiproject/dutchmate/issues/32)

**Blocked by:** None

**Outcome:** An existing learner upgrades without losing saved words, meanings, review history, or backup compatibility. The extension reads and writes a canonical Dutch learning record while current popup and Options behavior remains usable through a temporary compatibility boundary.

### Scope

- Introduce the language-keyed learning-item identity and record described by the specification, including word/chunk kind, meanings, sources, contexts, recognition mastery, recall mastery, and timestamps.
- Add an idempotent migration from current saved-vocabulary and review-card storage. Preserve Dutch, English, and Telugu data and conservatively map existing review evidence.
- Put learning-item persistence and mutation behind the typed background message handler with in-memory storage and an injected clock available to tests.
- Upgrade export/import to the new learning-backup version while retaining validated import support for current version-one vocabulary backups.
- Keep existing popup summary/review and Options vocabulary-management paths working during expansion. Do not delete legacy read compatibility or storage yet.

### Acceptance criteria

- [x] Canonical IDs include the explicit learning-language key and normalized Dutch form.
- [x] Words and future meaningful chunks use the same learning-item record.
- [x] Migration is idempotent and never creates duplicate items when initialization runs more than once.
- [x] Existing English and Telugu meanings, source metadata, page context, and review timestamps are preserved where present.
- [x] Existing ratings are mapped conservatively into separate recognition and recall dimensions without overstating mastery.
- [x] The typed background contract can list, summarize, create or merge, delete, clear, import, and export learning records.
- [x] A new-version export includes learning items, mastery, sources, capped contexts, lesson-progress storage, and rhythm storage, even when the latter two are initially empty.
- [x] Import validates the format and version before changing storage; malformed and unsupported documents leave local data unchanged.
- [x] Import conflicts preserve newer local mastery while safely filling missing meanings and contexts.
- [x] Current version-one backups remain importable.
- [x] Provider credentials, translation-cache entries, raw page content outside capped contexts, and unrelated settings remain excluded.
- [x] Existing popup and Options vocabulary behavior still works after migration.
- [x] Clearing vocabulary remains explicitly confirmed and clears associated learning state without touching unrelated settings.

### Verification

- [x] Focused tests cover empty migration, representative legacy migration, partial translations, repeated migration, conflict merging, malformed import, unsupported versions, version-one import, new-version round-trip, and excluded data.
- [x] Background-handler integration tests use in-memory storage and a deterministic clock rather than private-helper mocks.
- [x] `corepack pnpm test` passes.
- [x] `corepack pnpm typecheck` passes.
- [x] `corepack pnpm build:chrome` and `corepack pnpm build:firefox` pass because storage and runtime contracts affect every extension entry point.

### Not in this ticket

Meaningful-chunk capture UI, encounter history, Daily Five, new popup navigation, lesson UI/content, calm engagement, and removal of the legacy compatibility path.

## T02 — Capture confirmed meaningful chunks from webpages

**GitHub:** [#33](https://github.com/mgurramaiproject/dutchmate/issues/33)

**Blocked by:** [T01 / #32](https://github.com/mgurramaiproject/dutchmate/issues/32)

**Outcome:** A learner can select a useful two-to-eight-token Dutch chunk, inspect its normalized form, helper meanings, and local context, and explicitly keep it in the same vocabulary used for saved words.

### Scope

- Extend the content selection boundary to distinguish an eligible single word, an eligible chunk candidate, and an arbitrary or unsupported selection.
- Show a lightweight confirmation state for chunk candidates before persistence. Display normalized Dutch, English and Telugu meaning status, and capped page context.
- Send confirmed chunks through the typed background learning contract so duplicates merge canonically with existing webpage or lesson items.
- Preserve current opt-in automatic saving only for eligible single words. Multiword selections always require item-level confirmation.

### Acceptance criteria

- [x] A chunk candidate has two to eight Unicode word tokens, at most eighty characters, one line, and no sentence-ending punctuation.
- [x] Whitespace and Dutch text are normalized before the confirmation is shown and before identity is calculated.
- [x] The confirmation distinguishes an unavailable helper meaning from a completed translation.
- [x] Confirming creates or enriches exactly one Dutch learning item with webpage provenance and capped local context.
- [x] Cancelling or dismissing confirmation creates no learning item, mastery, context, or due work.
- [x] Re-saving a canonical match enriches the existing item instead of creating a duplicate.
- [x] Overlong, multiline, sentence-like, or otherwise arbitrary selections remain translatable but cannot be saved as learning chunks.
- [x] Existing eligible single-word saving still works.
- [x] Automatic saving never saves a multiword selection, even when automatic single-word saving is enabled.
- [x] The popup and Options vocabulary surfaces can render a saved chunk without assuming that every item is one word.
- [x] Capture errors are recoverable and do not leave partial records.

### Verification

- [x] Content-boundary tests cover eligible words, eligible chunks, punctuation, Unicode tokens, length limits, whitespace, confirmation, cancellation, missing meanings, duplicate merging, and automatic-save gating.
- [x] Background-handler tests prove confirmed chunk persistence and atomic failure behavior.
- [x] Popup and Options tests cover rendering and deleting a meaningful chunk.
- [x] `corepack pnpm test` passes.
- [x] `corepack pnpm typecheck` passes.
- [x] Both browser builds pass.

### Not in this ticket

Automatic chunk suggestions, saving arbitrary sentences, passive page scanning, automatic highlighting, or mastery changes caused by exposure.

## T03 — Remember deliberate encounters with saved language

**GitHub:** [#34](https://github.com/mgurramaiproject/dutchmate/issues/34)

**Blocked by:** [T02 / #33](https://github.com/mgurramaiproject/dutchmate/issues/33)

**Outcome:** When a learner deliberately hovers or selects a saved Dutch word or chunk on a webpage, DutchMate quietly shows `Seen before` and remembers a small, local set of authentic contexts without treating exposure as successful recall.

### Scope

- Match deliberate translation interactions against canonical saved words and chunks at the content/background boundary.
- Record a local encounter only after a hover or selection interaction that already belongs to DutchMate's translation flow.
- Maintain the specified capped, deduplicated context history and expose it where a review card needs a contextual cue.
- Render a subtle `Seen before` state in the existing translation surface without scanning or decorating the full page.

### Acceptance criteria

- [x] Passive page load, scrolling, mutation observation, and ordinary text presence create no encounter.
- [x] A deliberate hover or selection that matches a saved canonical item can record one encounter.
- [x] Context text is at most 240 characters, contains the learning item, and remains local.
- [x] Each item retains at most three contexts; repeated identical contexts are deduplicated and the oldest context is evicted when necessary.
- [x] Encounter timestamps and contexts merge through the background learning contract.
- [x] A matching interaction can show `Seen before` without covering or permanently highlighting page text.
- [x] Encounter recording does not change recognition or recall mastery, schedule due work, or count as a Daily Five answer.
- [x] Unsaved text and failed or cancelled interactions create no learning history.
- [x] Both words and meaningful chunks are supported.
- [x] Review presentation can use a stored context as a cue without exposing unrelated browsing data.

### Verification

- [x] Content tests cover deliberate versus passive events, saved and unsaved matches, word and chunk matches, and cue rendering.
- [x] Background tests cover deduplication, cap/eviction order, timestamp behavior, and separation from mastery.
- [x] `corepack pnpm test` passes.
- [x] `corepack pnpm typecheck` passes.
- [x] Both browser builds pass.

### Not in this ticket

Automatic webpage highlighting, complete-page saved-item scanning, browsing history, telemetry, or exposure-based mastery promotion.

## T04 — Deliver contextual mastery through Daily Five

**GitHub:** [#35](https://github.com/mgurramaiproject/dutchmate/issues/35)

**Blocked by:** [T01 / #32](https://github.com/mgurramaiproject/dutchmate/issues/32)

**Outcome:** The popup opens on Today and offers one calm Daily Five practice action. A learner reveals each answer and taps only `Again` or `Got it`; DutchMate targets recognition or recall internally and keeps the current queue stable.

### Scope

- Implement separate recognition and recall mastery schedules, weaker-dimension selection, binary results, and the approved initial transitions.
- Generate and persist a stable Daily Five snapshot through the typed background learning contract.
- Replace the current choice among new, due, and all-card primary modes with the Today experience and focused no-typing review flow.
- Update the toolbar badge from due Daily Five work and keep Settings reachable through a header control.

### Acceptance criteria

- [x] Today is the popup's default area and exposes one primary Daily Five action.
- [x] A Daily Five snapshot contains at most five distinct learning items with at most one tested dimension per item.
- [x] Due, previously attempted tasks are selected before unattempted items; stable tie-breaking makes the snapshot deterministic.
- [x] The snapshot does not reorder when a result changes storage during the session.
- [x] A new item starts with recognition; later direction targets the weaker or earlier-due dimension.
- [x] Dutch-to-helper or Dutch-to-context practice tests recognition; helper-or-context-to-Dutch practice tests recall.
- [x] The answer must be revealed before `Again` or `Got it` is enabled, and no review state requires typing.
- [x] `Got it` applies the approved New to Learning, Learning to Familiar, Familiar to Strong, and Strong interval rules only to the tested dimension.
- [x] `Again` resets only the tested dimension, schedules it for one day, and applies the approved limited regression.
- [x] Overall mastery is the weaker of recognition and recall.
- [x] Five completed tasks finish the daily goal; if fewer than five are available, completing all available tasks is valid.
- [x] A learner may continue voluntarily after completion.
- [x] An empty queue suggests a lesson but never starts one automatically.
- [x] The toolbar badge updates on initialization and relevant save, result, import, clear, and delete mutations while respecting the badge setting.
- [x] Today communicates understandable status and progress without exposing interval controls or algorithm jargon.
- [x] Focused review hides top-level navigation, offers an explicit exit, preserves visible focus, and fits a narrow Chrome or Firefox popup without horizontal scrolling.

### Verification

- [x] Exhaustive domain tests cover both dimensions, every approved success and failure transition, interval cap, weaker-dimension choice, due classification, and stable tie-breaking with an injected clock.
- [x] Background-handler tests cover snapshot creation, persistence, binary result mutations, completion, continuation, empty and short queues, and badge updates.
- [x] Popup state/view tests cover Today, front/reveal/result transitions, no-typing controls, progress, exit, errors, and completion.
- [x] Rendered checks cover roles, labels, keyboard order, visible focus, pending states, and narrow-popup sizing.
- [x] `corepack pnpm test`, `corepack pnpm typecheck`, and both browser builds pass.

### Not in this ticket

Mini-lesson catalog/content, personalized scheduling controls, typed answers, spelling tests, user-selected intervals, streaks, or game rewards.

## T05 — Deliver one complete micro-story lesson

**GitHub:** [#36](https://github.com/mgurramaiproject/dutchmate/issues/36)

**Blocked by:** [T04 / #35](https://github.com/mgurramaiproject/dutchmate/issues/35)

**Outcome:** The Lessons area contains one complete representative lesson, `A1 · Een afspraak maken`, that proves the bundled content contract and the entire Read, Notice, Practise, Replay and keep loop. Kept candidates enter the same learning record and Daily Five system.

### Scope

- Add the popup's `Today | Lessons` top-level navigation, keeping Settings in the header and hiding navigation during focused lesson/review flows.
- Define the versioned bundled lesson catalog and one public validator.
- Author and human-review the representative appointment lesson in Dutch, English, and Telugu.
- Implement all four lesson stages, line-level helper reveal, shared flashcard practice, candidate selection, and atomic keep behavior through the background contract.

### Acceptance criteria

- [x] Lessons is a distinct top-level area beside Today; Settings is not a third primary tab.
- [x] The catalog has a stable version and the lesson has stable identifiers, pathway, order, CEFR-prefixed title, and three-to-five-minute duration metadata.
- [x] `A1 · Een afspraak maken` contains one coherent four-to-six-line, 35-to-60-word Dutch micro-story with complete English and Telugu line help.
- [x] The lesson teaches one practical pattern with only the grammar needed to use it.
- [x] It defines three to five reusable candidate words or chunks and structurally valid practice prompts.
- [x] Read presents Dutch as the visual anchor and reveals English or Telugu help line by line.
- [x] Notice highlights only the active pattern or learning item in orange.
- [x] Practise reuses the same reveal, `Again`, and `Got it` controls as Daily Five and requires no typing.
- [x] Replay shows the story with reduced helper support before the keep decision.
- [x] Candidates are preselected, removable, and committed by one `Keep N for review` action.
- [x] Keeping is atomic and creates or merges canonical learning items with lesson provenance; an existing saved item is not duplicated.
- [x] Unchosen candidates create no durable learning item, mastery, or due work.
- [x] Leaving a focused lesson returns predictably to Lessons.
- [x] The validator rejects structural violations with actionable lesson identifiers and fields.
- [x] Dutch, English, Telugu, CEFR, cultural, and practical-use review is recorded; structural validation is not treated as linguistic review.

### Verification

- [ ] Catalog-validator tests cover every structural rule and representative malformed fixtures.
- [x] Background tests cover atomic keep, canonical merge, lesson provenance, and unchanged storage after failure.
- [ ] Popup tests cover navigation and all four stages, helper reveal, shared practice controls, selection, keep success/failure, and exit.
- [ ] Rendered keyboard, focus, reduced-motion, and narrow-popup checks pass.
- [x] `corepack pnpm test`, `corepack pnpm typecheck`, and both browser builds pass.

### Not in this ticket

The remaining eleven lessons, remote catalogs, generated or personalized lessons, audio, decorative illustration, or a separate lesson mastery system.

## T06 — Make lessons resumable, replayable, and duplicate-safe

**GitHub:** [#37](https://github.com/mgurramaiproject/dutchmate/issues/37)

**Blocked by:** [T05 / #36](https://github.com/mgurramaiproject/dutchmate/issues/36)

**Outcome:** Closing and reopening the popup never loses meaningful lesson progress, replay never duplicates saved candidates, and bundled content can evolve safely through explicit versions.

### Scope

- Persist learner progress separately from immutable bundled content, keyed by lesson and content version.
- Resume the last incomplete lesson at a safe stage and permit completed lessons to be replayed without erasing mastery.
- Show candidate state from the canonical learning record, including `Already saved`, and make repeated keep actions idempotent.
- Define safe fallback behavior for missing, invalid, or version-changed lesson content.

### Acceptance criteria

- [ ] Progress records contain only stable lesson identity/version and learner state, not copied catalog content.
- [ ] Closing the popup after Read, Notice, Practise, or Replay resumes at the documented safe state.
- [ ] A completed lesson remains replayable and retains its completion record.
- [ ] Replay does not reset recognition/recall mastery or create duplicate due work.
- [ ] Already-kept candidates are labeled `Already saved` and resolve to the same canonical learning item.
- [ ] Repeating `Keep N for review` is idempotent and atomic.
- [ ] A lesson version change is handled explicitly rather than silently applying incompatible old progress.
- [ ] Missing or invalid catalog entries show a recoverable Lessons error and do not corrupt progress.
- [ ] Import/export round-trips lesson progress and resolves conflicts without rescheduling newer local mastery.
- [ ] Clearing learning data removes associated lesson progress only after the existing explicit confirmation.

### Verification

- [ ] Background tests cover progress read/write, resume, completion, replay, duplicate keep, version changes, import/export, and clear behavior.
- [ ] Popup tests cover restoration at every stage, `Already saved`, completed replay, invalid content, and recoverable errors.
- [ ] Catalog validation remains the only structural publication seam.
- [ ] `corepack pnpm test`, `corepack pnpm typecheck`, and both browser builds pass.

### Not in this ticket

Remote content migration, downloadable lesson packs, cross-device progress, content personalization, or the remaining lesson library.

## T07 — Publish starter lessons 1–4

**GitHub:** [#38](https://github.com/mgurramaiproject/dutchmate/issues/38)

**Blocked by:** [T06 / #37](https://github.com/mgurramaiproject/dutchmate/issues/37)

**Outcome:** The first-conversations and shopping/cafe pathway is available as four reviewed, validated micro-story lessons.

### Lessons

1. `A0 · Hallo, ik ben…`
2. `A1 · Kunt u dat herhalen?`
3. `A1 · Ik wil graag bestellen`
4. `A1 · Kan ik met pin betalen?`

### Acceptance criteria

- [ ] Each lesson follows the checked-in mini-lesson pattern and has a stable ID, pathway, order, content version, CEFR title, and duration.
- [ ] Each lesson contains one coherent four-to-six-line, 35-to-60-word Dutch story and one naturally reused practical pattern.
- [ ] Each Dutch line has accurate, clear English and Telugu help.
- [ ] Each lesson has three to five reusable candidates with stable canonical identities and valid recognition/recall prompts.
- [ ] Vocabulary and grammar load fit the stated A0 or A1 level.
- [ ] Situations are credible in the Netherlands, culturally suitable, and useful within days rather than generic tourist trivia.
- [ ] Replay remains understandable with reduced support.
- [ ] All four lessons pass the one catalog validator.
- [ ] Human review explicitly records Dutch accuracy, English meaning, Telugu meaning, CEFR fit, cultural suitability, and practical usefulness.
- [ ] Any content-review correction is made in the bundled source and covered by validation before completion.

### Verification

- [ ] Validator tests load the real bundled catalog rather than duplicated lesson fixtures.
- [ ] Focused popup tests sample catalog ordering, opening each lesson, helper availability, candidate rendering, and replay.
- [ ] `corepack pnpm test` and `corepack pnpm typecheck` pass.
- [ ] Both browser builds include the validated catalog.

### Not in this ticket

Lessons 5–12, audio, animation rewards, remote content, or automated claims about linguistic quality.

## T08 — Publish starter lessons 5–8

**GitHub:** [#39](https://github.com/mgurramaiproject/dutchmate/issues/39)

**Blocked by:** [T06 / #37](https://github.com/mgurramaiproject/dutchmate/issues/37)

**Outcome:** The transport, appointments, and healthcare pathway is available as four reviewed, validated micro-story lessons.

### Lessons

5. `A1 · Waar moet ik overstappen?`
6. `A1 · Mijn trein is vertraagd`
7. `A1 · Een afspraak maken`
8. `A1 · Ik heb last van…`

The representative lesson from T05 becomes the reviewed catalog entry for lesson 7; do not maintain a duplicate fixture and production copy.

### Acceptance criteria

- [ ] Each lesson follows the checked-in mini-lesson pattern and has a stable ID, pathway, order, content version, CEFR title, and duration.
- [ ] Each lesson contains one coherent four-to-six-line, 35-to-60-word Dutch story and one naturally reused practical pattern.
- [ ] Each Dutch line has accurate, clear English and Telugu help.
- [ ] Each lesson has three to five reusable candidates with stable canonical identities and valid recognition/recall prompts.
- [ ] Vocabulary and grammar load fit A1 without hiding necessary practical meaning.
- [ ] Transport and healthcare situations use credible Dutch wording and avoid unsafe medical claims or culture-specific assumptions.
- [ ] Replay remains understandable with reduced support.
- [ ] All four lessons pass the one catalog validator.
- [ ] Human review explicitly records Dutch accuracy, English meaning, Telugu meaning, CEFR fit, cultural suitability, and practical usefulness.
- [ ] The T05 lesson is promoted into the canonical catalog without changing saved candidate identity or learner progress unexpectedly.

### Verification

- [ ] Validator tests load the real bundled catalog and catch duplicate IDs, order, candidates, or production/fixture copies.
- [ ] Focused popup tests sample catalog ordering, opening each lesson, helper availability, candidate rendering, and replay.
- [ ] `corepack pnpm test` and `corepack pnpm typecheck` pass.
- [ ] Both browser builds include the validated catalog.

### Not in this ticket

Lessons 1–4 or 9–12, medical advice, audio/pronunciation feedback, remote content, or automated claims about linguistic quality.

## T09 — Publish starter lessons 9–12

**GitHub:** [#40](https://github.com/mgurramaiproject/dutchmate/issues/40)

**Blocked by:** [T06 / #37](https://github.com/mgurramaiproject/dutchmate/issues/37)

**Outcome:** The home, work/study, and official-life pathway is available as four reviewed, validated micro-story lessons, completing the twelve-lesson starter library.

### Lessons

9. `A1 · Er is iets kapot`
10. `A1 · Ik ben beschikbaar op…`
11. `A1 · Wat moet ik meenemen?`
12. `A2 · Wat staat er in deze brief?`

### Acceptance criteria

- [ ] Each lesson follows the checked-in mini-lesson pattern and has a stable ID, pathway, order, content version, CEFR title, and duration.
- [ ] Each lesson contains one coherent four-to-six-line, 35-to-60-word Dutch story and one naturally reused practical pattern.
- [ ] Each Dutch line has accurate, clear English and Telugu help.
- [ ] Each lesson has three to five reusable candidates with stable canonical identities and valid recognition/recall prompts.
- [ ] Vocabulary and grammar load fit the stated A1 or A2 level.
- [ ] Home, work/study, and official-letter situations are credible, inclusive, and avoid implying legal or administrative advice.
- [ ] Replay remains understandable with reduced support.
- [ ] All four lessons pass the one catalog validator, and the complete catalog has exactly the accepted twelve lessons in order.
- [ ] Human review explicitly records Dutch accuracy, English meaning, Telugu meaning, CEFR fit, cultural suitability, and practical usefulness.
- [ ] The catalog makes the full practical-life pathway understandable without claiming to be a complete A0–A2 curriculum.

### Verification

- [ ] Validator tests load the complete real catalog and enforce all twelve accepted titles and their ordering.
- [ ] Focused popup tests sample catalog grouping/order, opening each lesson, helper availability, candidate rendering, and replay.
- [ ] `corepack pnpm test` and `corepack pnpm typecheck` pass.
- [ ] Both browser builds include the complete validated catalog.

### Not in this ticket

Lessons beyond the accepted starter library, legal/administrative advice, audio, remote content, or automated claims about linguistic quality.

## T10 — Add the calm learning rhythm

**GitHub:** [#41](https://github.com/mgurramaiproject/dutchmate/issues/41)

**Blocked by:** [T02 / #33](https://github.com/mgurramaiproject/dutchmate/issues/33), [T04 / #35](https://github.com/mgurramaiproject/dutchmate/issues/35), [T06 / #37](https://github.com/mgurramaiproject/dutchmate/issues/37)

**Outcome:** Today reflects gentle weekly consistency and meaningful learning milestones without punishing missed days or introducing a separate reward economy.

### Scope

- Record local active days from Daily Five completion or lesson completion.
- Present a compact seven-day rhythm with one grace-day behavior and supportive reset copy.
- Surface meaningful, non-spendable milestones tied to saved chunks, balanced recognition/recall, and lesson pathways.
- Keep rhythm and milestone data inside versioned learning backup/import behavior.

### Acceptance criteria

- [ ] A day becomes active after Daily Five completion or lesson completion, not after opening the extension or translating arbitrary text.
- [ ] Repeated qualifying activity on one local calendar day remains one active day.
- [ ] The seven-day view uses the learner's local date consistently across restarts and deterministic tests.
- [ ] One missed day can be shown as grace; longer gaps reset gently without loss language, countdown pressure, or fabricated rewards.
- [ ] Milestones represent meaningful evidence such as first saved chunk, balanced recognition/recall, or completion of a practical pathway.
- [ ] Milestones do not unlock unrelated decoration, create currency, or imply mastery from activity alone.
- [ ] Today remains compact and the Daily Five action is still visually primary.
- [ ] Rhythm and milestone mutations happen through the background contract and survive export/import.
- [ ] Clearing learning data removes rhythm/milestones only after explicit confirmation.
- [ ] No telemetry or account is introduced.

### Verification

- [ ] Deterministic-clock tests cover local-day boundaries, repeated same-day activity, grace behavior, reset behavior, import conflicts, and clear.
- [ ] Popup tests cover compact weekly presentation, milestone copy, keyboard access, narrow sizing, empty history, and reduced-motion behavior.
- [ ] `corepack pnpm test`, `corepack pnpm typecheck`, and both browser builds pass.

### Not in this ticket

Endless streak pressure, XP, levels, coins, collectibles, avatars, leaderboards, social challenges, telemetry, or notification campaigns.

## T11 — Contract the legacy review-card model

**GitHub:** [#42](https://github.com/mgurramaiproject/dutchmate/issues/42)

**Blocked by:** [T02 / #33](https://github.com/mgurramaiproject/dutchmate/issues/33), [T03 / #34](https://github.com/mgurramaiproject/dutchmate/issues/34), [T04 / #35](https://github.com/mgurramaiproject/dutchmate/issues/35), [T06 / #37](https://github.com/mgurramaiproject/dutchmate/issues/37), [T10 / #41](https://github.com/mgurramaiproject/dutchmate/issues/41)

**Outcome:** Every active learning consumer uses the canonical language-keyed record. Transitional legacy writes are removed without stranding existing storage or version-one backups.

### Scope

- Inventory popup, Options, content, background, badge, backup, and clear paths and move every active consumer to the typed learning contract.
- Remove transitional dual-write or legacy write behavior introduced by T01 after proving no current surface depends on it.
- Retain only the minimal, explicit migration/import compatibility required for upgrades and version-one backups.
- Remove obsolete review mode and card-direction settings only where the approved Today behavior has made them inapplicable, preserving unrelated settings.

### Acceptance criteria

- [ ] Popup Today/Lessons, Options vocabulary management, content capture/encounters, badge, backup/import, delete, and clear use the canonical learning contract.
- [ ] No normal runtime mutation writes the legacy saved-vocabulary or review-card format.
- [ ] Upgrade migration from a real representative legacy snapshot remains idempotent and tested.
- [ ] Version-one backup import remains supported and maps to canonical learning records.
- [ ] Existing meanings, contexts, sources, mastery, lesson progress, and rhythm remain intact after contraction.
- [ ] Removing obsolete review choices does not remove unrelated translation, cache, provider, badge, or context settings.
- [ ] Persistent-page import still avoids native file-picker popup dismissal and reports an understandable result.
- [ ] Delete and clear behavior is consistent across Today, Lessons, Options, badge, progress, and backup.
- [ ] Dead compatibility code and tests are removed only after equivalent public-contract coverage exists.
- [ ] No parked scope is introduced during cleanup.

### Verification

- [ ] Migration, import, popup, Options, content, background, badge, and clear regression tests exercise public seams after legacy writes are removed.
- [ ] A repository search confirms no unintended normal-runtime legacy storage writes remain.
- [ ] `corepack pnpm test` passes.
- [ ] `corepack pnpm typecheck` passes.
- [ ] `corepack pnpm build:chrome` and `corepack pnpm build:firefox` pass.
- [ ] `corepack pnpm verify:release` passes if packaged output contracts changed.

### Not in this ticket

Deleting support for real legacy upgrades, changing language roles, unrelated architecture refactors, or adding new product behavior.

## T12 — Verify and prepare the complete Learnloop release

**GitHub:** [#43](https://github.com/mgurramaiproject/dutchmate/issues/43)

**Blocked by:** [T07 / #38](https://github.com/mgurramaiproject/dutchmate/issues/38), [T08 / #39](https://github.com/mgurramaiproject/dutchmate/issues/39), [T09 / #40](https://github.com/mgurramaiproject/dutchmate/issues/40), [T11 / #42](https://github.com/mgurramaiproject/dutchmate/issues/42)

**Outcome:** The complete `002-learnloop` initiative has reproducible automated and manual evidence for migration, learning behavior, content, accessibility, and Chrome/Firefox delivery, plus a concrete post-release learner-validation protocol.

### Scope

- Run and record the full automated, build, package, manifest, and browser-popup verification appropriate to the final extension.
- Complete and record the human lesson-content acceptance gate for the twelve bundled lessons.
- Exercise migration and both backup versions against representative data.
- Update manual-testing and relevant release/privacy/store documentation for the learner-visible behavior and local data boundary.
- Define the small voluntary learner-validation protocol without adding background telemetry.

### Acceptance criteria

- [ ] Focused learning tests, the complete regression suite, and typecheck pass from a clean checkout.
- [ ] Chrome and Firefox builds contain background, content, popup, Options, icons, bundled catalog, correct browser-specific declarations, and correct popup entry points.
- [ ] Packaged-output verification passes for both browsers and generated manifests are inspected.
- [ ] Manual Chrome and Firefox checks cover narrow popup dimensions, Today, Daily Five, Settings access, Lessons, focused-flow exit, import, and representative webpage capture/encounter behavior.
- [ ] Keyboard order, visible focus, roles/labels, pending/disabled states, reduced motion, and absence of horizontal scrolling are checked and recorded.
- [ ] A representative pre-`002-learnloop` storage snapshot migrates without lost meanings or review history.
- [ ] New-version export/import round-trips the complete learning record and version-one import remains successful.
- [ ] All twelve lessons pass structural validation and have recorded Dutch, English, Telugu, CEFR, cultural, and practical-use acceptance.
- [ ] Privacy and store-facing documentation accurately describe local learning items, capped contexts, lesson progress, rhythm, and excluded credentials/cache data.
- [ ] Manual testing documentation records environments, commit, results, and any consciously deferred browser-only checks.
- [ ] The post-release learner protocol checks delayed Familiar/Strong retention and reduced-support story comprehension with a small voluntary Telugu-speaking Dutch-learner cohort.
- [ ] The protocol does not treat review count, lesson completion, time in product, or background analytics as proof of learning.
- [ ] Any defect found is fixed in the owning ticket's seam or recorded as a separate blocked issue before this ticket completes.

### Verification commands

- [ ] `corepack pnpm test`
- [ ] `corepack pnpm typecheck`
- [ ] `corepack pnpm build:chrome`
- [ ] `corepack pnpm build:firefox`
- [ ] `corepack pnpm verify:release`
- [ ] `git diff --check`

### Not in this ticket

Publishing a browser-store release, executing a long-running research study, collecting background telemetry, or expanding the accepted feature/content scope.
