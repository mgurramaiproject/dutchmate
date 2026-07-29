# DutchMate Design System v1.1

This package is the implementation handoff for DutchMate’s brand, interface,
learning flows, accessibility rules, and product UX.

Start with:

1. `DUTCHMATE_DESIGN_SYSTEM.md` — normative product and visual specification.
2. `CODEX_IMPLEMENTATION_PROMPT.md` — ready-to-paste task for Codex CLI.
3. `tokens/` — production CSS variables and machine-readable JSON.
4. `brand/` — SVG logo family and browser-icon PNG exports.
5. `IMPLEMENTATION_CHECKLIST.md` — acceptance criteria.
6. `reference-site/` — the React/CSS source behind the interactive reference.

Interactive reference:

https://dutchmate-design-system.spintothemoon.chatgpt.site

## How to hand this to Codex CLI

Place this folder inside or beside the DutchMate repository, start Codex CLI in
the repository, and paste the contents of `CODEX_IMPLEMENTATION_PROMPT.md`.

Codex should treat the files in this order of authority:

1. Existing functional contracts, privacy requirements, and data integrity in
   the DutchMate repository.
2. `DUTCHMATE_DESIGN_SYSTEM.md`.
3. `tokens/dutchmate-tokens.css` and `.json`.
4. `IMPLEMENTATION_CHECKLIST.md`.
5. `reference-site/` and the interactive site as visual examples.

The reference-site source illustrates appearance and flow. It is not a request
to replace DutchMate’s architecture, copy its React structure into the
extension, or remove/rearrange existing UI. The repository is authoritative
for current buttons, sections, heatmaps, settings, state, and behavior.

Codex must first inventory the current UI and create a preservation matrix.
Every existing element and interaction is preserved by default. Removing,
merging, relocating, or changing one requires an explicitly approved product
change; visual consistency alone is not sufficient reason.

The first Codex implementation pass is therefore a one-to-one visual retrofit.
Anything present only in the clickthrough is a future product proposal, not an
automatic implementation requirement.

## Product boundary

DutchMate remains deterministic and local-first. It must not require a runtime
LLM, fabricate learning progress, add points/lives as empty gamification, or
create separate top-level destinations for Grammar, Verb Gym, or Sentence
Forge.

Version: 1.1  
Handoff date: 2026-07-29
