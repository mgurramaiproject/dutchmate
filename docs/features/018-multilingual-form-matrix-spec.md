# Feature 018: Multilingual 8-Form Matrix

**Codename:** `multilingual-form-matrix`
**Status:** ready for implementation planning
**Branch:** `018-multilingual-form-matrix`
**GitHub issue:** [#148](https://github.com/mgurramaiproject/dutchmate/issues/148)

## Problem Statement

The DutchMate Verb Map is intended to be a stable eight-form reference, but
its current cards spend scarce popup space on repeated full Dutch tense names,
status words, and row metadata. A learner cannot compare the forms quickly
while also seeing the English and Telugu support needed by DutchMate's learning
triangle.

The selected-form detail panel also exposes incomplete multilingual content and
classification labels that do not help the learner understand the selected
form. The current form model does not provide one shared, required source for
the Dutch, English, and Telugu canonical and common-use examples across the
`werken`, `zijn`, and `hebben` packs.

## Solution

Retain the existing 4 × 2 Verb Map and detail-panel flow, but make each card a
compact multilingual reference. Each card shows its Dutch tense abbreviation,
one compact status symbol, a Dutch example, a full English translation, and a
full Telugu translation. Removing repeated full names and visible status words
creates room for the translations without reducing Dutch below a readable
size.

Use the same reviewed localized canonical and common-use records in the card
and detail panel. Keep the five internal progression meanings and project them
to three visible symbols: `✓` for mastered, `›` for current/next, and `○` for
later/reference. Preserve precise status meaning through accessible labels and
the detail surface.

Apply the content contract to every currently registered pack. Keep the map,
popup shell, navigation, evidence, progression, comparison, and practice
contracts additive and compatible.

## User Stories

1. As a Dutch learner, I want to see all eight Dutch form abbreviations in one
   stable map, so that I can orient myself without opening another lesson.
2. As a Dutch learner, I want each form card to show a Dutch example, so that
   the abbreviation is connected to a real sentence.
3. As an English-speaking learner, I want the full English sentence on every
   card, so that I can confirm the broad meaning at a glance.
4. As a Telugu-speaking learner, I want the full Telugu sentence on every
   card, so that I can use my support language without leaving the map.
5. As a learner using a narrow popup, I want the translations to use compact,
   readable typography, so that the map remains scannable rather than becoming
   an unreadable wall of text.
6. As a learner, I want the Dutch sentence to remain prominent over helper
   translations, so that Dutch remains the learning language.
7. As a learner, I want the row labels to distinguish future viewed from the
   present from future viewed from the past, so that the two future rows are
   not ambiguous.
8. As a learner, I want the completion columns to distinguish onvoltooid from
   voltooid, so that I can understand the second dimension of the map.
9. As a learner, I want each row to avoid repeated `2 forms` copy, so that
   the grid has room for useful examples.
10. As a learner, I want a compact legend for the three card symbols, so that
    I can decode status without guessing from colour.
11. As a learner, I want the selected card to remain visibly selected, so that
    I know which form the detail panel describes.
12. As a learner, I want the detail panel to show a learner-friendly English
    label, so that formal Dutch terminology is not my only explanation.
13. As a learner, I want the detail panel to show the full Dutch tense name,
    so that I can connect the abbreviation to Dutch grammar terminology when I
    need it.
14. As a learner, I want the detail panel to show the canonical NL, EN, and TE
    examples together, so that I can compare form and meaning in one place.
15. As a learner, I want the detail panel to explain meaning and pattern, so
    that I understand when the form is useful rather than memorising a label.
16. As a learner, I want one concise common-use example with all three
    languages, so that I can see the form in a practical context.
17. As a learner, I do not want reference/core/priority labels in the detail
    content, so that implementation metadata does not distract from grammar.
18. As a learner, I want selecting a card to reveal its detail panel with only
    the necessary scrolling, so that I retain context about the map.
19. As a keyboard user, I want to focus and activate cards with standard
    keyboard controls, so that the map does not require a pointer.
20. As a screen-reader user, I want each symbol and card to have an accessible
    precise status label, so that the compact visual representation is not
    ambiguous.
21. As a learner using browser zoom, I want Telugu text to retain line height
    and remain unclipped, so that zoom does not make the content unusable.
22. As a learner, I want the map to avoid horizontal scrolling, so that the
    narrow popup remains a coherent surface.
23. As a learner, I want existing English comparison actions to continue to
    work from the map, so that the map remains connected to the twelve-form
    comparison lens.
24. As a learner, I want existing practice actions and journey navigation to
    continue to work, so that the reference improvement does not break learning
    flow.
25. As a returning learner, I want my existing evidence and progression to
    remain meaningful, so that a content update does not reset my history.
26. As a returning learner, I want each active verb pack to use the same
    multilingual contract, so that the map behaves consistently for `werken`,
    `zijn`, and `hebben`.
27. As a content author, I want canonical and common-use examples stored once,
    so that card and detail translations cannot drift.
28. As a content reviewer, I want every NL/EN/TE example structurally
    validated and independently reviewed, so that visible content is safe to
    publish.
29. As a product maintainer, I want the three visible symbols to be a
    presentation mapping over existing five-status semantics, so that UI
    simplification does not change learner evidence.
30. As a product maintainer, I want Telugu gender variants and phonetic
    helpers out of this slice, so that the multilingual map remains a bounded
    additive change.

## Implementation Decisions

- Preserve the current 4 × 2 matrix, selected-card border, detail panel,
  bottom navigation, popup shell, and existing map identity.
- Remove visible full Dutch tense names, visible status words, repeated `2
  forms`, and redundant detail classifications from the map surface.
- Render every card in this order: code, status symbol, NL example, EN
  translation, TE translation.
- Keep full EN and TE sentences in cards with compact but readable typography.
  Do not use ellipsis in normal supported popup sizes. Equalise card heights
  within each row and validate the longest VTTT/VVTT content.
- Use explicit row labels for present, past, future from present, and future
  from past. Keep the existing onvoltooid and voltooid columns with their
  English helper labels.
- Keep five internal statuses unchanged. Project them visually as mastered
  (`✓`), current/next (`›`), and later/reference (`○`). Keep a compact visible
  legend and precise accessible/detail status labels.
- Use a required localized content record for every form's canonical example
  and common-use example. Each record has NL, EN, and TE values. Cards and
  detail render the same records; there is no runtime translation or missing
  helper fallback.
- Add a learner-friendly English label, meaning, Dutch pattern, and one
  concise common-use sentence to each form while retaining stable form IDs,
  viewpoint, completion, CEFR, teaching priority, and status.
- Apply the content contract to all active packs: `werken`, `zijn`, and
  `hebben`. Validate 24 form records and 24 common-use records.
- Keep one common-use sentence per form. Existing journey notices and the
  twelve-form English comparison remain the homes for alternatives and
  contrasts.
- Use one deterministic default Telugu rendering. Do not add gender variants,
  phonetic helpers, speech, or support-language settings in this feature.
- On selection, preserve the selected state and reveal the detail panel using
  nearest scrolling only. Preserve existing collapse behaviour if supported.
- Keep cards keyboard-operable and expose symbol meaning through accessible
  text. Do not rely on colour for status or selection.
- Reuse the existing content validator, popup renderer, style tokens, and
  popup integration tests. Do not create a new UI framework, map, scheduler,
  mastery model, translation service, or practice queue.
- Treat the localized form content as an additive content evolution. Preserve
  stable pack identities, evidence keys, export/import records, and learner
  history. Any required migration must be explicit, additive where possible,
  and atomic on failure.
- Require English and Telugu clarity checks, literal NL/EN/TE alignment, and
  independent fluent-Dutch review before release. Record reviewer, date, and
  sources; structural validation alone is not linguistic qualification.

## Testing Decisions

- Tests must verify learner-visible behaviour and stable content contracts,
  not CSS implementation details or private helper names.
- The shared content validator and pack tests will prove that each active pack
  has exactly eight unique forms, complete localized canonical/common-use
  records, learner labels, meanings, patterns, valid references, and stable
  pack identity.
- Existing popup integration tests will prove that eight cards render all
  three languages, visible redundant metadata is absent, row labels are
  correct, the three-symbol legend is present, and selected detail content
  matches the selected form.
- Popup tests will cover keyboard activation, accessible symbol/card labels,
  selected state, nearest detail reveal, return navigation, comparison
  actions, practice actions, and preservation of existing flows.
- Status tests will keep five internal semantics separate from their three
  visual symbols: evidence and progression behaviour remain covered by the
  existing learning tests, while popup tests cover only presentation.
- Manual visual QA will inspect the default popup size, 110% and 125% zoom,
  Firefox, and the supported Chromium-based browser. It must include OTT,
  VTTT, VVTT, longest Telugu content, no clipping, aligned row heights, and no
  horizontal scrolling.
- Independent linguistic review is a release check for all 24 form and 24
  common-use records across the three packs. It is separate from automated
  structural validation.
- The repository test sequence remains focused content/popup tests, typecheck,
  full test suite, build, and whitespace validation.

## Out of Scope

- A new top-level tab, new Verb Map destination, or popup-shell redesign.
- New mastery, evidence, scheduling, practice, or grammar-scoring behaviour.
- Runtime translation APIs, AI-generated translations, or user-selectable
  support-language modes.
- Telugu phonetic helpers, speech, pronunciation features, or gender-specific
  Telugu variants.
- A new translation or content framework.
- A change to the twelve-form English comparison model beyond preserving its
  existing connection to the map.
- Changes to lesson journey scope, practice question authoring, or Daily Five
  selection.

## Further Notes

Feature 018 is an additive presentation and content-contract change. The Verb
Map remains a supporting reference inside the existing Verb Path; it does not
become a conjugation course or a new learner-facing progress system.

The approved plan and ADR define the product rationale and domain vocabulary.
This spec intentionally keeps the implementation seams narrow so later tickets
can be vertical and independently verifiable.
