# Taaltrap — Practical Dutch Topic Lessons

**Code name:** `Taaltrap`  
**User-facing feature:** `Practical Dutch`  
**Pilot topic:** `Supermarket and shopping`  
**Pilot lessons:** `A1` and `A2`  
**Repository:** `mgurramaiproject/dutchmate`  
**Status:** Implementation handoff  
**Prepared:** 2026-08-04

---

## 1. Executive decision

Expand the existing **Practical Stories** area into a broader **Practical Dutch** learning system.

Do not add a separate Sentence Packs feature or a new popup tab. A Practical Dutch topic may use a dialogue, mini-story, written message, notice, or other contextual input, followed by a useful sentence bank, phrase bank, vocabulary, focused practice, and optional extra review.

Each topic is a **topic family** with two separately playable lessons:

- **A1:** essential, concrete interaction
- **A2:** more demanding interaction in the same real-life domain

The first topic family is:

```text
Supermarket and shopping
├── A1 — Find products, ask simple questions, and pay
└── A2 — Compare products, ask about ingredients, and solve problems
```

The content is original DutchMate-authored material. ChatGPT or Codex CLI may assist with drafting, but every published lesson must pass human editorial review. The released extension remains deterministic and makes no runtime AI or corpus/database calls.

---

## 2. Product principles

1. **Outcome first** — author communicative outcomes before sentences or exercises.
2. **Context plus breadth** — a short contextual input makes language memorable; a sentence bank makes it reusable.
3. **Vocabulary is explicit** — each lesson contains a deliberate vocabulary set and several vocabulary-focused exercises.
4. **Chunks beat isolated words** — teach reusable expressions such as `in de aanbieding` and `met pin betalen`.
5. **Practice progresses from support to use** — Understand → recall → build → transfer.
6. **A1 and A2 are distinct** — A2 is not merely A1 with longer sentences.
7. **Short first session, richer optional review** — six core exercises are required; six or more extra exercises remain available.
8. **Copy-ready content** — publishing a new lesson should require adding validated content files, not editing application logic.
9. **Preserve DutchMate** — keep Today, Lessons, Saved, Daily Five, heatmaps, legacy Practical Stories, Verb Journeys, grammar, and existing browser-extension constraints.

---

## 3. Information architecture

### Lessons hub

Rename the current user-facing category:

```text
Practical Stories → Practical Dutch
```

Keep existing story lessons, but present them as one supported lesson format.

Recommended Lessons categories:

1. Practical Dutch
2. Verb Journeys
3. Other existing grammar/contrast learning entries

Do not add a fourth bottom-navigation tab.

### Practical Dutch library

Display one card per topic family:

```text
Supermarket and shopping
Everyday errands

A1  Ready
A2  Ready

Find products, pay, compare choices,
and solve common shopping problems.
```

Selecting the topic opens a topic overview with both levels.

### Level behaviour

- A1 and A2 are both visible.
- Recommend A1 before A2.
- Do not hard-lock A2.
- After completing A1, promote A2 as the next action.
- Store progress separately per lesson and content version.

---

## 4. Scalable lesson anatomy

Each lesson uses the same content contract while allowing different contextual formats.

| Block | Requirement |
|---|---|
| Identity | Topic, level, title, duration, tags, content version |
| Practical outcomes | 3–5 concrete learner abilities |
| Situation | Brief explanation of when the language is used |
| Contextual input | 4–8 lines: dialogue, mini-story, message, notice, or interaction |
| Sentence bank | 8–12 independently useful Dutch sentences |
| Phrase bank | 4–8 reusable chunks |
| Vocabulary | 8–15 target items |
| Language focus | Exactly one primary pattern |
| Supporting observation | Zero or one short contrast/usage note |
| Core practice | Exactly 6 required exercises |
| Extra practice | 6–10 optional/review exercises |
| Completion claims | 3–5 abilities supported by lesson evidence |
| Editorial metadata | Authoring method, author, reviewer, dates, approval state |

