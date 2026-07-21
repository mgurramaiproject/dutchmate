# 003 Saved Shelf — implementation tickets

**Parent specification:** [#52 — 003 Saved Shelf: browse saved vocabulary from the popup](https://github.com/mgurramaiproject/dutchmate/issues/52)

**Feature branch:** `feature/003-saved-shelf`

Work the **frontier**: any ticket whose blockers are complete. T01 is the current frontier; T02 starts only after T01 is complete.

```text
T01 — #53 Browse the collection
└── T02 — #54 Revisit an item safely
```

## T01 — Browse the collection

**GitHub:** [#53](https://github.com/mgurramaiproject/dutchmate/issues/53)

**Blocked by:** None — can start immediately.

**What to build:** Give a learner a complete, browse-only Saved vocabulary collection in the popup. The learner can open Saved beside Today and Lessons, scroll every canonical Learning item, see its stable shelf number, change between newest-first and A–Z order, and understand its Dutch form, available English and Telugu meanings, and overall Mastery state without using Options.

### Acceptance criteria

- [ ] Today, Lessons, and Saved are accessible top-level popup tabs; Today remains selected on popup open.
- [ ] Saved reads the canonical Local learning record through the existing typed learning contract and displays every Learning item in a vertically scrollable list.
- [ ] Each compact card makes Dutch visually primary and shows labelled English and Telugu meanings when available plus a neutral New, Learning, Familiar, or Strong label.
- [ ] Newest-first is the default and an A–Z control changes presentation order without mutating the Local learning record.
- [ ] Each compact card shows a stable chronological shelf number: the first saved Learning item is 1 and the newest saved item is the collection count, regardless of display order.
- [ ] Empty, loading, and recoverable error states remain understandable and provide an appropriate lesson or retry action.
- [ ] Saved contains no practice, delete, clear, import, export, or backup action.
- [ ] Popup keyboard navigation, visible focus, 44-pixel targets, and narrow Chrome/Firefox scrolling remain usable.
- [ ] Focused review and lesson flows continue to hide top-level navigation.
- [ ] Focused view-model, popup-render, typecheck, Chrome build, Firefox build, and release verification evidence pass.

## T02 — Revisit an item safely

**GitHub:** [#54](https://github.com/mgurramaiproject/dutchmate/issues/54)

**Blocked by:** [T01 / #53](https://github.com/mgurramaiproject/dutchmate/issues/53)

**What to build:** Complete Saved Shelf as a calm recall surface. A learner can expand one compact card in place to revisit safe Learning-item source information and available Page context, move to Options for management, and trust the list to stay current after Local learning-record changes without turning browsing into practice or tracking.

### Acceptance criteria

- [ ] Selecting one compact Learning item expands it in place; selecting another item or leaving Saved collapses the prior expansion without mutating learning data.
- [ ] Expanded content shows only safe provenance (webpage or lesson) and an available capped Page context; it never shows URLs, page titles, raw page content, or browsing history.
- [ ] The expanded state offers Open Options for management; the popup still contains no destructive or backup controls.
- [ ] Saved refreshes after canonical Local learning-record changes while retaining the selected ordering and discarding an expansion whose item no longer exists.
- [ ] Opening, sorting, expanding, or reading context records no Learning encounter, Practice result, or Mastery change; Today remains the sole practice route.
- [ ] Screen-reader semantics, keyboard operation, visible focus, and real narrow Firefox popup behaviour are verified for expanded content and scrolling.
- [ ] Focused view-model, popup-render, typecheck, Chrome build, Firefox build, release verification, and manual Firefox evidence pass.
