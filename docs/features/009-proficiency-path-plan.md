# 009-proficiency-path: A0-A2 grammar progression

**Feature code:** `009-proficiency-path`

**Branch:** `feature-009-proficiency-path`

**Status:** Discovery approved; implementation not authorized

**Artifact convention:** Feature-specific artifacts use the `009-proficiency-path-` prefix.

## Goal

Make DutchMate more effective for A0, A1, and A2 learners by teaching practical Dutch grammar, retaining it through short daily practice, and helping learners notice studied patterns during normal browsing.

DutchMate should provide unusually high learning value per minute without pretending that lesson completion, clicks, or extension usage prove proficiency. Its learner-visible progression reflects supported recognition and controlled application inside DutchMate. It is not formal CEFR certification or evidence of independent speaking and writing.

The current product ceiling is A2. B1 and above are outside this initiative.

## Product direction

The three priorities form one connected learning loop:

1. **Learn:** grammar-powered Lessons teach a practical verb or sentence pattern.
2. **Retain:** mixed Daily Five sessions revisit studied patterns alongside saved vocabulary.
3. **Encounter:** ordinary hover or selection translation can recognize a studied pattern and offer optional practice.

The loop is:

> Understand the pattern → apply it with support → retrieve it later → notice it in authentic Dutch

Conceptual priority remains Learn, Retain, Encounter. Delivery should nevertheless prove one thin end-to-end pattern before expanding the system, then complete a high-quality A0 foundation before adding A1 and A2 breadth.

## Priority 1: Grammar-powered Lessons

### Learner value

Upgrade the existing practical mini-lessons so that they teach reusable grammar rather than only presenting a useful phrase and vocabulary cards. High-utility verbs anchor the sequence because they expose conjugation, subject agreement, questions, word order, auxiliaries, and tense in language learners can use immediately.

### Existing library integration

Verb Path is the grammar spine inside the current Lessons library. It is not another tab, library, mode, or conjugation course.

Keep the existing:

- Today, Lessons, and Saved navigation;
- A0, A1, and A2 lesson labels and filters;
- practical life pathways;
- three-to-five-minute micro-stories;
- Dutch, English, and Telugu help;
- Read, Notice, Practise, Replay, and Keep flow;
- learner choice about which lesson candidates enter Saved.

Enhance each applicable lesson stage:

| Existing stage | Grammar role |
| --- | --- |
| Read | Encounter the target pattern naturally in a practical micro-story. |
| Notice | Highlight the relevant forms and explain the minimum useful rule. |
| Practise | Complete short, objectively scored, click-only application tasks. |
| Replay | Read the story again with less support and notice the pattern in context. |
| Keep | Keep useful words and meaningful chunks through the existing learner-controlled flow. |

Every unit remains visible and directly selectable. DutchMate may recommend the earliest incomplete pattern, but it does not add a placement test, learner-level profile, locked level, or `Find my starting point` control.

### Preserve and enrich the published library

The twelve published starter lessons remain available with their existing lesson identifiers, content versions, completion records, and saved learning items. Grammar must not replace, renumber, or silently rewrite them.

Compatible lessons gain separately identified and versioned grammar companions. A learner who already completed the lesson keeps that completion; the new pattern practice is available inside the lesson without implying that the learner previously completed it. Lesson completion therefore does not retroactively award Introduced, Practising, or Applied pattern progress.

The existing catalog contains only one A0 lesson, so enrichment alone cannot form a coherent A0 foundation. Add new A0 lessons only where the reviewed progression has a real capability gap, without a fixed lesson-count target. Existing A1 and A2 lessons remain visible and unchanged while their grammar expansion stays parked until the A0 loop is validated.

### Exercise contract

Grammar practice requires no text entry. Learners use controls that work by tap, click, or keyboard:

- choose the correct conjugated form;
- change a subject or tense and choose the resulting form;
- reconstruct word order from shuffled tokens;
- position a separable prefix;
- identify and correct one invalid sentence.

