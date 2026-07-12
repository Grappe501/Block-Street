# Initiative Approval and Activation

**Build:** 11.1 · **Wave:** W3

## Approval

`ApproveInitiativeCommand` binds approval to current charter version, records conditions, sets `charter_status: approved`.

## Activation Readiness

`validateCharter(aggregate, "activation")` plus owner eligibility and `evaluateDependencyReadiness()`.

## Activation Transaction

`activate()` in one flow:

1. Lock version (optimistic concurrency)
2. Revalidate charter, owners, dependencies
3. Transition `preparation → active`
4. Mark charter `active_version`
5. Persist aggregate + history + domain event

Rollback on any failure before persist.

## Blocking Conditions

Approval conditions and missing review date block activation until satisfied.
