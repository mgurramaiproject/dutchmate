# Feature 021: Content Catalog uses versioned typed packages

Status: accepted

DutchMate's published authored content will use one catalog envelope containing
typed, versioned JSON packages for lessons, Verb Journey packs, grammar packs,
and contrast packs. A deterministic manifest and a shared loader expose those
packages to the existing UI, practice, and qualification seams.

The catalog is bundled and validated at build time. It is not a runtime
database, a generic record table, or a remote service in this feature. Learner-
owned Saved items, local learning history, and evidence remain in the existing
local learning-record boundary.

This preserves the extension's offline behavior and existing learner-history
contracts while making authored-content expansion additive and reviewable. A
future public remote catalog can serve the same package and manifest shape
without requiring learner accounts; private learner-data synchronization is a
separate identity decision.

Stable content IDs are never reused for a different meaning. Additive packages
do not affect existing evidence. Changes to meaning, accepted answers, targets,
or evidence semantics require a new content version and explicit compatibility
handling. Runtime inclusion requires structural validation and the existing
independent language/content review gate.

The trade-off is that content changes still require an extension release until
a remote catalog is justified. That operational cost is intentionally deferred
until the bundled schema, validator, review process, and release friction make
remote delivery worthwhile.

