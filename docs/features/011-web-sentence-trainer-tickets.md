# Tickets: 011 Web Sentence Trainer

Parent issue: [#97 — Web Sentence Trainer: deterministic Saved context practice](https://github.com/mgurramaiproject/dutchmate/issues/97)

Source plan: [011-web-sentence-trainer-plan.md](./011-web-sentence-trainer-plan.md)

Source specification: [011-web-sentence-trainer-spec.md](./011-web-sentence-trainer-spec.md)

The GitHub issues are the tracker source of truth. This checked-in document
mirrors the published child-ticket contracts so the implementation sequence
remains reviewable offline. Update each checklist with direct evidence as its
matching issue is implemented.

## Delivery rules

- Implement one frontier ticket at a time in a fresh agent session.
- Keep the feature on `feature/011-web-sentence-trainer-context-loop` unless the delivery workflow establishes a ticket-specific branch.
- Do not start a blocked ticket early.
- Preserve the canonical `LearningItem`, bounded contexts, existing mastery, ordinary review, and existing popup surfaces.
- Keep Context Missions word-only in this release; meaningful chunks retain existing review behavior.
- Keep Daily Five integration deferred until a later approved phase.
- Run focused tests during development, then typecheck, the relevant full suite, build/package checks, documentation checks, and privacy/accessibility verification before handoff.
- Update the matching GitHub issue checklist and Delivery fields with direct evidence. The checked-in checklist is live progress tracking, not a second source of truth.

## Dependency map

```text
#98 ──> #99 ──> #100
```

The first frontier is T01 / #98. Daily Five is intentionally not represented
as a ticket in this first tree.

## T01 — Manage Saved page context

GitHub: [#98](https://github.com/mgurramaiproject/dutchmate/issues/98)

**Blocked by:** None — can start immediately.

**What to build:** Let a learner inspect and manage the bounded page contexts
attached to a saved learning item from the expanded Saved surface.

- [x] Expanded Saved items show retained bounded contexts with clear original-language labeling.
- [x] The learner can remove exactly one context with a click and keyboard-accessible control.
- [x] Removing a context preserves the canonical learning item and every other context.
- [x] Existing save, sorting, ordinary review, export/import, and Saved navigation behavior remain intact.
- [x] Tests cover context removal, persistence, accessibility, and safe behavior when no context exists.

## T02 — Add reveal Context Mission from Saved

GitHub: [#99](https://github.com/mgurramaiproject/dutchmate/issues/99)

**Blocked by:** [T01 / #98](https://github.com/mgurramaiproject/dutchmate/issues/98)

**What to build:** Let a learner start a single-word Dutch Context Mission
from Saved, reveal its existing helper meaning, and record one canonical
recognition or recall result.

- [ ] A saved single-word item with an eligible Dutch context offers the `Practise context` action from its expanded Saved view.
- [ ] The newest eligible Dutch context is selected deterministically without a context picker.
- [ ] The learner can reveal the existing helper meaning and choose `Again` or `Got it` using click or keyboard controls.
- [ ] Missing helper meaning falls back to a safe reveal-only presentation without a new translation request.
- [ ] Results update the existing learning item once and reject duplicate or stale submissions safely.
- [ ] Chunks, missing contexts, non-Dutch contexts, and unknown-provenance contexts do not enter this mission path.
- [ ] Tests cover the focused flow, accessibility, canonical result behavior, privacy boundary, and unchanged existing surfaces.

## T03 — Add exact Dutch reconstruction

GitHub: [#100](https://github.com/mgurramaiproject/dutchmate/issues/100)

**Blocked by:** [T02 / #99](https://github.com/mgurramaiproject/dutchmate/issues/99)

**What to build:** Extend the Saved Context Mission with conservative exact
reconstruction for eligible Dutch single-word contexts, while preserving
meaning-recall fallback for every unsafe case.

- [ ] Reconstruction is offered only for explicitly Dutch contexts with one unambiguous saved-target occurrence.
- [ ] Conservative length, token, punctuation, Unicode, and duplicate-token checks determine eligibility.
- [ ] The learner can rebuild the stored Dutch sentence using click or keyboard controls.
- [ ] Only the stored source order is accepted; the feature does not grade arbitrary Dutch alternatives.
- [ ] Ambiguous, unsafe, non-Dutch, unknown-provenance, chunk, and over-limit contexts fall back to meaning recall.
- [ ] No raw answers, sentence attempts, new due state, new queue, backend call, or runtime AI dependency is introduced.
- [ ] Tests cover eligibility, tokenization, fallback, interaction accessibility, privacy, and full build/release regressions.

## Tracker state at publication

| Ticket | GitHub | Label | Blocked by | Frontier |
| --- | --- | --- | --- | --- |
| T01 | [#98](https://github.com/mgurramaiproject/dutchmate/issues/98) | `ready-for-agent` | None | Yes |
| T02 | [#99](https://github.com/mgurramaiproject/dutchmate/issues/99) | `ready-for-agent` | #98 | No |
| T03 | [#100](https://github.com/mgurramaiproject/dutchmate/issues/100) | `ready-for-agent` | #99 | No |

Delivery Project execution fields remain unset until implementation starts;
when T01 begins, set its execution owner and custom Delivery Status to
`In Progress` according to the repository workflow.
