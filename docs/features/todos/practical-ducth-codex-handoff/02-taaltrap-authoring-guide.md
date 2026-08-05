# Taaltrap Lesson Authoring Guide

**Purpose:** Create copy-ready Practical Dutch topic lessons for DutchMate.  
**Default unit:** One topic family containing one A1 lesson and one A2 lesson.  
**Pilot:** Supermarket and shopping.

---

## 1. What an author produces

For a new topic, create exactly three source files:

```text
content/practical-dutch/topics/<topic-slug>/
  topic.json
  a1.lesson.json
  a2.lesson.json
```

The application catalogue is generated from these files. Authors do not edit popup code or TypeScript imports.

For an existing topic, a single level may be revised, but the author must inspect its sibling lesson to avoid repetition and level overlap.

---

## 2. Authoring workflow

```text
Define the topic
  ↓
Define distinct A1 and A2 outcomes
  ↓
Create a communicative-intention map
  ↓
Draft contextual input
  ↓
Draft sentence bank
  ↓
Select chunks and vocabulary
  ↓
Choose one primary language focus
  ↓
Author core and extra exercises
  ↓
Run mechanical validation
  ↓
Human review: Dutch, English, Telugu, exercises
  ↓
Test in the popup
  ↓
Approve and publish
```

Do not begin by generating arbitrary sentences. Begin by deciding what the learner must be able to do.

---

## 3. Topic-family design

Every topic has A1 and A2 lessons.

### A1 design

A1 focuses on:

- Immediate, concrete needs
- Short, frequent language
- One-step requests and questions
- Predictable responses
- Limited vocabulary and sentence complexity

### A2 design

A2 focuses on:

- Explaining a simple problem
- Asking for details or clarification
- Comparing alternatives
- Giving a reason or preference
- Handling a short multi-step interaction
- More varied but still practical sentence structures

### Separation test

Complete this before authoring:

| Dimension | A1 | A2 |
|---|---|---|
| Primary outcome |  |  |
| Situation |  |  |
| Communicative intentions |  |  |
| Vocabulary domains |  |  |
| Primary pattern |  |  |
| Typical interaction length |  |  |
| Problem complexity |  |  |

Reject the pair if A2 is simply A1 with longer wording.

---

## 4. Lesson content requirements

### 4.1 Metadata

Required:

- Stable lesson ID
- Topic ID
- Slug
- Content version
- A1 or A2
- Title
- Subtitle
- Estimated duration
- Format
- Tags
- Status
- Original-content provenance

Recommended IDs:

```text
lesson.supermarket-shopping.a1
lesson.supermarket-shopping.a2
```

IDs remain stable after publication.

### 4.2 Practical outcomes

Write 3–5 observable abilities.

Good:

```text
Ask where a product is.
Ask whether an alternative is available.
Pay by card and respond to a basic checkout question.
```

Weak:

```text
Understand supermarket Dutch.
Improve vocabulary.
Become more fluent.
```

Every completion claim must be supported by taught content and at least one exercise.

### 4.3 Situation

Write one or two short support-language sentences explaining when the learner uses this Dutch. Do not write a long cultural introduction.

### 4.4 Contextual input

Choose the format that fits:

- `dialogue`
- `mini-story`
- `message`
- `notice`
- `mixed`

Requirements:

- 4–8 lines
- Dutch, English, and Telugu for every line
- Natural progression
- No line exists only to force a vocabulary item
- Consistent names/details
- Avoid unnecessary idioms at A1
- A2 may use a modestly longer interaction

### 4.5 Sentence bank

Create 8–12 standalone sentences.

Each sentence must:

- Be useful outside the contextual input
- Serve a named communicative intention
- Be natural contemporary Dutch
- Fit the assigned CEFR level
- Have natural EN and TE translations
- Avoid depending on omitted earlier text
- Be short enough for the popup
- Identify linked vocabulary/chunks where applicable

Guidelines:

- A1: usually 3–10 Dutch words
- A2: usually 5–15 Dutch words

Sentence length alone does not determine level.

### 4.6 Phrase bank

Create 4–8 reusable chunks.

Good:

```text
Waar kan ik … vinden?
in de aanbieding
met pin betalen
Kunt u dit controleren?
geschikt voor …
```

Weak:

```text
de
ik
product
heel erg
```

Chunks should support new sentence production.

### 4.7 Vocabulary

Create 8–15 items. Each item includes:

- Dutch lemma or fixed expression
- English
- Telugu
- Part of speech/type
- Article for countable nouns where applicable
- Optional plural
- Optional note
- Demonstrating sentence IDs

Include only vocabulary relevant to the outcomes.

### 4.8 Language focus

Exactly one primary focus. It may be:

- A reusable sentence frame
- A word-order pattern
- A politeness pattern
- A high-value collocation structure
- A contrast that directly supports the topic

Keep the explanation brief and practical.

Optional: one supporting observation. Do not turn the lesson into a grammar chapter.

---

## 5. Exercise authoring

### 5.1 Required volume

Each lesson has:

- Exactly 6 core exercises
- 6–10 extra exercises
- At least 12 total

Recommended core sequence:

1. Sentence comprehension
2. Situation response
3. Vocabulary fill
4. Chunk/pattern fill
5. Sentence construction
6. Transfer or dialogue response

Use extra exercises to deepen vocabulary, articles/collocations, repair, substitutions, dialogue completion, and practical responses.

