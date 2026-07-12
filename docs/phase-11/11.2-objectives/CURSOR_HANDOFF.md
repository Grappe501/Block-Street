# Cursor Handoff — Build 11.2

## Start here

1. Read [01_CONSTITUTION.md](01_CONSTITUTION.md)
2. Read [EXECUTION_HIERARCHY.md](EXECUTION_HIERARCHY.md)
3. Run `npm run phase11:11.2:w1`

## W1 complete when

- All docs present
- `objective_types.json` has 13 types
- `objective_vocabulary.json` has 20+ terms
- `objective_lifecycle.json` has 12 states
- 40+ W1 requirements status `documented`
- `runObjW1Certification().documentation_complete === true`

## Next wave (W2)

Canonical data model: Objective, KeyResult, Workstream, Mission, Milestone, Deliverable, Task records; ERD; state machine JSON; database contract.

## Pattern

Mirror Build 11.1 wave structure exactly. W3 owns enforcement. W1 is documentation + contracts only.

## Dependency

Build 11.1 (INI-001) must be complete. Objectives attach to Initiatives via `initiative_id`.