### Learner flow

```text
Overview
  ↓
Context
  ↓
Useful sentences
  ↓
Useful phrases and vocabulary
  ↓
Notice one pattern
  ↓
Core practice: 6 items
  ↓
Keep useful chunks
  ↓
Completion
  ↓
Optional extra practice: vocabulary or sentences
```

The learner can pause and resume after every stage.

---

## 5. Pilot content briefs

## 5.1 Supermarket and shopping — A1

### Primary outcome

The learner can locate products, ask simple product and price questions, and complete a basic checkout interaction.

### Required abilities

- Ask where a product is.
- Ask whether an alternative product is available.
- Ask a simple price or promotion question.
- Request a quantity.
- Pay by card.
- Ask for or decline a receipt/bag politely.

### Suggested context

A short customer–employee interaction followed by a short checkout exchange.

### Vocabulary territory

`het gangpad`, `de kassa`, `de aanbieding`, `de bon`, `de tas`, `de prijs`, `betalen`, `pinnen`, `vinden`, `nodig hebben`.

### Primary language pattern

```text
Waar kan ik + object + infinitive?
```

Example:

```text
Waar kan ik de melk vinden?
```

### Supporting observation

Question word order: the finite verb comes before the subject.

### Exercise emphasis

- Vocabulary recognition
- Vocabulary fill-in-the-blank
- Chunk completion
- Basic question ordering
- Product substitution
- Best response at checkout

## 5.2 Supermarket and shopping — A2

### Primary outcome

The learner can obtain more detailed product information and resolve a common shopping or checkout problem politely.

### Required abilities

- Ask about ingredients, allergens, or dietary suitability.
- Compare two products or explain a preference.
- Ask when an unavailable product will return.
- Report an incorrect shelf price or checkout charge.
- Request an exchange, refund, or help at the service desk.
- Explain the problem politely and understand a basic response.

### Suggested context

A product question followed by a customer-service-desk interaction.

### Vocabulary territory

`de ingrediënten`, `de allergie`, `glutenvrij`, `de houdbaarheidsdatum`, `de kassabon`, `de voorraad`, `verkeerd aangeslagen`, `terugbrengen`, `ruilen`, `terugbetalen`, `controleren`, `geschikt voor`.

### Primary language pattern

```text
Kunt u controleren of ...?
```

or, if editorial review finds it more useful:

```text
Ik zie dat ...; kunt u dit controleren?
```

Only one pattern should be marked primary in the final lesson.

### Supporting observation

Use polite `u` language for a service-desk problem.

### Exercise emphasis

- Ingredient and product-property vocabulary
- Collocations such as `in voorraad`, `geschikt voor`, `verkeerd aangeslagen`
- Polite problem descriptions
- Sentence repair
- Dialogue completion
- Choosing the most appropriate service-desk response

---

## 6. Exercise system

### Required practice volume

Each lesson contains:

- **6 core exercises** during first completion
- **6–10 extra exercises** after completion and for later review
- **12 exercises minimum** in the authored file

Do not require all 12 during first exposure.

### Default distribution

| Learning target | Minimum items |
|---|---:|
| Vocabulary | 4 |
| Chunks/collocations | 2 |
| Sentence comprehension | 2 |
| Word order/construction | 2 |
| Transfer/practical response | 2 |
| **Total minimum** | **12** |

### MVP exercise primitives

1. `choose-meaning`
2. `choose-situation-response`
3. `fill-word-choice`
4. `fill-chunk-choice`
5. `fill-pattern-choice`
6. `order-tokens`
7. `repair-sentence`
8. `complete-dialogue`
9. `choose-best-response`
10. `substitute-slot`

Drag-to-match and free typing are out of scope for the pilot.

### Fill-in-the-blank rules

Fill-in exercises must teach a defined target rather than hide arbitrary words.

Supported target types:

- Vocabulary: `De melk staat in ___ vier.`
- Collocation: `Kan ik ___ pin betalen?`
- Pattern: `Waar ___ ik de melk vinden?`
- Article: `Waar is ___ kassa?` — only for selected high-value nouns
- Dialogue fit
- Product substitution

