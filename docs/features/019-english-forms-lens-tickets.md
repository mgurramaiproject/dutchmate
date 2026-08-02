# Feature 019: English Forms Lens Tickets

**Codename:** `english-forms-lens`
**Parent issue:** [#153](https://github.com/mgurramaiproject/dutchmate/issues/153)
**Plan:** [019-english-forms-lens-plan.md](./019-english-forms-lens-plan.md)
**Spec:** [019-english-forms-lens-spec.md](./019-english-forms-lens-spec.md)

## Dependency order

| Ticket | GitHub issue | Title | Blocked by |
|---|---:|---|---|
| T01 | [#154](https://github.com/mgurramaiproject/dutchmate/issues/154) | Expand the versioned English comparison content contract | None |
| T02 | [#155](https://github.com/mgurramaiproject/dutchmate/issues/155) | Ship the `werken` English comparison lens | #154 |
| T03 | [#156](https://github.com/mgurramaiproject/dutchmate/issues/156) | Complete `zijn` and `hebben` lens coverage | #155 |
| T04 | [#157](https://github.com/mgurramaiproject/dutchmate/issues/157) | Qualify and hand off Feature 019 | #156 |

T01 is the intentional expand-stage exception for the shared versioned
content contract. T02 and T03 are learner-facing vertical slices; T04 is the
release qualification and handoff gate.

## Implementation status

- [x] T01 — Expand the versioned English comparison content contract
- [x] T02 — Ship the `werken` English comparison lens
- [x] T03 — Complete `zijn` and `hebben` lens coverage
- [x] T04 — Qualify and hand off Feature 019

The full acceptance criteria and blocker text live in the per-ticket
documents and matching GitHub issues:

- [T01](./019-english-forms-lens-t01.md)
- [T02](./019-english-forms-lens-t02.md)
- [T03](./019-english-forms-lens-t03.md)
- [T04](./019-english-forms-lens-t04.md)

All child issues are open and labeled `ready-for-agent`. The parent issue was
not modified or closed.
