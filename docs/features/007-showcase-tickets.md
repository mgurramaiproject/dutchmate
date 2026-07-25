# Tickets: 007-showcase

Implementation frontier for [007-showcase-spec.md](./007-showcase-spec.md), tracked by [issue #79](https://github.com/mgurramaiproject/dutchmate/issues/79) and [PR #80](https://github.com/mgurramaiproject/dutchmate/pull/80). The feature remains on `feature-007-showcase` until review and merge are complete.

## T01 — Stage the 0.4.0 showcase assets and release copy

**Blocked by:** None.

- [x] Copy all 14 supplied screenshots into `frontend/assets/screenshots/` with the normalized `007-showcase-040-` names.
- [x] Preserve the source screenshot folder outside the repository and do not reference it at runtime.
- [x] Track the feature-prefixed Firefox release note and use it as the homepage factual-copy source.
- [x] Confirm no old screenshot asset is referenced by the frontend pages; the older files remain only for existing README references.

## T02 — Build the responsive reading-flow gallery

**Blocked by:** T01.

- [x] Replace the old six-card section under “See DutchMate in real reading flow” with all 14 release screenshots.
- [x] Present the three approved stories with lead visuals, supporting cards, captions, and full-size image links.
- [x] Keep image content intact with contain-style sizing, responsive layout, visible focus, and no horizontal overflow.
- [x] Provide accurate alt text and concise captions that explain the learner value rather than repeating filenames.
- [x] Keep the gallery usable without JavaScript, auto-rotation, or a modal.

## T03 — Refresh the 0.4.0 conversion surface

**Blocked by:** T02.

- [x] Update title, description, Open Graph, Twitter, hero, feature, availability, and footer copy for 0.4.0.
- [x] Use the approved core message: “Read Dutch in context. Understand more. Keep the words that matter.”
- [x] Make the Firefox install CTA direct and consistent with the official Add-ons destination.
- [x] State the local/no-account/no-subscription boundary clearly without overstating privacy or product scope.
- [x] Retain the existing OG image after visual implementation review found it not materially misleading.

## T04 — Verify and hand off 007-showcase

**Blocked by:** T01, T02, and T03.

- [x] Run the frontend/public-site checks, full relevant test suite, `git diff --check`, and the appropriate build verification. Evidence: 92 test files / 560 tests, typecheck, and whitespace check pass.
- [x] Inspect the page at desktop and narrow/mobile widths for image containment, caption readability, focus visibility, and CTA clarity. Evidence: headless Chrome captures at 1440px and 390px widths.
- [x] Confirm all local asset links resolve and no external source-folder paths remain. Evidence: Vite served the homepage and the browser-popup asset with HTTP 200.
- [x] Update this checklist with direct evidence and commit the complete feature using the repository commit convention. Implementation is committed as `fdc333c`; tracker reconciliation is recorded in the follow-up docs commit.
- [x] Reconcile the GitHub issue/Delivery state and open the PR according to the repository workflow when remote access is available. Issue #79 is open with `enhancement`; PR #80 is open; Delivery is `In Review` with `Execution=Agent`.

## T05 — Open story screenshots in an on-page lightbox

**Blocked by:** T02.

- [x] Clicking a screenshot opens a native dialog on the homepage instead of navigating away.
- [x] Previous and next controls cycle only through the current story group.
- [x] `Esc`, the close button, and backdrop clicks close the dialog and restore focus to the triggering image.
- [x] Arrow keys navigate the open story; direct image links remain the no-JavaScript fallback.
- [x] Lightbox controls and image containment remain usable at desktop and narrow/mobile widths. Browser-level CDP verification passed at 390px and 1440px page widths.

**T05 evidence:** Headless Chrome opened the first story at `1 of 7`, moved to `2 of 7` with ArrowRight, and closed with Escape while restoring focus to the original trigger. `node --check frontend/007-showcase-gallery.js`, focused public-site tests, full tests, typecheck, release verification, and `git diff --check` pass.
