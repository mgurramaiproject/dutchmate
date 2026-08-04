# Plan 022: Public Face

**Codename:** `public-face`

**Feature code:** `022-public-face`

**Branch:** `feature/022-public-face`, created from the clean local `main`
branch on 2026-08-04.

**Status:** Implementation and qualification complete; ready for delivery
reconciliation.

**Specification:** [022-public-face-spec.md](./022-public-face-spec.md);
published as [GitHub issue #178](https://github.com/mgurramaiproject/dutchmate/issues/178)
with `ready-for-agent`.

## Goal

Refresh DutchMate's existing static public frontend so it accurately and
briefly explains the current product, links to the published Chrome and
Firefox listings, and makes the gap between the current repository build and
the older store-installed builds explicit. Preserve the existing design
system, information architecture, screenshot gallery, and human tone.

## Shared understanding

- The public site describes the current repository build, including the
  learner-visible browsing-to-fluency loop, Saved vocabulary, Daily Five,
  short Lessons, Verb Journeys, the multilingual Verb Map, and the English
  comparison lens.
- The content catalog is an internal delivery boundary, not a public feature
  claim. It may support the wording that reviewed content is bundled and
  versioned, but the site should not market a catalog or implementation model.
- The frontend must distinguish current product behavior from store status:
  Chrome and Firefox have public listings, but those listings still contain an
  earlier published build. Store actions remain valid install links and carry
  concise wording such as the latest update coming soon.
- Edge is not yet published. It appears as a clearly marked “Coming soon”
  availability action without a store link; clicking it shows “Edge support is
  coming soon” and does not navigate.
- Chrome and Firefox logos are used on the corresponding install or
  availability actions. No browser logo is required for the non-clickable
  Edge state unless an appropriate local asset already exists.
- The existing 007 showcase gallery remains in place for this feature. Its
  captions and surrounding copy must not imply that the images demonstrate
  newer Verb Journey or comparison-lens behavior that the captures do not
  show.
- The visual language remains the current DutchMate black, white, orange,
  serif-led reading copy, narrow responsive layout, existing button and card
  primitives, and current accessibility behavior. No UI framework or new
  navigation surface is introduced.
- Copy stays crisp, short, concrete, and human. It should explain learner
  benefits before naming internal feature vocabulary.
- The current version mismatch is corrected deliberately: package metadata
  identifies the current repository build as 0.4.1, while the store-status
  wording makes clear that the public listings are older rather than claiming
  that 0.4.1 is already installed there.

## Current inconsistencies to resolve

- The homepage, social metadata, footer, tests, and gallery copy still center
  release 0.4.0 while the package is 0.4.1.
- The homepage exposes only Firefox install actions even though Chrome now has
  a public listing.
- Several privacy, feedback, and sharing lines are Firefox-only where the
  availability story should cover both published browsers.
- The current copy omits the shipped Verb Journey, multilingual Verb Map,
  English comparison, grammar-in-context, and reviewed-content improvements.
- Store status and current-build status are currently conflated.

## Proposed frontend boundary

- Update homepage headings, body copy, social metadata, availability copy,
  install actions, feedback/review destinations, footer version language, and
  accessibility labels.
- Add the Chrome store link supplied by the user and retain the Firefox link
  supplied by the user.
- Add a local Chrome logo asset and reuse the existing Firefox logo asset.
- Keep the existing screenshot files and lightbox behavior unchanged.
- Extend the focused public-site tests to verify the two live store links,
  browser labels/logos, Edge's non-link state, current-build/store-version
  distinction, absence of stale claims, and preserved gallery references.

## Proposed verification seams

1. **Public copy contract:** the homepage and social metadata state the current
   product promise without claiming unsupported features or outdated store
   versions.
2. **Availability actions:** Chrome and Firefox actions point to the supplied
   public listings, use their browser logos, and describe the older store-build
   status accurately; Edge is visibly coming soon and not clickable.
3. **Existing frontend behavior:** the screenshot gallery, feedback links,
   privacy link, responsive structure, and lightbox remain intact.
4. **Repository consistency:** no stale 0.4.0 marketing claims remain where
   they would be read as the current build, and the tests protect against a
   future one-browser-only regression.

## Out of scope

- Publishing or updating the Chrome or Firefox store listings.
- Publishing Edge or creating an Edge store listing.
- New screenshots, screenshot recapture, or changes to the existing gallery
  assets.
- Extension popup redesign, new learner navigation, or a new frontend
  framework.
- Changes to extension behavior, content, learner history, scheduling, or the
  content catalog implementation.
- A new public content service or remote catalog.

## Approval gates and next delivery order

1. Commit this shared-understanding plan to the Feature 022 branch.
2. Ask for explicit approval to invoke `$to-spec` and create
   `docs/features/022-public-face-spec.md`. **Done:** the specification was
   published as GitHub issue #178 with `ready-for-agent`.
3. Confirm the proposed verification seams during the specification review.
   **Done:** the approved seams are recorded in the specification.
4. Ask for explicit approval to invoke `$to-tickets` and create
   `docs/features/022-public-face-tickets.md` plus the dependency-ordered
   tracker issues. **Done:** the approved breakdown is checked in and
   published as child issues [#179](https://github.com/mgurramaiproject/dutchmate/issues/179)
   and [#180](https://github.com/mgurramaiproject/dutchmate/issues/180), both
   labeled `ready-for-agent`; #180 is blocked by #179.
5. Implement the approved frontend slice, then present the final copy for
   explicit user approval before treating the copy as final.
6. Run focused public-site tests, the full relevant test suite, typecheck,
   frontend build checks, whitespace/diff review, and commit all changes.
   **Done:** qualification is recorded in
   [022-public-face-qualification.md](./022-public-face-qualification.md);
   final copy was approved and the implementation is committed.
