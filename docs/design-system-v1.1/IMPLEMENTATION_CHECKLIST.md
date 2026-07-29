# DutchMate implementation checklist

> Implementation evidence and explicit manual-QA blockers are tracked in
> [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Foundations

- [ ] CSS uses the provided semantic tokens; no avoidable one-off colours.
- [ ] Nunito Sans, Noto Sans, and Noto Sans Telugu are bundled or have tested
      fallbacks.
- [ ] Bright orange is not used as small text on paper.
- [ ] Focus and reduced-motion rules are global and consistent.
- [ ] Final rendered colour pairs are contrast-tested.

## Brand

- [ ] Mark, wordmark, and lockup are used according to the specification.
- [ ] Firefox/extension manifest points to correct raster icon sizes.
- [ ] Toolbar icon remains legible at 16 and 32 px in light/dark browser chrome.
- [ ] Brand mark is not recoloured, stretched, rotated, or shadowed.

## Popup

- [ ] Popup reference boundary is 390 × 600 px.
- [ ] Primary tabs are exactly Today, Lessons, and Saved.
- [ ] Quick Settings is secondary, not a fourth primary tab.
- [ ] Today preserves Week, Month, and Year learning-rhythm views.
- [ ] Previous/next period navigation, day descriptions, legend, and rhythm
      explanatory copy still work.
- [ ] Week/Month retain per-day calendar dates and recorded activity totals;
      Year retains its compact activity heatmap.
- [ ] Popup Settings contains Show page context, Daily review badge, and an
      Open Options page action—not the full Options form.
- [ ] Focused work hides distracting navigation and keeps Exit visible.
- [ ] One primary action is visually dominant per state.
- [ ] Content remains usable at 200% zoom.

## Learning

- [ ] Lessons use Read → Notice → Practise → Keep.
- [ ] Grammar Minute, Verb Gym, and Sentence Forge stay inside learning flows.
- [ ] Context Mission uses Translate → Practise → Return.
- [ ] Exercises and validation are deterministic/curated.
- [ ] No runtime LLM dependency is introduced.
- [ ] New/Learning/Familiar/Secure are tied to observable evidence.
- [ ] Recognition and recall are not conflated.
- [ ] No unsupported fluency or CEFR claims are shown.
- [ ] No points, lives, fake rewards, or guilt-driven streaks are added.

## Tooltip and Options

- [ ] Translation remains the fast first action.
- [ ] Dutch leads; English and optional Telugu are clear helper layers.
- [ ] Context practice returns focus/context to the webpage.
- [ ] Options covers General, Languages, Translation, Learning & data, Privacy.
- [ ] Every existing Options control and storage contract is preserved; no
      setting is duplicated into the popup unless named above.
- [ ] Import/export/reset/delete actions communicate scope and consequences.
- [ ] Privacy copy accurately reflects actual browser storage and provider use.

## Accessibility

- [ ] Primary targets and learning choices are at least 44 × 44 px.
- [ ] Keyboard order, focus movement, and focus restoration pass.
- [ ] Escape closes webpage coaching overlays.
- [ ] No interaction is drag-only, colour-only, hover-only, or audio-only.
- [ ] Feedback and important state changes are announced politely.
- [ ] Popup passes at 200% zoom; Options passes at 400% zoom/reflow.
- [ ] Reduced motion works without hiding state.
- [ ] Labels, roles, selected/current states, and errors are programmatic.
- [ ] Touch users can complete every primary flow.

## Reliability

- [ ] A preservation matrix covers every pre-existing visible control, section,
      state, and interaction before implementation begins.
- [ ] Clickthrough-only concepts are listed as future proposals and are not
      implemented during the one-to-one visual retrofit without approval.
- [ ] No existing element is removed, merged, relocated, renamed, or
      behaviorally changed without explicit product approval.
- [ ] Existing translation and review behavior still works.
- [ ] Existing user settings and vocabulary data are preserved or migrated.
- [ ] Empty, loading, offline, recoverable error, success, and destructive
      confirmation states are covered.
- [ ] Firefox build/package validation passes.
- [ ] Existing automated tests pass; new behavior has appropriate tests.
- [ ] Manual clickthrough covers Today, Daily Five, Lessons, Saved, Tooltip,
      Context Mission, Options, exit/back, and persistence.
- [ ] Any deviations from the handoff are documented.
