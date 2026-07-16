# CPOS Durable Authority 1.0

**Program ID:** `CPOS-DURABLE-AUTHORITY-1.0`

Every protected action resolves: **Actor + Permission + Resource + Scope**.

## Registries (data/authority/)

- permission-registry.json — business-action permissions
- scope-vocabulary.json — campaign, functional_lane, cluster, county, institution, committee, team, self
- role-permissions.json — role → permission mapping
- appointments.json — active leadership appointments (permission usable only when appointed)
- protected-routes.json — machine-readable mutation inventory (seed)
- denial-audit.jsonl — authorization denials (runtime append)

## Resolver

`src/lib/authority/resolver.ts` returns `AuthorizationDecision` with reason codes:
allowed_by_role, allowed_by_scope, platform_admin, missing_permission, outside_scope, inactive_appointment

## Enforcement

When `AUTHORITY_SCOPE_ENFORCEMENT_ENABLED` is true, API gateway routes may supply a `scopeResolver`.

## Verification

npm run test:durable-authority
npm run preflight:h-drive

## Postgres (Track A1 — next)

Users, roles, permissions, appointments, committee memberships, sessions, denial audit → durable records.
