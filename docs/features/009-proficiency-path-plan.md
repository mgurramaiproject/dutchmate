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

### Exercise contract

Grammar practice requires no text entry. Learners use controls that work by tap, click, or keyboard:

- choose the correct conjugated form;
- change a subject or tense and choose the resulting form;
- reconstruct word order from shuffled tokens;
- position a separable prefix;
- identify and correct one invalid sentence.

Teaching prompts may provide strong guidance. Scored progression must use a different sentence from the initial example and provide precise corrective feedback. The resulting evidence represents supported recognition and controlled application, not uncued written production.

### Verb content

The archived Valley Trail verb page is useful as inspiration for the kinds of forms a reference may expose, but it is not the curriculum or a content source to copy. It mixes essential and advanced tenses, is not sequenced for DutchMate's A0-A2 audience, and has no established reuse license.

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
- **Applied:** the learner succeeded across distinct exercises or contexts.

The specification must define scheduling, state transitions, versioning, backup behavior, and how grammar tasks coexist with the current recognition and recall model. It should extend the existing Today flow and local learning record rather than create a competing scheduler or cloud profile.

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

## Out of scope

- B1 or higher curriculum and progression.
- Formal CEFR placement, assessment, or certification.
- A separate grammar tab, Verb Path library, conjugation course, or learner-level setting.
- Locked lessons or mandatory A0 completion.
- Typed or free-form answers in the popup.
- Independent speaking, writing, pronunciation, or listening claims.
- Runtime-generated lessons, explanations, questions, or answer scoring.
- Automatic webpage scanning, grammar highlighting, or unrelated-content analysis.
- Copying the archived Valley Trail verb tables or another unlicensed verb database.
- A second daily queue, game economy, cloud learner profile, or background learning telemetry.

## Specification frontier

Before implementation, the next specification stage must resolve:

- the exact human-reviewed A0 pattern inventory and lesson changes;
- grammar-pattern identity, content versioning, and prerequisite representation;
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
- [Council of Europe CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search)
- [Woordenlijst.org](https://woordenlijst.org/)
- [Archived Valley Trail Dutch verb list](https://web.archive.org/web/20200226064312/https://www.valley-trail.com/VerbList100.htm)
- [Chrome content-script documentation](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
- [Mozilla content-script documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
