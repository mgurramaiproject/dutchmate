# Feature 019 T02 — Ship the `werken` English comparison lens

**Parent:** [Feature 019: English Forms Lens #153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**GitHub issue:** [#155](https://github.com/mgurramaiproject/dutchmate/issues/155)

## What to build

Ship the complete learner-facing English comparison lens for `werken`. A
learner can open the lens from the Verb Journey or selected Dutch form, scan a
four-card period list, open Dual-Dutch detail, move through all twelve forms,
and return to the existing Dutch Map or practice flow without leaving the
popup.

## Acceptance criteria

- [ ] The `werken` pack provides all twelve reviewed comparison records with
      two distinct Dutch roles, complete NL/EN/TE content, Dutch form badges,
      and authored cues.
- [ ] The list shows Present 1–4, Past 5–8, or Future 9–12, with each
      collapsed card showing only the required English and Everyday Dutch
      content plus its Cue line.
- [ ] Selecting a card opens Dual-Dutch detail with separately labelled
      Meaning-preserving Dutch and Everyday Dutch blocks, each rendered in
      NL, EN, TE order with its role-specific form badge.
- [ ] Matching Dutch sentences remain visible in both detail blocks, and cue,
      construction, and difference explanations are shown without arbitrary
      text parsing.
- [ ] Detail Previous and Next traverse all twelve forms; Back restores the
      prior period, scroll position, originating focus, and selected state.
- [ ] The inline information action and nearby eight-form Dutch map link work
      inside the popup, and existing journey, map, and practice actions remain
      available.
- [ ] Keyboard activation, visible focus, accessible names, active-period
      state, and non-colour status cues work through the popup integration
      seam.
- [ ] Focused content and popup tests, typecheck, and whitespace checks pass.

## Blocked by

- [T01 — Expand the versioned English comparison content contract](https://github.com/mgurramaiproject/dutchmate/issues/154)

**Status:** ready-for-agent
