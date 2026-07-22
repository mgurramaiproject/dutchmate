# 003 Saved Shelf — specification

**Feature code:** `003-saved-shelf`

**Design reference:** [003 Saved Shelf popup design](./003-saved-shelf-design.md)

**GitHub issue:** [#52 — 003 Saved Shelf: browse saved vocabulary from the popup](https://github.com/mgurramaiproject/dutchmate/issues/52)

## Problem Statement

As a DutchMate learner, I can save useful Dutch words and meaningful chunks while reading, but I cannot view the complete Saved vocabulary collection from the popup. The Options-page table contains the collection and its management controls, but it requires a separate navigation step and is not suited to quick, calm revisiting while learning.

The popup must make every saved Learning item available in one click without becoming a duplicate management page, bypassing Daily Five, or exposing more browsing data than the Local learning record already retains.

## Solution

Add a third top-level popup area, **Saved**, alongside Today and Lessons. Saved is a browse-and-revisit view of the canonical Saved vocabulary collection: a learner can scroll every Learning item, see its stable chronological shelf number, change between newest-first and A–Z order, and expand one item to revisit safe provenance and its saved Page context.

The popup keeps Today as the default and sole practice entry point. Options remains the only place to delete, clear, import, export, or otherwise manage Saved vocabulary.

## User Stories

1. As a DutchMate learner, I want a Saved tab beside Today and Lessons, so that I can reach my saved vocabulary in one click.
2. As a learner, I want Today to remain the default popup area, so that Daily Five stays my clear learning action.
3. As a learner, I want to see every Learning item I intentionally kept, so that my Saved vocabulary is a dependable personal collection.
4. As a learner, I want a vertically scrollable list in the popup, so that a growing collection remains usable without opening Options.
5. As a learner, I want the Dutch form to be visually dominant, so that I keep attention on the language I am learning.
6. As a learner, I want concise English and Telugu helper meanings on each item, so that I can recognise meaning in my Learning triangle without opening a separate screen.
7. As a learner, I want a quiet New, Learning, Familiar, or Strong status, so that I can understand my current relationship with an item without seeing scheduling jargon.
8. As a learner, I want newly saved items to appear first by default, so that I can immediately confirm that DutchMate kept what I selected.
9. As a learner, I want an A–Z ordering option, so that I can deliberately find a known item in a larger collection.
10. As a learner, I want to expand an item in place, so that I can revisit its context without losing my place in the list.
11. As a learner, I want an expanded item to say whether it came from a webpage or a lesson, so that I can understand its learning-item source.
12. As a learner, I want an expanded item to show an available saved Page context, so that I can recall how the Dutch item was used.
13. As a privacy-conscious learner, I do not want URLs, page titles, or a browsing-history view in Saved, so that contextual recall does not broaden DutchMate’s local-data boundary.
14. As a learner, I want an Open Options route from an expanded item, so that I can manage a particular item without destructive controls crowding the popup.
15. As a learner with no Saved vocabulary yet, I want a clear explanation and a lesson next step, so that I know how to begin without being told translations are saved automatically.
16. As a learner, I want loading and error states that can recover, so that a temporary local-read failure does not make the popup unusable.
17. As a keyboard or screen-reader user, I want accessible tabs, cards, expansion, and visible focus, so that the complete collection is equally usable without a pointer.
18. As a Firefox or Chrome user, I want Saved to fit a narrow popup without horizontal scrolling, so that the learning collection remains usable in the real extension surface.
19. As a learner, I do not want opening, sorting, or expanding Saved items to change mastery or create practice activity, so that browsing remains distinct from learning evidence.
20. As a learner, I do not want a Practise now action in Saved, so that Daily Five remains the calm and coherent route into review.
21. As a learner, I want the Saved list to reflect saved-vocabulary changes while the popup is open, so that it stays trustworthy after I save or remove an item elsewhere in DutchMate.
22. As a learner, I want the existing Options-page Saved vocabulary table to keep working unchanged, so that detailed management stays familiar and safe.
23. As a learner, I want each item to retain its collection number, so that I can understand when I saved it even when I change the display order.

## Implementation Decisions

- Use `Saved` as the visible tab label. Do not use `Library`, because Lesson library is an established and different domain term.
- Implement the approved **A — Quiet Index** presentation from the Saved Shelf mockup exploration: editorial numbered rows with Dutch as the anchor, compact helper meanings, neutral Mastery labels, and in-place expansion.
- Extend the current top-level popup navigation to `Today | Lessons | Saved`. Focused review and lesson flows continue to hide that navigation and provide their explicit exit behaviour.
- Read Saved vocabulary exclusively through the existing typed background learning contract and canonical Local learning record. Do not add a new storage format, mutation message, or parallel Saved-vocabulary store.
- Add a presentation-only Saved Shelf state with the selected sort and, at most, one expanded Learning-item identifier. Neither state is durable learning data.
- The default order is newest-first. A compact A–Z control changes only presentation order. Search, filtering, and grouped browsing are not part of this feature.
- Derive a stable shelf number from the Learning item’s creation order: the first saved Learning item is `1`, and the newest is the current collection count. The number is metadata for the collection, not a sort-position label, so it remains unchanged in newest-first and A–Z views.
- The compact item representation always shows Dutch, labelled English and Telugu meanings when available, and one overall Mastery state. It uses neutral status treatment; orange remains for active and focus treatment.
- Selecting a compact item expands it in place. Expanded content may show only the latest available Learning-item source category and an existing capped Page context. It must not show URLs, page titles, raw page content, or a browsing-history surface.
- The expanded state offers an Open Options route. Delete, clear, import, export, backup, and other management actions remain exclusively in Options.
- Saved never starts or modifies Daily Five. It has no ad-hoc practice action, and a visit, ordering change, expansion, or context read must not record a Learning encounter, Practice result, or Mastery change.
- The empty state explains Explicit capture and offers a secondary route to Lessons. Loading and recoverable error states must preserve top-level navigation and offer retry where appropriate.
- Refresh Saved when the local canonical record changes, preserving sort preference and retaining expansion only while its Learning item still exists.
- The popup remains content-driven in height with scrolling inside its content region. It must retain the existing narrow Firefox and Chrome sizing contract, 44-pixel minimum interactive targets, keyboard navigation, semantic tab behaviour, and visible focus.

## Testing Decisions

- The primary seam is a pure Saved Shelf view model that accepts canonical Learning items plus presentation state and returns ordered, compact, expanded, empty, loading, or error view data. This is the highest stable seam: it proves learner-visible behaviour without coupling tests to DOM structure or browser storage.
- Test external behaviour: stable shelf numbers across newest-first and A–Z ordering, missing helper meanings, overall Mastery labels, one-at-a-time expansion, safe provenance/context display, empty/loading/error recovery, and deletion of an expanded item after refresh.
- Extend existing popup navigation and rendered-view tests to prove Saved is a third accessible top-level tab, Today remains default, focused flows still hide navigation, keyboard order works, focus is visible, and no horizontal scrolling is introduced.
- Extend the existing typed learning-client integration tests only as needed to prove the Saved view consumes the existing list contract and responds to canonical-record refreshes. Do not add tests that duplicate Learning-record persistence coverage.
- Use existing Options vocabulary-item rendering and popup narrow-layout tests as prior art for meaning display, Learning-item source rendering, and popup sizing.
- Before completion, run focused tests, `corepack pnpm test`, `corepack pnpm typecheck`, `corepack pnpm build:chrome`, `corepack pnpm build:firefox`, and `corepack pnpm verify:release`. Manually validate the real Firefox popup separately from automated evidence.

## Out of Scope

- Deleting, clearing, importing, exporting, backing up, or editing Saved vocabulary from the popup.
- Search, filters, custom groups, tags, or bulk actions.
- A separate Saved Shelf schedule, Practice flow, `Practise now` action, typing, audio, or new Mastery algorithm.
- Changing Learning-item identity, Local learning-record schema, backup format, Learning-item source retention, or Page-context privacy limits.
- Accounts, synchronization, telemetry, generated examples, passive webpage scanning, URLs, page titles, or browsing-history display.
- Changes to the existing Options Saved vocabulary table beyond preserving its current behaviour.

## Further Notes

- This feature follows the accepted Daily Edition popup direction while extending its information architecture with one browse-only tab. It is a reversible presentation change, so no ADR is required.
- Keep all feature-specific artefacts under the `003-saved-shelf-` prefix and work on `feature/003-saved-shelf`.
- GitHub issue [#52](https://github.com/mgurramaiproject/dutchmate/issues/52) is the published specification and has the `ready-for-agent` label.
