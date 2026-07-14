# V2-B.4 — KPI Wiring & Review Resolution

**Status:** KPI catalog bound · content-backed responsibilities approved · placeholders remain draft  
**Preserves:** V2-A.3 hierarchy · enrollment-share campus goals · Blobs+seed · sensitive mutations disabled  
**Catalog:** `data/field-plan/kpi-catalog.json`  
**Twin:** `data/field-plan/kpi-binding-registry.json`  
**Updates:** `data/field-plan/responsibility-library.json` (`kpi_relationship`, review status)

## What this is

Framework KPIs (event / field / outreach / continuity) from Field Strategy success measures are bound onto **mapped, content-backed** responsibilities. Matching task scaffolds move to `approved` for durability readiness.

## Policy

- **No fake telemetry** — KPIs are framework targets and evidence requirements, not live counters.
- **Placeholders stay draft** — hierarchy seats without Field Plan prose are not silent-approved.
- **Unmapped / central deferred stay out** — same as V2-B.2 / B.3.
- **Task templates still unassigned** — `not_assigned_until_postgres_rbac`.
- Broad ingest remains **blocked**.

## Operator review resolution

| Content status | Result |
|----------------|--------|
| `ingested` (framework-backed) | `approved` + KPI links + evidence requirement |
| `placeholder` | `draft`, no KPI bind |
| no matching KPI | stays `queued_for_review` |

## Commands

```bash
npm run field-plan:wire-kpis
npm run test:v2b4-kpi-wiring
```

## Next

**V2-B.5** Durability prep — see [`V2B5_DURABILITY_PREP.md`](./V2B5_DURABILITY_PREP.md).
