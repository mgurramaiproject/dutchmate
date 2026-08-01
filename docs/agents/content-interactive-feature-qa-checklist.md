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
- [ ] Incorrect answers have a real retry/reset path and do not create false completion.
- [ ] Repeated tokens/options are treated as distinct occurrences.
- [ ] Completion and mastery/evidence remain separate concepts.
- [ ] Existing navigation, design tokens, accessibility, and narrow layouts remain intact.

## Verification evidence

- [ ] Content/schema tests cover counts, IDs, references, targets, required translations, and forbidden content.
- [ ] Pure logic tests cover answer checking, question routing, repair limits, and evidence/status transitions.
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
