# Feature 019 T01 — Expand the versioned English comparison content contract

**Parent:** [Feature 019: English Forms Lens #153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**GitHub issue:** [#154](https://github.com/mgurramaiproject/dutchmate/issues/154)

## What to build

Add the additive, versioned content contract that can represent the English
comparison lens without invalidating existing Verb Journey packs or learner
history. The contract must support two separately labelled Dutch comparison
roles, complete NL/EN/TE records, a Dutch form identity per role, and one
authored Cue per English form. Existing comparison consumers remain usable
during this expand stage.

## Acceptance criteria

- [x] A new content version supports two distinct Dutch comparison roles for
      every English form, each with complete NL/EN/TE content and a Dutch form
      identity.
- [x] Every English form can store an authored Cue with display text, short
      meaning, bounded kind, and safe authored token information.
- [x] Pack validation rejects missing role content, invalid Dutch form
      identities, missing cues, duplicate English identities, invalid group
      counts, and incomplete localized values.
- [x] The active `werken`, `zijn`, and `hebben` packs remain compatible with
      stable form IDs, evidence keys, exports, and learner history.
- [x] Matching Meaning-preserving Dutch and Everyday Dutch records remain
      distinct rather than being deduplicated.
- [x] Existing comparison rendering and relevant tests remain green while the
      additive contract is introduced.

## Blocked by

None — can start immediately.

**Status:** ready-for-agent
