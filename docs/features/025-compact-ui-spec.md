# Feature 025 — Practical Dutch Compact UI Specification

**Codename:** `compact-ui`
**Feature:** 025
**Status:** Spec approved for publication
**Plan:** [025-compact-ui-plan.md](./025-compact-ui-plan.md)
**Prepared:** 2026-08-05

## Problem Statement

As a DutchMate learner, I can reach Practical Dutch, but the topic list and
focused lesson player spend too much of the 390×600 popup on repeated labels,
large headings, nested cards, a dedicated exit row, and repeated translation
controls. This makes it harder to compare A1 and A2 choices and harder to see
the actual lesson content without scrolling.

The current Practical Dutch topic is a reviewed A1/A2 pair. Its content,
progress, local evidence, and four-stage lesson progression already work. The
problem is the presentation density and hierarchy, not the content model or
learning contract.

## Solution

Make the Practical Dutch topic list and focused lesson player compact while
preserving DutchMate's existing design system and learning architecture.

Each Practical Dutch topic becomes one bordered three-row component: a topic
heading, an A1 lesson row, and an A2 lesson row. Nonessential pathway,
description, duration, instructional, and persistent restart copy leaves the
selection surface. Lesson state remains visible through compact affordances
and accessible labels.

The focused lesson replaces the full `Exit lesson` row with a compact
`← Practical Dutch` back action and CEFR level. The existing four-stage lesson
stage rail remains a compact gated status indicator. The existing popup content
region remains the only vertical scroll region, and the focused lesson keeps
the existing hidden global bottom navigation behavior.

Read and Notice use a compact header and one session-local translation
visibility control. The control reveals or hides optional authored English and
Telugu support together. All authored context lines remain present; the
current four-line pilot is not shortened to meet a density target. Practise
and Keep retain their current exercise support, feedback, evidence, and
completion semantics.

## User Stories

