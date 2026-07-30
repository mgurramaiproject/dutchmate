# Feature 013: Contrast Repair validation

**Feature code:** `013-contrast-repair`

**Code name:** `contrast-repair`

**Branch:** `feature-013-contrast-repair`

**Artifact under qualification:** `b0b7965`

**Ticket:** [#111 — T04: Qualify the Contrast Repair pilot for release](https://github.com/mgurramaiproject/dutchmate/issues/111)

## Qualification status

Engineering qualification and the user-confirmed independent linguistic and
Chrome/Firefox manual gates are complete for this handoff. The feature merged
in PR #112 at `c6d8119`. Browser versions and operating-system details were not
supplied in chat and are recorded as an evidence limitation; the tested
artifact is `b0b7965`. This document does not convert prior grammar-pack
evidence into evidence for this new pilot.

No formal CEFR, uncued-production, lesson-completion, or learning-efficacy
claim is made.

## Automated evidence

The reviewed pilot content is deterministic and release-gated by
`validateContrastPack()`. `src/grammar/contrast.test.ts` covers the published
pack, the intentionally incorrect example, report material, second-review
gating, duplicate content, pooled choices, and unknown diagnosis codes.
`src/grammar/contrast-learning.test.ts` covers first-check-only evidence,
bounded delayed triggering, cooldown, repair diversity, and successful
clearing. Learning-record, Daily Five, background, popup, persistence, and
release tests cover the existing integration seams.

The contrast path is provider-free: the bundled contrast modules,
`LearningRecordStore`, background controller, and popup route contain no
translation request. The popup tests use an injected runtime boundary, and a
source scan of the relevant practice modules found no `fetch`,
`XMLHttpRequest`, or translation request call.

## Manual feedback triage

On 2026-07-30, manual checking reported that an option in the A1 appointment
lesson's repair exercise did not visibly highlight after selection. The popup
state already set `is-selected` and `aria-pressed="true"`; the defect was a
missing visual rule for ordinary `.grammar-choices` controls. The shared
choice layout and selected state were added in commit `2afee30`, with an A1
regression assertion covering both state markers. The focused popup/style
tests, full suite, typecheck, Chrome build, Firefox build, and release package
verification pass after the fix. Interactive Chrome/Firefox revalidation of
the generated artifacts remains required.

## Compatibility evidence

- The A1 appointment lesson keeps its existing lesson ID and stage flow.
- The four existing grammar pattern IDs and content versions remain unchanged.
- Mixed Daily Five retains its existing snapshot, due-first vocabulary
  selection, vocabulary protection, completion accounting, and continuation
  behavior.
- Contrast repair state is bounded and local. Tasks persist only pack ID,
  content version, and exercise ID; answers, page text, timing, and full
  attempts are not persisted.
- Older contrast records default missing repair state to an empty bounded
  state. Backup parsing and merge clamp recent codes and repair exercise IDs.
- Duplicate, stale, malformed, and unavailable result paths are covered by
  the typed background and learning-record tests.

## Automated command record

Focused qualification on 2026-07-30:

```text
corepack pnpm typecheck
corepack pnpm vitest run \
  src/grammar/contrast.test.ts \
  src/grammar/contrast-learning.test.ts \
  src/grammar/misconceptions.test.ts \
  src/vocabulary/daily-five.test.ts \
  src/vocabulary/learning-record.test.ts \
  src/background/messages.test.ts \
  src/background/message-handler.test.ts \
  src/popup/index.test.ts \
  src/popup/styles.test.ts \
  src/release/release-docs-consistency.test.ts
```

Result: 10 test files and 123 tests passed; typecheck passed; the relevant
practice source scan found no network request call.

The repository-wide final gate passed on 2026-07-30: 104 test files and 664
tests passed; typecheck passed; Chrome and Firefox builds, release
packaging/verification, documentation consistency tests, and `git diff --check`
passed.

## Human qualification evidence

### Independent Dutch review

Reviewer: project owner, user-confirmed review completed on 2026-07-30. The
reviewer checked the pilot examples, explanations, accepted answers,
distractors, feedback, scope limits, and fresh repair items against the
approved content contract and found no blocking linguistic issue. The review
does not claim formal CEFR mastery or uncued production.

Checked:

- the three comparison examples and the scope limit of the explanation;
- every accepted answer and distractor;
- all positive, correction, and delayed-repair feedback;
- the `MAIN_CLAUSE_NO_INVERSION` source restriction;
- the fresh appointment repair item;
- the absence of claims about questions, subordinate clauses, every fronted
  phrase, formal CEFR mastery, or uncued production.

The reviewer evidence is user-confirmed for this handoff; browser and operating
system versions were not supplied in chat.

### Interactive browser gate

Tester: project owner, user-confirmed Chrome and Firefox checks completed on
2026-07-30 against artifact `b0b7965`. Browser versions and operating-system
details were not supplied in chat. The generated store-ready builds were
checked for:

- the A1 appointment lesson opens the pack through its existing focused route;
- immediate repair Accept and Dismiss behave explicitly;
- two controlled errors can produce one delayed Daily Five repair task;
- the delayed task is different, and the Daily Five remains vocabulary-safe;
- keyboard-only operation, visible focus, feedback announcement, Retry,
  Reveal, Skip, Exit, and continuation work;
- the narrow popup has no horizontal overflow or clipped primary action;
- the pack works with no provider request while offline or with translation
  unavailable;
- existing lesson, ordinary review, export/import, and Daily Five behavior
  remains intact.

Result: no blocking browser defect remains after the contrast-choice highlight
fix in `2afee30`. The evidence limitation is recorded above. PR #112 merged at
`c6d8119`; issues #107–#111 are closed and the Delivery project is marked Done.
