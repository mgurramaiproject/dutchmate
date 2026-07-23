# 004-transfer: Context Missions

Status: Approved exploration plan

Branch: `feature/004-transfer`

Related deferred ideas: [004-transfer-parking-lot.md](./004-transfer-parking-lot.md)

Research and decision rationale: [004-transfer-research.md](./004-transfer-research.md)

## Decision

Add **Context Missions** as DutchMate's next feature exploration. A Context Mission is one short, learner-triggered practice exercise anchored in Dutch deliberately selected on a real webpage. The feature optimizes for **real-world transfer**: becoming better able to understand or use Dutch outside DutchMate.

Context Missions extend the existing browsing-to-fluency loop. They do not replace Daily Five, Lessons, Saved, contextual mastery, or learning rhythm, and they do not add another popup tab.

## Why this ranks first

DutchMate already owns a useful learning sequence: encounter Dutch on the web, translate it, save chosen words or meaningful chunks, and practise them later. Its strongest product advantage is the learner's real webpage context, not a separate stream of generic content.

The selected direction turns that context into retrieval and reconstruction while preserving reading flow. It ranks above news, quotations, sayings, poems, songs, and other content feeds because those formats require a learning mechanic before they improve durable language use.

The research basis is:

- contextual trial and error followed by corrective definitions can support stronger word learning than definitions supplied before the encounter;
- retrieval practice has robust support in second-language vocabulary learning;
- prompting learners to attempt output can make them notice gaps in their vocabulary; and
- the CEFR action-oriented approach values authentic reception, production, interaction, and mediation rather than content consumption alone.

Sources:

