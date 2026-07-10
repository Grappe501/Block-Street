# Burt — Start Here

> Read [BUILD-BIBLE.md](BUILD-BIBLE.md) before writing code.

## Production Code Gate [TR-MOTTO]

> **If it cannot be traced, it should not be built.**

Registry: `data/requirements-registry.json` · Admin **Traceability** tab

---

## The One Question [NS-013]

> **Does this help us reach the North Star?** If no — it doesn't belong in V1.

## Burt's Operating Manual [ED-003]

> **Design completely. Build deliberately. Validate thoroughly. Improve continuously.**

Full protocol: [PHASE-001.8-IMPLEMENTATION-DOCTRINE.md](PHASE-001.8-IMPLEMENTATION-DOCTRINE.md)

## Traceability [PHASE-001.9]

> **Why does this exist?** Every feature traces to an approved requirement.

Full system: [PHASE-001.9-MASTER-TRACEABILITY.md](PHASE-001.9-MASTER-TRACEABILITY.md)

---

## Phase 1 — Constitution Complete ✅ (9 Steps)

| Step | Document | Status |
|------|----------|--------|
| 1.1 | [Platform Identity](PHASE-001.1-PLATFORM-IDENTITY.md) | ✅ |
| 1.2 | [North Star Outcome](PHASE-001.2-NORTH-STAR-OUTCOME.md) | ✅ |
| 1.3 | [Core Principles](PHASE-001.3-CORE-PRINCIPLES.md) | ✅ |
| 1.4 | [Design Guardrails](PHASE-001.4-PLATFORM-BOUNDARIES.md) | ✅ |
| 1.5 | [Organizing Model](PHASE-001.5-ORGANIZING-MODEL.md) | ✅ |
| 1.6 | [Growth Model](PHASE-001.6-GROWTH-MODEL.md) | ✅ |
| 1.7 | [Launch Success Definition](PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md) | ✅ |
| 1.8 | [Implementation Doctrine](PHASE-001.8-IMPLEMENTATION-DOCTRINE.md) | ✅ |
| 1.9 | [Master Traceability](PHASE-001.9-MASTER-TRACEABILITY.md) | ✅ |

**Build Bible:** [BUILD-BIBLE.md](BUILD-BIBLE.md)

---

## Launch Readiness [LS-CHK]

> How do we know V1 is ready? **10-item checklist** in PHASE-001.7.  
> Live tracker: `data/launch-readiness.json` · Admin **Launch** tab

**Jul 12 minimum:** USR-001 · NET-001 · NET-002 · NET-003

---

## Critical Dates [GM-V1]

| Date | Milestone |
|------|-----------|
| **Jul 12** | Leader testing |
| **Jul 14** | Launch call (~50 students) |
| **Fall 2026** | Voter registration push |
| **Nov 3, 2026** | Election |

---

## Conflict Resolution [BG-001]

```
1. Platform Constitution [CP-*]
2. Design Guardrails [DG-*]
3. North Star [NS-*]
4. Feature request / convenience
```

---

## Implementation Rules

- Verify requirement in registry before production code [TR-BR]
- One build step at a time — user uploads step to Cursor
- Reference requirement IDs in commits (`feat(signup): [USR-001]`)
- Build vertically [ED-VS, GM-P2]
- V1 scope only for July 14 [GM-V1, LS-DEF]
- Update `build-progress.json` + `requirements-registry.json` every step
- Commit + push → Netlify auto-deploys
- H: drive only
- ED-FD handoff in BUILD-LOG

## ID Quick Reference

```
BUILD-BIBLE     Authoritative Phase 1 index
TR-MOTTO        If it cannot be traced, it should not be built
REG/CNTY/INST   Registry domain requirements
USR/NET         User and network requirements
TEST-*          Acceptance test IDs
DOC-*           Documentation IDs
PAGE-*          Page identifiers
DB-*            Database object IDs
API-*           API endpoint IDs
ED-GR           Never implement without approved design
LS-CHK          Launch readiness checklist
```
