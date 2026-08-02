# Feature 019: English Forms Lens

**Codename:** `english-forms-lens`
**Branch:** `feature/019-english-forms-lens`
**Status:** tickets published; ready for implementation handoff
**Source proposal:** [DutchMate 12 English Forms presentation plan](./todos/dutchmate-12-english-forms-presentation-plan-v2.md)
**Spec:** [Feature 019 spec](./019-english-forms-lens-spec.md)
**GitHub issue:** [#153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**Tickets:** [Feature 019 tickets](./019-english-forms-lens-tickets.md)

## Goal

Improve the existing twelve-form English comparison surface inside the
constrained DutchMate popup. The surface should teach a practical distinction:
English often expresses time or aspect through a larger verb construction,
while Dutch often uses a simpler Dutch form plus an authored cue such as `nu`,
`al`, `gisteren`, `toen`, `morgen`, or `tegen vrijdag`.

Feature 019 is a reusable English comparison lens for every active Verb Journey
pack with reviewed comparison content. It ships against `werken`, `zijn`, and
`hebben`; the `werken` records are the concrete content reference. It remains a
supporting reference inside the existing Verb Journey and does not add a
mastery model, scheduler, practice queue, translation service, or new
learner-facing destination.

## Shared understanding

### Scope and compatibility

- Use the existing `VerbJourneyPack.englishComparison` seam and one shared
  popup renderer.
- Require the redesigned contract for all three active packs: `werken`,
  `zijn`, and `hebben`.
- Add the new fields under a new content version. Preserve stable verb/form
  identities, evidence keys, exports, readable learner history, and existing
  progression without reset or regrading.
- Keep the current Verb Journey and Verb Map navigation and popup shell.
- The English comparison lens is reference content, not an English tense
  course or a one-to-one Dutch conversion table.

### Entry and navigation

- Entering from a journey opens the comparison list in the selected period;
  no detail is opened automatically.
- Entering from a selected Dutch form opens its corresponding period list;
  no detail is opened automatically.
- Use three sticky, full-width period tabs: `Present 1–4`, `Past 5–8`, and
  `Future 9–12`. The active state must not rely on colour alone.
- Place `View 8-form Dutch map` immediately below the period selector.
- The header contains a compact title and explanation. Its information action
  reveals the longer explanation inline beneath the heading.
- Detail mode replaces the list inside the same popup. It never opens a tab,
  route, floating overlay, or system modal.
- Detail `Previous` and `Next` traverse the complete twelve-form sequence,
  crossing period boundaries. The detail header shows the current position.
- Back restores the selected period, previous list scroll position, originating
  card focus, and selected-card state.

### Comparison-list cards

Each collapsed card shows exactly:

1. Form number.
2. English form name.
3. Everyday Dutch form badge.
4. Disclosure chevron.
5. English example sentence.
6. Everyday Dutch sentence.
7. A visible authored `Cue` line.

Collapsed cards show English and Dutch only. They do not show Telugu,
Meaning-preserving Dutch, full Dutch tense names, long explanations,
`Situation`, `Mismatch / usage`, both Dutch variants, duplicate sentences, or
inline expanded content.

Use one surface per card and the existing DutchMate design tokens. Do not add a
large nested sentence box or a parallel colour/spacing system. Keep English
and Dutch readable at the narrow popup width, allow natural card-height
variation, and avoid ellipsizing Dutch in supported widths.

### Dual-Dutch detail

Every English form opens a focused Dual-Dutch detail state with two separately
labelled blocks, in this order:

1. `MEANING-PRESERVING DUTCH`
2. `EVERYDAY DUTCH`

Each block contains, in order:

1. Primary Dutch sentence.
2. Full English translation.
3. Full Telugu translation.
4. Dutch form badge for that specific sentence.

The two blocks remain separate even when their Dutch sentences match. The
matching Dutch sentence is rendered twice with its own EN and TE lines; it is
never replaced with `Same`, deduplicated during preparation, or collapsed at
runtime.

The detail also contains concise authored sections for `CUE`, `HOW DUTCH
EXPRESSES IT`, and `WHY THEY DIFFER`. The current situation and mismatch
content may be reshaped into these sections, but the learner should not see
implementation metadata or a long article.

### Authored cues

Every one of the twelve forms has a required authored cue. A cue can express
frequency, current time or period, duration, a past time or reference point,
sequence, future time, a deadline, or a compact combination.

Cues are content, not runtime inference or another translation. Store enough
structured information to render:

- a compact display value for the card;
- a short meaning for detail;
- a bounded cue kind; and
- safe authored token information for optional emphasis.

Render `Cue · <display>` in the card and `<display> · <short meaning>` in
detail. Lightly emphasize authored cue tokens inside each Dutch sentence when
they occur. Use structured safe rendering; do not parse arbitrary HTML or
force a highlight into a variant that does not contain the token.

### Content contract

For each of the twelve English forms in each active pack, store two independent
Dutch comparison blocks. Each block has a complete NL/EN/TE record and a Dutch
form identity. The same English and Telugu translations may be authored in both
blocks when the Dutch sentence is identical, but the records remain distinct
by role.

The collapsed card always uses the Everyday Dutch record and its form badge.
Detail uses the form identity belonging to each block. Neither badge is
derived from the English form name.

The exact `werken` reference set is:

| # | English form | Everyday Dutch | Badge | Cue |
|---:|---|---|---|---|
| 1 | Present simple | Ik werk elke maandag thuis. | OTT | elke maandag |
| 2 | Present continuous | Ik werk nu thuis. | OTT | nu |
| 3 | Present perfect | Ik heb deze week drie keer thuis gewerkt. | VTT | deze week |
| 4 | Present perfect continuous | Ik werk al twee uur. | OTT | al twee uur |
| 5 | Past simple | Ik heb gisteren thuis gewerkt. | VTT | gisteren |
| 6 | Past continuous | Ik zat te werken toen ze belde. | OVT | toen ze belde |
| 7 | Past perfect | Ik had al thuis gewerkt voordat de vergadering begon. | VVT | al … voordat |
| 8 | Past perfect continuous | Ik zat al twee uur te werken toen ze belde. | OVT | al twee uur … toen |
| 9 | Future simple | Morgen werk ik thuis. | OTT | morgen |
| 10 | Future continuous | Morgen om acht uur ben ik aan het werken. | OTT | morgen om acht uur |
| 11 | Future perfect | Uiterlijk vrijdag heb ik drie keer thuis gewerkt. | VTT | tegen/uiterlijk vrijdag |
| 12 | Future perfect continuous | Morgen om acht uur ben ik al twee uur aan het werken. | OTT | morgen om acht uur + al twee uur |

The full meaning-preserving Dutch, EN, TE, cue meaning, construction, and
explanation records remain governed by the source proposal and must receive
independent linguistic review before release. The `werken` Telugu in the
proposal is an implementation-ready default, not a substitute for that
review. Equivalent complete content is required for `zijn` and `hebben`.

## Domain and architecture boundaries

- `Verb Journey` remains the learner-facing staged path for one Dutch verb.
- `Verb Map` remains the stable eight-form Dutch reference.
- `Multilingual form record` remains reviewed content support, not a language
  switch or a second learning mode.
- The `English comparison lens`, `Dual-Dutch detail`, and `Cue` are
  presentation/content concepts attached to the existing pack.
- Existing learner evidence and progression remain authoritative. No English
  comparison click contributes mastery evidence.
- Content evolution is additive and versioned. Any future incompatible change
  must use an explicit atomic migration; this feature must not silently reset a
  learner.

## Implementation seams

Prefer the highest existing seams:

1. Extend the shared English comparison content type and pack validator.
2. Extend the existing popup comparison renderer and style tokens.
3. Cover the public popup and content seams with focused tests.

Do not add a component framework, new rendering layer, parallel content store,
runtime translation, or new navigation system. Small rendering helpers are
appropriate only when they remove repeated markup or make the two block roles
explicit.

## Accessibility and responsive requirements

- Cards and detail navigation remain keyboard-operable with visible focus.
- Use button semantics for activation and expose selected/expanded state
  accessibly without depending on colour.
- Give tabs, cards, cues, form badges, and disclosure controls meaningful
  accessible names.
- Keep EN and TE text smaller than the primary Dutch sentence while preserving
  readable line height and contrast.
- Test the default popup size, 110% and 125% zoom, supported Chromium, and
  Firefox.
- Prevent clipping, overlapping text, bottom-navigation obstruction, and
  horizontal scrolling.

## Verification and release gates

Automated checks should prove external behaviour at existing seams:

- Content validation proves exactly twelve unique English forms per active
  pack, complete two-role NL/EN/TE records, cue data, valid Dutch form badges,
  stable identities, and the new content version.
- Popup tests prove the four-card period list, English-only/Dutch-only
  collapsed hierarchy, Everyday Dutch card content, cue rendering, separate
  Dual-Dutch blocks, repeated matching sentences, form badges, inline info,
  map link, all-twelve pager, return-state restoration, keyboard behaviour,
  and preserved map/practice/journey actions.
- Existing learning and progression tests continue to prove that the lens does
  not create or alter evidence, scheduling, or mastery state.
- `git diff --check`, focused content/popup tests, typecheck, the full test
  suite, and build remain required implementation checks.
- Independent review must record English/Telugu learner-facing clarity,
  literal NL/EN/TE alignment, and fluent-Dutch review for all visible
  comparison records across the three packs. Manual browser QA is also
  required before release.

## Out of scope

- A new top-level navigation area or separate English course.
- A one-to-one English-tense-to-Dutch conversion claim.
- New mastery, evidence, scheduling, Daily Five, practice, or grammar scoring
  behaviour.
- Runtime translation, AI-generated learner-facing content, or user-selectable
  support-language modes.
- Telugu phonetic helpers, speech, pronunciation features, or gender variants.
- Arbitrary cue parsing, arbitrary HTML highlighting, or automatic cue
  inference.
- A redesign of the popup shell or DutchMate design system.
- Changes to learner history semantics or stable Verb Journey/Verb Map IDs.

## Delivery gates

1. This plan, the canonical spec, and the ticket documents are committed on
   the dedicated feature branch.
2. The spec is published as GitHub issue #153 with `ready-for-agent`.
3. T01–T04 are published as GitHub issues #154–#157 with `ready-for-agent`
   labels and explicit blocker references.
4. Implementation begins only from the approved spec and ticket breakdown.
