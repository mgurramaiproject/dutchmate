# Feature 025 — Practical Dutch Compact UI

**Codename:** `compact-ui`  
**Branch:** `feature/025-compact-ui`  
**Status:** Plan approved through grilling  
**Source:** `docs/features/todos/dutchmate-practical-dutch-compact-ui-revision-plan.md`  
**Date:** 2026-08-05

## Shared understanding

Feature 025 is a focused density revision for the Practical Dutch topic list
and its focused lesson player. It preserves the existing Practical Dutch
content package, A1/A2 lesson identities, lesson progression, local progress,
LearningRecordStore boundary, support content, and DutchMate visual language.

The canonical learner-facing term is **Practical Dutch topic**, not pack. A
topic is the reviewed A1/A2 pair; its content package remains an implementation
boundary in the bundled content catalog.

The four-step **lesson stage rail** remains a gated status indicator for Read,
Notice, Practise, and Keep. It is not a clickable stage filter, a second
practice mode, or an independent progress system.

## Problem

The current Practical Dutch topic list spends vertical space on repeated
metadata, nested level cards, descriptions, and persistent status copy. The
focused lesson player spends space on a full exit row, large stage and title
chrome, repeated per-line translation controls, and nested content framing.
This makes the 390×600 popup harder to scan and increases unnecessary scrolling.

## Outcome

A learner can:

- identify a Practical Dutch topic from a compact three-row topic component;
- open either A1 or A2 with progress visible through compact row state;
- enter a lesson through a compact back header and a smaller stage rail;
- read all authored context lines in the current pilot without scrolling when
  the 390×600 viewport permits and translations are hidden;
- reveal optional English and Telugu support for Read and Notice with one
  session-local control;
- complete or resume all four stages without changing lesson evidence or
  progress semantics.

## Decisions

### Scope

- Change only the Practical Dutch topic list and Practical Dutch lesson player.
- Leave the Lessons hub, legacy Lesson library, Verb Journeys, Saved, Today,
  and global shared behavior unchanged unless a compatible opt-in variant is
  required by the Practical Dutch surface.
- Do not change authored content, lesson pedagogy, content identities,
  completion state, scheduler/evidence meaning, or storage migrations.

### Topic list

- Render each topic as exactly three primary visible rows: topic heading, A1
  lesson, and A2 lesson.
- Keep the topic title only in the heading row. Remove the pathway eyebrow,
  description, “Choose a level,” duration, and persistent restart copy.
- Use the existing border, orange accent, typography, spacing, focus, hover,
  and completion tokens. Do not introduce a new visual language.
- Keep each lesson row fully clickable and keyboard operable, with an A1/A2
  badge, one-line readable title, one compact status affordance, and chevron.
- Show no visible status text for a ready row, compact `Continue` for an
  in-progress row, and a check icon for a completed row. Accessible labels may
  still identify Start, Continue, or Restart.
- Preserve the current lesson-progress lookup and completed-lesson behavior.
- Reduce the page header to the existing back-navigation pattern and
  `Practical Dutch`; do not retain repeated explanatory copy.
- Stack multiple topic components with the existing page gap and never add an
  inner scroll region to a topic.

### Focused lesson shell

- Replace the full `Exit lesson` row with a compact `← Practical Dutch` back
  action and the current CEFR level at the opposite side.
- Keep the primary Today/Lessons/Saved navigation hidden during the focused
  lesson, matching the existing focused-flow behavior. Do not change it on
  other surfaces.
- Keep the existing popup content region as the only vertical scroll region.
  Do not introduce a nested scrollable card, clipped focus target, horizontal
  overflow, or content hidden behind fixed UI.
- Reduce the stage rail to the closest existing 36–40px compact treatment.
  Preserve the four labels, current-stage styling, accessible current-stage
  announcement, and gated progression; do not add arbitrary stage jumping.
- Reduce outer lesson framing and use existing spacing/card tokens. Keep
  touch targets at least 44×44 CSS pixels.

### Read and Notice support

- Combine stage, CEFR level, and title into a compact header. The title remains
  the Dutch lesson title without a duplicated large level prefix.
- Preserve every authored context line. The current pilot has four lines per
  lesson; the zero-scroll target applies to the full authored set where the
  standard 390×600 viewport permits, not to an artificially reduced excerpt.
- Replace per-line `Show English and Telugu` controls with one
  `Show translations` / `Hide translations` control.
- Use one session-local visibility state across Read and Notice. When hidden,
  omit optional English/Telugu helper lines; when shown, render the authored
  English and Telugu support with clear `EN` and `TE` labels.
- Keep the essential Notice teaching explanation visible even when optional
  helper translations are hidden.
- Use the current fixed bridge/native language roles and authored `{nl,en,te}`
  content. Do not add a new global language setting or persistence key.
- Keep Dutch sentence text readable and use subtle dividers/spacing rather
  than nested sentence cards.

