# Initiative Lifecycle Engine

**Build:** 11.1 · **Wave:** W3 · **Subsystem:** INI-SVC-001

## Canonical State Machine

Defined in `state-machine.ts` and `data/phase-11/initiative_state_machine.json`. All transitions go through `transitionStatus()` in `domain-service.ts`.

## Key Rules

- Illegal transitions (e.g. `concept → active`) return `INITIATIVE_TRANSITION_NOT_ALLOWED` with required intermediate states.
- `SubmitInitiativeForReviewCommand` walks lawful intermediate states (`discovery`, `design`) before `approval_pending` when charter validation passes.
- Archived initiatives are read-only (`INITIATIVE_ARCHIVED_READ_ONLY`).
- Restoration cannot jump directly to `active`; targets are `design`, `approval_pending`, or `preparation`.

## Distinct End States

| State | Meaning |
|-------|---------|
| `paused` | Temporary execution hold |
| `cancelled` | Governed termination before completion |
| `completed` | Closeout validated |
| `archived` | Terminal read-only retention |

## History

Every transition writes an append-only `InitiativeHistoryEvent` with actor, prior state, new state, and correlation IDs.

## Tests

`w3-tests.ts` — state machine permitted/prohibited transitions; restoration denial.
