# Feature 023 — Practical Dutch Authoring Guide

This guide is the content-quality contract for Practical Dutch authors and
agents. The implementation plan and eventual schema remain authoritative for
runtime details. This guide does not authorize runtime AI, automatic
publishing, or application-code edits for normal content additions.

## What an author produces

One Practical Dutch topic is an A1/A2 pair inside an existing Practical life
pathway. The topic is authored and reviewed as one atomic package, even though
each level has its own stable lesson identity and learner progress.

The normal workflow is:

```text
Define pathway and topic boundary
  ↓
Define distinct A1 and A2 outcomes
  ↓
Map communicative intentions
  ↓
Draft contextual input
  ↓
Draft useful sentences, chunks, and vocabulary
  ↓
Choose one primary language focus per level
  ↓
Author six core and six-to-ten extra exercises per level
  ↓
Run structural validation
  ↓
Review Dutch, English, Telugu, and exercises independently
  ↓
Inspect the popup and upgrade-sensitive behavior
  ↓
Approve the complete pair
```

Begin with learner outcomes, not a list of arbitrary sentences.

## Topic and level design

The topic must fit its parent Practical life pathway and make the two levels
meaningfully different.

### A1

Prefer immediate, concrete needs, short frequent language, one-step requests,
predictable responses, and basic vocabulary. Use the simplest language that
supports the real task.

### A2

Add product or service detail, comparison, reasons, preferences, polite
clarification, and a short multi-step problem-solving interaction. More words
alone do not make A2.

Complete this separation table before writing the full pair:

| Dimension | A1 | A2 |
| --- | --- | --- |
| Primary outcome |  |  |
| Situation |  |  |
| Communicative intentions |  |  |
| Vocabulary territory |  |  |
| Primary pattern |  |  |
| Interaction complexity |  |  |
| Transfer task |  |  |

Reject the pair if A2 is only A1 with longer sentences.

## Lesson contract

Each level contains:

- three to five observable practical outcomes;
- a short situation explanation;
- four to eight contextual lines;
- eight to twelve useful standalone Dutch sentences;
- four to eight reusable chunks;
- eight to fifteen vocabulary items;
- exactly one primary language focus;
- zero or one supporting observation;
- exactly six core exercises;
- six to ten extra exercises;
- three to five completion claims; and
- complete provenance and review metadata.

The first path should take roughly five to seven minutes. Extra practice is
optional review and does not affect completion.

### Context

Use a dialogue, mini-story, message, notice, or mixed format that fits the
outcome. Every line needs reviewed Dutch, English, and Telugu. Keep names,
details, and referents consistent. Do not add a line only to force a target
word into the story.

### Sentence bank

Each sentence must be useful outside the context, serve a named communicative
intention, use natural Netherlands Dutch, fit the assigned level, and have
meaning-preserving English and Telugu support. Link sentences to the chunks
and vocabulary they teach.

### Chunks

Teach reusable expressions and frames, not arbitrary short strings. Good
chunks include `Waar kan ik ... vinden?`, `in de aanbieding`, and `Kunt u dit
controleren?`. A single article, isolated pronoun, or generic adjective is not
automatically a chunk.

### Vocabulary

Include only items required by the outcomes. Record the Dutch form, lemma or
fixed expression, English, Telugu, type, article where relevant, optional
plural/note, and demonstrating sentence IDs. Do not automatically save the
whole list; the learner chooses a small authored candidate set at keep.

### Language focus

Choose one practical pattern per level. Explain it briefly, show it in authored
sentences, and avoid turning the lesson into a grammar chapter. A supporting
observation is optional and must not become a second primary lesson.

## Exercise authoring

The six core exercises should move from supported understanding toward
controlled use. A useful sequence is:

1. understand a sentence or situation;
2. choose a practical response;
3. complete a vocabulary target;
4. complete a chunk or primary-pattern target;
5. construct or repair a sentence; and
6. transfer the language to a new product, problem, or dialogue turn.

Extra exercises may deepen vocabulary, collocations, substitutions, dialogue,
repair, or practical responses.

The runtime should reuse existing deterministic choice and token-order seams.
Use a feature-specific primitive only when the behavior is genuinely distinct.
Every exercise must have:

- a stable ID and core/extra classification;
- a taught target reference;
- a prompt and context where needed;
- enumerated choices or tokens;
- exactly one clear accepted answer unless alternatives are explicitly
  enumerated;
- credible distractors that represent likely mistakes;
- concise corrective feedback containing the correct form; and
- review metadata.

Do not use free-text grading, hidden answer rules, arbitrary blanks, or
distractors that introduce unexplained advanced language.

## Multilingual quality

- Dutch is contemporary Netherlands Dutch and matches the situation's register.
- English preserves meaning, politeness, and pragmatic intent.
- Telugu is natural and meaning-preserving rather than mechanically literal.
- Dutch examples always carry reviewed English and Telugu support.
- Explanatory metadata may use the existing English-plus-Telugu support style.
- No runtime translation or fallback fills a missing authored field.

Review articles, plurals, separable verbs, word order, collocations,
`jij/jullie/u`, and CEFR suitability explicitly.

## Original-content policy

Learner-facing text must be newly authored. Dictionaries, official websites,
and grammar references may inform terminology and context, but do not copy
sentences from textbooks, courses, websites, subtitles, Wikipedia, Tatoeba, or
other sentence databases. AI may assist with drafts but does not establish
approval.

Every package declares original-content provenance, authoring method, and
research notes where relevant. Research notes support review and are not a
learner-facing citation system.

## Review gates

Review the complete A1/A2 pair in these passes:

1. **Author self-review:** outcomes, separation, references, counts, and
   duplication.
2. **Dutch review:** naturalness, grammar, register, Netherlands usage,
   collocations, and level.
3. **English review:** meaning, politeness, and pragmatic alignment.
4. **Telugu review:** naturalness, clarity, and meaning alignment.
5. **Exercise review:** accepted answers, distractors, feedback, and target
   coverage.
6. **Product review:** popup density, wrapping, keyboard operation, focus,
   resume, completion, and Saved-item behavior.

Only a complete pair with all required review fields may become released.

## Versioning and compatibility

Start new content at version 1. Increment for meaning-changing Dutch,
translations, accepted answers, target references, exercise semantics, primary
focus, or required-flow changes. Never reuse a stable ID for a different
meaning.

The topic package releases atomically, but each lesson records the content
version used by its own progress key. Do not edit or delete existing learner
records to make a content revision fit.

## Completion checklist

- [ ] The topic belongs to the correct Practical life pathway.
- [ ] A1 and A2 outcomes and transfer tasks are distinct.
- [ ] Context has four to eight multilingual lines.
- [ ] Sentence bank has eight to twelve entries.
- [ ] Chunk bank has four to eight entries.
- [ ] Vocabulary has eight to fifteen entries.
- [ ] Each lesson has exactly one primary language focus.
- [ ] Each lesson has six core and six to ten extra exercises.
- [ ] Exercise targets, accepted answers, distractors, and feedback are safe.
- [ ] All learner-facing Dutch examples have English and Telugu support.
- [ ] Provenance and all review fields are complete before approval.
- [ ] The package validates and the complete pair is release-qualified.
- [ ] Popup, keyboard, narrow-width, resume, Saved, and legacy-history checks
  pass.