1. As a DutchMate learner, I want to see Practical Dutch in the existing Lessons area, so that I can learn everyday situations without learning a new navigation model.
2. As a DutchMate learner, I want each Practical Dutch topic to appear as one compact unit, so that I can understand the relationship between its A1 and A2 lessons.
3. As a DutchMate learner, I want a topic heading to show only the topic name, so that I can identify the situation quickly.
4. As a DutchMate learner, I want the topic list to omit repeated pathway and description copy, so that useful lesson choices appear sooner.
5. As a DutchMate learner, I want each topic to contain exactly one heading row and two lesson rows, so that the information hierarchy is predictable.
6. As a DutchMate learner, I want the A1 and A2 labels to remain visible, so that I can choose the level intentionally.
7. As a DutchMate learner, I want the lesson title to remain readable in a compact row, so that I can choose a lesson without opening it first.
8. As a DutchMate learner, I want a ready lesson row to stay visually quiet, so that the title and chevron carry the choice.
9. As a DutchMate learner, I want an in-progress row to say `Continue` compactly, so that I know which lesson can be resumed.
10. As a DutchMate learner, I want a completed row to use a check affordance instead of persistent restart copy, so that completion is visible without adding another text block.
11. As a DutchMate learner, I want the full lesson row to be clickable, so that I do not have to target a small nested control.
12. As a keyboard learner, I want to activate a lesson row with Enter or Space, so that the compact layout remains fully operable without a pointer.
13. As a screen-reader learner, I want a lesson row to announce whether it will start, continue, or restart a lesson, so that compact visible copy does not remove essential meaning.
14. As a DutchMate learner, I want the topic list to keep the existing back-navigation pattern, so that I can return to Lessons without learning a new control.
15. As a DutchMate learner, I want multiple topics to stack with a predictable gap, so that the list remains scannable as more topics are added.
16. As a DutchMate learner, I want each topic to remain one interaction unit without its own scrollbar, so that scrolling behavior stays simple.
17. As a DutchMate learner, I want to enter a lesson through a compact back header, so that the lesson content begins sooner.
18. As a DutchMate learner, I want the compact back action to return to Practical Dutch, so that I retain my place in the topic list.
19. As a DutchMate learner, I want the current CEFR level to remain visible in the lesson header, so that I know which lesson I am studying.
20. As a DutchMate learner, I want the global Today/Lessons/Saved navigation to remain out of the focused lesson, so that lesson chrome does not consume content space.
21. As a DutchMate learner, I want the four lesson stages to remain visible, so that I understand where I am in the lesson.
22. As a DutchMate learner, I want the stage rail to distinguish the current stage with existing DutchMate styling, so that I can orient myself quickly.
23. As a DutchMate learner, I want stage progression to remain gated by the lesson, so that compactness does not accidentally allow unsupported stage jumping.
24. As a screen-reader learner, I want the current stage to be announced semantically, so that the visual rail has an accessible equivalent.
25. As a DutchMate learner, I want the stage rail to use less vertical space, so that more learning content appears in the popup.
26. As a DutchMate learner, I want the lesson content to have one vertical scroll region, so that I do not have to discover which nested card scrolls.
27. As a keyboard learner, I want focusable controls to remain reachable when content is long, so that compact styling never clips keyboard focus.
28. As a DutchMate learner, I want the lesson to preserve the existing black, cream, orange, border, typography, and radius language, so that the compact view still feels like DutchMate.
29. As a DutchMate learner, I want the compact layout to preserve 44×44 CSS-pixel touch targets, so that density does not make controls difficult to use.
30. As a DutchMate learner, I want the Read stage to combine its stage label, CEFR level, and title into one compact header, so that the lesson topic does not dominate the viewport.
31. As a DutchMate learner, I want the Dutch lesson title to remain prominent but popup-appropriate, so that I can understand the situation without losing room for the micro-story.
32. As a DutchMate learner, I want all authored Read-stage context lines to remain available, so that compactness does not remove part of the reviewed micro-story.
33. As a DutchMate learner, I want the current four-line pilot to fit without scrolling when the viewport permits and support translations are hidden, so that I can read the initial situation in one glance.
34. As a DutchMate learner, I want one `Show translations` control for the Read stage, so that I do not have to operate a repeated control after every sentence.
35. As a DutchMate learner, I want one `Hide translations` control after revealing support, so that I can return to the compact Dutch-first view.
36. As a DutchMate learner, I want the translation control to affect all Read context lines together, so that support visibility is predictable.
37. As a DutchMate learner, I want English and Telugu support to be labelled `EN` and `TE`, so that I can identify each language quickly.
38. As a DutchMate learner, I want optional support translations to remain hidden until I request them, so that the Dutch micro-story remains the visual priority.
39. As a DutchMate learner, I want the same session-local support visibility state to apply to optional Notice helpers, so that the lesson does not change translation behavior unexpectedly between these stages.
40. As a DutchMate learner, I want essential Notice teaching explanation to remain visible when optional helpers are hidden, so that the language focus remains understandable.
41. As a DutchMate learner, I want translation visibility to reset for a new lesson session, so that a prior support choice does not become an unannounced global setting.
42. As a DutchMate learner, I want Practical Dutch to use the existing English and Telugu authored content, so that compact rendering does not introduce runtime translation or fallback behavior.
43. As a DutchMate learner, I want Practise prompts and feedback to retain their current support, so that the density revision does not change exercise meaning.
44. As a DutchMate learner, I want answer controls to remain easy to tap, so that compact Practise stages remain usable.
45. As a DutchMate learner, I want feedback to appear near the answer action, so that I can understand the result without searching below a large card.
46. As a DutchMate learner, I want Keep to retain the existing review-selection behavior, so that compactness does not change which learning items become eligible for review.
47. As a DutchMate learner, I want to resume an interrupted A1 lesson at its existing stage, so that a visual revision does not reset my progress.
48. As a DutchMate learner, I want to open A2 directly without an A1 lock, so that the current Practical Dutch routing contract remains unchanged.
49. As a DutchMate learner, I want a completed lesson row to open through the existing restart behavior, so that compact status presentation does not change completion semantics.
50. As a DutchMate learner, I want returning to the topic list to show refreshed lesson status, so that the row reflects the latest local progress.
51. As a DutchMate learner, I want longer future topic titles and translations to remain readable through the main scroll region, so that density never causes clipping or horizontal overflow.
52. As a DutchMate learner, I want the layout to remain usable at supported browser zoom levels, so that compactness does not assume one zoom setting.
53. As a DutchMate learner, I want the Lessons hub, legacy lessons, Verb Journeys, Today, and Saved surfaces to remain stable, so that this focused revision does not create unrelated visual regressions.
54. As a DutchMate learner, I want Chromium and Firefox popup flows to behave consistently, so that the compact experience is not browser-specific.
55. As a DutchMate product owner, I want the feature to reuse existing popup and learning seams, so that the revision does not create a parallel UI framework, state model, scheduler, or evidence store.

## Implementation Decisions

- The feature is limited to the Practical Dutch topic list and focused lesson
  player. Neighboring surfaces may receive only a verified compatible compact
  variant where reuse is necessary.
