# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repo root, or
- `CONTEXT-MAP.md` at the repo root if it exists
- `docs/adr/` for architectural decisions that touch the area being changed

If any of these files don't exist, proceed silently.

## File structure

This repo is configured as a single-context repo.

```text
/
|- CONTEXT.md
|- docs/adr/
`- src/
```

## Use the glossary's vocabulary

When naming domain concepts, prefer the terms defined in `CONTEXT.md` if it exists.

## Flag ADR conflicts

If a proposed change conflicts with an ADR, surface that explicitly instead of silently overriding it.