Every exercise must have exactly one unambiguously correct answer, credible distractors, a target reference, and corrective feedback.

---

## 7. Content architecture

### Author-facing files

Store authored source files outside application code:

```text
content/
  practical-dutch/
    topics/
      supermarket-shopping/
        topic.json
        a1.lesson.json
        a2.lesson.json
```

Future topics use the same structure.

### Publishing rule

A topic is publishable only when both A1 and A2 files exist and pass validation, unless a development-only incomplete-topic flag is enabled.

### Topic manifest

`topic.json` owns shared metadata:

```json
{
  "schemaVersion": 1,
  "id": "topic.supermarket-shopping",
  "slug": "supermarket-shopping",
  "title": "Supermarket and shopping",
  "shortDescription": "Find products, pay, compare choices, and solve common shopping problems.",
  "domain": "everyday-errands",
  "order": 1,
  "tags": ["shopping", "food", "checkout", "netherlands"],
  "levels": ["A1", "A2"],
  "status": "approved"
}
```

### Lesson schema

Each lesson conforms to:

```text
schemas/practical-dutch/practical-lesson.schema.json
```

### Generated application catalogue

Do not manually import every lesson into TypeScript.

Add:

```text
scripts/practical-dutch/build-catalog.mjs
```

It should:

1. Discover topic and lesson files.
2. Parse and validate them.
3. Reject drafts in production builds.
4. Verify A1/A2 pairing.
5. Verify IDs and references.
6. Sort deterministically.
7. Generate:

```text
src/practical-dutch/generated/catalog.ts
```

Suggested commands:

```json
{
  "scripts": {
    "practical-dutch:validate": "node scripts/practical-dutch/validate.mjs",
    "practical-dutch:build": "node scripts/practical-dutch/build-catalog.mjs",
    "practical-dutch:check": "pnpm practical-dutch:validate && pnpm practical-dutch:build"
  }
}
```

Integrate `practical-dutch:check` into `verify` before tests and builds.

---

## 8. Runtime modules

Create:

```text
src/practical-dutch/
  types.ts
  catalog.ts
  validation.ts
  practice.ts
  session.ts
  progress.ts
  resume-target.ts
  generated/
    catalog.ts
```

Core types should include:

- `PracticalDutchLevel`
- `PracticalLessonFormat`
- `LocalizedText`
- `PracticalLesson`
- `PracticalContextLine`
- `PracticalSentence`
- `PracticalChunk`
- `PracticalVocabularyItem`
- `PracticalLanguageFocus`
- `PracticalExercise`
- `PracticalLessonReview`

Keep authored content separate from learner progress.

---

## 9. Validation contract

The validator must reject the following.

### Structural errors

- Unsupported schema version
- Duplicate IDs
- Missing A1 or A2 sibling for an approved topic
- Invalid content version
- Missing user-visible translation
- Broken target references
- Unsupported exercise primitive
- Invalid review state

### Quantity errors

- Context outside 4–8 lines
- Sentence bank outside 8–12
- Chunks outside 4–8
- Vocabulary outside 8–15
- Not exactly one primary focus
- More than one supporting observation
- Not exactly 6 core exercises
- Fewer than 6 extra exercises
- Fewer than 12 exercises total
- Insufficient exercise-category coverage

### Exercise errors

- No correct answer
- Multiple accepted answers unless explicitly supported
- Correct answer duplicated among distractors
- Duplicate choices
- Invalid token reconstruction
- Fill target mismatch
- Unknown target/content reference
- Ambiguous or empty feedback

### Editorial errors

Production publishing fails unless:

```text
review.status = "approved"
review.dutchReviewed = true
review.englishReviewed = true
review.teluguReviewed = true
review.exerciseReviewed = true
review.reviewedBy is non-empty
review.reviewedAt is a valid date
provenance.originalContentDeclaration = true
```

