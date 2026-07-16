# Event Core Record Checklist Protocol — CAL-P2 Wave 4B

## Item shape

Each checklist item records category, label, required flag, blocksReadiness, fieldSnapshot from canonical event, and soft-beta authority flags.

## Seed logic

`ensureCoreRecordFromEvent` derives initial item status from canonical event fields:

- Missing `owned_by_team` and `primary_contact` → ownership blocked
- Missing or invalid schedule → schedule blocked
- TBD or missing venue → venue not_started or blocked

## Routes

- Event: `/core-record`, `/ownership`, `/schedule`, `/venue`
- Command: `/core-records`, `/missing-ownership`, `/schedule-gaps`, `/venue-gaps`
- Edit surface links into core record checklist

## Honesty

Calendar venue record ≠ venue contract approval. Event Board oversight ≠ operational ownership.
