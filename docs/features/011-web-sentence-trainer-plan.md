# Plan 011: Personal Web Sentence Trainer

## Handoff status

- Priority: 1
- Primary surface: `Saved`
- Daily delivery: eligible exercises may enter `Today` / `Daily Five`
- Runtime AI: prohibited and out of scope for v1
- Curated admin dataset: not required for the core feature
- Backend: not required for v1

## Resolved grill decisions

- `Web Sentence Trainer` is the feature name, `Context Mission` is the
  existing domain term, and `Practise context` is the learner-facing action.
- The first release covers Saved context practice only. Daily Five eligibility
  follows as a later phase after duplicate-target and scheduler behavior are
  proven unchanged.
- v1 Context Missions are for single-word learning items. Meaningful chunks
  retain their existing Saved and review behavior until phrase-boundary rules
  are separately resolved.
- Removing context acts on one chosen context only. It never removes the
  canonical learning item or the item's other contexts.

## Product goal

Turn a word that the learner encounters while browsing into active, personal sentence practice. Close the gap between “I translated and saved this word” and “I can recognize and use it in its original context.”

This is DutchMate’s most differentiated near-term feature because the useful content—the learner’s actual webpage sentence and its translation—already exists at the moment of lookup.

## Learner-value hypothesis

If DutchMate preserves a concise source sentence and later asks progressively harder questions about it, learners will recall saved words better and recognize them more easily in authentic Dutch than with isolated word cards alone.

The feature succeeds only if:

- context capture adds little or no friction;
- generated exercises remain unambiguous;
- practice fits inside the popup;
- users can understand why a sentence is being shown;
- personal browsing data stays local.

## Scope for v1

### Included

- Reuse the existing selected `LearningItem` and attach one bounded visible `LearningContext` when available during the existing Save flow.
- Reuse existing `LearningContext.english` / `telugu` helper fields when already available; do not add `sentenceTranslation` or request translation during practice.
- Provide a click-only “Practise context” action from an expanded Saved item.
- Generate only the two deterministic v1 exercise forms below.
- Record one canonical recognition/recall result for the existing learning target; do not create sentence-specific mastery or due state.
- Allow eligible contextual review to enter Daily Five through its existing task contract.
- Allow click-only context removal while retaining the saved learning item.

### Excluded

- Grammar parsing or explanation of arbitrary webpage sentences.
- Automatic correction of free-form Dutch.
- AI-generated alternate examples.
- Crawling the page after save.
- Storing paragraphs or whole articles.
- Dependence on an admin-authored curriculum.
- Assuming every selected word maps cleanly to a lemma.

## UX placement and workflows

### A. Save-time context capture

1. User selects a word or phrase on a webpage.
2. DutchMate translates it using the existing flow.
3. The existing Save flow may attach one bounded visible source context when available.
4. Do not add a typed edit step, context picker, URL/title/domain/history storage, or a new context-consent preference for v1.
5. Saving updates the existing learning item/context record.
6. Missing context never blocks saving the word.

Do not block saving a word if sentence detection or sentence translation fails.

### B. Saved-item entry point

In `Saved`, an expanded item displays a short context preview and one “Practise context” action. If several eligible contexts exist, use the most recent eligible Dutch context automatically. A word without context retains current review behavior.

### C. Focused practice

The popup shows one task at a time:

1. bounded Dutch source context;
2. prompt;
3. click/keyboard response controls;
4. reveal or check;
5. exact saved target and original context;
6. existing helper translation when present.

### D. Daily Five

Daily Five may reference the existing learning item/context through its current task contract. It does not create a second lesson record, fixed feature mix, contextual queue, or sentence-specific due date.

## Exercise progression

Only generate an exercise when deterministic checks prove it is viable.

### Exercise A — meaning recall with reveal

Show the Dutch context while hiding the helper meaning. The learner clicks `Reveal`, then chooses `Again` or `Got it`. This is recognition/recall evidence for the existing learning target, not a sentence-specific mastery record.

