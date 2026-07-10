# Burt — Start Here

> Read documents in this order before writing code.

## The One Question

Before any feature, page, or database table:

> **Does this help us reach the North Star?**  
> If no — it doesn't belong in Version 1.

See [PHASE-001.2-NORTH-STAR-OUTCOME.md](PHASE-001.2-NORTH-STAR-OUTCOME.md) [NS-002, NS-013]

---

## 1. Design Steps (Identity & Doctrine — No Implementation)

| Order | Document ID | Title | Status |
|-------|-------------|-------|--------|
| 1 | **PHASE-001.1** | [Platform Identity](PHASE-001.1-PLATFORM-IDENTITY.md) | ✅ Canonical |
| 2 | **PHASE-001.2** | [North Star Outcome](PHASE-001.2-NORTH-STAR-OUTCOME.md) | ✅ Canonical |
| 3 | PHASE-001.3 | Core Principles (immutable doctrine) | Pending |
| … | … | … | … |

## 2. Reference Systems

| Document | Purpose |
|----------|---------|
| [00-ID-CONVENTION.md](00-ID-CONVENTION.md) | Requirement ID naming (`PI-001`, `NS-001`, etc.) |
| [../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md](../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md) | Expanded constitution (includes timeline + teaching) |
| [../master/MASTER-BUILD-SEQUENCE.md](../master/MASTER-BUILD-SEQUENCE.md) | 30-module long-range blueprint |

## 3. Implementation Rules

- One build step at a time — user uploads step to Cursor
- Reference requirement IDs in commits and code comments
- Evaluate every feature against [Five North Star Questions](PHASE-001.2-NORTH-STAR-OUTCOME.md#ns-013--five-north-star-questions) [NS-013]
- Update `data/build-progress.json` every step
- Commit + push → Netlify auto-deploys
- All files on **H: drive only**

## Requirement ID Quick Reference

### Step 1.1 — Platform Identity
```
PI-001  Working name: ASYON
MS-001  Mission statement
VS-001  Vision statement
OP-001  Organizing philosophy
OH-001/2/3  Organizing homes
ER-001  Equal representation
```

### Step 1.2 — North Star Outcome
```
NS-002  The North Star statement
NS-004  Success metrics (relationships, not just signups)
NS-005  Arkansas Map at maturity
NS-006  Personal network vision
NS-007  Campus vision
NS-008  County vision
NS-009  Statewide vision (connect, not control)
NS-013  Five North Star questions (feature filter)
NS-014  End-state statement
```
