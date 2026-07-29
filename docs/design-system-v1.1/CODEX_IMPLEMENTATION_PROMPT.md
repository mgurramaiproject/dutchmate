# Codex CLI implementation prompt

Implement the DutchMate Design System v1.1 in the existing DutchMate browser
extension repository.

Before changing code:

1. Read this complete handoff folder, especially
   `DUTCHMATE_DESIGN_SYSTEM.md`, `tokens/`, and
   `IMPLEMENTATION_CHECKLIST.md`.
2. Audit the repository’s current popup, selection/hover tooltip, Options page,
   website, manifest icons, local-storage contracts, tests, and documentation.
3. Produce a preservation matrix for every visible element and interaction in
   the popup, tooltip, and Options page. For each item record: current location,
   current behavior/data contract, visual treatment to apply, and verification.
4. Produce a concise mapping from existing files/components to the target
   design-system primitives and surfaces.
5. Identify functional behavior that must be preserved and any conflicts or
   migrations. Do not remove, merge, relocate, rename, or change working UI
   unless the user explicitly approves that product change.
6. Propose an incremental implementation plan and verification strategy.

Stop after the audit, preservation matrix, and plan. Wait for explicit approval
before editing the extension.

For the approved implementation, make the first pass a one-to-one visual-system
retrofit of the product that already exists. Apply tokens, typography, spacing,
brand, component styling, accessibility, and responsive behavior without
changing the information architecture or feature set. Treat elements or flows
shown only in the reference clickthrough as separate product proposals; list
them in a future-work section and do not add them automatically.

Then implement the approved retrofit in coherent stages:

1. Add semantic tokens, typography, focus, reduced-motion, and shared
   primitives.
2. Apply the shared popup shell and `Today · Lessons · Saved` navigation.
3. Restyle the existing focused review and lesson states without adding or
   removing top-level tabs.
4. Apply the system to the existing translation tooltip. Apply Context Mission
   styling only if that flow already exists or is separately approved.
5. Apply the same system to Options and the public website where applicable.
6. Replace brand assets and generate/use correct manifest icon sizes.
7. Verify keyboard, zoom, screen-reader semantics, touch targets, persistence,
   Firefox packaging, and existing tests.

Non-negotiable product constraints:

- Preserve translation as the fast primary interaction.
- Treat this handoff as a visual-system retrofit, not a replacement UI.
- Do not implement clickthrough-only concepts as new features during the visual
  retrofit; report them separately for product approval.
- Preserve all existing buttons, sections, content, data, flows, and settings by
  default, even when the reference clickthrough does not show every state.
- Preserve Today’s learning-rhythm component: Week, Month, and Year views,
  previous/next period navigation, per-day dates and recorded activity totals
  in Week/Month, the compact Year heatmap, legend, accessible day descriptions,
  and explanatory copy.
- Popup reference size is 390 × 600 px.
- Primary navigation is exactly `Today · Lessons · Saved`; Quick Settings is a
  secondary action.
- Popup Settings contains the existing high-frequency review preferences
  (`Show page context` and `Daily review badge`) plus `Open Options page`.
  Do not copy the full browser Options form into the popup.
- Preserve every existing browser Options setting and its storage semantics on
  the Options page. Restyle and group those settings without inventing,
  duplicating, or deleting controls.
- Grammar Minute, Verb Gym, and Sentence Forge are learning mechanics inside
  lessons or practice, not extra navigation destinations.
- The learning rail is `Read → Notice → Practise → Keep`.
- Context coaching is `Translate → Practise → Return`.
- Learning content and exercise generation are curated/deterministic in v1.
- No runtime LLM dependency.
- Learning records and settings remain local-first; do not store browsing
  history.
- Progress labels describe evidence: `New · Learning · Familiar · Secure`.
  Never infer CEFR level or fluency from clicks.
- Do not add fake gamification, guilt-driven streaks, lives, or unsupported
  proficiency claims.
- Dutch is visually primary. English and Telugu are helpers and must not
  compete with the Dutch content.
- Maintain one clear primary action per state and an obvious exit from focused
  work.
- Meet the accessibility acceptance criteria in the handoff.

Implementation rules:

- Adapt the design system to the repository’s actual framework and existing
  component boundaries; do not copy the reference site wholesale.
- When the reference site omits an existing repository feature, preserve the
  repository feature and apply the nearest compatible token/component styling.
- Use semantic tokens rather than scattered literal colours or dimensions.
- Keep unrelated changes out of scope.
- Preserve user data and provide a safe migration for changed stored schemas.
- Prefer shared primitives across popup, tooltip, Options, and website while
  respecting their different layout constraints.
- If a handoff detail conflicts with a real functional/security constraint,
  preserve correctness, document the conflict, and implement the closest
  compliant design.

Completion output:

- Summary of implemented changes.
- File-by-file mapping to the design system.
- Any intentional deviations and why.
- Tests and manual QA completed.
- Remaining risks or follow-up work.

Do not claim completion until every item in `IMPLEMENTATION_CHECKLIST.md` is
either verified or explicitly documented as blocked.