Do not use generated distractors or claim fine-grained correctness when the saved helper meaning is missing or ambiguous. Fall back to a safe reveal-only presentation.

### Exercise B — exact click/keyboard reconstruction

Offer the original Dutch sentence as deterministic word tokens and ask the learner to rebuild the saved context by clicking or keyboard-selecting tokens. Accept only the original stored order for this exercise; explain that the goal is to rebuild the source sentence, not to judge every possible Dutch word order.

Eligibility must pass all of these checks:

- v1 context language is Dutch;
- the saved target occurrence is found exactly once;
- sentence length is within configured token/character bounds;
- the selected span and control text are not ambiguous;
- punctuation attachment is safe and deterministic;
- duplicate tokens do not make token selection ambiguous;
- no generated or back-translated Dutch is required.

If any check fails, offer meaning recall only.

### Explicitly out of scope for v1

- typed cloze, typed word answers, or free-form sentence translation;
- generated distractors or grammar parsing;
- phrase-boundary inference;
- English/Telugu-source reconstruction or back-translation;
- a separate cloze/rebuild evaluator or sentence practice queue.

## Data model

Reuse the existing `LearningItem` and bounded `LearningContext[]`. Do not add `SavedEncounter`, `sentenceTranslation`, sentence-specific exercise state, sentence-specific due dates, URL/title/domain/history fields, or raw attempt storage.

The trainer may derive a transient exercise view from:

- the canonical saved Dutch learning item;
- the most recent eligible Dutch `LearningContext`;
- existing `LearningContext.english` / `telugu` helper fields when present;
- the existing canonical review/grammar learning-result contract.

Any context removal is a click-only update to the existing context collection and must preserve the learning item. If the repository later needs a stable occurrence marker, prefer a minimal versioned field on the existing context record and justify it in the compatibility audit.

## Sentence capture

Reuse the existing bounded page-context capture and explicit Save flow:

1. Start from the selected text and page context already available to the current extension flow.
2. Reuse the current sentence-sized, bounded context behavior and its limits.
3. Preserve the selected occurrence when it is present; otherwise store no context.
4. Do not add a second sentence extractor or a typed correction UI.
5. Treat missing or ambiguous context as a normal safe fallback, not a save failure.

Handle:

- abbreviations and initials;
- quotes and parentheses;
- selections spanning sentence boundaries;
- pages with no clean sentence;
- dynamically changing DOM;
- duplicate selected words;
- source/translation language mismatch;
- private pages and sensitive URLs; do not add URL/title/domain persistence.

## Sentence translation

Reuse the translation already produced in the lookup flow if it includes the full sentence. Do not make a second API request merely for convenience without explicit existing product permission.

If only the word translation exists, save the context without a sentence helper. Missing helper fields must not invalidate the item. Do not add a `sentenceTranslation` field or make a new translation request during practice. Existing save-time helper translation behavior may continue unchanged.

## Deterministic evaluation

Use the smallest deterministic evaluator needed by the two v1 forms and reuse existing normalization/result helpers where available:

- Unicode normalization;
- whitespace collapse;
- configurable case sensitivity only where the existing contract supports it;
- punctuation/token handling for sentence rebuild;
- no diacritic removal where it can change Dutch;
- accepted alternatives must be explicit, not generated by guesses.

Meaning recall uses reveal-and-self-assess (`Again`, `Got it`) rather than false precision. Reconstruction accepts only the stored source order.

## Scheduling

Use the existing review scheduler and canonical learning result for the saved learning item. Context is a richer presentation of the same review target. Do not add sentence-specific stages, streaks, due dates, queues, or a fixed Daily Five allocation. A contextual task may be eligible through the existing Daily Five contract only when it does not duplicate the target already selected for that session.

## Privacy and user control

- Context saving follows the existing explicit Save flow.
- Store one bounded sentence by default, not surrounding paragraphs.
- Provide click-only “Remove context” while retaining the word.
- Do not store or expose a new source link, title, domain, or browsing history.
- Respect existing private/incognito behavior and permissions.
- Never transmit stored context to a new service.
- Ensure export/import includes context only with clear labeling.
- Sanitize page text before rendering; never inject stored HTML.

