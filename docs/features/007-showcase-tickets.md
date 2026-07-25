# Tickets: 007-showcase

Implementation frontier for [007-showcase-spec.md](./007-showcase-spec.md). The feature remains on `feature-007-showcase` until all tickets are verified and the release handoff is complete.

## T01 — Stage the 0.4.0 showcase assets and release copy

**Blocked by:** None.

- [ ] Copy all 14 supplied screenshots into `frontend/assets/screenshots/` with the normalized `007-showcase-040-` names.
- [ ] Preserve the source screenshot folder outside the repository and do not reference it at runtime.
- [ ] Track the feature-prefixed Firefox release note and use it as the homepage factual-copy source.
- [ ] Confirm no old screenshot asset is needed by another frontend page before removing old references.

## T02 — Build the responsive reading-flow gallery

**Blocked by:** T01.

- [ ] Replace the old six-card section under “See DutchMate in real reading flow” with all 14 release screenshots.
- [ ] Present the three approved stories with lead visuals, supporting cards, captions, and full-size image links.
- [ ] Keep image content intact with contain-style sizing, responsive layout, visible focus, and no horizontal overflow.
- [ ] Provide accurate alt text and concise captions that explain the learner value rather than repeating filenames.
- [ ] Keep the gallery usable without JavaScript, auto-rotation, or a modal.

## T03 — Refresh the 0.4.0 conversion surface

**Blocked by:** T02.

- [ ] Update title, description, Open Graph, Twitter, hero, feature, availability, and footer copy for 0.4.0.
- [ ] Use the approved core message: “Read Dutch in context. Understand more. Keep the words that matter.”
- [ ] Make the Firefox install CTA direct and consistent with the official Add-ons destination.
- [ ] State the local/no-account/no-subscription boundary clearly without overstating privacy or product scope.
- [ ] Retain the existing OG image unless implementation review proves it misleading.

## T04 — Verify and hand off 007-showcase

**Blocked by:** T01, T02, and T03.

- [ ] Run the frontend/public-site checks, full relevant test suite, `git diff --check`, and the appropriate build verification.
- [ ] Inspect the page at desktop and narrow/mobile widths for image containment, caption readability, focus visibility, and CTA clarity.
- [ ] Confirm all local asset links resolve and no external source-folder paths remain.
- [ ] Update this checklist with direct evidence and commit the complete feature using the repository commit convention.
- [ ] Reconcile the GitHub issue/Delivery state and open or merge the PR according to the repository workflow when remote access is available.
