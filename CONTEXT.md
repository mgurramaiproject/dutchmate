# DutchMate

DutchMate is a browser-based Dutch learning product for people who read the web while moving between Dutch, English, and Telugu. This glossary captures the product language that shapes feature scope, privacy boundaries, and release decisions.

## Language

**Learning triangle**:
The core language set DutchMate is designed around: Dutch, English, and Telugu. It describes the intended learner flow rather than a generic "multi-language" product.
_Avoid_: Language pack, universal translation

**Telugu phonetic helper**:
An English-letter pronunciation guide for Telugu helper text, offered to support Dutch learners who cannot yet read Telugu script. It does not make Telugu a learning language or introduce a reverse Dutch-to-Telugu course.
_Avoid_: Telugu learning mode, pronunciation course, speech feedback

**Simple Telugu phonetics**:
The local Telugu phonetic-helper style: plain English letters with syllable breaks and no scholarly diacritics, such as `na-mas-kaa-ram`. It is an accessible reading aid, not a linguistic transcription standard.
_Avoid_: IAST, IPA, academic transliteration

**First audience**:
The initial public user group DutchMate is intentionally optimized for: Telugu-speaking people in the Netherlands who already use English and are learning Dutch through everyday web reading.
_Avoid_: Everyone, general translation users

**Browsing-to-fluency loop**:
The core DutchMate learning journey: understand Dutch encountered on real websites, keep useful language, practise it, and later recognize or actively use it. Curated teaching and playful mechanics support this loop rather than replace it.
_Avoid_: Translation workflow, complete Dutch course, standalone game

**Curated mini-lesson**:
A three-to-five-minute, intentionally sequenced A0-A2 activity that teaches one practical Dutch pattern for daily life in the Netherlands through a micro-story and three to five useful learning items, introducing grammar only where the situation needs it. Published mini-lessons are human-reviewed, versioned, stable across learners, and complementary to the browsing-to-fluency loop rather than a comprehensive curriculum.
_Avoid_: Full course unit, generated lesson, content feed

**Micro-story**:
One coherent everyday scene of four to six short Dutch sentences or dialogue turns, normally about thirty-five to sixty words, that gives a mini-lesson's practical pattern and learning items meaningful context. It is read first, revisited with less support after practice, and is not a collection of unrelated example sentences.
_Avoid_: Anchor sentence, long-form story, example list, grammar explanation

**Lesson library**:
The reviewed collection of curated mini-lessons bundled and versioned with DutchMate, organized by practical life pathway with each lesson title prefixed by its CEFR level. It is available without a separate content download and grows through normal product releases.
_Avoid_: Lesson marketplace, remote content feed, generated catalog

**Lesson filter**:
A compact, functional control that narrows the lesson library by learner status or CEFR level. An in-progress row carries its own current stage rather than making a lesson stage a global filter.
_Avoid_: Decorative chip, stage filter, lesson category badge

**Starter lesson library**:
The first twelve curated mini-lessons, spanning all seven practical life pathways and introducing roughly forty to sixty lesson candidates. It is the initial useful teaching set, not a sample catalog or comprehensive course.
_Avoid_: Lesson preview, full curriculum, content demo

**Practical life pathway**:
An ordered group of mini-lessons built around accomplishing related everyday tasks, with A0-A2 difficulty progressing inside the pathway. It organizes learning by real-life usefulness rather than by an isolated grammar or CEFR syllabus.
_Avoid_: Grammar chapter, CEFR section, flat topic list

**Engagement layer**:
The restrained set of playful feedback and motivation mechanisms that helps learners return to meaningful Dutch practice. It measures and rewards learning actions without becoming a separate game economy.
_Avoid_: Gamification system, rewards economy, entertainment mode

**Learning rhythm**:
The calm engagement pattern built from a small daily review goal, weekly consistency, a grace day, mastery celebrations, and practical learning milestones. It encourages returning without punishing a missed day or rewarding activity that lacks learning value.
_Avoid_: Endless streak, experience points, daily obligation

**Activity ledger**:
The durable local calendar record behind the learning-rhythm heatmaps. It counts completed reviews, newly saved learning items, and completed lessons by local day; opening or abandoning a lesson creates no activity.
_Avoid_: Session log, passive activity, telemetry

