# Feature 015: Verb Journeys use an additive pack and skill record

Status: accepted

Feature 015 keeps the existing `Lesson` catalog records, lesson identities, and lesson completion semantics unchanged. Verb Journeys are represented by an additive authored verb pack that is exposed through the existing Lessons surface, while verb/form/skill/exercise-family evidence is stored in an additive section of the existing local learning record and backup/migration boundary. This preserves the shared deterministic exercise and review contracts without forcing verb skills into the narrower per-pattern GrammarRecord or creating a second queue, scheduler, or progress system.

The first slice deliberately defers cross-activity universal Continue and Saved-to-verb links when reliable lemma resolution is absent. This keeps the feature reversible and protects existing learning history while the `werken` vertical slice proves the content, evaluator, persistence, and UI seams.
