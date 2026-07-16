# CPOS Durable Authority 1.1

**Program ID:** `CPOS-DURABLE-AUTHORITY-1.1`  
**Predecessor:** `CPOS-DURABLE-AUTHORITY-1.0`

> Move authority records toward durable storage and prove that every state-changing route is inventoried, classified, and protected.

## Part 1 — Full mutation inventory

Run:

```bash
npm run authority:inventory
```

Output: `data/authority/mutation-inventory.json`

**Baseline (2026-07-16):** 455 mutations inventoried — 0 scope-protected, 393 base-gated only, 30 unprotected, 11 public by design, 4 legacy unused, 4 needs investigation (calendar server actions using demo user). Re-run after each coverage sprint.

Each entry is classified as one of:

| Classification | Meaning |
|---|---|
| `protected` | Gateway + permission + scope resolver (appointment-aware when enforcement enabled) |
| `base_gated_only` | Gateway or admin permission check without scope resolver |
| `authenticated_only` | Session required but no permission gate |
| `unprotected` | No gateway, no permission check |
| `public_by_design` | Auth bootstrap, health, or explicitly public endpoints |
| `legacy_unused` | Marked legacy — verify before removal |
| `needs_investigation` | Ownership or protection unclear |

The inventory includes:

- API routes (`POST`, `PUT`, `PATCH`, `DELETE`)
- Server actions (`"use server"` mutations)
- Cross-reference to `protected-routes.json`

## Part 2 — Postgres authority schema (shadow-ready)

Migration: `database/migrations/20260716060000_authority_p1_core.sql`

### Core tables

```text
authority_roles
authority_permissions
authority_role_permissions
authority_appointments
authority_appointment_scopes
authority_scope_edges
authority_denial_events
authority_override_events
```

**No `authority_users` table.** Canonical users remain in `data/auth/users.json` (`user_id` text). Appointments reference `user_id` directly until identity Postgres promotion.

### Appointment record

```text
appointment_id
user_id
role_key
status
starts_at
ends_at
appointed_by
appointment_reason
created_at
updated_at
```

### Scope binding (`authority_appointment_scopes`)

```text
appointment_id
scope_type
scope_id
relationship
```

Examples: `county:clark`, `cluster:southwest`, `institution:henderson-state`, `functional_lane:outreach`

### Denial audit (`authority_denial_events`)

Captures: actor, permission, resource, requested scope, route, method, decision reason, timestamp, correlation ID.

Does **not** capture: passwords, session tokens, message bodies, voter records, or unnecessary request payloads.

## Build order (from 1.0 baseline)

```text
1. Complete full mutation-route inventory          ← 1.1 Part 1
2. Assign permission and scope resolver to each mutation
3. Identify remaining base-gated and unprotected routes
4. Design narrow Postgres authority schema         ← 1.1 Part 2
5. Add shadow persistence for appointments and denial events
6. Compare JSON and Postgres authorization decisions
7. Add CSRF and validation to onboarding mutations
8. Build Wave 2 onboarding
9. Build live Outreach queue
10. Promote authority storage to Postgres primary
11. Build committee bulletin board under scoped authorization
12. Add MFA before broad leadership activation
```

## Verification

```bash
npm run authority:inventory
npm run test:mutation-inventory
npm run test:durable-authority
npm run preflight:h-drive
```

## Wave 2 onboarding authority boundaries

See parent program doc for Volunteer / Outreach Manager / Volunteer Manager permission matrices. Wave 2 must use the resolver from the beginning — no parallel permission model.

## RedDirt integration

Before county leaders see voter-derived information, Block-Street must resolve authorization at scope + data tier. Platform administration must not automatically imply unrestricted voter-data access.
