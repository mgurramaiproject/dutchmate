# Architecture Decisions

These are product-level decisions. Codex may adapt implementation details to the repository, but should not silently reverse these decisions.

## ADR-001 — Existing UI is the visual source of truth

**Decision:** Reuse DutchMate’s current design system and components. The mockup defines flow and information architecture, not a new visual system.

**Consequences:**

- no broad UI rewrite;
- no replacement of Today heatmaps or current sections;
- new screens must look native to the existing product;
- visual regressions outside the feature are release blockers.

## ADR-002 — Verb Journeys live inside Lessons

**Decision:** Do not add a top-level popup tab. Provide shortcuts from Today and optionally Saved.

**Reason:** Keeps navigation compact and connects the feature to the current learning structure.

## ADR-003 — One universal Continue action

**Decision:** Continue resumes the learner’s most recent meaningful unfinished activity across lesson types.

**Caveat:** If repository discovery shows that implementing this now would require a risky cross-feature refactor, retain current Continue behaviour for the first slice and document a follow-up rather than breaking existing flows.

## ADR-004 — One canonical Verb Map per verb

**Decision:** Every journey reuses the same eight-form map and highlights its target.

**Reason:** A stable model builds recognition and avoids duplicated/inconsistent screens.

## ADR-005 — Complete coverage, unequal emphasis

**Decision:** Show all eight Dutch forms, but mark advanced/uncommon forms as later or reference. Do not require A1 learners to master them.

## ADR-006 — English comparison is a mapping tool

**Decision:** Show all 12 English patterns with natural Dutch equivalents and mismatch notes. Do not imply one-to-one tense equivalence.

## ADR-007 — Click-only assessment

**Decision:** No required typing and no drag-only interaction.

**Reason:** Fast popup interaction, predictable grading and accessibility.

## ADR-008 — Deterministic runtime

**Decision:** Content and correctness are authored and validated ahead of release. Runtime evaluation uses exact structured rules.

**Allowed:** AI-assisted drafting outside production followed by human review.

**Not allowed:** Runtime LLM grading, content generation or correctness decisions.

## ADR-009 — Progress is skill-granular

**Decision:** Track verb + skill + exercise family, with journey completion separate from mastery.

**Reason:** Recognising *gewerkt* does not prove ability to produce *heb gewerkt*.

## ADR-010 — Prove with werken before abstraction/expansion

**Decision:** Implement werken as a complete vertical slice before seven additional verbs.

**Reason:** It exposes real UI, content, validation and persistence needs without prematurely building a generic curriculum engine.

## ADR-011 — Saved integration is conditional

**Decision:** Link saved forms to verbs only if the existing system can reliably resolve lemma/form relationships.

**Reason:** Avoid adding speculative NLP, external services or incorrect links to the MVP.

## ADR-012 — No destructive progress migration

**Decision:** New progress data is additive, versioned and safely ignorable when the feature is disabled.