### 5.2 Supported primitives

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

### 5.3 Fill-in-the-blank quality

Good:

```text
De melk staat in ___ vier.
A. gangpad
B. kassa
C. bon
```

Good:

```text
Kan ik ___ pin betalen?
A. met
B. naar
C. voor
```

Weak:

```text
___ melk staat in gangpad vier.
A. De
B. Een
C. Mijn
```

This may be ambiguous without a defined article target.

Weak:

```text
De melk ___ in gangpad vier.
A. staat
B. is
C. ligt
```

This may have several contextually possible answers unless the lesson explicitly teaches the contrast.

### 5.4 Distractors

Distractors must:

- Be plausible enough to test learning
- Be clearly wrong in the stated context
- Reflect a likely learner error where possible
- Not introduce confusing advanced content
- Not duplicate the correct answer
- Not depend on hidden knowledge

### 5.5 Feedback

Feedback must:

- State the correct answer
- Explain the target briefly
- Reuse the full correct sentence
- Avoid generic “Wrong” messages
- Avoid long grammar lectures

Example:

```text
Use gangpad for an aisle: De melk staat in gangpad vier.
```

---

## 6. Translation standards

### Dutch

- Contemporary Netherlands Dutch
- Natural register for the situation
- Intentional `jij/jullie/u`
- Verify articles, plurals, separable verbs, word order, and collocations
- Avoid Belgian-only wording unless explicitly taught

### English

- Natural and meaning-preserving
- Preserve politeness and pragmatic intent
- Do not add information absent from Dutch

### Telugu

- Natural and understandable Telugu
- Meaning-preserving rather than mechanically literal
- Avoid unnecessary gendered wording
- Use familiar borrowed terms naturally where appropriate
- Final Telugu requires human review

---

## 7. CEFR guardrails

### A1

Prefer:

- Present tense
- Common modal constructions
- Short main clauses and questions
- Frequent nouns and verbs
- Concrete time/place/quantity language
- Predictable service interactions

Limit:

- Long subordinate clauses
- Abstract explanations
- Dense pronoun references
- Several unfamiliar words in one sentence

### A2

Allow:

- Basic subordinate clauses
- Polite multi-clause requests
- Reasons and preferences
- Simple past/perfect where useful
- Problem description and clarification
- More precise product/service vocabulary

Avoid:

- Bureaucratic or literary phrasing
- Dense B1/B2 argumentation
- Unexplained idioms
- Long encyclopedic sentences

---

## 8. Original-content policy

The lesson must be newly authored.

Allowed:

- Ask AI to draft original examples.
- Consult official Dutch websites for terminology/context.
- Consult dictionaries and grammar references.
- Rewrite after review.

Not allowed:

- Copy sentence lists from Tatoeba.
- Extract Wikipedia sentences.
- Copy textbooks, courses, subtitles, or websites.
- Ask AI to reproduce a named copyrighted lesson.
- Mark generated text approved without review.

Every file includes:

```json
{
  "provenance": {
    "authoringMethod": "ai-assisted-original",
    "originalContentDeclaration": true,
    "copiedSourceText": false
  }
}
```

---

## 9. Review process

### Pass 1 — Author self-review

- Outcome alignment
- A1/A2 separation
- Sentence usefulness
- Duplicate language
- Exercise coverage
- Valid IDs/references

### Pass 2 — Dutch review

- Naturalness
- Grammar
- Register
- Netherlands usage
- CEFR suitability
- Collocations
- Dialogue realism

### Pass 3 — Translation review

Check EN and TE line by line against Dutch.

### Pass 4 — Exercise review

- One clear answer
- Distractor quality
- Feedback
- Target coverage
- No answer hints

### Pass 5 — Popup review

- Wrapping
- Density
- Telugu readability
- Sequence
- Completion time
- Repetition
- Focus behaviour

Only then set `review.status` to `approved`.

---

## 10. Versioning rules

Start unpublished lessons at:

```json
"contentVersion": 1
```

Always increment for material changes such as:

- Changed Dutch target sentence
- Changed accepted answer
- Changed IDs
- Reordered required learning flow
- Replaced exercise
- Changed primary language focus

Never reuse an ID for a different target.

The implementation should document whether typo-only changes also increment version; do not apply inconsistent rules between lessons.

---

## 11. Completion checklist

- [ ] Topic manifest exists.
- [ ] A1 and A2 outcomes are distinct.
- [ ] Context has 4–8 lines.
- [ ] Sentence bank has 8–12 entries.
- [ ] Phrase bank has 4–8 entries.
- [ ] Vocabulary has 8–15 entries.
- [ ] Exactly one primary language focus.
- [ ] Exactly 6 core exercises.
- [ ] At least 6 extra exercises.
- [ ] At least 4 vocabulary exercises.
- [ ] At least 2 chunk/collocation exercises.
- [ ] At least 2 construction/word-order exercises.
- [ ] At least 2 application/transfer exercises.
- [ ] Every exercise has one clear answer.
- [ ] Required NL/EN/TE fields are complete.
- [ ] Content is original.
- [ ] Human review fields are complete.
- [ ] Local validation passes.
- [ ] Popup inspection passes.

---

## 12. Publication commands

```bash
corepack pnpm practical-dutch:validate
corepack pnpm practical-dutch:build
corepack pnpm verify
```

Then test both browser builds before committing approved content.
