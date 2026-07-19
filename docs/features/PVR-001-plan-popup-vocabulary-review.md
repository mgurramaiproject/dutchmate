# PVR-001: Popup Vocabulary Review MVP

Parent issue: #20

Implement the popup-based vocabulary review MVP described below.

Before changing code:
1. Inspect the current DutchMate extension structure.
2. Identify where popup UI, local vocabulary storage, background scripts, and badge logic currently live.
3. Propose a short implementation plan.
4. Then implement incrementally.

Requirements:
- Popup has two tabs: Learn and Settings.
- Learn is the default tab.
- Learn shows due words, total saved words, new words, recently saved preview, and buttons:
  - Review Due Words
  - Practice New Words
  - Review All Words
- Flashcards appear inside the popup, not in a new tab/page.
- Flashcard front shows progress, Dutch word, and Show Answer.
- Flashcard back shows Dutch word, English meaning, Telugu meaning, optional example sentence, and rating buttons: Again, Hard, Good, Easy.
- Rating updates local review metadata and advances to the next card.
- Simple SRS:
  - Again: tomorrow
  - Hard: 1 day
  - Good: 3 days
  - Easy: 7 days
- Settings tab includes:
  - learning language: Dutch
  - helper languages: English and Telugu
  - auto-save selected words on/off
  - show example sentence on/off
  - daily review badge on/off
  - card direction setting
  - export vocabulary
  - import vocabulary
  - clear vocabulary with confirmation
- Add toolbar badge showing number of due words.
- Hide badge when zero words are due.
- Update badge when words are saved, reviewed, imported, cleared, or when the extension initializes.
- Keep all vocabulary local.
- Do not add login, cloud sync, or full vocabulary dashboard.
