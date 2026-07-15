# DutchMate

DutchMate is a browser-based Dutch learning product for people who read the web while moving between Dutch, English, and Telugu. This glossary captures the product language that shapes feature scope, privacy boundaries, and release decisions.

## Language

**Learning triangle**:
The core language set DutchMate is designed around: Dutch, English, and Telugu. It describes the intended learner flow rather than a generic "multi-language" product.
_Avoid_: Language pack, universal translation

**First audience**:
The initial public user group DutchMate is intentionally optimized for: Telugu-speaking people in the Netherlands who already use English and are learning Dutch through everyday web reading.
_Avoid_: Everyone, general translation users

**Saved vocabulary**:
The learner-controlled list of single-word translations they intentionally keep for later study. It is part of the learning feature set, not an automatic performance mechanism.
_Avoid_: Translation history, synced word bank

**Review card**:
One study item centered on a Dutch learning word and assembled from the available Dutch, English, and Telugu meanings. It is the learner-facing unit used during vocabulary practice, not an individual saved translation pair.
_Avoid_: Saved translation, flashcard entry, word pair

**Page context**:
The short sentence or text snippet the learner encountered when saving a word. It is optional supporting context for a review card and stays local with the learner's saved vocabulary.
_Avoid_: Generated example, translation history, webpage archive

**New word**:
A saved review card that has not yet received a rating. It belongs to the separate first-practice queue rather than the scheduled due-review queue.
_Avoid_: Unreviewed due word, unscheduled translation

**Due word**:
A previously reviewed review card whose next scheduled review time has arrived. New words are not due words until their first rating is recorded.
_Avoid_: Every saved word, pending translation

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
