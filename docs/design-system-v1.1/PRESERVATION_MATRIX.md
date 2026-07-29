# DutchMate Design System v1.1 preservation matrix

This matrix records the existing product surface before and during the visual
retrofit. The handoff is applied one-to-one: existing data, states, controls,
and flows remain authoritative.

## Popup

| Existing element or interaction | Current location and contract | v1.1 treatment | Verification |
| --- | --- | --- | --- |
| Shell, DutchMate mark, Feedback, due badge, Settings | `src/popup/index.html`, `src/popup/index.ts`; fixed 390 × 600 popup, due count derives from local learning records, Settings opens review preferences | Paper/ink/orange tokens, v1.1 mark, 44 px header targets, secondary Settings action | Popup tests, Chrome/Firefox builds; browser geometry/manual contrast remains QA |
| Today/Lessons/Saved tabs | `#primary-navigation`; tablist semantics, roving keyboard navigation, focused work locks tabs | Same three tabs, selected ink state, no new destinations | `src/popup/index.test.ts`, `tab-navigation.test.ts` |
| Today next action | `renderToday`; Daily Five start/continue, empty lesson choice, completion copy, lesson continuation, local note | One dominant orange action and paper card; copy/data unchanged | Popup tests for Daily Five, completion, lesson entry |
| Week/Month/Year rhythm | `renderRhythm`; period tabs, previous/next period, dates, totals, day descriptions, legend, explanatory note | Shared tokens and accessible states; no heatmap or activity data removed | Popup rhythm tests; manual 200% zoom remains QA |
| Lessons library | `renderLessons`; 15 curated lessons, availability/error/empty states, status and level filters, progress labels | Tokenized rows, cards, filters, and focus states | Popup lesson tests and typecheck |
| Focused lesson | `renderLesson`; Exit, Read → Notice → Practise → Keep, story help, pattern highlighting, grammar choices, practice reveal/rating, Keep/replay | Same focused flow and explicit Exit; rail uses title-case v1.1 labels and shared visual language | Popup lesson end-to-end tests |
| Focused Daily Five review | `renderReview`; Exit, recognition/recall prompt, learner reveal, Dutch/English/Telugu/context answer, Again/Got it, local persistence | Shared learning card, evidence-first labels, one primary action; no scheduling/data changes | Popup review tests and full suite |
| Saved header and guidance | `renderSaved`; collection heading, local-only guidance, loading/error/empty states | Paper card hierarchy and readable helper text | Popup Saved tests |
| Saved backup actions | `renderSavedBackupControls`; Export/Import JSON through canonical learning client | Secondary controls with preserved filenames and backup contracts | Popup import/export tests and release builds |
| Saved Quiz, sorting, rows, expansion | Saved shelf view and `savedQuiz`; Quiz Saved, Newest/A–Z, stable shelf numbers, one expanded item, contexts, Open Options | Shared card/field treatment; internal `strong` evidence displays as `Secure` | Saved shelf and popup tests |
| Popup Settings | `renderSettings`; Show page context, Daily review badge, Open Options page | Secondary settings card; does not duplicate full Options form | Popup settings tests/build; manual keyboard QA remains |
| Popup due badge | `src/popup/index.ts`, `src/popup/styles.css`; due count derives from local learning records and the Daily review badge setting | Visible only for a positive count; disabling it hides the badge and clears accessible metadata | Popup regression test; manual browser inspection remains |

## Webpage tooltip and Context Mission