- The topic list uses a three-row structure: topic heading, A1 lesson row, and
  A2 lesson row. The topic remains an authored A1/A2 pair with stable lesson
  identities.
- Topic and lesson state continue to derive from the bundled content catalog
  and the existing lesson-progress boundary. No progress or content migration
  is introduced.
- Existing DutchMate design tokens and interaction states remain authoritative.
  New colors, a new font scale, new shadows, and global component replacements
  are not allowed.
- The lesson header uses the existing back-navigation language and shows the
  current CEFR level. The global bottom navigation remains hidden in a focused
  lesson, matching the current focused-flow contract.
- The lesson stage rail remains a compact, non-jumping status indicator for
  Read, Notice, Practise, and Keep. Stage progression remains lesson-defined.
- The existing popup content region remains the only vertical scroll region.
  No nested lesson-card scrolling, horizontal overflow, or clipped focus is
  allowed.
- The focused lesson session gains one transient translation-visibility state.
  It is initialized hidden for a new session and is not stored in learner
  history, extension settings, or a new storage key.
- Read and Notice consume the same visibility state for optional authored
  English/Telugu helpers. Essential Notice teaching copy and all Practise/Keep
  exercise support remain visible according to their existing behavior.
- Authored context lines, translations, exercises, accepted answers, feedback,
  stage progression, lesson completion, Saved-item selection, and local
  evidence meaning remain unchanged.
- All interactions remain semantic HTML controls with keyboard and assistive
  technology support. Compact visual rows may be smaller than their hit area
  only when the actual interactive target remains at least 44×44 CSS pixels.
- The highest application seam is the existing popup renderer and its DOM-level
  integration tests. The pure lesson-session state seam is used only for
  transient visibility and progression invariants that are clearer outside the
  renderer.

## Testing Decisions

- Tests verify observable learner behavior and accessible output rather than
  CSS implementation details or private renderer structure.
- The popup integration suite remains the primary seam. It will cover topic
  row count and content, ready/continue/completed states, pointer and keyboard
  activation, compact back behavior, hidden focused navigation, translation
  visibility, Read/Notice rendering, A1/A2 routing, resume, completion,
  restart, and return-state refresh.
- The lesson-session suite will cover the transient translation state,
  initialization/reset, shared Read/Notice visibility semantics, and the
  unchanged gated stage/evidence behavior.
- Existing style-contract checks may be updated only for meaningful public
  token/target contracts. They should not snapshot arbitrary declaration text
  as a substitute for behavior.
- Manual visual checks are required because viewport fit, one-scroll-region
  behavior, typography, and popup density are not fully observable in DOM
  assertions. Check 390×600 at 80%, 100%, 125%, and 150% zoom, long titles,
  long translations, keyboard-only navigation, and assistive-technology
  announcements.
- Before/after visual states should cover the topic list, Read translations
  hidden/shown, Notice, Practise unanswered/feedback, and Keep. Record
  approximate vertical savings and any intentional remaining scroll.
- Run focused popup tests, the relevant full test suite, typecheck, Chromium
  and Firefox extension builds, release verification, and whitespace checks.
- Regression tests must demonstrate that Today, Saved, Verb Journeys, the
  legacy Lesson library, local learning evidence, and existing content identity
  remain unchanged.

## Out of Scope

- A new Practical Dutch destination, new content service, runtime translation
  service, or remote content database.
- Changes to authored Practical Dutch content, the learning triangle, or lesson
  pedagogy.
- A new global translation-display preference, support-language setting, or
  storage migration.
- Clickable stage jumping, adaptive lesson branching, a second practice queue,
  a new mastery model, a new scheduler, or new evidence semantics.
- Gamification, animation, desktop-width layouts, or a redesign of the entire
  Lessons area.
- Removing authored context lines or shrinking readable text below the
  existing design-system minimum to avoid scrolling.

## Further Notes

- The current pilot contains four authored Read-stage context lines per lesson;
  the zero-scroll criterion applies to that complete content where the
  viewport permits.
- The domain glossary calls the learner-facing A1/A2 pair a Practical Dutch
  topic. “Content package” is reserved for the bundled authored-content
  implementation boundary.
- The plan deliberately keeps the focused lesson’s global bottom navigation
  hidden because the current focused-flow behavior already removes that
  vertical chrome.
- This spec is synthesized from the approved Feature 025 plan and the
  repository’s existing popup, lesson-session, content-catalog, and learning
  record seams.