For authoring, these primitives may be grouped as verb-form practice or sentence-building practice—ideas called Verb Gym and Sentence Forge in the review input. They remain reusable internal exercise families, not learner-facing modes, destinations, queues, or progress systems.

Teaching prompts may provide strong guidance. Scored progression must use a different sentence from the initial example and provide precise corrective feedback. Every scored item declares its accepted answer or finite set of accepted alternatives. Each distractor represents a known misconception with a stable error category, and feedback connects that category to the relevant rule and one reviewed contrast or corrected form. If DutchMate cannot enumerate the valid alternatives or accurately explain a rejection, the item must be omitted or redesigned.

The resulting evidence represents supported recognition and controlled application, not uncued written production.

For the first `a0-zijn-present` tracer, the popup practice posture is **calm single-check**: one decisive exercise per screen, with room to change the selection before Check and immediate corrective feedback after the first Check. A later pattern may use a short contrast sequence when its reviewed exercise set justifies it, but the tracer does not optimize for exercise density.

Content authoring is manual-first. Linguistically sensitive exercises and the initial tracer are authored as complete instances. Safe repetitive cases may use bounded templates only when every subject, verb, context, answer, accepted alternative, distractor, and feedback item is explicitly enumerated. The build must expand and validate every released combination and produce a human-readable review report containing the exact learner-visible material. If an exercise cannot be fully inspected this way, it must use authored instances instead. There is no runtime generation.

Every released content pack records its content version, authorship, review, authoritative reference sources, and license or provenance for any reused material.

### Verb content

The archived Valley Trail verb page is useful as inspiration for the kinds of forms a reference may expose, but it is not the curriculum or a content source to copy. It mixes essential and advanced tenses, is not sequenced for DutchMate's A0-A2 audience, and this review did not establish a reuse license.

DutchMate should:

- curate verbs by practical usefulness and pattern coverage;
- independently author and review every explanation and exercise;
- verify spelling and forms against authoritative Dutch-language references such as Woordenlijst.org and Taalunie guidance;
- expose compact conjugation tables only as supporting reference;
- avoid teaching a hundred isolated verbs one by one.

Candidate sequencing for content review:

- **A0:** `zijn`, `hebben`, subject pronouns, present-tense agreement, common regular forms, and simple questions or inversion;
- **A1:** high-frequency irregular and modal verbs, separable verbs, and the perfect tense;
- **A2:** useful past forms, auxiliary choice, subordinate-clause placement, and mixed-pattern application.

This is a planning outline, not an approved CEFR syllabus. The specification must define and human-review the exact pattern inventory before content implementation.

### Release-quality gate

Every grammar exercise must pass:

1. automated validation of all expanded sentences, answers, accepted alternatives, distractors, feedback, identifiers, and content references; and
2. human linguistic review recorded with the reviewer, date, and authoritative reference sources.

The internal tracer may be authored and checked by one person. Before content becomes a public learner-facing A0 release, a second fluent Dutch reviewer with grammar-teaching competence must inspect the exact human-readable review report. Formal NT2 certification is not required, and the reviewer does not need codebase access. AI output is drafting assistance, not linguistic approval.

## Priority 2: Mixed Daily Five

### Learner value

Turn lesson understanding into durable knowledge without creating a second daily queue. Daily Five remains the single obvious daily action and chooses five high-value tasks across saved learning items and previously studied grammar patterns.

Initial composition rule:

- due work comes first;
- grammar occupies at most two of the five positions;
- vocabulary remains protected;
- completing five is enough;
- continuing remains optional.

Grammar tasks reuse the click-only exercise contract. A learner may reveal or skip an answer safely, but an unattempted or revealed task cannot be misreported as successful application.

Pattern progress uses honest learner-facing states:

