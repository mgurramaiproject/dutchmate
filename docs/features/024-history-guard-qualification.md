# Feature 024 — History Guard

Status: fix in progress

Codename: `history-guard`

## User report

Firefox users reported that an automatic update from DutchMate 0.5.0 could show
an empty learned-history view.

## Finding

The local storage adapter treated a `storage.local.get` runtime error as if the
key did not exist. Migration then wrote an empty learning record and marked the
migration complete. A later update could not retry that migration.

## Safety boundary

- A local storage read failure rejects the migration and leaves the existing
  record and migration marker unchanged.
- Migration remains idempotent for a valid current record.
- If an earlier failed migration left an empty current record while the legacy
  saved-vocabulary or review-card data still exists, the next startup restores
  that legacy history.
- If the current record is only partially populated, missing legacy items are
  added and legacy review evidence can restore a still-new current item without
  replacing progress that is already present.
- This does not claim to recover data that Firefox already removed after an
  uninstall or a genuinely new add-on identity.

## Verification

- The focused migration test reproduces the destructive read-error path.
- The focused recovery test covers an empty record with an existing migration
  marker and retained legacy data.
- `corepack pnpm exec vitest run src/background/storage-migration.test.ts src/background/local-cache-storage.test.ts src/vocabulary/learning-record.test.ts`

## Release note

Ship this correction in the next Firefox patch release after rebuilding and
testing the Firefox package against an existing 0.5.0 profile. Do not describe
it as a recovery of data already removed by Firefox.
