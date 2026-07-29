# Spec 011: Personal Web Sentence Trainer

Status: proposed

This specification turns the approved Plan 011 into a buildable first slice.
It inherits Plan 010's compatibility result: reuse the canonical local
learning model, add no second scheduler or persisted sentence model, and keep
runtime AI out of the feature.

## Problem Statement

DutchMate can already save a Dutch learning item and, when the page exposes a
safe bounded sentence, retain that page context. The learner can review the
item, but the original sentence is currently supporting context rather than a
deliberate practice surface. This leaves a gap between saving a word while
reading and recalling it later in the situation where it was encountered.

The feature must improve contextual practice without turning personal webpage
text into a second learning database, introducing sentence-specific scheduling,
or pretending that arbitrary Dutch can be graded safely.

## Solution

Add a click-only Context Mission launched from an expanded Saved learning item.
The mission uses the newest eligible Dutch page context for a single-word
learning item and offers one of two deterministic forms:

1. Meaning recall with reveal and the existing binary `Again` / `Got it`
   result.
2. Exact click/keyboard reconstruction of the stored Dutch context when
   conservative eligibility checks pass.

Unsafe, ambiguous, missing, or unknown-provenance contexts fall back to
meaning recall or remain ordinary review-only context. Practice records one
recognition or recall result for the existing learning item. It does not create
sentence mastery, raw-answer history, a new due date, or a second queue.

The first release is Saved-only. Daily Five integration is a later phase after
the core flow proves that target identity and existing scheduler behavior stay
unchanged.

## User Stories

1. As a Dutch learner, I want to open a saved word and see its original page context, so that I remember where I encountered it.
2. As a Dutch learner, I want to start a Context Mission from Saved, so that practice begins only when I choose it.
3. As a Dutch learner, I want the mission to explain that the sentence came from my saved context, so that the exercise is understandable and trustworthy.
4. As a Dutch learner, I want to practise a single saved Dutch word in its original sentence, so that I connect the word with real usage.
5. As a Dutch learner, I want to reveal the saved helper meaning before rating myself, so that I can practise recognition without typing.
6. As a Dutch learner, I want to choose `Again` or `Got it`, so that the existing recognition or recall evidence can be updated without false scoring precision.
7. As a Dutch learner, I want to rebuild an eligible Dutch sentence by choosing visible tokens, so that I practise recall without being judged on arbitrary alternative word orders.
8. As a Dutch learner, I want keyboard controls for every mission action, so that the feature remains usable without a pointer.
9. As a Dutch learner, I want an unsafe sentence to fall back safely, so that DutchMate never marks a valid answer wrong because its evaluator was uncertain.
10. As a Dutch learner, I want a context without a helper translation to remain usable for safe reveal-only practice, so that missing translation data does not invalidate my saved word.
11. As a Dutch learner, I want a saved word without context to retain its existing review behavior, so that context capture remains optional.
12. As a Dutch learner, I want a context with unknown source language to avoid reconstruction, so that DutchMate does not silently infer provenance from text alone.
13. As a Dutch learner, I want the newest eligible Dutch context selected automatically, so that I can start practice without a context picker.
14. As a Dutch learner, I want to remove one noisy or sensitive context, so that I can control personal page data without deleting the learning item.
15. As a Dutch learner, I want other contexts and the word to remain after one context is removed, so that cleanup is not destructive.
16. As a Dutch learner, I want meaningful chunks to keep their existing Saved and review behavior, so that ambiguous phrase boundaries do not weaken the first release.
17. As a Dutch learner, I want the feature to work without an account or backend, so that personal browsing context remains local.
18. As a Dutch learner, I want practice to avoid sending stored context or answers to a new service, so that the privacy boundary stays explicit.
19. As a Dutch learner, I want my existing mastery and review schedule to remain intact, so that contextual practice strengthens the same learning item rather than creating a duplicate.
20. As a Dutch learner, I want the existing Today, Lessons, Saved, Settings, heatmap, and review surfaces to continue working, so that contextual practice is an addition rather than a disruptive replacement.

## Implementation Decisions

- The feature name is `Web Sentence Trainer`; the existing domain term is
  `Context Mission`; the learner-facing entry action is `Practise context`.
