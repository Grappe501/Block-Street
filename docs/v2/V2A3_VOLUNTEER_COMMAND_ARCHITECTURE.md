# V2-A.3 — Volunteer Command Architecture

**Ship posture:** Additive shell on Blobs + static seed  
**Next phase:** Field Plan ingestion / operationalization

## What’s live as shell

| Surface | Route | Parent |
|---------|-------|--------|
| Volunteer Command | `/admin/volunteer-command` | Director |
| College / Education Command | `/admin/college-command` | Volunteer Manager |
| County Volunteer Command | `/admin/counties/:slug/volunteer-command` | Volunteer Manager |
| Functional / Area Leader | `/leader/:id` | Assignment parent |
| Director Omniview | `/admin/director` | — |

## Contracts

- Roles: `data/volunteer-command/leadership-role-registry.json`
- Access: `data/volunteer-command/access-matrix.json`
- Dashboards: `data/volunteer-command/dashboard-config-registry.json`
- Chain: `data/volunteer-command/chain-of-command.json`
- Field Plan position: `data/volunteer-command/field-plan-position-contract.json`

## Campus goals

Canonical: `enrollment_share_of_county_vap_v1` — see `CAMPUS_GOAL_FORMULA_DECISION.md`. Flat 25% superseded.

## Persistence classification

| Feature class | Status |
|---------------|--------|
| Command shells / registries | Static scaffold |
| People counts (seed) | Seed + canonical person dedupe |
| Invite / place / share | Netlify Blobs |
| Personal personnel CRUD | Disabled until durable path proven |
| Postgres | Not active |

## Certification

Journey cert still PENDING for invite chain. This architecture shell is **implemented**, not CERTIFIED PRESENT as a human journey.