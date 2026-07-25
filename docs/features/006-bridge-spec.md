# 006-bridge: Cross-language capture and source-aware lookup specification

**Feature code:** `006-bridge`

**Branch:** `feature-006-bridge`

**Plan:** [006-bridge-plan.md](./006-bridge-plan.md)

**ADR:** [0006-006-bridge-cross-language-capture-keeps-dutch-learning-key.md](../adr/0006-006-bridge-cross-language-capture-keeps-dutch-learning-key.md)

## Problem Statement

DutchMate is intended for learners who move between Dutch, English, and Telugu webpages, but the current browsing-to-fluency loop is not consistent across those sources. English and Telugu selections can fail to expose a useful Save path, their original sentences can be lost or rejected because they do not contain Dutch, and saved-item matching only recognizes the Dutch form. Telugu hover can request a same-language result or fail to render a useful popup. Partial target failures can discard otherwise useful translations, and the Saved view does not yet distinguish original context language from helper translations across multiple recent contexts.

These failures make deliberate cross-language capture unreliable and can silently attach the wrong learning identity or context. The feature must preserve one Dutch learning model while making source language, context, and local matching honest and useful.

## Solution

Make cross-language capture source-aware while keeping Dutch as the only learning-language key. A deliberate single-word selection from Dutch, English, or Telugu resolves to one safe canonical Dutch word before Save is offered. The original context is retained from the exact selected occurrence with optional source-language provenance, and English/Telugu helper renderings are filled independently without losing the word when an optional translation fails.

Hover and selection lookups use the same source resolution. No source language is translated to itself. `Seen before` is shown for one confident saved-item match across Dutch, English, and Telugu, even when no sentence exists or encounter persistence fails. Dutch-only Context Mission eligibility and mastery semantics remain unchanged.

## User Stories

1. As a Dutch learner reading a Dutch webpage, I want existing single-word capture to continue working, so that this feature does not regress my current workflow.
2. As a Dutch learner reading an English webpage, I want a selected single word to resolve to a Dutch canonical word, so that I can save it into my normal Dutch learning record.
3. As a Dutch learner reading a Telugu webpage, I want a selected single word to resolve to a Dutch canonical word, so that Telugu reading can contribute to the same Dutch vocabulary.
4. As a learner, I want cross-language Save to require the popup Save action, so that English/Telugu text is never added to Saved without my confirmation.
5. As a learner with Dutch selection auto-save enabled, I want the existing opt-in Dutch behavior preserved, so that this feature does not change an unrelated preference.
6. As a learner, I want translation caching to remain separate from saving, so that cached lookup responses never become learning items.
7. As a learner, I want an ambiguous, multi-word, or otherwise unsafe Dutch result to remain translatable but not saveable, so that DutchMate never guesses my learning identity.
8. As a learner, I want an unresolved automatic source language to remain translation-only, so that provenance and helper meanings are never guessed.
9. As a learner, I want the exact sentence containing the selected occurrence to be retained, so that repeated words on one page do not attach the wrong context.
10. As a learner, I want a word to save without context when the exact occurrence cannot be resolved, so that a missing sentence never blocks deliberate vocabulary capture.
11. As a learner selecting English or Telugu text, I want the original sentence retained even when it contains no Dutch, so that my saved context reflects what I actually read.
12. As a learner, I want each saved context to identify its original language, so that I can distinguish Dutch, English, Telugu, and legacy unknown contexts.
13. As a learner, I want English and Telugu helper renderings shown separately from the original context, so that translations are not mistaken for the source sentence.
14. As a learner, I want a failed optional context translation to leave the word and successful helper fields saved, so that provider partial failure does not discard my deliberate capture.
15. As a learner, I want later captures to fill only missing context helpers, so that an existing translation is never silently overwritten.
16. As a learner, I want repeated captures of one Dutch word to merge into one Saved item, so that cross-language sources do not create duplicate mastery records.
17. As a learner, I want contexts deduplicated by normalized text and source language, so that the same sentence is not repeated while distinct language provenance remains honest.
18. As a learner with older local data, I want legacy contexts without provenance to remain intact and visibly unknown, so that migration does not invent historical source language.
19. As a learner, I want additive context fields to remain compatible with learning-backup version 2, so that old exports import safely and no unnecessary format break is introduced.
20. As a learner, I want `Seen before` when a Dutch, English, or Telugu form uniquely matches one Saved item, so that I recognize prior learning regardless of webpage language.
21. As a learner, I want `Seen before` even when no safe sentence exists, so that the cue reflects a confident local match rather than context availability.
22. As a learner, I want no `Seen before` cue when one helper form maps to multiple Saved items, so that DutchMate does not guess which item I encountered.
23. As a learner, I want encounter persistence to remain best effort, so that a failed local write does not create a false negative `Seen before` result.
24. As a learner, I want hover encounters to retain only bounded original context and provenance, so that hovering does not trigger hidden helper translation or vocabulary enrichment.
25. As a learner, I want Telugu hover to show useful Dutch and English results without Telugu self-translation, so that the popup teaches rather than echoing the source.
26. As a learner, I want no source language translated to itself, so that Dutch, English, and Telugu popups never show empty or meaningless self-results.
27. As a learner using one-target mode, I want English/Telugu selections to obtain Dutch as the required canonical target, so that Save still works when multi-target display is off.
28. As a learner using automatic source detection, I want source detection to remain active when target count is one, so that target preferences do not erase provenance.
29. As a learner, I want successful popup targets to remain visible when another optional target fails, so that one provider failure does not hide useful information.
30. As a learner, I want failed popup targets labeled `Unavailable`, so that missing translations are honest rather than silently omitted.
31. As a learner, I want Saved to show up to three recent contexts newest-first, so that a cross-language item retains useful recent reading evidence.
32. As a learner, I want Saved and review labels such as `Original context · English`, `English translation`, and `Unavailable`, so that every displayed sentence has a clear role.
33. As a learner, I want existing Dutch review, mission, backup, privacy, and no-account behavior preserved, so that cross-language capture improves browsing without changing the learning model.

