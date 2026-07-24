# 006-bridge: Cross-language capture and source-aware lookup plan

**Feature code:** `006-bridge`

**Branch:** `feature-006-bridge`

**Status:** Grill complete; implementation not started.

## Outcome

Make DutchMate behave consistently when a learner reads Dutch, English, or Telugu webpages. A deliberate single-word capture from any supported source language resolves to one canonical Dutch learning item, preserves the original source context, and remains visible through the normal Saved/review flow. Hover translation and the `Seen before` cue use the same source-aware language resolution.

## Decisions

- Dutch remains the only learning-language key. English/Telugu captures do not create a second learning mode.
- Cross-language capture is limited to single words in this feature. Dutch meaningful chunks keep their current eligibility and practice rules.
- Every new context retains its original source sentence and optional source-language provenance (`nl`, `en`, `te`); older contexts remain valid with unknown provenance.
- A captured context must come from the exact selected occurrence; if that occurrence cannot be resolved safely, the word saves without context rather than retaining a misleading sentence.
- Context translations keep fixed English and Telugu fields. Copy through the source text when it already is English or Telugu; request only missing translations.
- A successful Dutch canonical translation is enough to expose Save. Missing English/Telugu helpers remain explicitly unavailable rather than hiding Save.
- A translation result that is ambiguous, multi-word, or otherwise not one safe Dutch word remains visible for understanding but does not expose Save; 006 adds no choice picker.
- Context translation is best effort per helper. A failed optional context translation must not discard the learner’s deliberate word save; later captures may fill only missing helper fields and never overwrite existing translations.
- Repeated captures merge into one Dutch item. Contexts deduplicate by normalized text plus source language and fill missing translations/provenance.
- Source-language resolution prefers Telugu script in the selected text, then supported nearest page metadata, then Dutch/English lexical evidence. A unique saved-form match may support `Seen before` but never overrides a confident source or invents one.
- Telugu hover shows Dutch and English results, never a Telugu self-translation. Save remains selection-only; hover remains translation/encounter-only.
- `Seen before` appears for confident Dutch, English, or Telugu saved-item matches even if the later encounter write fails. Dutch-only recall/reconstruction missions remain unchanged.
- Context retention remains local-only: normalized source text, at most 240 characters per context, at most three recent contexts per item, and no URLs or page metadata.
- A missing safe sentence never blocks the word save.

## Acceptance boundary

- Dutch, English, and Telugu single-word selections can expose Save when a Dutch canonical form is available.
- Ambiguous or non-canonical Dutch results remain translatable but cannot be saved without a future explicit disambiguation design.
- Saved context from all three source languages retains source text, provenance, and available fixed English/Telugu renderings.
- Repeated words in one page retain the sentence for the selected occurrence, or no context when the occurrence is uncertain.
- Partial provider failure preserves the word and any successful context fields.
- Repeated captures can fill missing context helpers without replacing an existing translation.
- Existing records and legacy contexts migrate/read without data loss; unknown context provenance remains honest.
- Repeated captures merge correctly without duplicate Saved rows or duplicate contexts.
- Telugu hover renders the source-aware popup; configured same-language targets never produce an empty/self-translation result.
- `Seen before` works for all three source forms and remains truthful when encounter persistence fails.
- Saved/review UI labels the original context language and distinguishes original text from helper renderings.
- Existing Dutch capture, hover, review, mission, backup, privacy, and no-account behavior remains intact.
- Focused tests, typecheck, full suite, Chrome/Firefox builds, release verification, whitespace checks, and manual Chrome/Firefox checks pass.

## Proposed implementation slices

1. **Canonical record and context contract** — add context provenance, source-aware merging, partial context translations, and migration-safe tests.
2. **Source-aware lookup and capture** — resolve Telugu/English/Dutch sources consistently, expose Telugu Save, request only required translations, and make encounters match all helper forms.
3. **Popup and Saved presentation** — render Telugu hover targets, consistent `Seen before`, source-labeled contexts, unavailable states, and focused UI tests.
4. **Verification and delivery** — update the feature checklist, run the full release gate, complete Chrome/Firefox manual checks, and reconcile GitHub/Delivery.

## Out of scope

Cross-language meaningful chunks, Telugu lessons, reverse-language mastery, audio/pronunciation features, provider backfill for old records, URLs/history, accounts, sync, telemetry, and a new multilingual learning mode.

## Artifact convention

All feature artifacts created from this work use the shared `006-bridge` prefix, for example:

- `docs/features/006-bridge-plan.md`
- `docs/features/006-bridge-spec.md`
- `docs/features/006-bridge-tickets.md`
- `docs/features/006-bridge-validation.md`
- `docs/adr/0006-006-bridge-cross-language-capture-keeps-dutch-learning-key.md`

## Next step

Review this plan. If approved, create the `006-bridge` spec and implementation tickets, then implement the first slice on `feature-006-bridge` using the `implement` skill. Keep the branch scoped to this feature and commit every intentional repository change.
