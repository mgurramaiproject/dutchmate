# Feature Parking Lot

This document preserves promising DutchMate feature directions that are intentionally deferred. Parked ideas are not rejected, scheduled, or ordered against committed work; each should be reconsidered only when its revisit signal becomes true.

## Automatic chunk suggestions

Detect potentially useful Dutch expressions on a webpage and invite the learner to capture them as meaningful chunks.

**Why parked:** Explicit learner-confirmed capture comes first. Automatic detection could interrupt reading, create noisy suggestions, and weaken learner control before DutchMate has evidence that it can identify and normalize high-quality chunks reliably.

**Revisit when:** Explicit chunk capture is stable, learners are successfully reviewing chunks, and real usage shows that learners regularly miss useful expressions they would have wanted to save.

## Cross-device learning synchronization

Synchronize learning progress across installations, either through browser-managed synchronization or an optional DutchMate account.

**Why parked:** The local learning record preserves zero-setup use and keeps vocabulary, mastery, lesson progress, and contexts on-device. Browser synchronization has storage and cross-browser constraints, while account synchronization introduces authentication, backend persistence, security, deletion, and privacy obligations.

**Revisit when:** Learner evidence shows that device loss or cross-device study is a recurring problem that versioned export and import do not solve adequately.

## Opt-in learning analytics

Collect consented anonymous product events about lesson and review behavior to study aggregate usage patterns.

**Why parked:** The first learning model needs qualitative observation and delayed learning checks, not a large stream of shallow activity events. Telemetry also requires consent, privacy documentation, durable event definitions, and careful interpretation.

**Revisit when:** Contextual mastery and mini-lessons are stable, a specific learning question cannot be answered through local evidence or a small voluntary study, and the minimum necessary event set can be justified clearly to learners.

## Telugu learning mode

Teach Telugu to learners who already know Dutch, using Dutch and English as helper languages and a separate Telugu learning-item, mastery, and curated mini-lesson experience.

**Why parked:** DutchMate's current language roles, canonical cards, review directions, product positioning, and accepted `002-learnloop` content all center on Dutch as the learning language. A credible Telugu mode needs Telugu-specific normalization, script and transliteration decisions, meaningful chunks, reviewed teaching content, separate progress queues, and learner validation; it is not a translation-direction toggle.

**Revisit when:** Dutch contextual mastery and mini-lessons are proven, Dutch-speaking demand for learning Telugu is validated, and there is capacity to create and review a genuine Telugu curriculum. Treat it as a separate exploration, potentially artifact family `003-telugu`.

## Automatic webpage highlighting

Scan readable webpages for saved or lesson-relevant learning items and mark them without waiting for a learner interaction.

**Why parked:** Interaction-based encounters preserve normal reading, avoid full-page scanning, and produce a clearer signal of learner attention. Automatic highlighting could add visual noise, page-performance cost, and privacy concerns.

**Revisit when:** Interaction-based encounter history is demonstrably useful and learners explicitly ask DutchMate to surface known or currently studied language during ordinary reading.

## Full game economy

Add experience points, levels, endless streaks, leagues, coins, avatars, and unlockable rewards.

**Why parked:** DutchMate's engagement layer should first reward durable learning and gentle consistency. A separate reward economy could optimize activity rather than recognition, recall, and useful Dutch.

**Revisit when:** The calm learning rhythm is established and evidence shows that learners need stronger motivation which cannot be met by meaningful progress feedback.

## Dutch-themed collectibles

Let learners earn cultural cards, sayings, city badges, or similar Dutch-themed objects through practice.

**Why parked:** High-quality collectibles require a continuing supply of accurate, culturally respectful text, translation, artwork, and review. If they do not unlock a learning activity or deepen a practical concept, they add decoration and maintenance without improving mastery.

**Revisit when:** DutchMate has a sustainable curated-content process and each collectible can deliver a concrete learning benefit, such as opening a cultural mini-lesson or authentic example.

## Personalized lesson templates

Use stable lesson structures while filling examples or practice cards with learning items from the learner's saved vocabulary.

**Why parked:** Personalization adds selection, difficulty, sequencing, and fallback rules before the human-curated mini-lesson model has established what a good lesson looks like.

**Revisit when:** A reviewed A0-A2 lesson library exists, contextual mastery is stable, and DutchMate has enough learner-approved saved vocabulary to personalize a lesson without lowering its quality.

## Social competition

Add friend challenges, shared streaks, leagues, or leaderboards.

**Why parked:** Social competition would introduce accounts, identity, synchronization, moderation, and comparison pressure before the individual learning loop is mature.

**Revisit when:** Learners repeatedly ask to practise with people they know, optional accounts are independently justified, and a cooperative design can support learning without public-pressure mechanics.

## Sentence coach

Explain Dutch grammar, word order, separable verbs, idioms, and why a sentence is constructed in a particular way.

**Why parked:** Contextual mastery is the first priority. Sentence coaching should later enrich that learning loop rather than become an isolated explanation tool.

**Revisit when:** Learners can practise words and phrases in context, and user evidence shows that sentence structure is the next recurring comprehension barrier.

## Pronunciation and listening

Add Dutch audio, listening recall, learner recording, and pronunciation feedback.

**Why parked:** This introduces audio sourcing, speech capture, feedback-quality, privacy, and cross-browser questions before the core contextual learning loop is mature.

**Revisit when:** Contextual mastery and curated mini-lessons have stable learning-item and progress models that audio practice can reuse.