- **Introduced:** the learner completed the relevant teaching encounter;
- **Practising:** the learner has scored recognition or application evidence;
- **Applied:** the learner succeeded across varied exercise primitives, lexical contexts, and sessions, including at least one delayed attempt using unseen or recombined material.

The specification must define scheduling, state transitions, versioning, backup behavior, and how grammar tasks coexist with the current recognition and recall model. It should extend the existing Today flow and local learning record rather than create a competing scheduler or cloud profile.

Persistence follows a minimum-learning-record rule:

- keep the current Daily Five snapshot needed to resume;
- keep each studied pattern's state, due date, compact evidence markers, and bounded misconception counters;
- keep recent exercise identifiers only where selection needs them to prevent immediate repetition;
- do not keep raw webpage text, selected sentences, response times, full attempt histories, or behavioral timelines.

The record remains local and participates in DutchMate's existing export, import, and clear-data behavior. Exact bounds and migration rules belong in the specification.

## Priority 3: Encounter Coaching

### Learner value

Help learners notice studied grammar in authentic Dutch without requiring them to recognize and deliberately select a suitable sentence first.

Encounter Coaching is opportunistic. During an ordinary learner-triggered hover or selection translation, DutchMate may use the word and nearby context it already handles. If that bounded text confidently matches a previously studied pattern, the tooltip can offer a short action such as:

> Pattern you know
> `komt ... aan` comes from `aankomen`
> Practise · 20 seconds

DutchMate identifies the opportunity. The learner only decides whether to practise it.

### Privacy and trust boundary

Encounter Coaching must not:

- scan a webpage for exercise candidates;
- inspect unrelated page content;
- run from passive page load;
- transmit or persist additional raw page content;
- make an extra translation or generative-service request;
- interrupt an unmatched hover or selection;
- fabricate a match when classification is uncertain;
- award durable progress for a first explanation alone.

If the interaction text does not confidently match a studied pattern, normal translation continues unchanged. Daily Five remains the guaranteed practice route, so authentic encounters are a bonus rather than a progression requirement.

Matching should start with a small, deterministic, human-reviewed form inventory. The specification must define eligibility, ambiguity handling, evidence rules, accessibility, provider-call assertions, and Chrome and Firefox behavior.

## Playfulness and return value

DutchMate should feel playful through satisfying learning interactions rather than an unrelated reward economy:

- a quick `Spot → Change → Build` rhythm;
- visible movement and placement of forms or sentence tokens;
- immediate feedback that names the relevant rule;
- pattern progress earned through scored evidence;
- restrained celebration when a learner applies a pattern across distinct exercises or contexts;
- continued use of the existing weekly rhythm and grace-day posture.

Do not add coins, lives, experience points, leaderboards, punitive streaks, failure animation, or rewards for opening the extension.

## A0-first delivery

Engineering should first prove one end-to-end tracer pattern across:

1. one practical lesson;
2. one scored click-only grammar task;
3. one mixed Daily Five grammar task;
4. one safe, confident Encounter Coaching match.

That tracer validates the shared pattern identity, local evidence flow, UI, accessibility, scheduling seam, zero-extra-provider-request boundary, and browser behavior.

The first public grammar delivery should then complete a coherent, human-reviewed A0 foundation across the same loop. A1 and A2 content should expand the proven system in later slices rather than being authored in bulk before the learning interaction is validated.

Content volume follows the capability and evidence coverage required by that reviewed A0 sequence. The plan does not impose verb, lesson, skill, or exercise quotas.

## Learning validation

DutchMate should judge this direction by learning evidence, not engagement alone.

Useful validation includes:

- delayed recognition and controlled application in a different sentence;
- comparison of reveal-only study with scored click-only practice;
- errors by pattern and whether corrective feedback improves a later attempt;
- whether mixed Daily Five remains short enough to complete willingly;
- whether Encounter Coaching helps without disrupting normal reading;
- small voluntary learner studies without background learning telemetry.

