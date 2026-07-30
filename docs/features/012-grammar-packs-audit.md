# T01 audit: shipped A0 grammar pack

**Ticket:** #102 / T01
**Feature:** 012 Grammar Content Packs
**Audit date:** 2026-07-30
**Scope:** repository-grounded audit only; no learner-facing surface, schema,
scheduler, grading, or content expansion was added.

## Result

The existing four-pattern slice is present and wired through the existing
Lessons, Today, Daily Five, content, learning-record, and webpage-encounter
contracts. The audit found no missing learner surface or evidence-path fix for
T01.

T02 does need a focused validator/content-governance change for four concrete
gaps:

1. `validateGrammarPattern` accepts `self-reviewed`, and that content is
   therefore eligible for `isGrammarContentAvailable` and the runtime bundle.
2. `validateAllLearningContent` validates the entries that happen to be in
   `grammarPatterns`, but does not assert that the canonical four-pattern pack
   is complete.
3. Review metadata is stored and reported once per pattern, not per exercise,
   so the validator cannot inspect author, reviewer, review state, review date,
   sources, and provenance for every released exercise.
4. The validator does not require every declared choice to be either an
   accepted answer or a coded distractor; an unclassified choice could pass.

The current four patterns do not exhibit these failures: all sixteen shipped
exercises have complete accepted/distractor partitions and all four pattern
records currently say `second-review-complete`. The gaps are release-safety
holes in the validator contract, not a reason to invent new exercises or a
new runtime model.

No T03 runtime change is indicated by this audit. T03 should qualify the
existing surfaces and add only missing regression/manual evidence after T02
hardens the content contract. T04 still needs an independent fluent-Dutch
reviewer and release/manual gates; the repository's current `Project owner`
reviewer value is not evidence of that independent gate.

## Content inventory

All four patterns are `contentVersion: 1`, `level: A0`, and have one companion
lesson with `contentVersion: 1`. Each pattern has four finite exercises.

| Pattern | Capability | Exercises and primitives | Companion lesson | Review metadata currently bundled |
| --- | --- | --- | --- | --- |
| `a0-zijn-present` | Introduce and identify people or simple states. | `zijn-choose-ik` (`choose-form`); `zijn-change-jij` (`change-subject`); `zijn-contrast-u` (`contrast-form`); `zijn-repair-zij` (`repair-choice`) | `a0-hallo-ik-ben` | DutchMate team; `second-review-complete`; Project owner; 2026-07-27; Taaladvies `u is of bent`; original DutchMate examples. |
| `a0-hebben-present` | Say what you have or need in practical lesson situations. | `hebben-choose-ik` (`choose-form`); `hebben-change-jij` (`change-subject`); `hebben-contrast-u` (`contrast-form`); `hebben-repair-wij` (`repair-choice`) | `a0-ik-heb-dit-nodig` | DutchMate team; `second-review-complete`; Project owner; 2026-07-27; Taaladvies and Woordenlijst; original examples, including reviewed `u hebt` / `u heeft` alternatives. |
| `a0-regular-present` | Say what you do, where you live, and what you learn in simple present-tense sentences. | `regular-choose-ik` (`choose-form`); `regular-change-jij` (`change-subject`); `regular-contrast-u` (`contrast-form`); `regular-repair-wij` (`repair-choice`) | `a0-ik-woon-en-werk-hier` | DutchMate team; `second-review-complete`; Project owner; 2026-07-27; Taaladvies and Woordenlijst; original subject-agreement examples. |
| `a0-yes-no-inversion` | Ask simple yes-or-no questions about everyday places, work, and routines. | `inversion-order-je` (`order-tokens`); `inversion-order-u` (`order-tokens`); `inversion-contrast-je` (`contrast-form`); `inversion-repair-u` (`repair-choice`) | `a0-woon-je-hier` | DutchMate team; `second-review-complete`; Project owner; 2026-07-27; Taaladvies inversion and present-tense references; original questions. |

The source of truth for the inventory is `src/grammar/content.ts`. The four
companion links and lesson versions are in `src/lessons/catalog.ts`.