- [Contextual word learning in the first and second language](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/contextual-word-learning-in-the-first-and-second-language/D3C1B4649450133D59D3334356BCF20C)
- [Review of adult second-language vocabulary training](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/review-of-laboratory-studies-of-adult-second-language-vocabulary-training/18F0A5D1FFC829CE05931B2EEE83124A/share/9612bae4e131a6e3d9d0b0aacac044f5587eb6e0)
- [Noticing vocabulary holes aids incidental word learning](https://www.cambridge.org/core/journals/bilingualism-language-and-cognition/article/noticing-vocabulary-holes-aids-incidental-second-language-word-learning-an-experimental-study/42AF3995A8FF9D94399289040188CC2F)
- [CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)

## Ranked opportunity set

| Rank | Direction | Decision |
| ---: | --- | --- |
| 1 | Real-page micro-missions | Selected as Context Missions |
| 2 | Recall on repeat encounters | Folded into Context Missions |
| 3 | Pattern Lab and sentence coaching | Parked |
| 4 | Can-do Passport | Parked |
| 5 | Personalized remix lessons | Parked |
| 6 | Listening and pronunciation | Parked, including all voice and audio work |
| 7 | Narrow reading and headline trails | Parked |
| 8 | Pragmatics and culture decoder | Parked |
| 9 | Daily Dutch brief | Parked |
| 10 | Sayings, quotations, poems, and songs lab | Parked |

## Product boundaries

### Additive, webpage-first placement

- Keep the popup's Today, Lessons, and Saved areas unchanged in V1.
- Add `Practise this` to an eligible successful selection-translation result.
- Add `Try from memory` for an eligible saved repeat encounter.
- Expand the existing webpage tooltip into a compact, non-modal mission card.
- Preserve page scrolling and the original Dutch context.
- Provide a visible close action, Escape support, and predictable focus return.
- Do not add a fourth popup tab, popup mission card, resume control, modal, side panel, or automatic page highlighting.

### Explicit eligibility

`Practise this` is eligible only when:

- the learner deliberately selects Dutch;
- the selection contains 2–12 words;
- it represents one phrase or short sentence rather than a paragraph; and
- translation succeeds.

`Try from memory` is eligible only when the deliberately selected word or meaningful chunk already exists in Saved.

The actions remain hidden for ordinary hover, non-Dutch text, failed translations, and unsupported selections. The existing extension-enabled and selection-translation settings remain authoritative. No new feature toggle is added.

### First and repeat paths

For a first encounter, keep the current translation flow. After the translated meaning appears, offer `Practise this`; accepting it starts `Rebuild in context` with the result already in memory.

For a saved repeat, use the local learning-item identity before revealing a new translation when available. Show `Seen before` with `Try from memory` and `Translate now`:

- `Try from memory` starts the locally supported recognition or recall exercise without a provider request;
- `Translate now` continues the normal translation flow; and
- if saved-item identity or required local helper data is unavailable, fall back to the normal translation instead of presenting a broken recall exercise.

Ordinary hover remains unchanged. The pre-reveal choice applies only after deliberate selection.

### One short exercise

One Context Mission contains one adaptive exercise and should normally take 20–45 seconds.

- First encounter: `Rebuild in context`; exposure only.
- Saved repeat needing recognition: `Recall meaning`.
- Saved repeat needing recall: `Rebuild in context`.
- If both mastery dimensions need work, choose the weaker or earlier-due dimension.
- Finish immediately and return to the webpage.
- An optional replay cannot produce a second mastery update from the same encounter.

There is no multi-stage wizard, mission queue, progress bar, point score, percentage, life system, or failure animation.

## Exercise contracts

### Recall meaning

1. Show the saved Dutch word or meaningful chunk in its webpage context.
2. Hide the existing English or Telugu helper meaning.
3. Prompt: `What does this mean here?`
4. Let the learner commit mentally.
5. Reveal with `Show meaning`.
6. Ask for `Again` or `Got it`, matching Daily Five.

If the original lookup returned both English and Telugu, reveal both. If it returned only one configured target, reveal only that target. Never make an extra request for a missing helper translation.

### Rebuild in context

1. Blank the selected Dutch from its original sentence or short context.
2. Present the exact Dutch words or short fragments in shuffled order.
3. Prompt: `Put the Dutch back`.
4. Tapping an available fragment appends it to the answer.
5. Tapping a placed fragment returns it.
6. Provide `Reset` and `Check`.
7. Support keyboard navigation, Enter or Space activation, visible focus, and accessible status announcements.
8. Do not require drag-and-drop.

DutchMate scores the learner's first submitted order. Exact normalized order is `Got it`; an incorrect order is `Again`, followed by the correct Dutch. Comparison ignores capitalization, surrounding whitespace, and terminal punctuation. Replay remains available for learning but cannot revise the recorded result.

## Learning-record integration

Context Missions reuse the canonical learning item, recognition mastery, recall mastery, and practice scheduling. They do not create mission progress or a second mastery system.

- A first-encounter mission remains exposure.
- Completing it never saves the selection automatically.
- An eligible word or candidate meaningful chunk may retain the existing `Save` or `Review & save` action.
- A complete sentence remains ephemeral context and cannot become a learning item.
- Saving after the mission creates a normal New learning item and awards no mastery retroactively.
- An eligible saved repeat mission may update one mastery dimension once.
- `Recall meaning` contributes recognition evidence through the learner's `Again` or `Got it` result.
- `Rebuild in context` contributes recall evidence from the first checked order.
- Daily Five and Context Missions continue to share the same learning item and schedule.

## Local execution and API-cost boundary

Context Missions V1 is deterministic and local. It reuses the selected Dutch, page context, existing translation response, helper meanings, and local learning record.

- Clicking `Practise this` or `Try from memory` must not trigger another translation request.
- Mission construction must not call an LLM or any generative service.
- Google Cloud Translation Basic v2 is billed by processed characters, not tokens. Context Missions add no billable characters because they reuse the lookup already completed or deliberately deferred until reveal.
- Dual-language lookup may already submit the source separately for two target languages; that existing behavior is outside the incremental mission cost.
- Mission exercises must remain available only when their required local inputs already exist.

Current pricing reference: [Google Cloud Translation pricing](https://cloud.google.com/translate/pricing).

## Privacy and persistence

Mission state is ephemeral webpage state.

- Discard an unfinished mission on close, navigation, refresh, or content-script teardown.
- Do not store mission history, answers, page URLs, generated exercises, or unfinished queues.
- Persist only data already permitted by the local learning record: an explicitly saved learning item, its capped page context, and at most one eligible mastery update.
- A completed mission may affect existing review and rhythm summaries through that mastery update; no separate Today surface is added.
- V1 records no audio and requests no microphone permission.

## Learner-facing copy

| Purpose | Copy |
| --- | --- |
| Fresh selection action | `Practise this` |
| Saved repeat action | `Try from memory` |
| Saved repeat bypass | `Translate now` |
| Recognition prompt | `What does this mean here?` |
| Reveal | `Show meaning` |
| Reconstruction prompt | `Put the Dutch back` |
| Submit reconstruction | `Check` |
| Practice outcomes | `Again` / `Got it` |
| Exit | `Back to page` |

Internal terms such as recognition, recall, mission evidence, and mastery dimension do not appear in learner-facing exercise copy.

## Validation standard

### Shippable

- Focused behavior and accessibility tests pass.
- Type checking and the full relevant test suite pass.
- Chrome and Firefox builds and manual browser checks pass.
- Tests prove that starting and completing a mission makes no incremental translation request.
- Closing, navigation, translation failure, storage failure, stale responses, and unsupported selections fail safely.
- Release packaging and privacy documentation remain consistent with actual behavior.

### Learning-validated

After the engineering release, run a small voluntary study with DutchMate's first audience. Compare items that learners only translated with items they translated and practised. Recheck recognition or reconstruction after 2–7 days in a different sentence, and observe whether missions disrupt normal reading.

Clicks, completions, time spent, and repeat usage are not sufficient learning evidence. Ship after the engineering bar, but describe Context Missions as experimental until delayed learner evidence supports real-world transfer.

## Deliberate exclusions

- no new popup tab or primary navigation;
- no automatic launch, scanning, or highlighting;
- no required typing;
- no voice, audio, recording, pronunciation, or speech feedback;
- no hidden or incremental API calls;
- no AI-generated questions, distractors, explanations, or examples;
- no grammar coach or Pattern Lab;
- no news, quotation, saying, poem, song, or general content feed;
- no automatic saving of mission selections;
- no arbitrary sentence cards;
- no mission history, resume queue, points, badges, or separate progress model; and
- no claim of learning validation from engagement alone.

## Artifact family

All feature-specific artifacts use the shared `004-transfer` prefix.

Expected follow-on names are:

- `004-transfer-research.md`;
- `004-transfer-spec.md`;
- `004-transfer-tickets.md`;
- `004-transfer-design-mockups.html`;
- `004-transfer-validation.md`; and
- `004-transfer-implementation-*.md` only when a durable implementation note is justified.

Implementation work remains on `feature/004-transfer` unless a later approved delivery plan chooses ticket branches.

## ADR decision

No ADR is needed at this planning stage. The selected boundaries are intentionally narrow V1 product choices and are inexpensive to revisit. Create an ADR later only if implementation introduces a hard-to-reverse, surprising architectural trade-off.

## Next planning step

Use the `to-spec` skill to turn this approved plan into `docs/features/004-transfer-spec.md`. Do not implement Context Missions until the spec is approved and broken into independently verifiable tickets with `to-tickets`.
