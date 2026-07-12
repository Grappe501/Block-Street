# Initiative Review and Pause Service

**Build:** 11.1 · **Wave:** W3

## Review

Review records exist in canonical model (`InitiativeReview`). Schedule derivation from governance class is MVP-deterministic; full ops scheduling in W7.

## Health States

Derived: Healthy, Needs Attention, At Risk, Critical, Unknown — from owner eligibility, overdue review, blocking dependencies.

## Pause / Resume

`PauseInitiativeCommand` and `ResumeInitiativeCommand` require reason, owner authority, and lifecycle-valid transitions.

## Zombie Detection

Overdue reviews generate warnings; initiatives are not auto-closed.
