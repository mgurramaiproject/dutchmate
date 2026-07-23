# 004-transfer: Context Missions validation

Status: Engineering validation record for T06

Related artifacts:

- [Context Missions specification](./004-transfer-spec.md)
- [implementation tickets](./004-transfer-tickets.md)
- [manual testing](../release/manual-testing.md)
- [browser release playbook](../release/browser-release-playbook.md)

## Scope and release claim

Context Missions are an optional, local webpage-practice surface. They are engineering-ready only after the automated and browser evidence below is complete. They are **not** a substantiated learning-effect claim: DutchMate describes them as experimental until a consented delayed-transfer pilot supplies evidence beyond activity or completion.

## Automated evidence

Run from `feature/004-transfer` at `881822a` on 2026-07-22:

| Check | Result | Evidence |
| --- | --- | --- |
| Focused Context Slip and canonical-learning seams | Pass | `corepack pnpm exec vitest run src/content/webpage-lookup-module.test.ts src/content/tooltip-view-adapter.test.ts src/content/webpage-lifecycle-controller.test.ts src/background/message-handler.test.ts src/vocabulary/learning-record.test.ts src/vocabulary/daily-five.test.ts src/release/release-docs-consistency.test.ts` — 63 tests passed. |
| Complete relevant suite | Pass | `corepack pnpm test` — 513 tests in 90 files passed. |
| Type checking | Pass | `corepack pnpm typecheck`. |
| Chrome and Firefox build/package gate | Pass | `corepack pnpm verify:release` built and packaged both targets and verified each generated manifest and ZIP. |
| Whitespace | Pass | `git diff --check`. |

The focused `webpage-lookup-module` tests prove that `Practise this`, `Try from memory`, reveal, replay, checking, and completion reuse local state and add no translation-provider request. They also prove configured ordinary translation still uses the existing transport. The rendered tooltip tests cover the two entry controls, while the learning-record and message-handler tests cover the one-result canonical mastery boundary.

The package gate verified each target contains its background entry, content script, popup, Options page, icons, and target-specific manifest declaration. It found no new permission, remote service, or popup tab.

## Interactive browser evidence

| Browser | Build | Result | Evidence |
| --- | --- | --- | --- |
| Chrome 149.0.7827.114 on Linux | `dist/chrome` | Pending | An interactive extension pass has not been recorded for this Context Missions release candidate. |
| Firefox 152.0.6 on Linux | `dist/firefox` | Pending | An interactive extension pass has not been recorded for this Context Missions release candidate. |

The required interactive pass is the Context Missions checklist in [manual testing](../release/manual-testing.md): deliberate selection; first encounter; saved-repeat recognition and recall; scrolling; viewport edges; Escape; focus return; keyboard-only completion; touch-sized controls; and safe translation/storage failures. Record browser version, tester, commit, and result in that document's Verification Log.

## Corrected Firefox observations

On 2026-07-22, a Firefox user observed four Context Slip defects: a headline selection did not expose `Practise this`; Reset did not reliably remain in the card; the saved-repeat cue was cramped; and the recall card did not clearly identify the Dutch being recalled. The correction normalizes layout-only whitespace around hyphenated selections, preserves phrase/headline context, lets older saved items without stored context use the current deliberate selection safely, stops card actions from bubbling into the page after a rerender, and restores Direction A's saved-repeat hierarchy: saved Dutch, context, plain-language prompt, and one clear primary action. The approved mockup records this recall-card clarification as the updated Direction A source of truth.

Focused rendered and behavioral tests cover the wrapped headline, Context Slip Reset, saved-repeat copy/context, and recall hierarchy; the full suite and package gate passed afterwards. Reload the Firefox temporary add-on and re-run these four observations as part of the remaining interactive browser pass.

The completion card now says `Correct` and explains that the word order matches the original sentence. Capture details use labelled Dutch, English, Telugu, and Context rows; an outside click dismisses the card after the selection's initiating click; and positioning prefers below the selection, flips above near the viewport bottom, and moves left when the card would run off the right edge.

## Privacy and persistence boundary

Mission sessions, shuffled fragments, answers, raw page URLs/history, completion history, and resume state stay ephemeral in the content page. The only persistence remains existing explicit capture and capped context, encounter metadata, and at most one canonical recognition or recall update for an eligible saved item. Context Missions make no incremental translation-provider or generative-service request, and DutchMate sends no mission telemetry, account data, or background learning analytics.

## Voluntary delayed-transfer pilot protocol

This optional product-learning check is not telemetry, a default product flow, or a research claim.

1. Obtain explicit, informed consent from each voluntary adult participant; allow withdrawal without explanation and collect only notes they choose to share outside the extension.
2. For each participant, select comparable intentional items: one translation-only item and one translation-plus-mission item. Do not use item counts, mission completion, or time in product as the outcome.
3. After 2–7 days, present each item in a different short Dutch sentence without DutchMate open. Ask for the appropriate meaning or use, then record the participant's voluntary response and whether the exercise disrupted ordinary reading.
4. Compare the two conditions descriptively, retaining uncertainty and qualitative reading-disruption notes. Do not add identifiers, remote reporting, default background telemetry, or activity-only success claims.
5. Keep Context Missions labelled experimental unless delayed evidence supports transfer; this small voluntary comparison is directional product evidence, not a statistically generalizable efficacy result.

## Unresolved limitations and readiness

Automated engineering and packaging evidence is complete, and PR [#63](https://github.com/mgurramaiproject/dutchmate/pull/63) has merged the implementation into `main`. Release readiness remains **blocked** until a tester records the Chrome and Firefox interactive pass above. No implementation defect was found in the automated scope. The next action is to load the generated Chrome and Firefox builds, run the Context Missions browser checklist, then update this record, the T06 checklist, close issue #62, and move its Delivery Status to Done.