Drafts may render only in local-testing builds.

---

## 10. Original-content policy

No external sentence database is used.

Every lesson declares:

```json
{
  "provenance": {
    "authoringMethod": "ai-assisted-original",
    "originalContentDeclaration": true,
    "copiedSourceText": false,
    "researchNotes": []
  }
}
```

Rules:

- AI may draft content.
- Do not ask the model to reproduce textbook, Tatoeba, Wikipedia, website, or course sentences.
- External materials may inform terminology or context, but learner-facing text must be newly authored.
- Research notes stay in authoring metadata.
- Generated content is not approved until reviewed.

---

## 11. Existing lesson architecture migration

The repository currently has a monolithic `src/lessons/catalog.ts` and a lesson session built around read, notice, practise, replay, and keep. Extend it without breaking existing lessons.

### Phase A — Compatibility layer

- Keep existing lesson IDs and versions.
- Introduce `PracticalLessonV2`.
- Add an adapter that presents existing Practical Stories in the new Practical Dutch library.
- Existing stories retain their current renderer initially.
- New Taaltrap lessons use the new renderer and progress model.

### Phase B — Shared catalogue

```ts
type PracticalDutchCatalogEntry =
  | { generation: "legacy"; lesson: LegacyLesson }
  | { generation: "v2"; lesson: PracticalLesson };
```

### Phase C — Optional legacy conversion

Convert existing story lessons later, one at a time. Do not make that a pilot requirement.

---

## 12. Progress and storage

```ts
export type PracticalLessonStage =
  | "overview"
  | "context"
  | "sentences"
  | "language-focus"
  | "core-practice"
  | "keep"
  | "complete"
  | "extra-practice";

export type PracticalLessonProgress = {
  lessonId: string;
  contentVersion: number;
  stage: PracticalLessonStage;
  contextLineIndex: number;
  sentenceIndex: number;
  revealedSentenceIds: string[];
  knownSentenceIds: string[];
  selectedChunkIds: string[];
  coreExerciseIdsCompleted: string[];
  extraExerciseIdsCompleted: string[];
  latestCoreScore: number | null;
  latestExtraScore: number | null;
  completedAt: number | null;
  updatedAt: number;
};
```

Add to the learning record:

```ts
practicalLessons: Record<string, PracticalLessonProgress>;
```

Increment learning-record and backup versions.

### Migration

- Existing users get an empty `practicalLessons` record.
- Existing `lessonProgress` remains intact.
- Old backups import successfully.
- New backups include both legacy and v2 progress.

### Completion and rhythm

Completing core practice and the keep stage marks the lesson complete.

- Increment lesson activity once.
- Show completion in the existing rhythm/heatmap.
- Do not increment completion again during extra practice.

---

## 13. Saving chunks

At the keep stage, allow learners to select useful chunks such as:

```text
Waar kan ik … vinden?
met pin betalen
in de aanbieding
Kunt u dit controleren?
```

Extend source metadata compatibly:

```ts
type LearningItemSource =
  | ExistingSource
  | {
      type: "practical-lesson";
      addedAt: number;
      lessonId: string;
      topicId: string;
      level: "A1" | "A2";
      contentVersion: number;
    };
```

Save the originating sentence and EN/TE context. Do not automatically save every vocabulary item.

---

## 14. Popup implementation

Create dedicated modules instead of further expanding `src/popup/index.ts`:

```text
src/popup/practical-dutch/
  controller.ts
  renderer.ts
  topic-view.ts
  lesson-view.ts
  context-view.ts
  sentence-bank-view.ts
  language-focus-view.ts
  practice-view.ts
  completion-view.ts
```

The main popup file should only add routes, delegate rendering, and coordinate top-level navigation/focus.

Suggested route model:

```ts
type PracticalDutchRoute =
  | { screen: "library" }
  | { screen: "topic"; topicId: string }
  | { screen: "lesson-overview"; lessonId: string }
  | { screen: "lesson"; lessonId: string }
  | { screen: "completion"; lessonId: string }
  | { screen: "extra-practice"; lessonId: string };
```

