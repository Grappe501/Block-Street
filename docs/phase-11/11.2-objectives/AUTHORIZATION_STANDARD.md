# Authorization Standard

Every protected endpoint evaluates:

1. Verified identity (invitation-based membership)
2. Institution context
3. Effective permissions from gateway + membership
4. Domain reauthorization on mutation

## Advisory Permissions

`GET /objectives/{id}/permissions` returns available actions for UX only. Server always revalidates before command execution.

## Client Authority Prohibition

`stripUntrustedIdentityFields` removes actor, institution, membership, lifecycle state, and owner fields from mutation bodies.
