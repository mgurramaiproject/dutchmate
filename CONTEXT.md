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

**Foundation progression**:
The deliberately bounded DutchMate learning range from A0/Pre-A1 through A1 to A2. It supports beginners becoming increasingly independent with practical Dutch without extending the current product promise to B1 or above.
_Avoid_: A0-B1 pathway, full fluency path, advanced Dutch course

**Open foundation path**:
The ordered A0-A2 learning path in which DutchMate recommends the earliest incomplete pattern while leaving every unit visible and directly selectable. It requires no placement test, learner-level setting, locked level, or additional starting-point control.
_Avoid_: Placement flow, level gate, learner-level profile

**Capability progression**:
Learner-visible movement through the foundation progression based on demonstrated recognition and controlled application of practical Dutch. It is evidence from DutchMate learning activities, not proof of uncued production, lesson completion alone, or a claim of formal CEFR certification.
_Avoid_: Course completion level, certified CEFR level, engagement score

**Verb Path**:
A pattern-first A0-A2 grammar sequence threaded through the existing practical mini-lessons and Lessons library, not a separate learner-facing library or navigation area. High-utility Dutch verbs make conjugation and sentence structure concrete through explanation, guided construction, retrieval, and contextual application, while conjugation tables remain supporting references.
_Avoid_: 100-verb catalog, conjugation-table course, tense encyclopedia

**Click-only grammar practice**:
The exercise contract in which learners choose forms, transform prompts, and reconstruct Dutch with tap-, click-, or keyboard-operated controls without entering text. Its results are evidence of supported recognition and controlled application, not independent written production.
_Avoid_: Typed answer, free-form response, uncued-production claim

**Grammar exercise primitive**:
A deterministic click-only interaction reused inside Lessons, Daily Five, or Encounter Coaching, such as choosing or contrasting a verb form or building, transforming, and repairing sentence order. Released instances are manually authored unless a bounded template can enumerate and expose every resulting sentence, answer, accepted alternative, distractor, and feedback item for build-time validation and human review. Verb Gym and Sentence Forge may group these primitives for authoring, but they are not learner-facing modes or separate progress systems.
_Avoid_: Grammar mode, second practice queue, standalone exercise course

**Grammar content pack**:
A reviewed, versioned set of deterministic exercises attached to the existing Verb Path and its pattern IDs. The first pack hardens the four shipped A0 patterns; it is not a learner-facing destination, separate queue, or promise of a fixed exercise count.
_Avoid_: Grammar product, Verb Gym destination, fixed verb catalog

**Grammar companion**:
Separately identified and versioned pattern teaching and click-only practice attached to a compatible lesson without replacing that lesson, changing its identity, or invalidating its completion. Completing the earlier lesson does not retroactively award pattern progress; the additional practice remains available inside the lesson flow.
_Avoid_: Replacement lesson, completion reset, separate grammar destination

**Grammar feedback**:
A deterministic correction that connects a scored wrong answer to one known misconception, one relevant rule, and one reviewed contrast or corrected form. If DutchMate cannot enumerate the accepted alternatives and explain a rejection accurately, the exercise is not eligible for release.
_Avoid_: Generic incorrect message, random distractor, fuzzy grammar judgment

**Grammar content review**:
The release gate that combines automated inspection of every expanded learner-visible grammar item with human linguistic review. The internal tracer may be self-reviewed, but public content must also be checked by a second fluent Dutch reviewer with grammar-teaching competence; formal NT2 certification is not required, and reviewer, date, and reference sources are recorded.
_Avoid_: AI approval, author-only public review, certification requirement

**Grammar learning record**:
The minimum local evidence needed to resume practice, schedule a studied pattern, prevent immediate repetition, and support its honest progress state. It contains the current Daily Five snapshot, per-pattern state and due date, compact evidence markers, bounded misconception counters, and only the recent exercise identifiers needed for selection; it excludes raw webpage text, selected sentences, response times, full attempt histories, and behavioral timelines.
_Avoid_: Event log, page-content history, analytics profile

**Encounter coaching**:
An optional grammar-practice offer attached to text DutchMate already handles during an ordinary learner-triggered hover or selection when that Dutch confidently matches a previously studied pattern. It does not scan pages for exercises, interrupt unmatched encounters, or treat a first explanation as mastery evidence.
_Avoid_: Automatic page scan, passive grammar highlighting, unrelated-content analysis

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

**Pattern progress**:
The learner-visible grammar states Introduced, Practising, and Applied. Applied requires scored recognition and controlled application across varied exercise primitives, lexical contexts, sessions, and at least one delayed attempt with unseen or recombined material; the states do not represent points, independent production, or formal proficiency.
_Avoid_: Experience level, lesson-completion badge, certified mastery

**Learning rhythm**:
The calm engagement pattern built from a small daily review goal, weekly consistency, a grace day, mastery celebrations, and practical learning milestones. It encourages returning without punishing a missed day or rewarding activity that lacks learning value.
_Avoid_: Endless streak, experience points, daily obligation

**Activity ledger**:
The durable local calendar record behind the learning-rhythm heatmaps. It counts completed reviews, newly saved learning items, and completed lessons by local day; opening or abandoning a lesson creates no activity.
_Avoid_: Session log, passive activity, telemetry

**Daily Five**:
The single default daily goal of completing five high-value practice tasks across saved learning items and previously studied grammar patterns. Due work comes first, grammar initially occupies at most two positions so vocabulary practice remains protected, completing five is enough, and continuing is optional.
_Avoid_: Clear-all-due target, daily quota, timed session

**Grammar Minute**:
An internal packaging label for a concise grammar task or sequence delivered through the existing Today or Daily Five flow. It does not create a grammar destination, fixed feature mix, second queue, or separate progress record.
_Avoid_: Grammar tab, grammar session, second scheduler

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

