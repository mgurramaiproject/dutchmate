# Feature 023 — Practical Dutch Drafting Prompt

Copy this prompt for an authoring-only ChatGPT or Codex CLI session. Replace
the bracketed values. It produces draft authored content; it does not approve,
publish, translate at runtime, or change application code.

```text
You are drafting original multilingual learning content for DutchMate.

Create [a complete A1/A2 topic pair / one A1 lesson / one A2 lesson] for:

- Parent Practical life pathway: [PATHWAY ID]
- Practical Dutch topic: [TOPIC TITLE]
- Topic ID: [TOPIC ID]
- Situation in the Netherlands: [SITUATION]
- Required outcomes and exclusions: [PASTE THE APPROVED BRIEF]

Before drafting, inspect:

1. docs/features/023-practical-dutch-plan.md
2. docs/features/023-practical-dutch-authoring-guide.md
3. docs/features/023-practical-dutch-lesson-template.json
4. the approved pilot brief or topic brief
5. sibling and nearby DutchMate content to avoid duplicate outcomes, examples,
   vocabulary, chunks, and exercises

Return one draft atomic practical-dutch package with shared topic metadata and
stable A1/A2 lesson IDs. Keep each lesson's contentVersion explicit and set
releaseStatus/review status to draft unless named human review has already
occurred.

For each lesson provide:

- 3–5 observable outcomes and completion claims;
- a concise situation explanation;
- 4–8 context lines with natural Dutch, English, and Telugu;
- 8–12 standalone useful sentences;
- 4–8 reusable chunks;
- 8–15 relevant vocabulary items;
- exactly one primary language focus and at most one supporting observation;
- exactly 6 core exercises and 6–10 extra exercises; and
- original-content provenance and draft review metadata.

Use the smallest deterministic click-only exercise set that expresses the
learning target. Prefer existing choice and token-order behavior. Every
exercise must enumerate its choices/tokens, accepted answer, distractors,
target references, and corrective feedback. Do not use free typing, audio,
drag-and-drop, runtime AI, or external sentence databases.

Level separation is mandatory. A1 handles concrete immediate needs with short,
frequent language. A2 adds detail, comparison, reasons, clarification, and a
short multi-step problem. A2 must not be A1 with longer sentences.

Translation rules:

- Dutch is natural contemporary Netherlands Dutch.
- English preserves meaning, register, and politeness.
- Telugu is natural and meaning-preserving, not mechanically literal.
- Never invent a missing translation at runtime or use a fallback.

Original-content rules:

- Write new learner-facing text.
- Do not copy or closely reproduce sentences from Tatoeba, Wikipedia,
  textbooks, courses, websites, subtitles, or sentence databases.
- References may inform terminology but are not copied learner content.

Before finishing, self-check:

- A1 and A2 are materially different.
- All counts and references satisfy the guide.
- Every exercise has one clear answer or explicitly enumerated alternatives.
- Every learner-facing Dutch example has reviewed-looking English and Telugu
  draft fields.
- Completion claims are supported by exercises.
- The pair remains suitable for a 5–7 minute first path.
- No content is marked approved.

Report:

- package and lesson IDs;
- counts for context, sentences, chunks, vocabulary, core, and extra
  exercises;
- exercise coverage by target category;
- duplicate/overlap risks;
- Dutch, English, Telugu, and pedagogical review risks; and
- validation failures that require implementation or human review.
```

The prompt is a drafting aid. A human reviewer must approve the complete pair
after structural validation and popup inspection.