## Implementation Decisions

- Dutch remains the only learning-language key. English/Telugu captures enrich one Dutch learning item rather than creating a second learning mode.
- Cross-language capture applies to single words only. Existing Dutch meaningful-chunk eligibility and practice remain unchanged.
- The lookup module remains the behavioral seam. It resolves source language, requests the required Dutch target for deliberate English/Telugu selections, aggregates per-target results, gates Save, and computes `Seen before`.
- Explicit non-`auto` source configuration wins. In automatic mode, source resolution uses Telugu script in the selected text, then supported nearest page metadata, then Dutch/English lexical evidence. A unique saved-form match may support `Seen before` but never overrides confident source resolution.
- If automatic source resolution remains unresolved, translation may render but Save, provenance assignment, and helper assignment remain unavailable.
- No source language is a target. Multi-target requests exclude the source; one-target requests fall back to Dutch for English/Telugu and English for Dutch when the configured target equals the source.
- Deliberate English/Telugu selections always request Dutch as the canonical learning target even when multi-target mode is disabled. Automatic source detection remains active regardless of target count. Hover target selection remains settings-respecting.
- A Save candidate must reuse the existing normalized single-word eligibility rule: Unicode letters/numbers with apostrophes or hyphens are allowed; labels, separators, alternatives, and multi-word results are rejected.
- A safe canonical Dutch result exposes Save. Cross-language Save requires the popup action; the legacy opt-in Dutch selection auto-save remains unchanged. Translation caching never creates a learning item.
- Context capture must be tied to the exact selected occurrence. If the occurrence is uncertain, the word saves without context. Context validity follows the selected source form, not the Dutch key.
- Each context may carry optional source-language provenance and partial English/Telugu helper fields. Source text is copied through for its matching helper language; only missing helpers are requested.
- Context helper translation is independently best effort. A failed helper becomes `Unavailable`; it cannot discard the word or successful fields, and later captures fill only missing helpers.
- Contexts deduplicate by normalized text plus source language and retain at most three recent contexts. Legacy unknown-provenance contexts are never retroactively relabeled and remain distinct from later known-provenance text.
- Item-level source history remains unchanged for compatibility; context provenance is the user-visible provenance record.
- `Seen before` matches Dutch, English, or Telugu forms against Saved items. It appears only for one confident match, does not require context, and remains truthful if encounter persistence fails. Ambiguous helper matches show no cue.
- Encounter persistence stores only bounded original context and provenance. It does not request helper translations or silently enrich vocabulary.
- Multi-target popup results render independently. Successful targets remain usable, failed targets read `Unavailable`, and only missing essential Dutch blocks the result or Save.
- The local learning record remains backup version 2 compatible. New fields are optional; old imports retain unknown context provenance.
- Saved/review presentation shows up to three recent contexts newest-first with explicit original/helper labels: `Original context · Dutch/English/Telugu`, `English translation`, `Telugu translation`, `Language not detected`, and `Unavailable`.

## Testing Decisions

- Test external behavior at existing seams rather than private helpers. The highest-value behavioral seam is the webpage lookup module with a controlled translation transport and learning-record transport.
- Lookup tests cover explicit and automatic source resolution, Telugu script detection, target exclusion/fallback, required Dutch selection targets, safe-word Save gating, ambiguous/unresolved translation-only states, partial target failures, cross-language `Seen before`, and encounter-write failure.
- Learning-record tests cover source-aware context validation, optional provenance migration, merge/dedupe by normalized text plus source language, partial helper fill without overwrite, three-context retention, legacy unknown contexts, encounter persistence, and version-2 backup import/export.
- Existing tooltip and Saved view seams cover original/helper labels, `Unavailable` states, self-target avoidance, three recent contexts, highlighting, and no-regression Dutch review presentation.
- Existing lookup, page-context, review-card, backup, and popup test patterns are prior art; tests should assert learner-visible state and persisted records, not implementation structure.
- Verification must include focused tests, typecheck, full test suite, Chrome and Firefox builds, release verification, whitespace checks, and manual Chrome/Firefox browser checks.

## Out of Scope

- Cross-language meaningful chunks, Telugu lessons, reverse-language mastery, audio or pronunciation features, provider backfill for old records, URL/page-history capture, accounts, sync, telemetry, and a new multilingual learning mode.
- A translation-choice picker for ambiguous Dutch results.
- A redesign or cap policy for item-level `sources[]` history.
- Helper translation requests during hover/encounter persistence.
- A backup-format version bump.
- New public testing seams or a new translation provider contract.

## Further Notes

- The checked-in domain glossary and ADR are the language and architectural decision sources for this specification.
- Implementation is intentionally paused until this spec is reviewed and approved. After approval, break it into tracer-bullet tickets with `to-tickets`; do not implement directly from this document.
- All feature artifacts use the shared `006-bridge` prefix. The implementation branch remains `feature-006-bridge`.
- Delivery state should be `Ready` for the specification issue until implementation begins. Each ticket must later follow the repository workflow for branch scope, verification, issue state, and Delivery reconciliation.