Keep interaction state in a feature-owned session object rather than one global variable per control.

---

## 15. Today integration

Do not add multiple continuation cards.

Add:

```ts
getResumeLearningTarget()
```

Inputs may include legacy stories, Practical Dutch v2 progress, Verb Journeys, and other resumable activities.

Selection:

1. Most recently updated incomplete activity
2. Otherwise recommended next lesson
3. Prefer A2 in the same topic after A1 completion
4. Never start automatically

Example:

```text
Continue learning
Supermarket and shopping · A1
Useful sentences · 4 of 10

Continue →
```

---

## 16. UI and accessibility requirements

- Show one high-density context line, sentence, or exercise at a time.
- Prevent horizontal scrolling.
- Let Dutch, English, and Telugu wrap naturally.
- Dutch remains primary; EN/TE are smaller but readable.
- Do not require hover for essential content.
- Preserve keyboard operation and visible focus.
- Use `aria-live` for feedback.
- Move focus predictably after navigation.
- Use `lang="nl"` and `lang="te"` appropriately.
- Do not reveal translations before checking when that gives away an answer.

---

## 17. Practice-session behaviour

### Core practice

- Six exercises in a fixed pedagogical order
- Retry supported
- Focused feedback
- Save progress after each item
- Completion requires all six, not first-attempt perfection

### Extra practice

Offer entry points:

```text
Practise vocabulary
Practise sentences
Practise the situation
```

Use deterministic rotation. Avoid immediate repetition until all relevant exercises have been shown.

---

## 18. Background messages and learning client

Use explicit typed messages rather than direct popup storage writes.

Likely operations:

```text
GET_PRACTICAL_LESSON_PROGRESS
SAVE_PRACTICAL_LESSON_PROGRESS
COMPLETE_PRACTICAL_LESSON
SAVE_PRACTICAL_LESSON_CHUNKS
GET_PRACTICAL_DUTCH_SUMMARY
```

Follow current conventions for validation, storage ownership, errors, and tests.

---

## 19. Implementation phases

### Phase 0 — Branch and baseline

- Create `feature/taaltrap-practical-dutch` from `main`.
- Run the existing verification suite.
- Record baseline status.
- Avoid unrelated cleanup.

### Phase 1 — Content contract and tooling

- Add topic and lesson JSON Schemas.
- Add content directories.
- Add validator and generated-catalog builder.
- Add package scripts and validation tests.
- Create draft supermarket fixtures.

**Exit:** invalid/unreviewed content cannot enter production.

### Phase 2 — Runtime catalogue and compatibility

- Add Practical Dutch types/catalogue.
- Add legacy adapter.
- Rename the user-facing category.
- Add topic-family library and A1/A2 overview.
- Preserve legacy entry points.

**Exit:** existing lessons work; pilot entries render in local testing.

### Phase 3 — Session, progress, and migration

- Implement v2 session state.
- Add progress storage and backup migration.
- Add background messages/client operations.
- Add resume behaviour and tests.

**Exit:** a new lesson resumes after closing the popup.

### Phase 4 — Learning screens

- Overview
- Context
- Sentence bank
- Phrase/vocabulary support
- Language focus
- Keep stage
- Completion

**Exit:** lessons are readable end to end without practice.

### Phase 5 — Exercise engine

- Implement ten MVP primitives.
- Add checking, feedback, retry, core flow, extra practice, and persistence.

**Exit:** pilot lessons complete deterministically.

### Phase 6 — Saved and Today integration

- Save chunks with context.
- Add shared resume target.
- Recommend A2 after A1.
- Record rhythm activity.

**Exit:** Practical Dutch connects to DutchMate’s existing learning loop.

### Phase 7 — Author pilot topic

- Author `topic.json`.
- Author and review A1.
- Author and review A2.
- Validate content.
- Test in the popup.
- Revise for density and clarity.
- Mark approved.

