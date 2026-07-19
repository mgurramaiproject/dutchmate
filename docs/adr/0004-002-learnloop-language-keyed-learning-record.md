# Keep the Dutch learning product on a language-keyed record

`002-learnloop` will teach Dutch only, but every new learning item and mastery record will carry an explicit learning-language key rather than deriving its identity from hardcoded Dutch fields or an `nl` prefix. This accepts a small schema cost now so a separately justified future Telugu-learning mode would not require another identity migration, while deliberately excluding language switching, Telugu lessons, and bidirectional teaching UI from the current roadmap.