**Canonical Dutch form**:
The one safe Dutch word that identifies a cross-language capture and can become the learning item's Dutch key. It follows the existing normalized Unicode letter/number plus apostrophe/hyphen eligibility rule; if a result is ambiguous, multi-word, or otherwise not one safe form, DutchMate may explain it but does not save it without an explicit learner choice.
_Avoid_: First translation returned, guessed Dutch key, provider text

**Cross-language capture**:
A learner-controlled save that starts from English or Telugu webpage text but resolves to one Dutch learning item, retaining the source language and original page context alongside the Dutch, English, and Telugu helpers.
_Avoid_: Source-only saved word, multilingual learning mode, automatic language switching

**Source-language provenance**:
The language identity of the webpage text that the learner deliberately selected when saving a learning item. It explains where the capture began without changing the item's Dutch learning-language key.
_Avoid_: Translation direction, detected language as mastery scope, browsing telemetry

**Cross-language encounter**:
A deliberate or hover interaction with a saved learning item through its Dutch, English, or Telugu form on a webpage. It can show the learner that the item was seen before and retain bounded original context plus provenance, while helper context translations remain a deliberate-save concern and only Dutch encounters qualify for the current contextual recall and reconstruction missions.
_Avoid_: Reverse-language mastery, passive page scan, multilingual practice mode

**Source-language resolution**:
The ordered process that identifies a webpage's active language for translation and saved-item matching. An explicit non-`auto` source setting wins; automatic mode uses Telugu script in the selected text, supported nearest page metadata, then Dutch/English lexical evidence. If automatic resolution remains unresolved, translation may continue but Save and provenance assignment stop; a saved-form match can support a `Seen before` cue but never overrides a confident source or invents a saved-item identity.
_Avoid_: Browser locale, guessed mastery language, silent language switch

**Learning validation**:
The evidence used to judge whether DutchMate improves durable recognition, recall, and reduced-support story comprehension, gathered through learner-visible local progress and small voluntary learner studies. It excludes background learning telemetry and activity-only success measures.
_Avoid_: Engagement analytics, review count, silent telemetry

**Real-world transfer**:
The primary product outcome in which DutchMate practice makes a learner better able to understand, explain, or act on Dutch encountered outside DutchMate. Enjoyment and playful feedback support this outcome but are not substitutes for it.
_Avoid_: Time in app, content consumption, engagement alone

**Explicit capture**:
The learner-controlled path in which DutchMate presents a selected word or candidate meaningful chunk with its normalized learning form, meanings, and page context, and saves it only after confirmation.
_Avoid_: Automatic saving, translation history, unconfirmed suggestion

**Selection auto-save**:
The separate opt-in setting that can save eligible Dutch single-word selections without a Save-button click. It is off by default, does not apply to cross-language English/Telugu capture in `006-bridge`, and is unrelated to the translation cache.
_Avoid_: Translation caching, background saving of hover text, automatic page scan

**Saved vocabulary**:
The learner-controlled collection of Dutch learning items they intentionally keep for later study. It may contain words and meaningful chunks, and is not an automatic record of every translation request.
_Avoid_: Translation history, synced word bank

**Review card**:
The learner-facing practice representation of one learning item, assembled from its available Dutch, English, and Telugu meanings and supporting context. Its answer may show a Telugu phonetic helper and translations of the saved context sentence, with the original context language labeled separately from helper translations; it is not an individual saved translation pair.
_Avoid_: Saved translation, flashcard entry, word pair

**Page context**:
The short sentence or text snippet the learner encountered when saving a learning item, retained in the source language in which it appeared and validated against the selected source occurrence rather than requiring Dutch text. Up to three recent contexts can support one Dutch learning item; each remains optional supporting context for a review card and stays local with the learner's saved vocabulary.
_Avoid_: Generated example, translation history, webpage archive

**Context translations**:
The fixed English and Telugu renderings of a saved page context shown with its original sentence after a review-card reveal; the source-language rendering is copied through, each helper is independently best effort, and later captures fill only missing helpers. They are supporting comprehension, not generated replacement examples.
_Avoid_: Generated sentence, sentence coaching, translation history

**Context provenance**:
The optional source-language identity attached to one saved page context. It distinguishes Dutch, English, Telugu, and older unknown contexts without changing the learning item's Dutch identity; unknown legacy provenance is never inferred later from matching text.
_Avoid_: Item language switch, browser locale, raw page metadata

**Cross-language merge**:
The canonical merge rule for repeated captures of one learning item: one Dutch item remains, while contexts deduplicate by normalized text and source language and fill missing translations or provenance.
_Avoid_: Duplicate vocabulary row, source-specific mastery, overwrite history

**Seen-before cue**:
The learner-facing signal that a confident unique local match found an existing saved item in the current webpage text. It does not require a sentence, remains truthful if encounter persistence later fails, and uses the same wording across Dutch, English, and Telugu surfaces; ambiguous helper matches stay silent.
_Avoid_: Mastery proof, passive page scan, translation confidence

**Cross-language capture scope**:
The current cross-language capture improvement applies to single words whose Dutch canonical form can be resolved. Dutch meaningful chunks retain their existing dedicated eligibility and practice rules until a separate cross-language chunk design exists.
_Avoid_: Arbitrary translated phrase, automatic chunking, multilingual chunk practice

**Optional page context**:
A bounded source sentence from the exact selected occurrence that enriches a saved word when the webpage exposes it safely. If the occurrence is uncertain, context is omitted; its absence never invalidates the deliberate word save or the canonical learning item.
_Avoid_: Required sentence capture, generated replacement context, browsing history

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
