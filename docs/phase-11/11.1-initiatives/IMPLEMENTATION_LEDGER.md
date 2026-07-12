# Build 11.1 — Implementation Ledger

**System ID:** INI-001 · **Build progress:** 25%

## Wave Status

| Wave | Name | Doc Status | Tech Status |
|------|------|------------|-------------|
| W1 | Initiative Constitution | Complete | Contracts only |
| W2 | Canonical Data and Lifecycle | **Complete** | TS model + contracts; store migration W3 |
| W3 | Service Engine | Next | Not started |
| W4–W8 | UI through Certification | Pending | — |

## W2 Deliverables

- [x] `02_DATA_MODEL.md` and 7 specialized model documents
- [x] `data/phase-11/initiative_database_contract.json` (10 tables)
- [x] `data/phase-11/initiative_state_machine.json` (14 states)
- [x] `data/phase-11/initiative_entity_schema.json`
- [x] `src/lib/civic-action/builds/11.1/data-model.ts` (canonical entities)
- [x] `state-machine.ts`, `versioning.ts`, `data-validation.ts`
- [x] `legacy-adapter.ts` (MVP → `InitiativeAggregate`)
- [x] 22 W2 requirements (`DATA-001`–`DATA-022`)
- [x] `scripts/phase11/11.1-w2.mjs`

## Canonical Model

`InitiativeRecord` is the single canonical initiative type. MVP `LegacyInitiative` in `store.json` projects via adapter until W3 migration.

## Next Wave

**11.1-W3** — Initiative Service Engine
