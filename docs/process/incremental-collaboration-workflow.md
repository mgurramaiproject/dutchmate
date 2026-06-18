# Incremental Collaboration Workflow

Use this note when starting a new project, chat, or Codex session and you want the same careful working style used for DutchMate.

## Starter Prompt

```text
I want to work incrementally, one focused step at a time.

Please:
- First inspect the repo and understand the current state.
- Ask before choosing major product or architecture directions.
- Recommend the next best small step, then wait for my approval.
- Implement only that approved step.
- Run relevant verification.
- Commit each completed step with a clear message.
- Then stop and ask "What is next?" instead of doing multiple future steps.
- Explain what changed in beginner-friendly terms so I can learn.
- Avoid big refactors unless we explicitly agree they are needed.
```

## Short Version

```text
I prefer a teaching/collaboration style like we used for DutchMate: small scoped increments, options when there are meaningful choices, safe commits after each step, and no rushing ahead.
```

The most important instruction is: **one focused step at a time, wait for my approval before the next step.**

## Why This Works

- It keeps the project understandable while it grows.
- It makes each commit easier to review and revert if needed.
- It gives the user a chance to learn the codebase instead of receiving a large finished system all at once.
- It reduces accidental architecture decisions by making important choices explicit.