- Only single-word learning items are eligible for the first Context Mission
  release. Meaningful chunks remain in existing review flows.
- The canonical saved learning item and its bounded context collection remain
  the only durable source of practice data. No sentence-specific item,
  encounter record, mastery state, due date, or attempt history is added.
- A context is eligible for exact reconstruction only when its source language
  is explicitly Dutch, the saved target occurs exactly once, the bounded text
  satisfies conservative token and character limits, punctuation attachment is
  deterministic, and duplicate tokens cannot make selection ambiguous.
- Unknown-provenance legacy contexts, non-Dutch contexts, missing contexts, and
  ambiguous contexts never receive guessed Dutch reconstruction. They fall
  back to safe meaning recall or ordinary review.
- The newest eligible Dutch context is selected by timestamp, with normalized
  context text providing a stable tie-breaker. There is no context picker in
  v1.
- Meaning recall uses reveal and the existing binary practice result. It does
  not claim to grade a typed answer or infer fine-grained correctness.
- Reconstruction accepts only the stored source order. It is a bounded
  interaction, not a general Dutch grammar evaluator.
- Context removal targets one chosen context and leaves the learning item and
  its other contexts intact.
- Save-time context capture and existing helper translations are reused.
  Practice does not make a new translation request, crawl the page, or store a
  URL, title, domain, paragraph, or article.
- The first release is launched from Saved only. Daily Five integration is
  explicitly deferred until duplicate-target and scheduler regression checks
  justify a later phase.
- If a feature-owned pure deterministic eligibility/tokenization seam is
  needed, it remains transient and local to this feature. It must not become a
  general exercise DSL or shared learner-state layer.

## Testing Decisions

Tests should prove externally visible behavior at stable seams, not mirror
private helper implementation. Every unsafe input should demonstrate the safe
fallback rather than merely a successful happy path.

The test set will cover:

- bounded sentence capture, exact target occurrence, source-language
  provenance, missing context, and legacy unknown provenance;
- single-word eligibility, chunk exclusion, tokenization, punctuation,
  duplicate-token ambiguity, length limits, Unicode normalization, and safe
  fallback;
- newest-context selection and deterministic tie-breaking;
- reveal-only meaning recall, binary result recording, stale/duplicate result
  rejection, and preservation of the weaker mastery dimension;
- exact stored-order reconstruction through click and keyboard interactions;
- one-context removal while preserving the item and remaining contexts;
- export/import and existing migration behavior without a new field;
- Saved entry, focused-flow navigation, accessibility names, live feedback,
  popup containment, and no horizontal scrolling;
- unchanged Today, Lessons, Daily Five, Settings, heatmap, ordinary saving,
  ordinary review, and grammar progression;
- no new network request during deterministic practice and no transmission of
  stored context or answers to a new service;
- the existing full test, typecheck, Chrome build, Firefox build, and release
  consistency checks.

Prior art includes the existing page-context, webpage lookup, learning-record,
Daily Five, grammar, Saved shelf, popup, and build verification tests.

## Out of Scope

- Daily Five integration in the first Saved practice slice.
- Meaningful-chunk Context Missions or phrase-boundary inference.
- English- or Telugu-source reconstruction, back-translation, or generated
  Dutch.
- Typed cloze, typed sentence answers, free-form grading, grammar parsing, or
  arbitrary accepted alternatives.
- AI-generated examples, runtime AI, a backend, telemetry, or a new network
  service.
- A new context picker, typed context editor, URL/title/domain/history storage,
  paragraph storage, or a context-consent setting.
- Sentence-specific mastery, due dates, queues, streaks, or a fixed Daily Five
  feature mix.
- A new top-level tab, standalone grammar destination, universal exercise DSL,
  curriculum registry, or admin content tool.

## Further Notes

The release sequence is intentionally narrow:

1. Saved presentation, newest eligible context selection, and per-context
   removal.
2. Meaning recall with reveal and canonical result recording.
3. Conservative exact reconstruction with safe fallback.
4. A later scheduler review for optional Daily Five eligibility.

The feature is ready for ticketing only after the acceptance boundaries above
remain unchanged in review. Any request to add storage ownership, a new
top-level surface, backend behavior, or a broader evaluator returns to product
decision rather than being folded into implementation.
