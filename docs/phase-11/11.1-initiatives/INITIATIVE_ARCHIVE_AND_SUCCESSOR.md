# Initiative Archive and Successor

**Build:** 11.1 · **Wave:** W3

## Archive

`ArchiveInitiativeCommand` requires `completed` or `cancelled` status, retention metadata, and archive authority. Archived records are read-only.

## Successor

`CreateSuccessorInitiativeCommand` creates a new `initiative_id` with explicit lineage to source initiative. Successor follows full approval lifecycle.

## Restoration

`RestoreInitiativeCommand` is exceptional. Direct restoration to `active` is denied. Permitted targets: `design`, `approval_pending`, `preparation`.