**Daily Five**:
The default daily goal of practising five learning items, taking due items first and then new saved items when capacity remains. Completing five is enough; continuing is optional, and an undersized queue may prompt a mini-lesson without starting one automatically.
_Avoid_: Clear-all-due target, daily quota, timed session

**Meaningful chunk**:
A reusable Dutch multiword expression whose meaning or use is best learned as a unit, such as a collocation, fixed expression, idiom, or separable verb pattern. An arbitrary selected phrase or complete sentence is not automatically a meaningful chunk.
_Avoid_: Any phrase, sentence card, text selection

**Learning item**:
One learner-controlled unit in saved vocabulary: either a Dutch word or a meaningful chunk. It is the stable subject of contextual practice and progress, while the sentence where it appeared remains supporting page context.
_Avoid_: Saved translation, text selection, complete sentence

**Lesson candidate**:
A curated word or meaningful chunk introduced by a mini-lesson but not yet placed in saved vocabulary. Lesson candidates are preselected in the completion summary, may be removed there, and become learning items only after the learner confirms Keep for review.
_Avoid_: Automatically saved lesson word, required vocabulary, separate lesson card

**Learning-item source**:
A confirmed webpage capture or chosen lesson candidate that contributes to a learning item. Multiple sources enrich one canonical learning item and share its mastery rather than creating separate browser and lesson copies.
_Avoid_: Duplicate card, separate lesson vocabulary, translation history

**Learning encounter**:
A deliberate DutchMate interaction with a saved learning item while it appears on a webpage, recorded locally with a small capped set of recent contexts. It is evidence of exposure, not successful recognition or recall.
_Avoid_: Page scan, passive page view, mastery proof, complete browsing history

**Context mission**:
A short guided practice exercise anchored in Dutch that the learner deliberately selects on a real webpage. A first encounter rebuilds the Dutch in context, while an eligible saved repeat can test meaning before reveal or rebuild the Dutch for recall.
_Avoid_: Mini-lesson, generic quiz, news feed, passive translation

**Mission evidence**:
A completed repeat Context Mission result that may update one recognition or recall dimension once for an existing learning item. A first-encounter mission remains exposure and cannot award mastery before the learner chooses to save the item.
_Avoid_: Mission progress, experience points, retroactive mastery, duplicate practice result

**Local learning record**:
The on-device record of saved vocabulary, mastery, lesson progress, learning rhythm, and capped encounter contexts that can move through DutchMate's versioned export and import. It requires no account and is not a cloud learner profile.
_Avoid_: Account, cloud progress, browser history

**Learning-language key**:
The explicit language identity that scopes every learning item and its mastery inside the local learning record. `002-learnloop` uses Dutch as its only learning-language key, without exposing a language switch or claiming to teach Telugu.
_Avoid_: Translation direction, helper language, multilingual learning mode

**Learning validation**:
The evidence used to judge whether DutchMate improves durable recognition, recall, and reduced-support story comprehension, gathered through learner-visible local progress and small voluntary learner studies. It excludes background learning telemetry and activity-only success measures.
_Avoid_: Engagement analytics, review count, silent telemetry

**Real-world transfer**:
The primary product outcome in which DutchMate practice makes a learner better able to understand, explain, or act on Dutch encountered outside DutchMate. Enjoyment and playful feedback support this outcome but are not substitutes for it.
_Avoid_: Time in app, content consumption, engagement alone

**Explicit capture**:
The learner-controlled path in which DutchMate presents a selected word or candidate meaningful chunk with its normalized learning form, meanings, and page context, and saves it only after confirmation.
_Avoid_: Automatic saving, translation history, unconfirmed suggestion

**Saved vocabulary**:
The learner-controlled collection of Dutch learning items they intentionally keep for later study. It may contain words and meaningful chunks, and is not an automatic record of every translation request.
_Avoid_: Translation history, synced word bank

**Review card**:
The learner-facing practice representation of one learning item, assembled from its available Dutch, English, and Telugu meanings and supporting context. Its answer may show a Telugu phonetic helper and translations of the saved context sentence; it is not an individual saved translation pair.
_Avoid_: Saved translation, flashcard entry, word pair

**Page context**:
The short sentence or text snippet the learner encountered when saving a learning item. It is optional supporting context for a review card and stays local with the learner's saved vocabulary.
_Avoid_: Generated example, translation history, webpage archive