## Exercise answer and feedback map

The table records the exact accepted answers, released distractors with their
misconception code, and the positive/correction feedback currently shipped.
Every row has finite choices and `evidenceEligible: true`.

| Exercise | Accepted answer(s) | Distractors (`value` / misconception) | Feedback |
| --- | --- | --- | --- |
| `zijn-choose-ik` | `ben` | `bent` / `wrong-person`; `is` / `wrong-person` | Positive and correction: “With ik, use ben: ik ben Noor.” |
| `zijn-change-jij` | `bent` | `ben` / `wrong-person`; `is` / `wrong-person` | “With jij, use bent: jij bent hier.” |
| `zijn-contrast-u` | `bent` | `ben` / `wrong-person`; `zijn` / `wrong-person` | “With u, use bent: u bent welkom.” |
| `zijn-repair-zij` | `is` | `ben` / `wrong-person`; `zijn` / `wrong-person` | “For one person with zij, use is: zij is thuis.” |
| `hebben-choose-ik` | `heb` | `hebt` / `wrong-person`; `heeft` / `wrong-person` | “With ik, use heb: ik heb een pen nodig.” |
| `hebben-change-jij` | `hebt` | `heb` / `wrong-person`; `heeft` / `wrong-person` | “With jij, use hebt: jij hebt een schrift.” |
| `hebben-contrast-u` | `hebt`, `heeft` | `hebben` / `wrong-irregular-form` | “With u, both hebt and heeft are correct: u hebt een extra pen or u heeft een extra pen.” |
| `hebben-repair-wij` | `hebben` | `heb` / `wrong-person`; `heeft` / `wrong-person` | “With wij, use hebben: wij hebben alles voor de les.” |
| `regular-choose-ik` | `woon` | `woont` / `wrong-person`; `wonen` / `wrong-person` | “With ik, use the stem woon: ik woon in Utrecht.” |
| `regular-change-jij` | `werkt` | `werk` / `wrong-person`; `werken` / `wrong-person` | “With jij, add -t to the stem: jij werkt in een team.” The `werken` correction is “With jij, use werkt, not the plural werken: jij werkt in een team.” |
| `regular-contrast-u` | `leert` | `leer` / `wrong-person`; `leren` / `wrong-person` | “With u, add -t to the stem: u leert Nederlands.” The `leren` correction names singular `leert` rather than plural `leren`. |
| `regular-repair-wij` | `maken` | `maak` / `wrong-person`; `maakt` / `wrong-person` | “With wij, use the plural form maken: wij maken een plan.” The `maakt` correction explicitly excludes the singular form. |
| `inversion-order-je` | `Woon je hier?` | `Je woont hier?` / `wrong-person`; `Woon hier je?` / `invalid-order` | “Put the finite verb first. Before je, use woon without -t: Woon je hier?” |
| `inversion-order-u` | `Werkt u vandaag?` | `Werk u vandaag?` / `wrong-person`; `U werkt vandaag?` / `invalid-order` | “Put the finite verb first and keep -t before u: Werkt u vandaag?” |
| `inversion-contrast-je` | `Woon` | `Woont` / `wrong-person`; `Wonen` / `wrong-person` | “Before je in a question, use the stem without -t: woon.” |
| `inversion-repair-u` | `Werkt` | `Werk` / `wrong-person`; `Werken` / `wrong-person` | “Before u, keep -t on the finite verb: werkt.” The `werken` correction identifies the singular `-t` form. |

`validateGrammarPattern` currently checks duplicate choices and accepted
answers, accepted/distractor overlap, misconception membership, non-empty
feedback, and order-token shape. It does not yet enforce the full choice
partition or exercise-level review metadata described above.

## Runtime and surface trace

### Lessons

- `Lesson.grammarCompanion` links each A0 companion lesson to exactly one
  existing pattern and content version.
- `renderGrammarNotice` uses the first authored exercise for the Notice step;
  there is no generated prompt or runtime grading model.
