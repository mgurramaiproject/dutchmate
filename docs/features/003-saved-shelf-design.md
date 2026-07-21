# 003 Saved Shelf — popup design

**Feature code:** `003-saved-shelf`

## Artefact convention

Use the `003-saved-shelf-` prefix for every feature-specific artefact created for this work. For example: `003-saved-shelf-spec.md`, `003-saved-shelf-tickets.md`, `003-saved-shelf-design.html`, and `003-saved-shelf-release-notes.md`. Keep unrelated LearnLoop artefacts under their existing names.

## Purpose

Give learners one-click access to their complete **Saved vocabulary** collection in the extension popup, without turning the popup into a second vocabulary-management page or competing with Daily Five practice.

This design uses the existing **Learning item** and **Saved vocabulary** terms from [CONTEXT.md](../../CONTEXT.md). The visible tab label is **Saved**: `Library` is deliberately avoided because **Lesson library** already has a distinct meaning in the product glossary.

## Information architecture

- Add **Saved** as the third primary popup tab: `Today | Lessons | Saved`.
- Keep **Today** as the default tab and the single entry point for Daily Five practice.
- Keep Settings in the popup header. Keep deletion, clear-all, import, export, and other management actions in Options.
- Hide primary navigation during focused review and lesson flows, as it is today.

## Saved tab

The tab is a browse-and-revisit surface, not an ad-hoc practice mode.

- Load all saved learning items from the canonical local learning record.
- Use a scrollable list within the existing content area; the popup shell itself must not gain a horizontal scrollbar or a fixed mobile-page height.
- Sort newest-first by default, matching the Options-page expectation.
- Provide a compact `A–Z` sort toggle for deliberate lookup. Do not add search in this slice.
- Refresh the list when the underlying local learning record changes, while preserving the selected sort where possible.

### Compact learning-item card

Each closed card is a full-width, keyboard-operable control with a clear visible-focus state and at least a 44 px target.

1. Dutch learning item is the visual anchor.
2. English and Telugu helper meanings appear as two short, explicitly labelled lines (`EN` and `TE`). Missing meanings use a quiet unavailable treatment rather than fabricated copy.
3. A neutral mastery chip shows exactly one of `New`, `Learning`, `Familiar`, or `Strong`.
4. Do not show source metadata in the closed state. Orange remains reserved for active and focus treatment, not for a competing set of status colours.

### Expanded item

Selecting a card expands it in place; it does not navigate away or start review.

- Show `Saved from webpage` or `From lesson`.
- Show the existing capped contextual sentence when one is available.
- Do not show URLs, page titles, or a browsing-history view.
- Offer a subtle `Open Options` link for management. It must open the existing Options page rather than duplicate deletion controls in the popup.

Only one card needs to be expanded at once. Collapsing or moving to another tab does not mutate the learning record.

### Empty, loading, and error states

- Empty: explain that intentionally saved words and meaningful chunks appear here; offer a secondary `Choose a lesson` action. Do not imply that every translation is automatically saved.
- Loading: use a short, non-jarring loading state while the local record is read.
- Error: explain that saved items could not be loaded and offer a retry. Preserve the rest of the popup navigation.

## Boundaries

- Local-only learning data and the fixed Dutch / English / Telugu roles remain unchanged.
- A Saved-tab visit, expansion, sort change, or contextual read is not a learning encounter, review result, or mastery change.
- Daily Five remains the only popup practice route; Saved has no `Practise now` action.
- Options remains the authoritative management surface shown in the supplied reference screenshot.
- This is a presentation change on the existing canonical learning-record and typed popup/background message seams. It does not require a new data model or an ADR.

## Acceptance criteria

- [ ] The popup presents `Today`, `Lessons`, and `Saved` as accessible top-level tabs, with Today selected on open.
- [ ] Saved displays every canonical learning item in a vertically scrollable, narrow-popup-safe list.
- [ ] Newest-first and A–Z ordering work without changing stored learning items.
- [ ] Each card presents Dutch, English, Telugu, and the current overall mastery state without a table layout.
- [ ] A card expands in place to show safe provenance and available context, without creating practice or mastery activity.
- [ ] The popup contains no delete, clear, import, or export controls for saved vocabulary.
- [ ] The empty, loading, and error states are actionable, accessible, and do not claim automatic saving.
- [ ] Keyboard operation, focus treatment, and screen-reader tab/card semantics work in Chrome and Firefox narrow popups.
- [ ] The existing Options-page saved-vocabulary table and management controls remain unchanged.

## Verification direction

- Add pure view/state tests for ordering, card data, expansion, and empty/error states.
- Extend popup navigation/render tests for the third tab, keyboard behaviour, and narrow-popup scroll contract.
- Run the repository popup verification ladder: focused tests, `corepack pnpm test`, `corepack pnpm typecheck`, `corepack pnpm build:chrome`, `corepack pnpm build:firefox`, and `corepack pnpm verify:release`.
- Manually validate the actual Firefox popup after implementation; automated layout checks do not replace browser evidence.
