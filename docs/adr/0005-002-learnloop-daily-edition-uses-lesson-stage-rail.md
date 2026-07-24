# Use Daily Edition with an explicit lesson stage rail

Status: accepted

`002-learnloop` will use the approved **Daily Edition** popup direction, derived from design mockup A, with the four-part lesson rail from design mockup B. Today remains an editorial, action-first surface with one dominant Daily Five action, a quiet weekly rhythm, recognition/recall evidence, and an optional continue-lesson entry. The top level exposes only `Today | Lessons`; Settings stays in the header.

Daily Five and lesson work are focused flows. They keep the originating top-level tab visible as a locked orientation marker and provide an explicit Exit action. Lessons show an equal-width `Read | Notice | Practise | Keep` rail directly below the focused header, with the current labelled stage marked in orange. Orange is never the only indication of stage because the stage number and label remain visible.

The design continues DutchMate's black, white, and orange editorial system, uses a 390-pixel popup width and at least 44-pixel targets, supports content scrolling within the real browser popup, and requires no typing. The approved HTML is a reference rather than production code; implementation must recreate it through the popup's tested state and view-model seams.

Accepted reference: `docs/features/002-learnloop-approved-popup-design.html`.

The Five-Line Ledger's Today layout, Story Spine, and Action Dock are not selected. The original four-direction prototype remains in `docs/features/002-learnloop-design-mockups.html` only as a historical exploration archive; it is not an implementation source of truth.
