# DutchMate implementation queue

These are the four revised plans currently eligible for implementation. They are copied from the reviewed plan package and tracked here so the implementation queue has one repo-local source.

Implement exactly one queue item at a time. Copying a plan here is not implementation approval; the user must explicitly approve the next item after reviewing its current architecture and release gate.

## Queue

| Order | Plan | Status | Boundary |
|---:|---|---|---|
| 0 | [Shared deterministic foundation](./00-shared-deterministic-foundation/plan.md) | First approval candidate | Compatibility audit only; no speculative runtime foundation |
| 1 | [Web Sentence Trainer](./01-web-sentence-trainer/plan.md) | Next product slice | Existing `LearningItem` + bounded Dutch `LearningContext`; click-only |
| 2 | [Grammar content packs](./02-grammar-content-packs/plan.md) | Later active candidate | Internal Verb Gym/Sentence Forge/Grammar Minute families; four shipped A0 patterns first |
| 3 | [Contrast Packs](./03-contrast-packs/plan.md) | Later active candidate | Small authored repair inserts tied to reliable controlled evidence |

## Approval and handoff rules

- Current released behavior and repository architecture override these copies if they differ.
- Do not implement a later queue item while an earlier item lacks its release and learner-value gate.
- Do not add runtime AI, typing, free-form grading, a second scheduler, or a new top-level destination without a new explicit product decision.
- Keep deferred ideas in [the canonical parking lot](../feature-parking-lot.md), not in this queue.
- After implementation approval, update the selected plan checklist with evidence and keep the other plans untouched.

## Source

Reviewed source package: `/home/mgurram/MGurramAI/projects/dutchmate-proj/DutchMate-deterministic-feature-plans`.
