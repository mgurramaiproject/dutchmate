# Feature 022: Public Face

## Problem Statement

DutchMate's public homepage still describes the older 0.4.0 Firefox-only
release, even though the repository now contains a broader learner experience
and public Chrome and Firefox listings. The site therefore undersells the
current product, hides the newer learning loop, and gives visitors an
incomplete availability picture.

The store listings have not yet been updated with the latest extension build.
The website must not imply that the current repository build is already what a
visitor will receive from either store. Existing screenshots also show the
older release and should not be presented as evidence of newer surfaces.

## Solution

Refresh the existing DutchMate static frontend in place. Keep its current
black, white, orange, serif-led visual language, layout, navigation, gallery,
feedback flow, and responsive behavior, while replacing stale public copy with
short, human descriptions of the current product.

The homepage will link to the supplied Chrome Web Store and Firefox Add-ons
listings. Each browser action will use its browser logo and explain that the
listing is available while the latest update is still coming soon. An Edge
availability action will use a non-navigating interactive state: clicking it
shows “Edge support is coming soon.” It does not link to a store.

The public copy will describe the user-visible browsing-to-fluency loop:
translate on real webpages, save useful vocabulary, practise with Daily Five
and short Lessons, and follow Verb Journeys with multilingual form support and
English comparisons. Internal catalog architecture and unverified future
capabilities remain out of the marketing promise.

## User Stories

1. As a Dutch learner, I want the homepage to explain the current DutchMate
   experience, so that I can decide whether it fits how I learn.
2. As a Telugu-speaking learner in the Netherlands, I want English and Telugu
   support described clearly, so that I know the learning triangle matches my
   needs.
3. As a visitor who reads Dutch online, I want to understand that translation
   happens on real webpages, so that I know I can keep reading instead of
   switching tabs.
4. As a learner who finds useful words, I want the site to explain Saved
   vocabulary, so that I understand how words move from reading into practice.
5. As a returning learner, I want Daily Five and short Lessons described as a
   connected practice loop, so that the product promise is concrete rather than
   a list of isolated features.
6. As a learner who wants structured grammar help, I want Verb Journeys
   described in plain language, so that I understand they guide me through
   useful verb forms inside the existing learning experience.
7. As a learner comparing Dutch and English, I want the site to mention
   multilingual form references and English comparisons accurately, so that I
   know DutchMate helps me understand differences without promising a full
   grammar course.
8. As a privacy-conscious visitor, I want the site to retain the no-account and
   local-learning explanation, so that I can understand the data boundary before
   installing.
9. As a Chrome user, I want a recognizable Chrome logo and a direct link to the
   official Chrome Web Store listing, so that I can install from a trusted
   destination.
10. As a Firefox user, I want a recognizable Firefox logo and a direct link to
    the official Firefox Add-ons listing, so that I can install from a trusted
    destination.
11. As a visitor choosing a browser, I want the site to distinguish the public
    store listing from the latest available build, so that I am not misled by
    the older store version.
12. As an Edge user, I want the Edge availability action to tell me that
    support is coming soon when I click it, so that the unavailable destination
    feels intentional rather than broken.
13. As a visitor viewing the existing gallery, I want its captions to match
    what the screenshots actually show, so that older captures are not
    mistaken for demonstrations of newer features.
14. As a visitor sharing the homepage, I want the title, description, and
    social preview copy to match the page, so that shared links do not advertise
    stale release or browser information.
15. As a visitor using a narrow screen, I want the updated browser actions and
    copy to fit the existing responsive layout, so that the install path stays
    usable on mobile-sized screens.
16. As a keyboard or assistive-technology user, I want browser availability
    actions to have accurate names, states, focus behavior, and feedback, so
    that I can understand which actions navigate and which one only reports
    future support.
17. As a visitor who wants to give feedback, I want the existing private form,
    review, and sharing paths to remain available, so that the copy refresh does
    not break the feedback loop.
18. As a maintainer, I want tests to reject stale one-browser-only marketing
    claims, so that a later copy edit does not silently regress the availability
    story.
19. As a maintainer, I want the public site to avoid internal implementation
    terms such as the content catalog, so that architecture changes do not
    unnecessarily become marketing promises.