- `renderGrammarAnswerControls` renders semantic buttons for finite choices and
  order tokens. Selection uses `aria-pressed`; order-token selection updates a
  visible `aria-live="polite"` answer area.
- `Check answer`, `Reveal`, `Skip`, and `Try again` retain the existing lesson
  flow. Correct and misconception-specific feedback are rendered with
  `role="status"`. `startLesson` moves focus to the focused popup content.
- The companion is reached inside the lesson's existing Read → Notice →
  Practise → Replay → Keep stages. Lesson identity, content version,
  completion, candidate saving, and stage storage remain separate from the
  grammar record.

### Daily Five and Today

- `getDailyFive` returns the current same-day snapshot when available, so the
  task list is stable for the day. It creates grammar candidates only for an
  introduced, due pattern and chooses the first exercise not in that pattern's
  recent-exercise list, with a deterministic fallback.
- `selectGrammarDailyFiveTasks` sorts by overdue days, due time, pattern order,
  and pattern ID, then caps grammar candidates at two.
- `createDailyFiveSnapshot` preserves up to five tasks and, when at least three
  vocabulary tasks are eligible, leaves at least three vocabulary slots. It
  does not create a grammar queue or fixed grammar quota.
- `recordGrammarDailyFiveResult` requires the task to exist in the persisted
  snapshot, rejects duplicate task IDs, rejects stale `evidenceRevision`, and
  records the result through the same grammar outcome function. A completed
  snapshot remains the source of truth for Continue/Review more.
- Today renders one primary Daily Five action. There is no grammar tab,
  Grammar Minute session, or second top-level destination.

### Evidence, scheduling, and storage

- `recordGrammarCheck` and `recordGrammarDailyFiveResult` validate the bundled
  pattern/exercise and content version before writing.
- `evidenceRevision` is compared before mutation. A first check, Reveal, or
  Skip increments it once; stale submissions and completed Daily Five tasks
  are safe no-ops.
- `applyGrammarOutcome` stores bounded evidence: successful exercise IDs,
  primitives, context tags, recent exercise IDs/days, delayed evidence, and
  misconception counters. It stores no raw answer or attempt history.
- Correct checks schedule the next local day or the bounded existing interval;
  Reveal and Skip do not increase successful evidence. Applied remains bounded
  by distinct exercises, primitives, contexts, sessions, and delayed evidence.
- Learning backup parsing validates pattern IDs, exercise IDs, primitive and
  context references, content version, and durable evidence compatibility.

### Privacy and offline boundary

Grammar content is bundled in `src/grammar/content.ts`. The background grammar
controller checks `isGrammarContentAvailable()` and handles grammar results
locally; the grammar path does not call a translation provider or store page
text, raw answers, or response timing. Webpage encounter coaching only matches
exact reviewed forms and requires introduction before offering introduced
practice.

## Existing verification baseline

Focused T01 baseline, run from the repository root on 2026-07-30:

```text
./node_modules/.bin/vitest run \
  src/grammar/content.test.ts \
  src/grammar/learning.test.ts \
  src/grammar/progression.test.ts \
  src/vocabulary/daily-five.test.ts \
  src/vocabulary/learning-record.test.ts \
  src/popup/daily-five-view.test.ts \
  src/popup/lesson-session.test.ts \
  src/popup/index.test.ts \
  src/background/message-handler.test.ts \
  src/content/webpage-lookup-module.test.ts

Test Files  10 passed (10)
Tests       181 passed (181)
```

The repository typecheck also passed:

```text
./node_modules/.bin/tsc --noEmit
```

The repository's documented `pnpm` commands could not be used because `pnpm`
is not installed in this environment; the checked-in local Vitest and
TypeScript binaries were used instead. GitHub issue/project reconciliation was
also unavailable because the GitHub API connection failed during this audit.

## T01 disposition

- T01 is complete as a local audit artifact and checklist update.
- T02 is the next implementation frontier and should address only G-01
  through G-04 with focused fixtures and no new learner surface or storage
  contract.
- T03 has no identified runtime defect from this audit; it should qualify the
  existing integration after T02.
- T04 remains the release and independent human-review gate.
