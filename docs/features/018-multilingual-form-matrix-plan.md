# Feature 018: Multilingual 8-Form Matrix

**Codename:** `multilingual-form-matrix`
**Branch:** `018-multilingual-form-matrix`
**Status:** approved for specification planning

## Goal

Improve the existing Verb Map so every form remains useful at a glance in the
narrow popup while making the selected form understandable in detail. The
4 × 2 map remains a reference map, not a new practice surface.

Each of the eight form cards will show:

1. the Dutch tense abbreviation;
2. one compact status symbol;
3. the Dutch example sentence;
4. the full English translation; and
5. the full Telugu translation.

The selected card will continue to open one detail panel below the matrix.
The current popup shell, navigation, mastery/progression logic, and Verb Map
identity remain intact.

## Approved product decisions

### Map density and hierarchy

- Keep the existing 4 × 2 matrix, four viewpoint rows, two completion columns,
  selected-card treatment, detail panel, bottom navigation, and current
  progression logic.
- Remove the full Dutch tense name, visible status word, and any redundant
  metadata from each card. The space recovered by removing those elements is
  reserved for compact EN/TE sentences rather than for a smaller unreadable
  Dutch sentence.
- Keep full EN and TE sentences in every card. They may use smaller, muted
  typography and tight line spacing, but they must remain readable and must
  not be ellipsized in normal supported popup sizes.
- Use equal card heights within each row. The longest VTTT/VVTT content is a
  required visual test case; no text may clip, overlap, or introduce horizontal
  scrolling.
- Keep visible language prefixes (`NL`, `EN`, and `TE`) where they clarify the
  compact translation lines.
- Do not add Telugu phonetics to the matrix or form detail. Existing phonetic
  helper surfaces retain their current scope.

### Viewpoint and completion labels

Keep the two completion columns:

- `Onvoltooid` / `Not completed`
- `Voltooid` / `Completed`

Use the explicit viewpoint rows:

- `Present` / `tegenwoordige tijd`
- `Past` / `verleden tijd`
- `Future from present` / `tegenwoordige toekomende tijd`
- `Future from past` / `verleden toekomende tijd`

Do not show the repeated `2 forms` label. The row supplies viewpoint and the
column supplies completion; the card supplies only its code and examples.

### Status display

The underlying five semantic statuses remain unchanged:
`mastered`, `learning`, `next`, `later`, and `reference`.

The matrix has exactly three visible symbols:

| Internal meaning | Visible symbol | Accessible/detail meaning |
| --- | --- | --- |
| `mastered` | `✓` | Mastered / ready to use |
| `learning`, `next` | `›` | Current or next useful form |
| `later`, `reference` | `○` | Later or reference form |

Cards must not display the status words. The card’s accessible name and the
detail panel may retain the precise semantic status. Keep a compact legend
above the matrix so the symbols are decodable without relying on colour.

### Detail panel

The selected-form panel remains below the matrix and contains, in order:

1. tense code and precise status;
2. learner-friendly English tense label;
3. full Dutch tense name;
4. NL canonical example;
5. EN canonical translation;
6. TE canonical translation;
7. `MEANING`;
8. `PATTERN`;
9. `COMMON USE`; and
10. NL, EN, and TE for the one common-use sentence.

Remove `REFERENCE FORM`, `CORE FORM`, `LEARNING PRIORITY`, `FORMULA`, and
duplicated status explanations from this panel. `PATTERN` is the learner-facing
name for the existing formula content. Existing notes explaining that Dutch
onvoltooid/voltooid do not map one-to-one to English remain outside the form
record and may stay below the panel.

Selecting a card updates the selected border and panel, then scrolls only as
far as needed to reveal the panel while preserving map context. Existing
collapse behaviour may be retained if it is already supported.

### Content scope and source of truth

This slice covers every currently registered Verb Journey pack:

- `werken`;
- `zijn`; and
- `hebben`.

Every form record has one required localized canonical example and one
required localized common-use example:

```ts
type LocalizedSentence = {
  nl: string;
  en: string;
  te: string;
};
```

Cards and detail render those same records. No runtime translation, missing
helper fallback, or duplicated card/detail content path is allowed.

Each form also has a learner-friendly English label, meaning, Dutch pattern,
and the existing stable form identity, viewpoint, completion, CEFR, teaching
priority, and progression status. The eight form identities and all existing
verb/evidence keys remain stable.

Author exactly one concise common-use sentence per form. Alternatives and
contrast explanations stay in the existing journey notice and twelve-form
English comparison surfaces.

The initial learner-facing English labels and pedagogical meanings are:

| Form | English label | Meaning | Pattern |
| --- | --- | --- | --- |
| OTT | Present | Current, habitual, or generally true situation. | Present finite verb |
| VTT | Completed present / perfect | Completed event presented as relevant now or as a conversational fact. | `hebben/zijn` in OTT + past participle |
| OVT | Past | Past event, state, habit, or narrative background. | Past finite verb |
| VVT | Completed past | Event completed before another past reference point. | `hebben/zijn` in OVT + past participle |
| OTTT | Future viewed from the present | Uncompleted future action viewed from now. | `zal/zullen` + infinitive |
| VTTT | Completed future viewed from the present | Action expected to be complete by a future point. | `zal/zullen` + past participle + `hebben/zijn` |
| OVTT | Future viewed from the past / conditional | Future action viewed from a past point or hypothetical action. | `zou/zouden` + infinitive |
| VVTT | Completed future viewed from the past / conditional perfect | Completed result viewed from the past, often hypothetical or unrealised. | `zou/zouden` + past participle + `hebben/zijn` |

Telugu content uses one consistent deterministic default rendering for this
slice. Gender-specific variants are deferred and must not block the current
content update.

## Domain and architecture boundaries

- The Verb Map remains a stable eight-form reference inside the existing
  Lessons and Saved-linked flows.
- This is an additive content-model evolution. Do not create a parallel map,
  mastery model, scheduler, practice queue, translation service, or verb UI
  framework.
- Existing `VerbJourneyPack` selection by stable verb identity remains the
  source of pack selection.
- Existing skill evidence and progression remain the source of status; the
  three-symbol mapping is presentation-only.
- Existing learner history, evidence revisions, export/import records, and
  review semantics remain compatible. If content versioning requires a
  migration, it must be explicit, additive where possible, and atomic on
  failure.

## Implementation seams

Prefer the existing seams, in this order:

1. the shared verb content model and pack validator;
2. the shared popup Verb Map renderer and its existing style tokens;
3. the shared popup test suite and content tests.

The implementation should not add a component framework or a new rendering
layer. The card and detail changes should remain inside the current Verb Map
surface, with small helpers only where they remove duplicated rendering or
validation logic.

## Accessibility and responsive requirements

- Cards remain keyboard-focusable buttons with Enter and Space activation.
- Expose selected state through the existing button interaction semantics;
  use `aria-selected` only if the final map semantics require it, and do not
  make a button’s accessible name depend on visual colour.
- Every status symbol has an accessible label. The accessible card name may
  include the full Dutch name and precise internal status even though those
  are not visible inside the card.
- The legend is visible text and does not rely only on colour.
- Preserve readable Dutch text, adequate contrast, Telugu line height, and
  visible focus at 125% zoom.
- Test default popup size, 110% and 125% zoom, Firefox, and the supported
  Chromium-based browser.
- Keep the bottom navigation from covering the detail panel and prevent
  horizontal scrolling.

## Content qualification gate

Before release, structurally validate all 24 form records and 24 common-use
records across the three active packs. Separately record:

- English learner-facing clarity;
- Telugu meaning and learner-facing clarity;
- literal NL/EN/TE alignment for canonical and common-use sentences; and
- independent fluent-Dutch review with reviewer, date, and sources.

Structural validation is necessary but does not replace linguistic review.
No pack may ship with placeholder or `Unavailable` multilingual content.

## Verification plan

Test external behaviour at the highest existing seams:

- Content validation proves exactly eight unique forms per pack, required NL,
  EN, and TE records, learner labels, meanings, patterns, common-use records,
  stable references, and valid pack registration.
- Popup tests prove eight cards render the three languages, cards omit visible
  full names/status words, row headers omit `2 forms`, the legend exposes
  three symbols, and the selected detail shows the correct localized content.
- Popup tests cover card keyboard activation, accessible status labels,
  nearest detail-panel reveal, selected state, navigation return paths, and
  preservation of existing comparison/practice actions.
- Visual/manual QA covers OTT, VTTT, and VVTT selection, longest Telugu text,
  default/zoomed layouts, Firefox, Chromium, no clipping, and no horizontal
  scrolling.
- Existing mastery/progression tests continue to prove five internal status
  semantics and evidence behaviour; presentation tests prove only their
  three-symbol projection.

Run focused checks first, then the repository-required checks:

```sh
npm test -- --run src/verb-journeys/content.test.ts src/popup/index.test.ts
npm run typecheck
npm test
npm run build
git diff --check
```

Manual browser QA and independent language review are required before the
feature is ready for implementation delivery.

## Out of scope

- New top-level navigation or a new Verb Map destination.
- Changes to mastery algorithms, evidence semantics, practice questions, or
  progression scheduling.
- Runtime translation APIs or AI-generated learner-facing content.
- User-selectable support-language modes.
- Telugu phonetic helpers, speech, or pronunciation features.
- Gender-specific Telugu variants.
- Redesign of the overall DutchMate design system or popup shell.
- Changes to the twelve-form English comparison model beyond links or shared
  content helpers needed to avoid duplication.

## Delivery gates

This approved plan is the only planning artifact created in this slice. Before
creating a spec or tickets, obtain explicit approval to invoke `$to-spec` and
then `$to-tickets`. Their canonical documents must use feature code `018` and
live directly under `docs/features/`.

After implementation work is later approved, keep each ticket independently
verifiable, commit every intentional change, and finish with one tracker- and
verification-grounded next action.
