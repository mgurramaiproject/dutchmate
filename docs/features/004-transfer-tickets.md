# Tickets: 004-transfer Context Missions

Status: Approved implementation plan

Parent: [GitHub issue #56](https://github.com/mgurramaiproject/dutchmate/issues/56)

Source specification: [004-transfer-spec.md](./004-transfer-spec.md)

Approved design: [Direction A · Context Slip](./004-transfer-design-mockups.html)

These six tracer bullets add optional, local webpage practice without adding a popup tab, automatic saving, mission history, or incremental translation requests. Work the **frontier** one ticket at a time in a fresh agent session. Update this checked-in checklist alongside the matching GitHub issue as evidence is completed.

```text
T01 ──┬── T02 ──┐
      └── T03 ── T04 ──┤
                        T05 ── T06
```

## T01 — Practise a fresh selection in Context Slip

GitHub: [#57](https://github.com/mgurramaiproject/dutchmate/issues/57)

**What to build:** Let a learner turn one successful, deliberate Dutch selection into the approved Context Slip reconstruction exercise without leaving the webpage. This first tracer bullet establishes the reusable ephemeral mission session while delivering the complete first-encounter path from translation to correction and return to reading.

**Blocked by:** None — can start immediately.

- [x] A successful deliberate Dutch selection containing 2–12 words offers `Practise this` after the existing translation result.
- [x] The action remains absent for hover, failed or non-Dutch translation, unsupported selection length, a disabled extension, or disabled selection translation.
- [x] `Practise this` opens approved Direction A, Context Slip: a white non-modal card with the orange context tether, original sentence in view, approved copy, and no popup navigation.
- [x] `Rebuild in context` blanks the selected Dutch and presents deterministic shuffled words or short fragments that can be placed and returned without typing or drag-and-drop.
- [x] Reset restores the original shuffled task; Check becomes available only when the answer can be evaluated.
- [x] The first checked order ignores capitalization, surrounding whitespace, and terminal punctuation; an exact order produces `Got it`, while an incorrect order produces `Again` and reveals the correct Dutch.
- [x] Replay is available for learning but cannot create, revise, or persist Mission evidence.
- [x] A first-encounter mission never updates recognition, recall, scheduling, or saved learning items.
- [x] Starting, checking, replaying, and completing the mission add zero translation-provider requests and call no generative service.
- [x] Visible close, Escape, keyboard-operable fragments, visible focus, accessible result announcements, page scrolling, and `Back to page` work at the two approved test seams.
- [x] Existing hover translation, selection translation, saving, settings, and popup behavior remain green.

## T02 — Keep first-encounter capture learner-controlled

GitHub: [#59](https://github.com/mgurramaiproject/dutchmate/issues/59)

**What to build:** Keep first-encounter practice and capture clearly separate. A learner may explicitly keep an eligible meaningful chunk after practising it, while complete sentences and unfinished mission work remain ephemeral and no practice result is promoted into mastery retroactively.

**Blocked by:** [T01 — #57](https://github.com/mgurramaiproject/dutchmate/issues/57).

- [x] Context Slip preserves the existing `Save` or `Review & save` path only for selections already eligible under the canonical word or meaningful-chunk rules.
- [x] Practice never saves a selection automatically, including when the legacy single-word auto-save setting exists.
- [x] A complete sentence can be practised when otherwise eligible but cannot become a learning item through Context Missions.
- [x] `Review & save` still requires item-level confirmation of the normalized Dutch, available helpers, and capped page context.
- [x] Cancelling capture changes no learning record and leaves the mission safely usable or dismissible.
- [x] Saving after a mission creates or merges the normal canonical learning item; a newly created item begins New with no retroactive recognition or recall credit.
- [x] Saving cannot turn a first-encounter result into Mission evidence, alter a Daily Five snapshot, or create a mission-specific record.
- [x] Unfinished fragment order, checked answers, replay state, and mission completion are never written to storage.
- [x] Existing single-word, meaningful-chunk, hover, and duplicate-save behavior remains compatible.
- [x] Focused content, learning-record, and rendered-card tests prove the learner-controlled capture boundary.

## T03 — Recall a saved meaning before translation

GitHub: [#58](https://github.com/mgurramaiproject/dutchmate/issues/58)

**What to build:** Let a learner retrieve the meaning of a saved word or meaningful chunk before DutchMate reveals or retranslates it. The complete path resolves the learning item locally, offers the pre-reveal choice, runs Recall meaning, and records at most one recognition result in the canonical learning record.

**Blocked by:** [T01 — #57](https://github.com/mgurramaiproject/dutchmate/issues/57).

- [x] A deliberate selection matching a saved word or meaningful chunk can resolve the canonical item, helpers, context, and mastery locally before provider reveal.
- [x] When the local data is sufficient, Context Slip shows `Seen before`, `Try from memory`, and `Translate now` before a new translation is requested.
- [x] `Translate now` follows the existing configured translation flow without creating Mission evidence.
- [x] Missing or stale identity, missing required local helper data, or unusable context falls back to normal translation instead of showing a broken recall task.
- [x] `Try from memory` opens `Recall meaning`, shows the Dutch in context, hides helpers, and uses `What does this mean here?`.
- [x] `Show meaning` reveals exactly the stored English and Telugu helpers when both exist, or the one available configured helper, without requesting missing data.
- [x] `Again` and `Got it` are unavailable before reveal and update recognition only after reveal.
- [x] The Mission evidence operation uses the canonical mastery and scheduling policy without completing, reordering, or fabricating a Daily Five task.
- [x] One mission session can apply at most one recognition update despite replay, double activation, retry, or duplicated messages.
- [x] Storage failure never shows false success and leaves a clear retry or Back to page path.
- [x] `Try from memory`, reveal, result, replay, and completion add zero translation-provider requests.
- [x] Primary-seam, learning-contract, and rendered-card tests prove the local pre-reveal and one-result boundaries.

## T04 — Rebuild a saved repeat for recall evidence

GitHub: [#60](https://github.com/mgurramaiproject/dutchmate/issues/60)

**What to build:** When a saved repeat needs Dutch recall rather than meaning recognition, choose that weaker learning dimension and reuse reconstruction to collect objective recall evidence. The result updates the same canonical learning item once and appears in Today only through normal scheduling.

**Blocked by:** [T03 — #58](https://github.com/mgurramaiproject/dutchmate/issues/58).

- [x] Saved-repeat exercise selection chooses the weaker mastery dimension first and the earlier-due dimension second, using the canonical stable tie rule.
- [x] Recognition continues to select Recall meaning; recall selects Rebuild in context.
- [x] The recall reconstruction uses the selected saved Dutch and real page context locally, with the same deterministic fragment and normalized scoring contract as first-encounter reconstruction.
- [x] Only the first checked order determines `Got it` or `Again` and submits recall Mission evidence.
- [x] A recall mission changes recall only; recognition remains unchanged.
- [x] Replay, Reset after feedback, double Check, retry, or duplicated messages cannot revise or add another mastery result.
- [x] The Mission evidence operation uses canonical scheduling without completing or changing a Daily Five snapshot.
- [x] Today and due counts reflect only the updated canonical learning item; no mission card, queue, badge, or progress model is added to the popup.
- [x] Missing or stale local item data falls back safely without provider calls disguised as memory practice.
- [x] Primary-seam, learning-contract, and rendered-card tests cover both dimension choices, due-time ordering, stable ties, first-check evidence, and idempotency.

## T05 — Harden the Context Slip mission lifecycle

GitHub: [#61](https://github.com/mgurramaiproject/dutchmate/issues/61)

**What to build:** Make the approved Context Slip dependable on real webpages across the full first-encounter and saved-repeat lifecycle. This slice closes accessibility, asynchronous, privacy, positioning, fallback, and regression gaps without broadening the feature into popup or background activity.

**Blocked by:** [T02 — #59](https://github.com/mgurramaiproject/dutchmate/issues/59) and [T04 — #60](https://github.com/mgurramaiproject/dutchmate/issues/60).

- [ ] Starting another lookup, replacing the selection, closing the card, disabling the extension, disabling selection translation, or navigating away invalidates the current mission and ignores late results.
- [ ] Visible close, Escape, completion, and safe failure return focus predictably to the initiating control when it remains available and otherwise fail safely.
- [ ] Every action and fragment is keyboard-operable with logical order, visible focus, Enter or Space activation, and useful accessible names.
- [ ] Fragment movement, reveal, check result, correction, failure, and completion use accessible live announcements without making the whole interactive card a noisy status region.
- [ ] The non-modal card keeps the page scrollable and remains usable near every viewport edge, at zoom, narrow widths, and touch sizes consistent with approved Direction A.
- [ ] Translation failure, learning-record failure, missing helpers, missing identity, stale cache, and unsupported selections provide the specified fallback or actionable failure without false success.
- [ ] Mission state, fragments, answers, URLs, raw page history, completion history, and resume state remain ephemeral; only existing explicit capture, capped context, encounter metadata, and one eligible Mission evidence update may persist.
- [ ] Ordinary hover, existing single- and multi-target translation calls, Save and Review & save, Today, Lessons, Saved, Options, and badges remain unchanged except for canonical mastery consequences.
- [ ] Automated tests at the approved behavioral and rendered-UI seams cover lifecycle invalidation, failures, focus, keyboard, announcements, responsive positioning, and zero incremental provider requests.
- [ ] Manual accessibility inspection confirms that Direction A's structure, hierarchy, copy, controls, orange tether, and responsive behavior match the approved mockup rather than Directions B or C.

## T06 — Verify and document release readiness

GitHub: [#62](https://github.com/mgurramaiproject/dutchmate/issues/62)

**What to build:** Produce the evidence and durable documentation needed to call Context Missions engineering-ready in Chrome and Firefox while keeping learning-effect claims experimental. This is the final integration and validation handoff, not a new feature surface.

**Blocked by:** [T05 — #61](https://github.com/mgurramaiproject/dutchmate/issues/61).

- [ ] Focused feature tests, canonical learning regressions, the complete relevant suite, type checking, Chrome and Firefox builds, and release packaging all pass.
- [ ] Automated evidence proves that Practise this and Try from memory add zero translation-provider requests and that existing configured translation calls remain unchanged.
- [ ] Real Chrome and Firefox checks cover deliberate selection, first encounter, both saved-repeat exercises, page scrolling, viewport edges, Escape, focus return, keyboard-only completion, touch-sized controls, and safe failures.
- [ ] Generated manifests and packaged outputs contain the expected background, content, popup, Options, icons, and browser-specific declarations without adding a new permission, remote service, or popup tab.
- [ ] Privacy, manual-testing, release, and store-facing documentation accurately describe ephemeral mission state, canonical mastery updates, provider behavior, and the absence of background learning telemetry.
- [ ] The shared `004-transfer` validation artifact records automated evidence, manual-browser evidence, unresolved limitations, and release readiness without conflating them.
- [ ] The validation artifact includes a voluntary delayed-transfer pilot protocol comparing translation-only and translation-plus-mission items after 2–7 days in a different sentence while observing reading disruption.
- [ ] The pilot protocol requires consent, no default background telemetry, and no activity-only success claim; Context Missions remain described as experimental until delayed evidence supports transfer.
- [ ] Any defect found by validation is fixed and reverified within the approved scope, or the ticket is marked Blocked with the exact remaining evidence and next action.

## Frontier and delivery discipline

- Start with T01 only.
- After T01 is complete, T02 and T03 are both unblocked, but implement them one at a time in fresh sessions.
- T04 starts only after T03; T05 starts only after both T02 and T04; T06 is the final integration and validation ticket.
- Each implementation session must update this file's matching checkboxes, synchronize the GitHub issue, run proportionate verification, create one focused commit, and leave the feature branch clean.
- Keep implementation on `feature/004-transfer` unless an approved delivery change introduces ticket branches.
