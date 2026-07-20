# 002-learnloop Priority Roadmap

This roadmap records the agreed product direction for turning DutchMate from a translation-and-review extension into a browsing-to-fluency learning companion. It orders feature families by learner value and dependency; it is not yet an implementation spec or ticket breakdown.

## Product hierarchy

DutchMate's core is the browsing-to-fluency loop: understand Dutch encountered on real websites, capture useful language, practise it, and later recognize or actively recall it.

The hierarchy is:

1. contextual mastery of learner-controlled webpage vocabulary and meaningful chunks;
2. dedicated, curated mini-lessons that close systematic A0-A2 gaps; and
3. a calm engagement layer that helps learners return without becoming a separate game economy.

## Priority 1: Learning-item foundation

Expand saved vocabulary from single words to learning items that may be Dutch words or meaningful chunks.

Deliver:

- explicit, learner-confirmed capture for selected words and candidate chunks;
- normalized canonical items that do not duplicate across webpage and lesson sources;
- English and Telugu helper meanings;
- a small capped set of recent local page contexts;
- interaction-based learning encounters without automatic page scanning;
- migration of current review-card data; and
- versioned export and import for the expanded local learning record.

This foundation comes first because every later feature depends on one trustworthy identity, context, and progress record for each learning item.

## Priority 2: Contextual mastery and Daily Five

Replace fixed-interval, four-rating review with a dead-simple adaptive flashcard loop.

Deliver:

- separate recognition and recall mastery;
- New, Learning, Familiar, and Strong states, with overall mastery limited by the weaker dimension;
- adaptive card direction and spacing behind a consistent interaction;
- `Show answer`, followed by only `Again` or `Got it`;
- no typing or learner-selected interval;
- one unified queue for webpage and lesson learning items;
- Daily Five, taking due items first and then new saved items when capacity remains;
- optional continuation after the daily goal; and
- a default `Today` popup area with the main review action and quiet progress feedback.

Webpage encounters support exposure but do not count as successful recognition or recall.

## Priority 3: Curated mini-lesson engine

Add a dedicated `Lessons` popup area while keeping Settings behind a header control.

Deliver:

- practical life pathways with CEFR-prefixed lesson titles;
- human-reviewed, versioned Dutch, English, and Telugu content bundled with the extension;
- one coherent micro-story per three-to-five-minute lesson;
- the four-stage Read situation, Notice pattern, Practise, and Replay and keep flow;
- three to five lesson candidates per lesson;
- one preselected completion summary with `Keep N for review`;
- `Already saved` behavior that reuses the canonical learning item; and
- focused lesson screens that temporarily hide top-level navigation.

The detailed lesson contract lives in [002-learnloop-mini-lesson-pattern.md](./002-learnloop-mini-lesson-pattern.md).

## Priority 4: Twelve-lesson starter library

Publish the first useful A0-A2 teaching set across all seven practical life pathways.

The accepted lesson order is:

1. `A0 · Hallo, ik ben…`
2. `A1 · Kunt u dat herhalen?`
3. `A1 · Ik wil graag bestellen`
4. `A1 · Kan ik met pin betalen?`
5. `A1 · Waar moet ik overstappen?`
6. `A1 · Mijn trein is vertraagd`
7. `A1 · Een afspraak maken`
8. `A1 · Ik heb last van…`
9. `A1 · Er is iets kapot`
10. `A1 · Ik ben beschikbaar op…`
11. `A1 · Wat moet ik meenemen?`
12. `A2 · Wat staat er in deze brief?`

Each lesson must pass Dutch, English, Telugu, CEFR, cultural, interaction, and saved-item integration review.

## Priority 5: Calm engagement

Add motivation only where it reflects meaningful learning.

Deliver:

- Daily Five completion;
- weekly consistency rather than an endless punitive streak;
- one grace day;
- restrained celebrations when items become Familiar or Strong; and
- practical milestones such as learning twenty-five meaningful chunks.

Do not introduce experience points, coins, leagues, public leaderboards, or decorative rewards that lack a learning benefit.

## Priority 6: Validation and refinement

Validate the complete loop with real learners and the supported browsers.

Cover:

- popup usability and accessibility;
- Chrome and Firefox behavior;
- existing vocabulary and backup migration;
- no-typing review clarity;
- mastery scheduling behavior;
- CEFR and trilingual lesson-content review;
- lesson completion and candidate-keeping comprehension; and
- whether the calm learning rhythm helps users return without pressure.

Use learner-visible local recognition and recall evidence, delayed checks of Familiar and Strong items, reduced-support micro-story comprehension, small observed studies with Telugu-speaking Dutch learners, and the existing voluntary feedback intake. Do not add background learning telemetry for this roadmap.

Refine scheduling, wording, lesson difficulty, and interaction only from observed learner evidence rather than adding broader feature families during this phase.

## Cross-cutting boundaries

- The popup has two primary areas: `Today` and `Lessons`; Settings remains behind a header control.
- Focused review and lesson screens hide top-level navigation temporarily.
- Learning data stays local-first and requires no account.
- The product teaches Dutch only, while new learning-item and mastery records carry an explicit learning-language key instead of relying on hardcoded Dutch identity assumptions.
- Saved vocabulary remains learner-controlled.
- The extension does not type-test the learner.
- English and Telugu remain helper languages for Dutch learning.
- Mini-lessons share the same learning-item, mastery, review, and backup model as webpage captures.
- Automatic suggestions, page highlighting, cloud sync, full gamification, social competition, sentence coaching, and pronunciation remain parked.

Deferred ideas and their revisit signals live in [002-learnloop-feature-parking-lot.md](./002-learnloop-feature-parking-lot.md).

## Artifact family

All feature-specific artifacts produced from this exploration and its later delivery use the shared code `002-learnloop` in the filename. Existing repository-wide canonical files keep their required names.

Expected follow-on names include:

- `002-learnloop-spec.md`;
- `002-learnloop-tickets.md`;
- `002-learnloop-design-*.html`; and
- `002-learnloop-implementation-*.md` when a durable implementation note is justified.

Related ADRs retain their required sequential prefixes:

- `0003-002-learnloop-contextual-mastery-separates-recognition-and-recall.md`; and
- `0004-002-learnloop-language-keyed-learning-record.md`.