| Existing element or interaction | Current location and contract | v1.1 treatment | Verification |
| --- | --- | --- | --- |
| Loading and translation error | `src/content/tooltip-view-adapter.ts`; positioned, bounded tooltip with recoverable text | Scoped paper/ink/orange tokens inside arbitrary host pages; no host CSS dependency | Tooltip tests and content builds |
| Translation result | Tooltip adapter and webpage lookup module; selected/hovered input remains the fast primary interaction | Dutch result leads; English/Telugu helper rows remain readable; truncation and multi-target behavior preserved | Tooltip/webpage lookup tests |
| Save and Seen before | Existing save action state and local learning record messages | Primary/secondary token treatment; no automatic save or history added | Webpage lookup, learning-record, popup tests |
| Practise this | Existing deterministic Context Mission entry | Shared primary control; no runtime provider/LLM call added | Webpage lookup and tooltip tests |
| Grammar practice | Existing encounter grammar primitive with Check/Reveal/Skip/retry/back | Same mechanic styled as focused coaching; remains inside translation/lesson practice | Tooltip tests and grammar tests |
| Context Mission rebuild | Existing fragment banks, Reset, Check, status, result, Replay, Back to page, capture/save | Orange tether, paper layers, 44 px controls, polite status retained | Tooltip and webpage lifecycle tests |
| Recall offer/mission | Existing Seen before → Try from memory/Translate now → reveal → Again/Got it/Replay/Back to page | Same Translate → Practise → Return flow and focus restoration | Tooltip tests |
| Close, Escape, focus restoration, resize | Lifecycle controller and tooltip adapter | Existing close/return behavior preserved; focus ring/reduced motion tokenized | Tooltip/lifecycle tests; manual touch/zoom QA remains |

## Options page

| Existing element or interaction | Current location and contract | v1.1 treatment | Verification |
| --- | --- | --- | --- |
| Brand header and form shell | `src/options/index.html`, `styles.css`; full browser tab | v1.1 lockup, warm paper document, grouped raised sections | Chrome/Firefox builds; 400% reflow remains manual QA |
| Behavior controls and matrix | Enable, hover/selection translation, cache toggles, save notes | Tokenized fields/table; dark styling scoped to column headers so Text-column row labels stay on paper; no setting moved out or deleted | Options stylesheet regression test and full suite |
| Study preferences | Auto-save, page context/example sentence, daily review badge | Tokenized preference rows; sync field names unchanged | Settings tests and popup contract tests |
| Tuning | Hover mode, fixed delay and selection length controls | Tokenized range/choice controls; fixed semantics preserved | Settings tests/typecheck |
| Languages | Learning/native/bridge selects and role normalization | Tokenized selects and helper copy; language role contract unchanged | Language-role/settings tests |
| Saved vocabulary | Count, refresh, export/import, clear, table, row Delete, empty/help copy | Tokenized table/actions; canonical local learning client retained; newest-first order shared with popup Saved | Saved shelf order regression test, Options vocabulary/cache tests, full suite |
| Privacy/cache | Cached count, refresh, clear cache, local-storage explanation | Tokenized privacy section; cache key and expiry semantics unchanged | Cache tests and release verification |
| Save/status/errors and local testing | Form submit, validation focus, status live region, optional local endpoint fields | Shared controls and semantic status colors; provider security validation unchanged | Settings tests/typecheck; manual screen-reader QA remains |

## Public website

| Existing element or interaction | Current location and contract | v1.1 treatment | Verification |
| --- | --- | --- | --- |
| Site header, mark, navigation, download/feedback links | `frontend/index.html`, `feedback.html`, `privacy-policy.html` | v1.1 mark and shared token/type foundation; links unchanged | Public-site tests |
| Hero, screenshots, lightbox, feature/trust/steps sections | `frontend/index.html`, `007-showcase-gallery.js`, `styles.css` | Same content and interaction; warm paper/ink/orange system and responsive type | Public-site tests; visual browser QA remains |
| Feedback and privacy pages/footer | Static HTML and shared stylesheet | Same information architecture and links; shared brand assets/tokens | Public-site tests/manual responsive QA |

## Data and behavior preserved

- Settings remain in `browser.storage.sync` with the existing field names and
  normalization rules.
- Learning records remain local under `dutchmate.learningRecord.v2`; backup
  format/version and legacy migration paths remain unchanged.
- Translation cache remains local under `dutchmate.translationCache.v1` and is
  not converted into browsing history or learning records.
- Existing runtime messages, provider handling, deterministic grammar content,
  lesson progress, review scheduling, import/export, and Firefox packaging are
  unchanged.

## Clickthrough-only proposals not added

The v1.1 reference site remains documentation/reference material. Its example
states, extra prototype controls, and any new destination not already present
in DutchMate were not added as product features. Grammar mechanics remain
inside existing lessons, Daily Five, or Context Mission flows.
