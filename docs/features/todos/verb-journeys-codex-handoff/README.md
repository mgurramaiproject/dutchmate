# DutchMate Verb Journeys — Codex CLI Handoff

This package specifies how to add deterministic, verb-centred learning journeys to the existing DutchMate browser extension.

## Product outcome

A learner can open a verb such as **werken**, learn it through short staged journeys, understand all eight Dutch grammatical forms through one reusable Verb Map, compare the 12 English tense patterns with natural Dutch equivalents, complete click-only exercises, and later review weak skills from Today.

## Critical implementation constraint

**Preserve the existing DutchMate UI and design system.**

The implementation must:

- retain the existing Today, Lessons, Saved, Options, heatmaps, buttons, sections and navigation;
- reuse existing components, tokens, spacing, typography, colours, icons and interaction patterns;
- add Verb Journeys inside the current architecture;
- avoid restyling unrelated screens;
- treat the clickable mockup as a behavioural/reference prototype, not as a replacement UI;
- keep changes small and reviewable.

If the mockup conflicts with the repository, preserve the repository’s established visual language and adapt the feature to it.

## Documents

1. [product-spec.md](product-spec.md) — product behaviour, scope and non-goals.
2. [implementation-plan.md](implementation-plan.md) — phased engineering plan and decision gates.
3. [content-and-data-model.md](content-and-data-model.md) — deterministic schemas, example records and validation.
4. [learning-and-authoring-guide.md](learning-and-authoring-guide.md) — curriculum, exercise design and content workflow.
5. [acceptance-and-test-plan.md](acceptance-and-test-plan.md) — acceptance criteria and test coverage.
6. [architecture-decisions.md](architecture-decisions.md) — decisions Codex must preserve.
7. [codex-cli-start-prompt.md](codex-cli-start-prompt.md) — ready-to-paste starting prompt.

## Recommended delivery sequence

1. Inspect the repository and document the current architecture.
2. Agree on the smallest integration plan; do not code yet if material choices remain.
3. Implement one complete **werken** vertical slice behind a feature flag.
4. Validate UI preservation, persistence, accessibility and deterministic grading.
5. Expand content only after the slice meets the acceptance criteria.

## Definition of the first releasable slice

The first slice includes:

- Lessons entry point using the existing navigation;
- Werken overview;
- one canonical eight-form Werken Verb Map;
- complete 12-English-form comparison for werken;
- three core journeys: OTT, VTT and OVT;
- five click-only core exercise types;
- deterministic remediation after mistakes;
- skill-level progress persistence;
- a Today review/resume entry point;
- no runtime LLM or network dependency.

Advanced Dutch forms remain visible as reference content but are not beginner mastery requirements.

