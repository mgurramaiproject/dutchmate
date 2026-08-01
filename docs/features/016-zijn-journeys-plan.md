# Plan 016: `zijn` Verb Journeys

**Codename:** `zijn-journeys`

**Feature code:** `016-zijn-journeys`

**Branch:** `016-zijn-journeys`, created from the clean `main` branch.

**Status:** Grill and specification complete; `$to-tickets` remains
approval-gated.

**Specification:** [016-zijn-journeys-spec.md](./016-zijn-journeys-spec.md);
published as [GitHub issue #133](https://github.com/mgurramaiproject/dutchmate/issues/133)
with `ready-for-agent`.

## Goal

Improve the reusable `author-verb-journeys` skill and use the improved skill
to author a complete DutchMate Verb Journey package for the high-utility,
irregular verb `zijn` (“to be”). The package must add a second verb without
resetting or re-keying existing `werken` learning history, and must keep the
existing deterministic Lessons, Today/Daily Five, popup, and local learning
record contracts.

## Resolved product decisions

- Use six complete, playable journeys:
  1. `ben / bent / is / zijn` for identity, state, and description (A0/A1
     core).
  2. Present-tense questions and inversion such as `ben je?`, `is het?`, and
     `zijn we?` (A1 core).
  3. `was / waren` for past states and locations (A1/A2 core).
  4. `ben geweest / is geweest` for past experience or being somewhere (A2
     core).
  5. `zal zijn / zou zijn` for future plans and conditional possibilities (A2
     later).
  6. `was geweest / zal geweest zijn / zou geweest zijn` as an advanced
     reference journey.
- All six journeys receive the complete story → notice → Verb Map or English
  comparison → five-question practice → bounded repair → evidence →
  completion path. `later` and `reference` describe progression priority, not
  missing functionality or a dead-end screen.
- Keep stories primarily first-person for coherence, while notices and
  controlled practice deliberately compare the high-value present forms and
  inversion. Do not teach the full conjugation paradigm in every journey or
  claim uncued production.
- Teach `zijn` as the main/copular verb only, including forms meaning “have
  been” and “had been.” Teaching `zijn` as an auxiliary for other verbs is
  deferred.
- Keep the canonical eight-form Dutch Verb Map and twelve English comparison
  records. Preserve the A0/Pre-A1 through A2 product ceiling and the learning
  triangle support contract.
- Do not create a new clickable prototype. Reuse the established Feature 015
  interaction contract and verify the new content through focused integration
  tests and manual QA.
- Do not add direct Saved-to-`zijn` resolution in this feature. Common
  one-word forms such as `is`, `was`, and `zijn` are too ambiguous to classify
  safely without context; unresolved Saved items remain unchanged.
- Record the additive multi-verb pack and history-preservation boundary in
  ADR 0009.

## Skill improvement

Update the separate `author-verb-journeys` skill repository at
`/home/mgurram/agent-skills/author-verb-journeys` before authoring the package.
The revision keeps the existing product contract but makes the reusable
workflow explicit:

- separate verb-agnostic rules from `werken`-specific defaults, including
  subject/person scope;
- require a per-journey authoring matrix connecting learner meaning, target
  forms, contrasts, evidence, and review provenance;
- require explicit Dutch, English, and Telugu content qualification before
  implementation;
- require verification that the content seam supports multiple additive packs
  and preserves existing learner history.

Add one concise reusable authoring-matrix and qualification reference; do not
add a new script or duplicate DutchMate product documents. Validate the skill,
commit its separate repository, and install the updated skill into the
machine's built-in agent targets: Hermes, Claude, Codex, OpenCode, Pi,
OpenClaw, and universal `~/.agents/skills`. Verify every resolved symlink and
note that already-running agent sessions may need a fresh session to re-index
updated skill metadata.

## Deferred parking-lot ideas

The following remain parked rather than silently expanding Feature 016:

- Teach `zijn` as an auxiliary for other verbs, such as `is gegaan`.
- Add a new clickable prototype for the second verb.
- Resolve ambiguous one-word Saved entries directly to `zijn`.

They are recorded in the canonical feature parking lot with `016` provenance.

## Verification seams to take to `$to-spec`

1. The authored multi-pack validator and availability report: complete `zijn`
   eight-form/twelve-pattern coverage, stable IDs, target integrity, all six
   complete journeys, person-scope rules, translations, and review metadata.
2. Pure journey and evaluator logic: one authored five-question set per
   journey, all five exercise families, deterministic accepted answers,
   bounded repairs, retry/reset behavior, and duplicate-token identity.
3. The existing learning-record and typed background boundary: additive
   `zijn` evidence, idempotency, stale-submission protection, migration
   atomicity, export/import compatibility, Daily Five eligibility, and
   preservation of `werken` and unrelated records.
4. Existing popup and Lessons integration: two-verb directory, `zijn`
   overview, all journey routes, map/comparison focus, completion return,
   Today activity, accessibility, and narrow-popup containment.

Extend existing tests at these seams; do not create a second scheduler,
mastery model, evidence store, verb-specific UI framework, or Saved resolver
that guesses from ambiguous text.

## Approval gates and delivery order

1. Commit this plan, ADR, and parking-lot update.
2. Ask for approval to invoke `$to-spec`; only after approval create and
   publish `docs/features/016-zijn-journeys-spec.md`. **Completed:** issue
   #133 is open with `ready-for-agent`.
3. Review the specification and proposed seams with the user. **Completed:**
   the approved seams are recorded in the specification.
4. Ask for approval to invoke `$to-tickets`; only after approval create and
   publish `docs/features/016-zijn-journeys-tickets.md` and the approved
   GitHub issue tree.
5. Implement tickets strictly against the checked-in specification, using the
   improved installed `author-verb-journeys` skill.
6. Run content qualification, Dutch review, automated verification, manual
   popup QA, documentation checks, and the complete delivery handoff.

No specification, ticket document, issue tree, prototype, or implementation
work is authorized by this plan alone.