## Implementation phases

### Phase 0 — audit and fixture

- Inspect lookup, save, translation, sentence extraction, and storage flows.
- Confirm the existing `LearningItem`, `LearningContext`, context-translation, and canonical result seams.
- Build deterministic fixtures from bounded Dutch contexts, including ambiguous and missing-context cases.
- Confirm that no migration, new translation request, or new permission is required.

### Phase 1 — Saved presentation and context removal

- Show the existing bounded context in an expanded Saved item.
- Add one click-only “Practise context” entry point.
- Add click-only context removal while retaining the learning item.
- Preserve current sorting, searching, saving, and word review.

### Phase 2 — meaning recall

- Implement reveal-based meaning recall using existing helper meaning when available.
- Record one canonical result through the existing review/learning contract.
- Fall back safely when helper meaning is missing.

### Phase 3 — eligible reconstruction

- Implement exact click/keyboard reconstruction only for eligible Dutch contexts.
- Fall back to meaning recall for every ambiguous or unsafe context.
- Do not add typed input, free-form grading, or a second evaluator.

### Phase 4 — scheduler integration

- Integrate through the existing Daily Five task contract only if the audit proves a seam is required.
- Preserve current scheduler semantics and avoid duplicate target representation.

### Phase 5 — pilot and refinement

- Test with consented or synthetic bounded Dutch contexts across varied page shapes.
- Review eligibility/failure reasons locally in development builds without adding telemetry.
- Refine conservative length, tokenization, and interaction limits only from evidence.

## Tests

- unit tests for existing context bounds, unique occurrence, reconstruction eligibility, tokenization, normalization, and sanitization;
- regression tests proving no migration is needed or safely handling any explicitly approved field;
- round-trip export/import tests if context is already exported;
- UI tests for save with/without context and click-only context removal;
- scheduler tests for duplicate canonical targets;
- end-to-end Firefox tests from page selection to later Saved practice;
- regression tests for ordinary word saving and translation;
- tests proving no new network call is made in deterministic exercise generation.

## Learner-value validation

Pilot questions:

- Do users understand where the sentence came from?
- Does the existing context capture add value without a new save step?
- Does contextual presentation make the saved Dutch target easier to recall after 3–7 days?
- Are reveal and reconstruction exercises useful rather than mechanical?
- How often do users remove context because it is noisy or sensitive?

Suggested release thresholds should be established after baseline measurement. Do not invent analytics collection if DutchMate currently avoids telemetry; a manual local pilot is sufficient.

## Acceptance criteria

- A user can save a word with bounded source context when the existing flow provides it.
- Existing word saving still works when capture fails or is disabled.
- Meaning recall and eligible exact reconstruction operate without AI.
- Ambiguous exercises fall back safely instead of marking valid Dutch wrong.
- Results enter the existing learning/review contract without duplicate content or sentence-specific scheduling.
- Context can be removed independently of the word with a click.
- No new backend or network dependency is introduced.
- Existing Today, Lessons, Saved, settings, heatmaps, and reviews remain intact.

## AI-assisted authoring boundary

The core feature needs no curated content. ChatGPT may help developers create test fixtures and edge-case corpora, but fixtures must be synthetic or consented and must not contain private browsing data.

AI comparison and optional AI practice remain parked future exploration. Any later adapter would require a separate approved plan with explicit consent, provider, budget, privacy, latency, accepted-answer, quality, and deterministic-fallback contracts. Do not add placeholder runtime calls now.

## Stop-and-ask conditions

Pause and ask the user if:

- sentence context would require a new permission;
- the current save flow cannot preserve bounded context without changing storage ownership;
- the current translation helper behavior would require a new practice-time request;
- storage migration could risk current vocabulary;
- product design would expose sensitive source data unexpectedly;
- the proposed reconstruction evaluator would be ambiguous for a plausible Dutch context.
