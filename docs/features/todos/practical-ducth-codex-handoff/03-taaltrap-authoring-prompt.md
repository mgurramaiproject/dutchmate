# Taaltrap Authoring Prompt for ChatGPT or Codex CLI

Copy this prompt and replace bracketed values.

---

You are authoring original multilingual learning content for the DutchMate browser extension.

## Task

Create `[MODE: a topic pair with A1 and A2 lessons / one A1 lesson / one A2 lesson]` for:

- Topic: `[TOPIC]`
- Topic slug: `[TOPIC-SLUG]`
- Domain: `[DOMAIN]`
- Intended situation in the Netherlands: `[SITUATION]`

The output must conform to:

```text
docs/features/taaltrap/lesson-authoring-guide.md
schemas/practical-dutch/practical-lesson.schema.json
```

When those repository files are available, inspect them before writing content. Also inspect the sibling level and nearby lessons to avoid duplicate outcomes, sentences, vocabulary, chunks, and exercises.

## Product constraints

- Create newly authored content for DutchMate.
- Do not copy or adapt sentences from Tatoeba, Wikipedia, textbooks, courses, websites, subtitles, or sentence databases.
- Do not assume runtime AI.
- Dutch is the target language; English and Telugu are support languages.
- Use natural contemporary Dutch used in the Netherlands.
- Keep content suitable for a narrow browser-extension popup.
- Every answer must be deterministically gradable.
- No free-text grading, audio, or image-dependent tasks.
- Do not create learner-facing citations because the content must be original.

## Level separation

When authoring a pair:

1. Define distinct A1 and A2 outcome maps.
2. Show that A2 is not merely longer A1 language.
3. Avoid repeating more than two essential chunks unless pedagogically necessary.
4. Give A2 different interaction problems, vocabulary, and transfer tasks.

### A1 emphasizes

- Concrete immediate needs
- Short frequent language
- One-step requests/questions
- Predictable responses
- Basic vocabulary and chunks

### A2 emphasizes

- Detailed product/service information
- Explaining a simple problem
- Comparing alternatives
- Giving reasons/preferences
- A short multi-step interaction
- Polite clarification or resolution

## Required lesson contents

For each lesson produce:

- 3–5 observable practical outcomes
- A brief situation
- 4–8 contextual lines
- 8–12 useful standalone sentences
- 4–8 reusable chunks
- 8–15 vocabulary items
- Exactly one primary language focus
- Zero or one supporting observation
- Exactly 6 core exercises
- 6–10 extra exercises
- At least 12 exercises total
- 3–5 evidence-based completion claims
- Original-content provenance metadata
- Draft review metadata unless reviewer details are supplied

## Exercise coverage

Each lesson includes at least:

- 4 vocabulary-focused exercises
- 2 chunk/collocation exercises
- 2 comprehension exercises
- 2 sentence-construction/word-order exercises
- 2 practical transfer/response exercises

Use only these primitives unless the repository schema supports more:

- `choose-meaning`
- `choose-situation-response`
- `fill-word-choice`
- `fill-chunk-choice`
- `fill-pattern-choice`
- `order-tokens`
- `repair-sentence`
- `complete-dialogue`
- `choose-best-response`
- `substitute-slot`

Fill-in-the-blank exercises must target vocabulary, chunks, or the primary pattern. Do not remove arbitrary words.

Every exercise includes:

- Stable ID
- `core` or `extra`
- Primitive
- Learning-target category
- Prompt
- Context where needed
- Choices/tokens as required
- Accepted answer
- Credible distractors
- Short corrective feedback
- References to taught IDs

## Translation quality

### Dutch

- Natural Netherlands Dutch
- Correct grammar and collocations
- Appropriate `jij/jullie/u`
- Appropriate CEFR difficulty

### English

- Natural and meaning-preserving
- Preserve politeness and pragmatic intent

### Telugu

- Natural and meaning-preserving
- Avoid awkward literal translation
- Avoid unnecessary gendered forms
- Use common borrowed words naturally where appropriate

## Output mode

When writing in a repository:

1. Create or update:
   - `content/practical-dutch/topics/[TOPIC-SLUG]/topic.json`
   - `content/practical-dutch/topics/[TOPIC-SLUG]/a1.lesson.json`
   - `content/practical-dutch/topics/[TOPIC-SLUG]/a2.lesson.json`
2. Run:
   - `corepack pnpm practical-dutch:validate`
   - `corepack pnpm practical-dutch:build`
3. Fix every validation error.
4. Do not mark content `approved` without named human review.
5. Report files changed, counts, exercise coverage, validation result, and human-review risks.

When responding outside a repository:

- Return each complete JSON file in a separate fenced block.
- Do not omit fields or use placeholders such as `add more here`.
- Keep review status `draft`.
- Add a concise review-risk list after the JSON.

## Topic-specific brief

### A1 outcome requirements

`[PASTE A1 OUTCOMES AND COMMUNICATIVE INTENTIONS]`

### A2 outcome requirements

`[PASTE A2 OUTCOMES AND COMMUNICATIVE INTENTIONS]`

### Required/preferred vocabulary

`[OPTIONAL VOCABULARY]`

### Patterns to consider

`[OPTIONAL PATTERNS; CHOOSE EXACTLY ONE PRIMARY PATTERN PER LEVEL]`

### Content to avoid

`[TOPIC-SPECIFIC RISKS OR EXCLUSIONS]`

## Final self-check

Verify:

- A1 and A2 are materially different.
- All content is original.
- Required translations are complete.
- Counts satisfy the schema.
- Exercise coverage satisfies the contract.
- Every exercise has one clear answer.
- All references point to existing IDs.
- Completion claims are supported.
- Review status is `draft` unless human review information was provided.
