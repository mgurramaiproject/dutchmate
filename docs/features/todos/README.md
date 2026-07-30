# DutchMate implementation queue

These are the reviewed plan records for the deterministic feature sequence. The
completed slices stay listed here for traceability; only the next candidate is
eligible for new implementation approval.

Implement exactly one queue item at a time. Copying a plan here is not implementation approval; the user must explicitly approve the next item after reviewing its current architecture and release gate.

## Completed

| Order | Plan | Status | Boundary |
|---:|---|---|---|
| 0 | [Shared deterministic foundation](../010-shared-deterministic-foundation-plan.md) | Completed compatibility audit | No runtime foundation was added; the audit established the reuse boundary for later slices. |
| 1 | [Web Sentence Trainer](../011-web-sentence-trainer-plan.md) | Completed and merged in PR [#101](https://github.com/mgurramaiproject/dutchmate/pull/101) | Saved Context Missions reuse the canonical learning item and bounded Dutch context. Issues #97–#100 are closed. |
| 2 | [Grammar content packs](../012-grammar-packs-plan.md) | Completed and merged in PR [#106](https://github.com/mgurramaiproject/dutchmate/pull/106) | Four reviewed A0 patterns remain inside Lessons, Today, and Daily Five. Issues #102–#105 are closed. |
| 3 | [Contrast Repair / Feature 013](./03-contrast-packs/plan.md) | Completed and merged in PR [#112](https://github.com/mgurramaiproject/dutchmate/pull/112) | One authored time-first main-clause inversion repair pack shipped through the existing lesson and Daily Five flows. Issues #107–#111 are closed. |

## Next approval candidate

There is no approved implementation candidate in the queue. New work must
start with a reviewed plan and explicit implementation approval.

## Approval and handoff rules

- Current released behavior and repository architecture override these copies if they differ.
- Do not implement a later queue item while an earlier item lacks its release and learner-value gate.
- Do not add runtime AI, typing, free-form grading, a second scheduler, or a new top-level destination without a new explicit product decision.
- Keep deferred ideas in [the canonical parking lot](../feature-parking-lot.md), not in this queue.
- Do not implement the next candidate from this queue entry alone. First review
  its current architecture, learner-value gate, and ticket boundary, then
  explicitly approve it.
- After implementation approval, update the selected plan checklist with
  evidence and keep completed plans unchanged.

## Source

Reviewed source package: `/home/mgurram/MGurramAI/projects/dutchmate-proj/DutchMate-deterministic-feature-plans`.

Feature 011 and Feature 012 canonical plans, specifications, ticket trees, and
validation records live in [`docs/features/`](..). The original
`todos/02-grammar-content-packs` copy is retained only as historical queue
input; Feature 012's checked-in artifacts are the implementation and delivery
record.
