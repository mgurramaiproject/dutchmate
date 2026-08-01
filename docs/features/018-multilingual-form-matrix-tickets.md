# Feature 018: Multilingual 8-Form Matrix Tickets

**Codename:** `multilingual-form-matrix`
**Parent issue:** [#148](https://github.com/mgurramaiproject/dutchmate/issues/148)
**Design baseline:** [Feature 018 design mockup](./018-multilingual-form-matrix-mockup.html)

## Dependency order

| Ticket | Issue | Title | Blocked by |
| --- | --- | --- | --- |
| T01 | [#149](https://github.com/mgurramaiproject/dutchmate/issues/149) | Expand multilingual form-record contract | None |
| T02 | [#150](https://github.com/mgurramaiproject/dutchmate/issues/150) | Ship Map-first `werken` Verb Map | #149 |
| T03 | [#151](https://github.com/mgurramaiproject/dutchmate/issues/151) | Complete cross-pack coverage and qualification | #150 |

All three child issues are open and labeled `ready-for-agent`. The blocker
edges are recorded in each issue body because this repository uses GitHub
Issues as its tracker and does not require a separate local issue queue.

## T01 — Expand multilingual form-record contract

**Issue:** [#149](https://github.com/mgurramaiproject/dutchmate/issues/149)  
**Blocked by:** None — can start immediately

### What it delivers

An additive localized canonical/common-use content contract for the three
active Verb Journey packs. Existing form IDs, pack selection, evidence keys,
learner history, and consumers remain compatible during the expand phase.

### Acceptance criteria

- [x] Required NL, EN, and TE values are supported without runtime translation or
  missing-content fallbacks.
- [x] Pack validation rejects incomplete localized values, duplicate identities,
  dangling references, and incomplete eight-form packs.
- [x] Content tests cover `werken`, `zijn`, and `hebben` without changing stable
  pack or form identities.
- [x] No parallel scheduler, mastery model, translation service, or map is added.
- [x] Focused content tests, typecheck, and whitespace checks pass.

## T02 — Ship Map-first `werken` Verb Map

**Issue:** [#150](https://github.com/mgurramaiproject/dutchmate/issues/150)  
**Blocked by:** [#149](https://github.com/mgurramaiproject/dutchmate/issues/149)

### What it delivers

The approved Map-first design for `werken`: eight multilingual cards, the
three-symbol presentation mapping over five internal statuses, compact legend,
explicit row/column labels, selected detail panel, nearest scrolling,
accessibility, and preserved comparison/practice/navigation actions.

### Acceptance criteria

- Every `werken` card shows code, symbol, NL example, full EN translation, and
  full TE translation; visible redundant names/status words and `2 forms` are
  removed.
- The existing 4 × 2 map structure and explicit future viewpoint labels remain.
- The legend uses exactly `✓`, `›`, and `○`, while precise internal status and
  accessible meaning remain intact.
- Detail shows learner label, full Dutch name, NL/EN/TE canonical example,
  meaning, pattern, one localized common-use example, and existing actions.
- Keyboard activation, accessible labels, selected state, nearest scrolling,
  comparison, practice, and navigation work through the popup seam.
- Focused content/popup tests, typecheck, and whitespace checks pass.

## T03 — Complete cross-pack coverage and qualification

**Issue:** [#151](https://github.com/mgurramaiproject/dutchmate/issues/151)  
**Blocked by:** [#150](https://github.com/mgurramaiproject/dutchmate/issues/150)

### What it delivers

`zijn` and `hebben` use the shared Map-first surface with complete multilingual
content, and the whole Feature 018 release is qualified across content,
accessibility, layout, browser boundaries, learner history, and language review.

### Acceptance criteria

- Both remaining packs provide eight localized canonical and eight localized
  common-use records with stable identities.
- All three packs render the same card order, symbols, legend, labels, detail,
  accessibility, and nearest-scroll behaviour.
- Cross-pack tests prove 24 complete form records, 24 complete common-use
  records, stable evidence/history, and preserved actions.
- Manual QA passes default, 110%, and 125% zoom in Firefox and supported
  Chromium, including long Telugu content and no clipping or horizontal scroll.
- English/Telugu clarity, literal alignment, and independent fluent-Dutch
  review are recorded with reviewer, date, and sources.
- Full relevant tests, typecheck, build, and whitespace checks pass; the parent
  issue checklist and Delivery state are reconciled.
