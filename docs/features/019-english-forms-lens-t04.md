# Feature 019 T04 — Qualify and hand off Feature 019

**Parent:** [Feature 019: English Forms Lens #153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**GitHub issue:** [#157](https://github.com/mgurramaiproject/dutchmate/issues/157)

## What to build

Complete the release qualification for the English comparison lens across
`werken`, `zijn`, and `hebben`. The feature is ready for implementation
handoff only when the popup behaviour has been checked in supported browsers
and zoom levels, the visible NL/EN/TE content has passed independent language
review, and the repository and tracker evidence agree.

## Acceptance criteria

- [ ] Manual QA passes the default popup, 110% and 125% zoom, Firefox, and the
      supported Chromium-based browser without clipping, overlap, obstruction,
      horizontal scroll, or broken focus.
- [ ] Accessibility QA covers keyboard navigation, visible focus, tab and card
      state, accessible form badges, cues, disclosure controls, and Previous /
      Next boundaries.
- [ ] Independent review records English/Telugu clarity, literal NL/EN/TE
      alignment, fluent-Dutch review, reviewer names, dates, and sources for
      all visible comparison records in the three active packs.
- [ ] Focused tests, full relevant tests, typecheck, build, and whitespace
      checks pass.
- [ ] The feature plan, spec, ADR/glossary updates, qualification evidence,
      and issue checklists agree with the delivered behaviour.
- [ ] GitHub and Delivery state are reconciled for the child tickets and the
      parent issue remains unchanged except for normal external workflow state.

## Blocked by

- [T03 — Complete `zijn` and `hebben` lens coverage](https://github.com/mgurramaiproject/dutchmate/issues/156)

**Status:** ready-for-agent
