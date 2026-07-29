# v1.1 implementation status

The implementation checklist is retained as the source checklist. This ledger
records evidence for this pass and makes manual blockers explicit.

## Verified in this pass

- Handoff docs, tokens, brand SVGs, raster mark exports, and reference site are
  copied under `docs/design-system-v1.1/`.
- Runtime token CSS and shared primitives are available under
  `src/design-system/` and imported by popup, Options, and website CSS.
- Popup, tooltip, Options, and website use the v1.1 semantic palette/type
  foundation without changing their existing state or storage boundaries.
- Popup remains 390 × 600 with exactly Today, Lessons, and Saved navigation.
- Existing Week/Month/Year rhythm, focused lesson/review flows, Saved Quiz,
  tooltip, Context Mission, and popup settings remain present.
- v1.1 mark/lockup and 16/32/48/128 raster icons are used by runtime surfaces
  and manifest packaging.
- Internal mastery state `strong` remains stored as-is; the learner-facing
  label is `Secure`.
- `corepack pnpm test`: 97 files, 619 tests passed.
- `corepack pnpm typecheck` passed.
- `corepack pnpm build:chrome` and `corepack pnpm build:firefox` passed.
- `corepack pnpm verify:release` passed for Chrome and Firefox packages.
- `git diff --check` passed.
- The Options stylesheet's avoidable literal colour declarations were removed;
  remaining legacy declarations in popup, tooltip, and website layers are
  compatibility overrides beneath the semantic v1.1 layer.

## Explicit blockers / remaining manual evidence

- Rendered contrast, actual Nunito/Noto font availability, toolbar legibility
  in light/dark browser chrome, 200% popup zoom, 400% Options reflow, touch
  completion, and screen-reader announcements require browser/device/manual
  evidence not available in the current headless test harness.
- The website and extension surfaces need a real browser clickthrough after
  reload to verify geometry at the target sizes; automated DOM/build checks do
  not prove visual containment.

## Intentional deviations

- Font files are not bundled in this pass; the runtime uses the specified
  Nunito Sans, Noto Sans, and Noto Sans Telugu stacks with system fallbacks.
  Actual font availability remains a manual verification item.
- Existing Options section names and boundaries remain intact so no setting is
  relocated, renamed, duplicated, or removed. The handoff's suggested grouping
  is treated as a visual direction, not permission to change the information
  architecture.
- Reference-site-only product concepts were documented in the preservation
  matrix and were not added to the extension.
