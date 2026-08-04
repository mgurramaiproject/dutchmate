# Feature 022: Public Face Qualification

**Feature:** `022-public-face`

**Branch:** `feature/022-public-face`

**Status:** Final copy approved; QA follow-up implemented and qualification
checks passed, including navigation and hero browser actions.

## Scope qualified

- The public homepage describes the current 0.4.1 repository build without
  pretending that the published Chrome or Firefox listings already contain the
  latest update.
- Chrome and Firefox availability actions use the supplied public store URLs
  and local browser logos. All four browser logos are visible in the nav, hero,
  and availability surfaces.
- Edge and Safari are native buttons, not fabricated links. Their click
  handlers expose accessible browser-specific support-is-coming-soon text in
  each surface without navigation.
- The existing screenshot gallery, lightbox, feedback routes, privacy route,
  and responsive design primitives remain in place.
- The newer learner-facing story is represented through translation, Saved
  vocabulary, Daily Five, Lessons, Dutch grammar, verb conjugations with
  English, sentence exercises, Verb Journeys, and useful vocabulary practice.
  Internal content-catalog terminology is not marketed.
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
  contained the current build copy, four browser cards, Edge and Safari buttons
  and statuses, and the expanded practice copy.
- Edge and Safari interaction regression — passed through the focused test that
  executes the shipped script, clicks all six native placeholders across the
  nav, hero, and availability surfaces, verifies `aria-expanded="true"`, and
  verifies that each status becomes visible.
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
