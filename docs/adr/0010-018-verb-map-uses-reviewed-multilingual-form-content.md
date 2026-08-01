# Feature 018: Verb Map uses reviewed multilingual form content

Status: accepted

## Context

The Verb Map is a narrow 4 × 2 reference surface. Its current cards spend
space on repeated Dutch full names and status words, while the learner-facing
English and Telugu examples are incomplete or absent. The product decision is
to keep full NL/EN/TE examples visible in every card without turning the map
into a separate reading or translation surface.

The map is shared by the `werken`, `zijn`, and `hebben` packs. The same content
must therefore be usable in both the compact card and the selected detail
panel, and it must not weaken the existing five-status evidence semantics.

## Decision

Each shipped form record owns one reviewed localized canonical example and one
reviewed localized common-use example, each with required `nl`, `en`, and `te`
values. The map card and detail panel render these same records. Runtime
translation and missing-content fallbacks are not part of the contract.

The compact map projects the five internal statuses into three visible symbols:
mastered (`✓`), current/next (`›`), and later/reference (`○`). Precise status
meaning remains available through accessible labels and the detail surface.

## Consequences

- All active packs need complete, qualified multilingual form content before
  this surface can ship.
- The map remains a stable reference and does not create a new progress or
  translation system.
- Card density increases, so concise authored examples, equal row heights,
  zoom checks, and longest-content visual QA become release requirements.
- Future authoring must qualify content independently from structural tests.
- Telugu gender variants and phonetic helpers remain separate decisions rather
  than becoming hidden complexity in every map record.

## Alternatives considered

- Showing full translations only in the detail panel would preserve density but
  would not satisfy the approved at-a-glance multilingual map goal.
- Replacing the five internal statuses with three statuses would simplify the
  UI at the cost of changing progression meaning and learner history semantics.
- Keeping separate card and detail translation fields would allow drift and
  make pack validation weaker.