**Context translations**:
The English and Telugu renderings of a saved page context shown with its Dutch original after a review-card reveal. They are supporting comprehension, not generated replacement examples.
_Avoid_: Generated sentence, sentence coaching, translation history

**New learning item**:
A saved review card that has not yet received a rating. It belongs to the separate first-practice queue rather than the scheduled due-review queue.
_Avoid_: New word, unreviewed due item, unscheduled translation

**Due learning item**:
A previously reviewed review card whose next scheduled review time has arrived. New learning items are not due until their first rating is recorded.
_Avoid_: Due word, every saved item, pending translation

**Mastery state**:
A revisable estimate of learning durability, expressed as New, Learning, Familiar, or Strong. DutchMate tracks recognition and recall separately, lets failed evidence weaken the relevant dimension, limits overall mastery by the weaker dimension, and treats webpage encounters as exposure rather than proof of mastery.
_Avoid_: Permanent mastery, repetition count, self-rating, experience points

**Recognition mastery**:
The revisable estimate of how durably the learner can understand a learning item when encountering its Dutch form in context.
_Avoid_: Passive mastery, page view, exposure count

**Recall mastery**:
The revisable estimate of how durably the learner can produce a learning item's Dutch form from its meaning or supporting context.
_Avoid_: Active mastery, typing score, self-rated knowledge

**Flashcard-first practice**:
The tap-to-reveal practice model in which DutchMate adapts card direction and supporting context to strengthen recognition or recall without requiring typed input. The interaction stays consistent even as scheduling and challenge change behind the scenes.
_Avoid_: Typing exercise, exercise ladder, quiz form

**Focused practice flow**:
A lesson, Daily Five, or Saved Quiz in progress. It retains the originating selected popup tab as an orientation marker, locks tab navigation, and provides an explicit Exit action.
_Avoid_: Hidden navigation, free tab switching, modal dialog

**Practice result**:
The learner's binary response after revealing a review card: Again or Got it. DutchMate interprets the result together with card direction and prior spaced practice, rather than asking the learner to choose a schedule.
_Avoid_: Difficulty rating, interval choice, quiz score

**Unified review queue**:
The single daily flashcard queue for due learning items, regardless of whether they came from a confirmed webpage capture or a chosen lesson candidate. Learning sources may remain visible as context, but they do not create separate schedules or practice systems.
_Avoid_: Lesson review queue, browsing review queue, duplicated progress

**Saved Quiz**:
A learner-started, shuffled practice pass through every saved learning item. Its results are real mastery and activity evidence, but it neither completes nor replaces the Daily Five goal.
_Avoid_: Daily Five, mock quiz, separate vocabulary system

**Early learning companion**:
The product posture for the first public release. DutchMate helps learners notice and keep useful words while reading, without yet claiming a full flashcard or spaced-repetition practice loop.
_Avoid_: Generic translator, complete study system

**Translation cache**:
The automatic local store used to speed up repeat lookups and reduce provider cost. It is a performance feature, not a learner-facing record of what the user chose to study.
_Avoid_: Saved words, vocabulary list

**Normal readable webpage**:
The supported browsing surface for the first public release: ordinary web pages where text can be read and selected in a stable way. It excludes hostile or special surfaces such as browser-internal pages, PDFs, and rich text editors.
_Avoid_: Any website, all web content

**Reliable daily-use baseline**:
The release bar for the first production version of DutchMate. It means the current feature set is trustworthy enough for repeated real-world reading sessions without requiring a rewrite or a broader product expansion.
_Avoid_: Beta quality, polished rewrite

**Hosted translation backend**:
The single DutchMate-operated online service the extension calls for public translations. It is the stable production boundary that hides provider choice from the browser extension.
_Avoid_: User-configured translation service, offline engine

**Online-only with clear errors**:
The service expectation for the first public release. DutchMate depends on the hosted backend for translations, and when that service is unavailable it should fail fast, explain the problem clearly, and recover cleanly on the next request.
_Avoid_: Offline translation mode, silent failure

**Single feedback intake**:
The soft-launch support model where users can reach DutchMate through either direct email or a minimal website feedback form, but both routes feed the same review workflow.
_Avoid_: Separate support systems, analytics-heavy issue collection
