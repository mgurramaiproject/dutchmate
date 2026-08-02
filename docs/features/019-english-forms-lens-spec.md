# Feature 019: English Forms Lens

**Codename:** `english-forms-lens`
**Branch:** `feature/019-english-forms-lens`
**Status:** published as GitHub issue [#153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**Plan:** [Feature 019 plan](./019-english-forms-lens-plan.md)

## Problem Statement

The existing DutchMate twelve-form English comparison surface is difficult to
scan in the constrained browser-popup viewport. A learner sees an English
example and one Dutch sentence, but cannot quickly distinguish the Dutch form
that preserves the English meaning from the Dutch form a speaker would
commonly use. The current card also spends scarce space on detail that is more
useful after deliberate selection.

The current expanded card does not provide a consistent, complete multilingual
comparison. It does not show two separately labelled Dutch roles, full English
and Telugu support under each role, an authored cue for every form, or the
specific Dutch form identity for each sentence. The existing English records
also need a versioned additive contract so the presentation can evolve without
resetting learner history.

## Solution

Replace the current accordion-style presentation with a compact English
comparison lens and a focused Dual-Dutch detail state inside the existing
Verb Journey popup.

The list shows four forms at a time, grouped into Present, Past, and Future.
Each collapsed card shows the English form and sentence, the Everyday Dutch
sentence and its Dutch form badge, and an authored cue. Selecting a card opens
a detail state with separately labelled Meaning-preserving Dutch and Everyday
Dutch blocks. Each block shows its Dutch sentence, full English translation,
full Telugu translation, and the Dutch form badge that belongs to that block.

The lens is reusable across the active `werken`, `zijn`, and `hebben` packs.
It remains reference content attached to the existing Verb Journey. It does
not become a new English course, mastery surface, scheduler, practice queue,
or translation system.

## User Stories

1. As a Dutch learner, I want to compare English forms with Dutch in one popup,
   so that I can understand why the two languages do not map one-to-one.
2. As a Dutch learner, I want the comparison to remain inside the popup, so
   that I do not lose my current Verb Journey.
3. As a learner using a narrow popup, I want four comparison cards visible at a
   time, so that the list remains scannable.
4. As a learner, I want to switch between Present, Past, and Future groups, so
   that I can focus on one period without scrolling through all twelve forms.
5. As a keyboard user, I want period controls to be full-width keyboard
   targets, so that the comparison does not require precise pointer input.
6. As a learner, I want the active period to be clear without colour alone, so
   that I can understand the selection with different visual abilities.
7. As a learner, I want the English form number and name on each card, so that
   I can orient myself in the twelve-form sequence.
8. As an English-speaking learner, I want the full English example on each
   card, so that I can recognise the intended meaning immediately.
9. As a Dutch learner, I want the Everyday Dutch example on each card, so that
   I can see the form a speaker commonly uses.
10. As a learner, I want the Everyday Dutch form badge on the card, so that I
    can identify the Dutch form without opening detail.
11. As a learner, I want an authored cue on every card, so that I can see what
    carries the time or aspect meaning in Dutch.
12. As a learner, I do not want Telugu on collapsed cards, so that the compact
    comparison remains easy to scan.
13. As a learner, I do not want Meaning-preserving Dutch on collapsed cards,
    so that the list has one clear Dutch example per form.
14. As a learner, I want to select a card deliberately, so that detail opens
    only when I need a closer comparison.
15. As a learner, I want detail to replace the list temporarily, so that the
    popup does not become a long page of nested expansions.
16. As a learner, I want a Meaning-preserving Dutch block, so that I can see a
    Dutch construction that closely preserves the English distinction.
17. As a learner, I want an Everyday Dutch block, so that I can compare that
    construction with ordinary Dutch usage.
18. As a learner, I want the two Dutch blocks to remain separately labelled,
    so that matching sentences do not imply that the comparison roles are the
    same concept.
19. As a learner, I want the Dutch sentence to be visually primary, so that
    Dutch remains the learning language.
20. As an English-speaking learner, I want a full English translation below
    each Dutch sentence, so that I can confirm the meaning of both roles.
21. As a Telugu-speaking learner, I want a full Telugu translation below each
    Dutch sentence, so that I can use the Learning triangle without leaving the
    detail state.
22. As a learner, I want the Dutch form badge for each detail block, so that I
    do not assume its form from the English label.
23. As a learner, I want identical Dutch sentences rendered in both blocks,
    so that the two comparison roles remain explicit.
24. As a learner, I want a concise cue explanation in detail, so that I
    understand the phrase carrying the intended timeline.
25. As a learner, I want a concise explanation of how Dutch expresses the
    meaning, so that I can connect the sentence to its construction.
26. As a learner, I want a concise explanation of why the forms differ, so
    that I do not mistake the lens for a tense conversion table.
27. As a learner, I want authored cue tokens lightly emphasised when present
    in a Dutch sentence, so that I can connect the cue line to the example.
28. As a learner, I do not want arbitrary text parsing or forced highlighting,
    so that emphasis remains safe and truthful.
29. As a learner, I want Previous and Next to move through all twelve forms,
    so that I can compare the sequence without returning to the list each time.
30. As a learner, I want the detail position shown as part of twelve, so that I
    know where I am in the sequence.
31. As a learner, I want Back to restore my period, scroll position, and focus,
    so that I can continue scanning where I left off.
32. As a learner, I want an inline explanation of the lens available from the
    header, so that I can learn its purpose without opening a modal or route.
33. As a learner, I want a visible link to the eight-form Dutch map near the
    period controls, so that I can switch references without scrolling through
    all twelve forms.
34. As a learner entering from a Dutch form, I want the corresponding period
    selected without an unexpected detail screen, so that I can orient myself
    before choosing a comparison.
35. As a returning learner, I want the presentation update to preserve my
    learning record, so that a reference-content change does not reset or
    regrade my progress.
36. As a learner using `werken`, `zijn`, or `hebben`, I want the same lens
    behaviour across packs, so that the reference works consistently.
37. As a learner using browser zoom, I want Dutch, English, and Telugu text to
    remain readable and unclipped, so that the popup remains usable.
38. As a screen-reader user, I want cards, tabs, badges, cues, and navigation
    to have meaningful accessible names, so that visual shorthand is explained.
39. As a keyboard user, I want visible focus and standard activation, so that
    I can use the entire lens without a pointer.
40. As a content author, I want each Dutch comparison role stored as reviewed
    content, so that card and detail content cannot drift accidentally.
41. As a content reviewer, I want every visible NL/EN/TE record checked, so
    that structural completeness does not substitute for language review.
42. As a product maintainer, I want the lens to reuse existing pack and popup
    seams, so that the feature does not create a parallel architecture.
43. As a product maintainer, I want comparison clicks to remain outside
    mastery evidence, so that reference use does not make unsupported learning
    claims.

## Implementation Decisions

- Preserve the existing Verb Journey, Verb Map, popup shell, navigation,
  design tokens, mastery logic, evidence semantics, and practice actions.
- Extend the shared English comparison content contract additively under a new
  content version. Preserve stable verb/form identities, evidence keys,
  exports, and learner history; do not reset or silently regrade records.
- Require twelve unique English forms grouped as four Present, four Past, and
  four Future forms in each active `werken`, `zijn`, and `hebben` pack.
- Give each English form two distinct Dutch comparison roles:
  Meaning-preserving Dutch and Everyday Dutch. Each role has its own NL/EN/TE
  localized sentence record and Dutch form identity.
- Keep the two roles distinct even when their Dutch, English, or Telugu values
  match. Never deduplicate matching blocks or render a `Same` replacement.
- Use Everyday Dutch and its form identity in collapsed cards. Use the
  role-specific identity in detail. Never derive a Dutch badge from the
  English form name.
- Require one authored Cue for every English form. Store its display value,
  short meaning, bounded kind, and safe authored token information. Do not infer
  cues at runtime.
- Render cue emphasis only from authored structured content and only when the
  token occurs in the relevant Dutch variant. Do not parse arbitrary HTML or
  force a highlight.
- Replace the current accordion presentation with a list/detail state model.
  The list shows the selected four-form group. Detail is a focused popup state.
- Use sticky Present 1–4, Past 5–8, and Future 9–12 controls. Place the eight-
  form Dutch map action immediately below them.
- Keep the header compact. The information action reveals its explanatory note
  inline; it does not open a modal, tab, route, or separate page.
- Open the list at the relevant period when launched from a journey or selected
  Dutch form. Do not open detail automatically.
- Make detail Previous and Next traverse all twelve forms. Back restores the
  prior group, scroll position, originating card focus, and selection.
- Render each detail block in the order NL, EN, TE, with EN and TE smaller than
  the Dutch sentence. Include the block's Dutch form badge.
- Render concise Cue, How Dutch Expresses It, and Why They Differ sections in
  detail. Existing situation and mismatch content may be reshaped into these
  learner-facing sections.
- Keep the lens presentation-only. No English comparison action contributes
  Verb skill evidence, mastery, scheduling, Daily Five state, or practice
  results.
- Reuse the shared content validator, popup comparison renderer, style tokens,
  and existing integration test patterns. Do not add a UI framework, new
  rendering layer, parallel content store, runtime translation, or new queue.
- Keep `werken` as the concrete reviewed content reference while requiring
  equivalent complete content for `zijn` and `hebben` before release.
- Require independent language review for English/Telugu clarity, literal
  NL/EN/TE alignment, and fluent-Dutch quality across all visible records.

## Testing Decisions

- Tests verify learner-visible behaviour and stable content contracts rather
  than CSS implementation details, private helper names, or a particular DOM
  nesting arrangement.
- The highest content seam is the shared pack validator and its existing
  content/qualification tests. It must prove twelve unique English forms per
  pack, correct group counts, complete two-role NL/EN/TE records, cue data,
  valid Dutch form identities, stable identities, and the new content version.
- The highest UI seam is the existing popup integration test suite. It must
  prove the four-card grouped list, required collapsed-card hierarchy,
  Everyday Dutch selection, cue rendering, inline information, map link,
  keyboard activation, accessible state, detail block order, repeated matching
  content, form badges, all-twelve paging, period transitions, and return-state
  restoration.
- Popup tests must also prove existing Verb Map, journey, practice, and
  navigation actions remain available and functional.
- Existing learning and progression tests remain the prior art for proving
  that presentation changes do not alter evidence, scheduling, or mastery.
- Content tests for the existing multilingual form matrix are the prior art for
  complete localized NL/EN/TE records and independent qualification evidence.
- Manual browser QA must cover the default popup, 110% and 125% zoom, Firefox,
  and the supported Chromium-based browser. It must inspect long Dutch,
  English, and Telugu content, visible focus, no clipping, no overlap, no
  bottom-navigation obstruction, and no horizontal scroll.
- Required implementation checks are focused content and popup tests, typecheck,
  the full relevant test suite, build, and whitespace validation.
- Automated structural validation does not replace independent linguistic
  review. The release record must name reviewers, dates, and sources for the
  three active packs.

## Out of Scope

- A new top-level navigation area, English course, or separate learner-facing
  comparison destination.
- A claim that English tense labels convert one-to-one into Dutch forms.
- New mastery, evidence, scheduling, Daily Five, practice, grammar scoring, or
  learner-level behaviour.
- Runtime translation, AI-generated visible content, or selectable
  support-language modes.
- Telugu phonetic helpers, speech, pronunciation features, or gender variants.
- Runtime cue inference, arbitrary cue parsing, arbitrary HTML highlighting,
  or a general grammar-diagnosis system.
- A redesign of the popup shell or DutchMate design system.
- Changes to stable Verb Journey/Verb Map identities, learner-history meaning,
  or existing lesson and practice architecture.

## Further Notes

Feature 019 is intentionally additive to the completed multilingual Verb Map
work. The English comparison lens is a reference companion to the existing
Verb Journey, not a parallel course or progress system.

The implementation must treat the `werken` content in the agreed plan as the
reference for the two-role detail contract and authored cues, then apply the
same reviewed contract to `zijn` and `hebben`. Manual browser QA and
independent linguistic review are release gates, not reasons to weaken the
structural content contract.
