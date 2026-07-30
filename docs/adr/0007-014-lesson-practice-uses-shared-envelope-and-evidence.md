# Feature 014: Use one lesson-practice envelope and shared evidence contract

Status: accepted

Related plan: `docs/features/014-lesson-practice-loop-plan.md`.

Feature 014 will give every curated mini-lesson the same short practice
envelope: understand the practical outcome, act with support, retrieve with
less support, and apply the Dutch in a safe context. The envelope is
interleaved into the existing lesson flow and is sized to the normal three-to-
five-minute lesson rather than appended as a mandatory quiz.

The learner-facing sequence remains stable across learners. Lesson-specific
content is selected from a reviewed outcome map and uses behavior coverage,
not fixed exercise quotas. A0, A1, and A2 increase difficulty through reduced
support, varied contexts, and recombination while retaining the same
deterministic click-only interaction contract.

All lesson practice, Daily Five grammar work, Contrast Repair, eligible Saved
context practice, and Encounter Coaching use one shared exercise-result seam.
The seam owns accepted-answer validation, scoped feedback, bounded evidence,
idempotency, and persistence. Existing grammar-pattern and learning-item
records remain the only progress owners; Feature 014 adds no lesson mastery,
second scheduler, queue, or learner-facing Verb Timeline.

Every lesson has a guaranteed in-lesson transfer step. Saved-context or
webpage practice may extend that step only when the existing safety contract
finds an eligible item; external discovery is never required.

Bundled practice content must pass deterministic validation and independent
Dutch review before release. Stable identifiers and explicit content
versions preserve compatible history. Incompatible changes require an
explicit migration, and an atomic migration failure leaves the prior local
learning record readable.

This decision favors one understandable learning system and durable learner
history over per-lesson specialization, adaptive lesson branching, and
additional progress surfaces. The cost is that some lesson-specific teaching
ideas must fit the shared contract or remain deferred.
