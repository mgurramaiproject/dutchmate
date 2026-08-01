# Content and interactive-feature QA checklist

Use this checklist for a feature that combines authored content with a user flow, such as lessons, journeys, exercises, maps, or review surfaces. It complements the issue's acceptance criteria; it does not replace them.

## Source and scope

- [ ] Read the complete handoff/spec/ticket set, including every file in the relevant handoff directory.
- [ ] Identify the canonical source of truth and the exact files/seams to change.
- [ ] Record explicit inclusions and exclusions: learner perspective, supported forms, languages, audio/media, interaction type, CEFR range, and gating.
- [ ] Confirm content changes do not silently broaden the pedagogical scope.

## Authored content

- [ ] Every record has a stable ID and required learner-facing fields.
- [ ] Every example contains the intended target form or construction.
- [ ] Highlighted targets occur literally in the source sentence.
- [ ] English and other supported-language translations preserve the intended meaning.
- [ ] Situations, time markers, distractors, and feedback make the expected answer defensible.
- [ ] Vocabulary and grammar match the stated learner level.
- [ ] Content is reviewed for idiomatic language separately from technical schema validation.
- [ ] Content/version migration preserves existing learner history.

## Interaction and state

- [ ] The initial screen is non-empty and every visible action is clickable.
- [ ] The primary flow works end to end, including back, completion, and return navigation.
- [ ] Each content unit routes to its own exercises or detail state.
- [ ] Start, continue, review, completed, and unavailable states use truthful labels.
- [ ] Progress names one explicit unit and denominator: do not mix journey count, unique map-form count, and target-form-slot count.
- [ ] Progress is derived from pack metadata rather than hardcoded journey/form totals; duplicate-target and multi-target journeys have explicit expected contributions.
- [ ] Incorrect answers have a real retry/reset path and do not create false completion.
- [ ] Repeated tokens/options are treated as distinct occurrences.
- [ ] Completion and mastery/evidence remain separate concepts.
- [ ] After queued evidence writes or stale-write recovery, the canonical persisted record is refreshed before overview, directory, Today, or Daily Five summaries render.
- [ ] Multi-pack progress is calculated independently for every verb; evidence from one pack cannot change another pack's progress.
- [ ] Notice comparisons identify the current journey and nearby contrast in both visual treatment and learner-facing language; important grammar structures are highlighted consistently.
- [ ] Existing navigation, design tokens, accessibility, and narrow layouts remain intact.

### Multilingual map surfaces

For an authored map with localized form examples:

- [ ] Canonical and common-use NL/EN/TE records are single sources shared by cards and detail surfaces; no runtime translation or fallback copy is shipped.
- [ ] Cards show visible language prefixes, complete sentences, and a smaller but readable secondary treatment for EN/TE without routine ellipsis.
- [ ] The detail surface preserves the approved content order, keeps one localized common-use section, and scrolls into view with nearest-only behavior after selection.
- [ ] Internal status semantics remain intact behind the visual symbol mapping; the legend has visible names and symbols have precise accessible labels.
- [ ] Selected state is visible and exposed accessibly; the contract is checked across every registered verb pack, not only the newly authored verb.
- [ ] Long future/conditional and Telugu strings are checked in Chromium and Firefox at normal and 125% zoom with no clipping, horizontal overflow, or fixed-navigation obstruction.

## Verification evidence

- [ ] Content/schema tests cover counts, IDs, references, targets, required translations, and forbidden content.
- [ ] Pure logic tests cover answer checking, question routing, repair limits, and evidence/status transitions.
- [ ] Pure progress tests cover repeated map forms, multi-form journeys, empty evidence, and future-pack metadata without assuming the `werken` journey count.
- [ ] Integration tests cover the user flow, state labels, persistence/activity updates, and cross-screen return paths.
- [ ] Focused tests pass.
- [ ] Typecheck passes.
- [ ] Full test suite passes.
- [ ] Required build/package checks pass.
- [ ] Manual QA repeats the reported scenario and at least one adjacent shared state.
- [ ] Dutch/content review status is recorded: draft, language-reviewed, validated, or release-ready.

## Handoff

- [ ] All intentional changes are committed.
- [ ] Worktree is clean, or the exact blocker is reported.
- [ ] Handoff names the commit, verification evidence, remaining risks, and one recommended next action with the relevant skill.
