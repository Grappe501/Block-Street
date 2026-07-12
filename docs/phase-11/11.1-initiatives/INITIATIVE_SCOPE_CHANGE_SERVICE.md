# Initiative Scope Change Service

**Build:** 11.1 · **Wave:** W3

Material scope changes cannot hide inside ordinary edits.

## Classification

Editorial, minor operational, material scope, major strategic, emergency temporary.

## Flow

`RequestScopeChangeCommand` → impact review → `ApproveScopeChangeCommand` → new charter version via `versioning.ts`.

## Governing Institution

Changing governing institution is not a normal field update; requires transfer review or successor initiative.

## Emergency Scope

Temporary expansions require expiration and rollback plan (policy hook in domain service).