Clicks, time in the extension, lesson completions, immediate retries, and return frequency may describe use but cannot establish learning effectiveness.

Before the public A0 release, a small product-learning pilot should check that real A0-A2 learners can understand and complete the click-only flow, improve on delayed unseen or recombined items, and reduce the targeted misconception errors. This is a release-quality check for the product's bounded learning claims, not a statistically powered efficacy study or a basis for broad marketing claims. The specification must set the sample, procedure, thresholds, and what happens when a threshold is missed.

## Alternative-plan synthesis

The ChatGPT review input strengthened this plan without replacing the approved product model:

| Disposition | Incorporated decision |
| --- | --- |
| Adopted | Contrast, transformation, repair, and recombination primitives; explicit accepted alternatives; misconception-based distractors and stable error categories; exact feedback; deterministic build-time validation; delayed and varied evidence; human-readable content review. |
| Reframed | Verb Gym and Sentence Forge are internal exercise families. Grammar Minute is absorbed into the existing mixed Daily Five. Five proposed progress states are reduced to the honest learner-facing Introduced, Practising, and Applied states. |
| Parked | A1 and A2 expansion, a Saved-verb practice entry point, and a larger verb inventory remain in the single [feature parking lot](./feature-parking-lot.md) until their revisit signals are met. |
| Rejected for `009` | Separate grammar modes or library switch, fixed content quotas, B1, typed answers, runtime generation, pseudo-precise Secure claims, and full attempt or response-time histories. |

## Out of scope

- B1 or higher curriculum and progression.
- Formal CEFR placement, assessment, or certification.
- A separate grammar tab, Verb Path library, conjugation course, or learner-level setting.
- Locked lessons or mandatory A0 completion.
- Typed or free-form answers in the popup.
- Independent speaking, writing, pronunciation, or listening claims.
- Runtime-generated lessons, explanations, questions, or answer scoring.
- Automatic webpage scanning, grammar highlighting, or unrelated-content analysis.
- Raw encounter-text storage, response-time tracking, full attempt histories, or behavioral timelines.
- Copying the archived Valley Trail verb tables or another unlicensed verb database.
- A second daily queue, game economy, cloud learner profile, or background learning telemetry.

## Specification frontier

Before implementation, the next specification stage must resolve:

- the exact human-reviewed A0 pattern inventory and lesson changes;
- grammar-pattern and grammar-companion identity, content versioning, and prerequisite representation;
- additive catalog migration that preserves all twelve existing lessons and their progress;
- click-only task schemas and objective scoring rules;
- pattern progress and spaced scheduling transitions;
- mixed Daily Five selection and starvation rules;
- local-record migration, export, import, and clear-data behavior;
- Encounter Coaching eligibility and privacy-preserving matching;
- learner-facing copy, accessibility, narrow-popup composition, and browser validation;
- the focused automated seams and small learning-validation plan.

Implementation should not begin directly from this discovery plan. Convert it into an approved specification, then independently deliverable tracer-bullet tickets following the repository workflow.

## References

- [DutchMate domain glossary](../../CONTEXT.md)
- [Curated mini-lesson pattern](./002-learnloop-mini-lesson-pattern.md)
- [LearnLoop specification](./002-learnloop-spec.md)
- [Context Missions specification](./004-transfer-spec.md)
- [Context Missions research](./004-transfer-research.md)
- [Proficiency Path research and source register](./009-proficiency-path-research.md)
- [Single feature parking lot](./feature-parking-lot.md)
- [Council of Europe CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search)
- [Taalunie overview of the ERK](https://erk-nederlands.taalunie.org/over-het-erk/)
- [Woordenlijst.org](https://woordenlijst.org/)
- [Archived Valley Trail Dutch verb list](https://web.archive.org/web/20200226064312/https://www.valley-trail.com/VerbList100.htm)
- [Chrome content-script documentation](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
- [Mozilla content-script documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