### Practise and Keep

- Apply the compact shell, stage rail, title hierarchy, spacing, and content
  framing consistently to Practise and Keep.
- Keep exercise prompt, feedback, accepted-answer, evidence, and persistence
  semantics unchanged.
- Keep existing Practise/Keep support content; the Read/Notice translation
  visibility control must not alter exercise meaning.
- Keep answer controls at accessible touch height and place feedback near the
  action that produced it.
- Make Keep concise while retaining the existing review-selection behavior and
  clear primary/secondary actions.

## Implementation seams

Prefer the existing popup renderer and lesson-session seams:

- Practical Dutch topic rendering and lesson-row status derive from the
  current content catalog and `lessonProgressById`.
- The focused shell remains in the existing lesson renderer and uses the
  current back, lesson-stage, and popup-content structure.
- Translation visibility belongs in the existing `LessonSession` state and
  is reset when a new lesson session starts; it is not learner history.
- Read and Notice views consume the same visibility state while Practise and
  Keep retain their existing authored support.
- CSS changes should extend existing compact row/card/rail patterns and
  `--dm-*` design tokens rather than adding global replacements.

## Delivery sequence

1. Audit the existing renderer, tokens, popup shell, lesson states, and focused
   flow; record the 390×600 baseline.
2. Replace the topic list card with the three-row topic component and add
   status-state coverage.
3. Compact the focused shell, back action, stage rail, and scroll behavior.
4. Add session-local Read/Notice translation visibility and compact sentence
   rendering.
5. Apply the same shell and spacing rhythm to Notice, Practise, and Keep.
6. Run focused regression, accessibility, viewport, type, build, and release
   checks; record before/after viewport measurements.

## Acceptance criteria

### Topic list

- [ ] Every topic has exactly one heading row and two lesson rows.
- [ ] Removed metadata does not reappear in the topic component.
- [ ] A1/A2 titles remain readable without collision at the reference width.
- [ ] Rows work by pointer, Enter, Space, and assistive technology.
- [ ] Ready, Continue, and completed states use the agreed compact affordances.
- [ ] Existing tokens and interaction states are reused.

### Lesson shell

- [ ] No standalone full-width `Exit lesson` row remains.
- [ ] The compact back action returns to Practical Dutch and preserves the
      existing focused-flow contract.
- [ ] The stage rail remains visible, compact, labelled, and gated.
- [ ] Only the existing main lesson content region scrolls.
- [ ] No content or keyboard focus is clipped at the popup boundaries.
- [ ] Interactive targets remain at least 44×44 CSS pixels.

### Read and Notice

- [ ] Stage, CEFR level, and title form one compact header.
- [ ] All authored pilot context lines remain present.
- [ ] One control reveals or hides optional English/Telugu support for Read and
      Notice.
- [ ] No per-sentence translation reveal links remain in Read.
- [ ] Three/four-line pilot content fits without user scroll when the target
      viewport permits and translations are hidden.
- [ ] Expanded support is clearly labelled `EN` and `TE` and remains readable.
- [ ] Longer content scrolls in the main region without clipping or horizontal
      overflow.

### Regression

- [ ] Lesson progress, completion, resume, restart, A1/A2 routing, and local
      learning evidence are unchanged.
- [ ] Practise and Keep behavior and support content remain meaningful.
- [ ] Lessons hub, legacy lessons, Verb Journeys, Today, and Saved are
      unaffected outside intentional compatible variants.
- [ ] Chromium and Firefox popup smoke paths pass.

## Verification plan

- Unit/component checks cover three-row rendering, all progress states,
  translation visibility, title overflow, keyboard activation, and stage-rail
  accessibility.
- Integration checks cover opening A1/A2, resume, completion, completed-row
  restart, translation visibility across Read/Notice, return to the topic, and
  status refresh.
- Manual viewport checks cover 80%, 100%, 125%, and 150% browser zoom, long
  titles, long translations, keyboard-only flow, and assistive-technology
  announcements.
- Capture before/after states for topic list, Read hidden/shown, Notice,
  Practise unanswered/feedback, and Keep; record approximate vertical savings.
- Run focused popup tests, typecheck, the relevant full test suite, extension
  builds for Chromium and Firefox, formatting/whitespace checks, and the
  repository release verification command required by the workflow.

## Out of scope

- A new Lessons destination, content service, translation service, or storage
  migration.
- Changes to Practical Dutch authored content or the learning triangle.
- New stage jumping, adaptive lesson branching, gamification, animation, or
  desktop-width layouts.
- A global translation-display preference or new support-language settings.
- A redesign of shared surfaces without an explicitly verified compatible
  variant.

## Approval gate

This plan captures the shared understanding reached through `grill-with-docs`.
`to-spec` and `to-tickets` have not been run. They require explicit user
approval before their documents are created or published.
