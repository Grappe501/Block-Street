# V2-B.3 — Expandable Responsibility Library

**Status:** Library generated · operator review of content status required  
**Preserves:** V2-A.3 hierarchy · enrollment-share campus goals · Blobs+seed · sensitive mutations disabled  
**Twin:** `data/field-plan/responsibility-library.json`  
**Bound to:** mapped seats only (`data/field-plan/position-mapping-registry.json`)

## What this is

Expandable responsibility entities promote Field Plan role narratives (`position-content.json`) into reviewable records with source lineage, phase, supervisors, and dashboard owner. Hierarchy seats without ingested prose get an honest **placeholder** expandable — not invented doctrine.

## Policy

- **Mapped only** — `media_lead`, `logistics_lead`, conflict rows, and central-activation seats stay out until mapping/review clears them.
- **No silent invent** — placeholder copy only when content is missing (`FIELD_PLAN_INTEGRATION_CONTRACT` language).
- **Task templates are scaffolds** — never assigned to real personnel until Postgres + RBAC.
- **KPI wiring** — completed in V2-B.4 (`docs/v2/V2B4_KPI_WIRING.md`).
- Broad Field Plan ingest remains **blocked**.

## Entity shape

Each responsibility answers: stable id, mapped position owner, phase, body, supervisors, scope, dashboard, evidence requirement, sensitivity, review status — per `source-contract.json` required fields.

## Commands

```bash
npm run field-plan:build-responsibility-library
npm run test:v2b3-responsibility-library
```

## Next

**V2-B.4** KPI wiring — see [`V2B4_KPI_WIRING.md`](./V2B4_KPI_WIRING.md).
