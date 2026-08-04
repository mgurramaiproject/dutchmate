# Feature 022: Public Face Qualification

**Feature:** `022-public-face`

**Branch:** `feature/022-public-face`

**Status:** Final copy approved; implementation and qualification checks passed.

## Scope qualified

- The public homepage describes the current 0.4.1 repository build without
  pretending that the published Chrome or Firefox listings already contain the
  latest update.
- Chrome and Firefox availability actions use the supplied public store URLs
  and local browser logos.
- Edge is a native button, not a fabricated link. Its click handler exposes
  the accessible status text “Edge support is coming soon.”
- The existing screenshot gallery, lightbox, feedback routes, privacy route,
  and responsive design primitives remain in place.
- The newer learner-facing story is represented through translation, Saved
  vocabulary, Daily Five, Lessons, Verb Journeys, English comparisons, and
  reviewed practice. Internal content-catalog terminology is not marketed.
- The user explicitly approved the final copy on 2026-08-04.

## Verification evidence

- `corepack pnpm test -- frontend/public-site.test.ts` — passed, 4 tests.
- `corepack pnpm verify` — passed, 119 test files / 800 tests, typecheck,
  Chrome build, and Firefox build.
- `corepack pnpm exec vite build frontend --outDir /tmp/dutchmate-public-face-frontend`
  — passed. Vite reports the existing static classic-script warning; Render
  publishes the `frontend/` directory directly, and the script is served as a
  deferred static asset there.
- `git diff --check` — passed.
- Headless Chrome DOM load of the local homepage — passed. The rendered DOM
  contained the current build copy, Chrome/Firefox availability, Edge button
  and status, and combined review copy.
- Edge interaction regression — passed through the focused test that executes
  the shipped script, clicks the native Edge button, verifies
  `aria-expanded="true"`, and verifies that the status becomes visible.
- Local Render-style preview — passed through the repository `frontend:dev`
  server and HTTP response inspection. The preview served the updated
  homepage from the same `frontend/` directory documented for Render.

## Human review

- Final copy: approved by the user.
- Screenshot replacement: intentionally out of scope; existing captures remain
  and surrounding copy does not claim they demonstrate newer Verb Journey or
  English comparison screens.
- Real store-installed extension update: intentionally out of scope; the page
  says the latest update is coming soon.

