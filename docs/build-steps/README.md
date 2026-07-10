# Burt — Start Here

> Read documents in this order before writing code.

## 1. Design Steps (Identity & Doctrine — No Implementation)

| Order | Document ID | Title | Status |
|-------|-------------|-------|--------|
| 1 | **PHASE-001.1** | [Platform Identity](PHASE-001.1-PLATFORM-IDENTITY.md) | ✅ Canonical |
| 2 | PHASE-001.2 | North Star Outcome | Pending |
| 3 | PHASE-001.3 | Core Principles | Pending |
| … | … | … | … |

## 2. Reference Systems

| Document | Purpose |
|----------|---------|
| [00-ID-CONVENTION.md](00-ID-CONVENTION.md) | Requirement ID naming (`PI-001`, `MS-001`, etc.) |
| [../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md](../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md) | Expanded constitution (includes timeline + teaching) |
| [../master/MASTER-BUILD-SEQUENCE.md](../master/MASTER-BUILD-SEQUENCE.md) | 30-module long-range blueprint |

## 3. Implementation Rules

- One build step at a time — user uploads step to Cursor
- Reference requirement IDs in commits and code comments
- Update `data/build-progress.json` every step
- Commit + push → Netlify auto-deploys
- All files on **H: drive only**

## Requirement ID Quick Reference (Step 1.1)

```
PI-001  Working name: ASYON
PI-002  Identity statement
PI-003  Motto: Connect Locally. Organize Statewide. Lead Together.
PI-004  Long-term identity
MS-001  Mission statement
VS-001  Vision statement
PU-001  Purpose (problems solved)
AU-001  Primary audience
GS-001  Geographic scope (initial)
GS-002  Geographic scope (future)
OP-001  Organizing philosophy
OH-001  Organizing home: institution
OH-002  Organizing home: county
OH-003  Organizing home: personal network
ER-001  Equal representation principle
```
