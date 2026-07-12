# Wave 5 API Handoff — Initiative Human Experience

Wave 4 UI demands the following from Wave 5 (INI-API-001).

## Required Queries

- `GET /initiatives/portfolio` — institution-scoped, role-filtered
- `GET /initiatives/{id}` — `InitiativeOverviewView`
- `GET /initiatives/{id}/charter` — workbench + section autosave
- `GET /initiatives/{id}/readiness` — blocking vs advisory
- `GET /initiatives/{id}/permissions` — `InitiativePermissionsView` for UI actions
- `GET /approvals/initiatives` — approval inbox

## Required Commands (existing W3 — expose via authenticated API)

All `InitiativeCommandType` values via `POST /initiatives/commands` with:

- Resolved `actor_human_id`, `institution_id`, `active_membership_id`
- `InitiativeCommandResult` + `HumanBlockedState` on failure
- Idempotency keys for high-impact commands

## Events for Live UI

- `InitiativeStatusChanged`
- `InitiativeOwnerAssigned`
- `InitiativeCharterApproved`
- `InitiativeDependencyResolved`
- `InitiativeReviewDue`

## Auth Integration

Replace `DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT` with Identity Trust Layer session + institution membership resolution.

## Error Contract

```json
{
  "result": { "success": false, "validation_errors": [] },
  "human_blocked": {
    "title": "...",
    "explanation": "...",
    "items": [],
    "next_action": "..."
  }
}
```