### Phase 8 — Release readiness

- Unit tests
- Typecheck
- Chrome/Firefox builds
- Release verification
- Backup migration
- Narrow-popup/Telugu testing
- Keyboard testing
- Legacy regression testing
- Offline testing
- Documentation

---

## 20. Test plan

### Schema/tooling

- Valid pair builds
- Missing sibling fails
- Duplicate IDs fail
- Draft fails production
- Unsupported primitive fails
- Broken target fails
- Missing translation fails
- Missing review metadata fails
- Generated output is deterministic/current

### Unit

- Topic/level sorting
- A1→A2 recommendation
- Session creation/resume
- Stage progression
- Fill-in checking
- Token ordering
- Retry
- Completion
- Extra-practice rotation
- Saved chunk conversion
- Progress/backup migration

### Popup

- Library and topic overview
- Legacy lesson still opens
- Context/sentence navigation
- Translation reveal
- Core and extra practice
- Keep/completion
- Focus and `aria-live`
- Error recovery

### Manual browsers

- Chrome and Firefox
- 360–400 px popup width
- Telugu and long Dutch wrapping
- Close/reopen mid-lesson
- A1 completion → A2 recommendation
- Saved chunk appears under Saved
- Heatmap update
- Old backup import

---

## 21. Acceptance criteria

The pilot is complete when:

- Practical Stories appears under the broader Practical Dutch category.
- Existing story lessons still function and retain progress.
- Supermarket and shopping appears as one topic family.
- It exposes separate A1 and A2 lessons.
- Both use the validated content contract.
- A1 and A2 have distinct outcomes/content.
- Each lesson has 4–8 context lines, 8–12 sentences, 4–8 chunks, 8–15 vocabulary items, one primary focus, 6 core exercises, and at least 6 extra exercises.
- Both include vocabulary fill-in-the-blank practice.
- Learners can pause/resume and save chunks.
- A1 completion recommends A2.
- Completion contributes to the rhythm/heatmap.
- There are no runtime AI or external-content calls.
- A normal future topic can be published by adding validated source files and running documented commands.
- Draft/unreviewed content cannot enter production.
- Existing and new tests pass.
- Chrome and Firefox builds pass.

---

## 22. Out of scope

- Audio
- Speech recognition
- Free-text grading
- Runtime AI
- External sentence databases
- Automatic translation
- User-authored lessons
- B1/B2
- Required images
- Drag-and-drop matching
- Hard-locking A2
- Build-time content generation by AI
- Bulk conversion of all existing stories

---

## 23. Copy-to-repo publication workflow

For a new topic, create:

```text
content/practical-dutch/topics/<topic-slug>/topic.json
content/practical-dutch/topics/<topic-slug>/a1.lesson.json
content/practical-dutch/topics/<topic-slug>/a2.lesson.json
```

Run:

```bash
corepack pnpm practical-dutch:validate
corepack pnpm practical-dutch:build
corepack pnpm verify
```

Review in Chrome and Firefox. Change `draft` to `approved` only after human review. Commit authored files and the generated catalogue. No application code should require editing for a normal topic.

---

## 24. Codex CLI implementation instruction

```text
Implement the Taaltrap Practical Dutch feature from this document in a dedicated
feature branch from main.

Preserve the existing DutchMate UI, Today heatmaps, Saved learning, legacy
Practical Stories, Verb Journeys, and current design system.

Build the reusable architecture and content-validation pipeline first. Then
implement only one pilot topic family: Supermarket and shopping, with separate
A1 and A2 lessons.

Do not use runtime AI or external sentence databases. Treat all published lesson
content as original DutchMate-authored, AI-assisted, human-reviewed content.

Keep authored content outside application code so a future topic can be published
by copying topic.json, a1.lesson.json, and a2.lesson.json into the content folder,
running validation/catalog generation, and passing pnpm verify.

Commit coherent changes in small steps. After each phase, run the relevant tests.
Do not silently weaken validation or acceptance criteria to make tests pass.
```