20. As a maintainer, I want the site to preserve the existing design primitives
    and gallery behavior, so that a copy refresh does not become an accidental
    visual redesign.

## Implementation Decisions

- The existing static frontend remains the public surface. No framework,
  routing system, new navigation area, or separate marketing application is
  introduced.
- Homepage copy, headings, social metadata, footer version language,
  availability sections, feedback references, and accessibility labels are
  updated together so the page presents one consistent story.
- The current repository build is described as 0.4.1 where a version is
  needed. Chrome and Firefox store actions state that the public listings are
  available but still carry an earlier build and that the latest update is
  coming soon. The copy does not claim that 0.4.1 is already installed from
  those listings.
- Chrome and Firefox install actions are real links to the user-supplied
  official listings and display local browser logo assets. The existing Firefox
  logo is reused; a local Chrome logo asset is added if required by the current
  asset set.
- Edge is represented as a clearly labelled coming-soon availability action.
  Its click behavior shows “Edge support is coming soon” in an accessible
  feedback state and does not navigate or fabricate a store URL.
- Public feature copy leads with learner outcomes and uses domain terms only
  where they clarify the experience: Saved, Daily Five, Lessons, Verb
  Journeys, Verb Map, and English comparisons. Content catalog remains an
  internal term and is not marketed.
- The existing 007 showcase image files, gallery structure, lightbox, and
  screenshot navigation remain unchanged. Captions and adjacent prose are
  narrowed so they describe only the behavior visible in those older captures.
- Existing privacy language remains accurate: learners choose what to
  translate, saved learning data stays in the browser, and no account or
  subscription is required. Copy does not claim that translation requests
  never leave the browser or that the extension works entirely offline.
- Existing feedback, privacy, review, and sharing destinations remain in place;
  browser-specific wording is updated where it would otherwise imply Firefox
  is the only published browser.
- The implementation remains compatible with the current design tokens,
  primitives, narrow popup-inspired visual rhythm, focus treatment, and
  responsive breakpoints.

## Testing Decisions

- Tests assert external public behavior: visible or accessible copy, link
  destinations, browser labels and logos, Edge's non-navigation feedback,
  metadata consistency, preserved gallery behavior, and absence of stale
  claims. They do not assert incidental HTML ordering or CSS implementation
  details.
- The focused public-site test suite covers the homepage and its existing
  feedback/privacy contracts. It verifies both supplied store links, both
  browser logo references, the Edge coming-soon interaction contract, the
  current-build/store-version distinction, and retained screenshot/lightbox
  references.
- Existing frontend test prior art is the public-site contract test that reads
  the static pages and protects copy, asset, feedback, privacy, sharing, and
  lightbox behavior.
- Focused tests run first, followed by the full Vitest suite, TypeScript
  checking, the frontend build, and whitespace/diff checks.
- Manual review checks the homepage at desktop and narrow widths, verifies
  keyboard focus and accessible names, clicks both store links, clicks Edge to
  confirm the coming-soon message, and confirms that the old gallery remains
  readable and truthful.
- Marketing/content review remains separate from structural tests. Automated
  checks can catch stale strings and broken contracts, but they do not replace
  human review of tone, brevity, browser-status clarity, or claims about the
  learner experience.

## Out of Scope

- Updating or publishing the Chrome Web Store listing.
- Updating or publishing the Firefox Add-ons listing.
- Publishing Edge or implementing an Edge build or store integration.
- Capturing, replacing, or redesigning the existing screenshot gallery.
- Extension popup redesign or changes to learner-facing runtime behavior.
- Changes to learner history, evidence, scheduling, content packages, or the
  content catalog implementation.
- A remote content service, account system, subscription, or new analytics
  promise.
- Marketing claims about features not verified in the current repository.

## Further Notes

- The supplied public listings are:
  - Chrome Web Store: `https://chromewebstore.google.com/detail/kafimmaagcjmcpajmfneabhebblobgeo`
  - Firefox Add-ons: `https://addons.mozilla.org/en-US/firefox/addon/dutchmate/`
- The final learner-facing copy requires explicit user approval before the
  feature is considered copy-complete.
- The next workflow gate is approval to invoke `$to-tickets` and create the
  dependency-ordered ticket document and GitHub issue tree.

