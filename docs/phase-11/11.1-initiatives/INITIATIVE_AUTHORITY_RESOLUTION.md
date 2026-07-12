# Initiative Authority Resolution

**Build:** 11.1 · **Wave:** W3

Authority resolution runs before every command via `resolveInitiativeAuthority()` in `services/policy.ts`.

## Sequence

1. Confirm actor (Human or governed service identity)
2. Confirm institution context and membership
3. Load initiative and verify institution scope
4. Map command type to required permission
5. Return `Allowed`, `Denied`, `Approval Required`, or `Institution Context Mismatch`

## Service Identity Limits

Service identities may run projections and reminders. They may not approve, activate, cancel, complete, or archive unless executing a pre-approved Human decision.

## Permissions

Permission keys are defined in `INITIATIVE_PERMISSIONS` in `commands.ts` (e.g. `initiative.activate`, `initiative.approve`).

## Coalition Note

Participating institution roles do not grant host-institution authority. Full coalition rules deferred to Build 11.9.
