# Feature 022: Public Face Tickets

**Parent:** [Feature 022: Public Face](https://github.com/mgurramaiproject/dutchmate/issues/178)

**Status:** Dependency-ordered ticket set published; implementation and
qualification are complete.

## Ticket tree

### T01 — Refresh the public frontend story and browser availability

**Issue:** [#179](https://github.com/mgurramaiproject/dutchmate/issues/179)

**Blocked by:** None — can start immediately.

**What it delivers:** The existing DutchMate homepage accurately presents the
current learner experience and honest browser availability. Chrome and Firefox
have real store links with their logos; Edge is a non-navigating coming-soon
action that reports its support message when clicked. Safari is deferred.
The page,
metadata, accessibility labels, and focused public-site tests no longer make
stale release or Firefox-only claims, while the existing gallery and feedback
paths remain intact.

**Acceptance criteria:**

- [x] Homepage copy describes translation, Saved vocabulary, Daily Five,
      Lessons, Verb Journeys, multilingual form support, and English
      comparisons in crisp learner-first language.
- [x] Current repository build and older store-installed builds are clearly
      distinguished.
- [x] Chrome and Firefox install actions use the supplied public listing URLs,
      recognizable local browser logos, and accessible names.
- [x] Clicking the Edge availability action shows “Edge support is coming
      soon” without navigating to a fabricated URL.
- [x] Practice copy highlights Dutch grammar, verb conjugations with English,
      sentence exercises, and useful vocabulary practice.
- [x] Social metadata, footer, privacy/feedback wording, and accessibility
      labels agree with the updated availability story.
- [x] Existing gallery assets, lightbox behavior, feedback links, and privacy
      link remain intact.
- [x] Focused public-site tests protect the new external behavior and reject
      the stale one-browser-only claims.

### T02 — Qualify and approve the Feature 022 public face

**Issue:** [#180](https://github.com/mgurramaiproject/dutchmate/issues/180)

**Blocked by:** T01 — Refresh the public frontend story and browser
availability.

**What it delivers:** A reviewed, release-ready public frontend whose final
copy is explicitly approved and whose desktop, narrow-screen, keyboard,
browser-link, Edge feedback, test, typecheck, build, diff, and consistency
checks pass.

**Acceptance criteria:**

- [x] Final homepage and metadata copy receives explicit user approval.
- [x] Stale release, unsupported feature, misleading store-status, and
      Firefox-only claims are reviewed and corrected.
- [x] Desktop and narrow layouts remain readable without horizontal overflow.
- [x] Keyboard focus, accessible names, and Edge status feedback are
      verified for the navigation, hero, and availability actions.
- [x] Chrome and Firefox links open the supplied public listings.
- [x] The existing screenshot gallery remains readable and its copy does not
      claim to show newer behavior absent from the captures.
- [x] Focused tests, full relevant tests, typecheck, frontend build checks, and
      whitespace/diff review pass.
- [x] All intentional changes are committed on the Feature 022 branch.

## Publication record

- Parent issue: [#178](https://github.com/mgurramaiproject/dutchmate/issues/178)
- T01: [#179](https://github.com/mgurramaiproject/dutchmate/issues/179)
- T02: [#180](https://github.com/mgurramaiproject/dutchmate/issues/180),
  blocked by #179
- Qualification: [022-public-face-qualification.md](./022-public-face-qualification.md)
