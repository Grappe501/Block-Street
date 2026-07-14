# V2-B.5 — Durability Prep for Approved Templates

**Status:** Approved templates frozen on `static_seed` · Postgres not live · personnel assign still off  
**Preserves:** V2-A.3 hierarchy · enrollment-share campus goals · Blobs+seed · sensitive mutations disabled  
**Twin:** `data/field-plan/approved-template-durability-registry.json`  
**Postgres map:** `data/v2/v2b-postgres-port-readiness-map.json` → entity `field_plan_approved_templates`

## What this is

A freeze of **approved** Field Plan responsibilities, task scaffolds, and KPI ids so durability work has a stable inventory. Storage class remains **static_seed** (deploy artifact). Dual-write and Postgres cutover are **not** started.

## Policy

| Rule | Status |
|------|--------|
| Approved-only freeze | Yes |
| Placeholders excluded from approve | Yes |
| Task templates unassigned | `not_assigned_until_postgres_rbac` |
| Personnel assignment | Disabled |
| Broad Field Plan ingest | Blocked |
| Invite-chain CERTIFIED PRESENT | Still named launch blocker |
| Postgres / Netlify Database | Not live |

## Commands

```bash
npm run field-plan:prep-durability
npm run test:v2b5-durability-prep
```

## Next

V2-B.6 / Postgres durability lane — dual-write candidates only after invite-chain CERTIFIED PRESENT and Operator gates; still no silent personnel assign.
