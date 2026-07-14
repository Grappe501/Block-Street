# V2-B.1 — Field Plan Source Contract and Ingestion Spine

**Status:** Schema ready · broad content ingest **blocked** until gates pass  
**Baseline preserved:** V2-A.3 (`51b3ce6` lineage) — enrollment-share campus goals, Volunteer Command hierarchy, Blobs+seed, sensitive personnel mutations disabled  
**Machine twin:** `data/field-plan/source-contract.json`

## Purpose

Define the canonical Field Plan schema, source traceability, conflict handling, and validation gates **before** importing full operational content.

## Hierarchy preserved (V2-A.3 — not the nested-County sketch)

```text
Director
└── Volunteer Manager
    ├── County Volunteer Command
    ├── Education Volunteer Command (College Leader → Institution Leads)
    ├── Functional / Area Leaders
    ├── Committees
    └── Volunteers
```

Education remains a **sibling** subordinate of Volunteer Manager (parallel to County), not nested under County.

## Source tree

```text
Field Plan
├── Commands
├── Positions
├── Responsibilities
├── Recurring Tasks
├── Milestone Tasks
├── KPIs
├── Reporting Relationships
├── Required Resources
├── Escalation Rules
└── Training Requirements
```

Every imported item must carry: stable ID, source reference, command level, position owner, frequency/deadline logic, KPI relationship, completion evidence requirement, sensitivity classification, version, review status.

## Conflict policy

Unmapped or conflicting positions enter `data/field-plan/ingestion/review-queue.json` / `conflict-queue.json`.  
**Never silently assign.**

## Gates before broad ingest

1. Schema complete  
2. Source traceability  
3. Conflict handling wired  
4. Validation gates green  
5. No **active** flat-25% campus formula  
6. Sensitive personnel actions still disabled  

## Parallel launch blocker

`V1-JRN-INVITE-CHAIN-01` → **CERTIFIED PRESENT** is a named launch blocker. Field Plan ingestion may proceed in parallel; V2-B is not operationally complete without invite-chain proof.

## Campus formula

Active: `enrollment_share_of_county_vap_v1`  
Retired: flat 25% — must not reappear in calculations, seed identity of active rules, docs as current, or UI copy presenting it as live.

## Commands

```bash
npm run field-plan:validate-contract
npm run field-plan:assert-no-flat-25
npm run test:v2b1-field-plan-spine
```

## Next

**V2-B.2** Position mapping — see [`V2B2_POSITION_MAPPING.md`](./V2B2_POSITION_MAPPING.md).
