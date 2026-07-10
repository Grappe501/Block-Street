# Burt — Start Here

> Read documents in this order before writing code.

## The One Question

Before any feature, page, or database table:

> **Does this help us reach the North Star?**  
> If no — it doesn't belong in Version 1.

See [PHASE-001.2-NORTH-STAR-OUTCOME.md](PHASE-001.2-NORTH-STAR-OUTCOME.md) [NS-002, NS-013]

---

## Standing Engineering Doctrine [ED-001]

> **Design First. Build Second. Validate Third. Iterate Fourth.**

| # | Phase | Action |
|---|-------|--------|
| 1 | Design | Fully design and approve — user uploads step to Cursor |
| 2 | Build | Burt implements from approved design only |
| 3 | Validate | Test against design + Constitution + Guardrails |
| 4 | Iterate | Feedback → Version 2 planning |

**No implementation without an approved design step document.**

---

## Conflict Resolution Order [BG-001]

```
1. Platform Constitution [CP-*]
2. Design Guardrails [DG-*]
3. North Star [NS-*]
4. Feature request / convenience
```

Guardrail conflict → **redesign** or **constitutional change** — never silent drift.

---

## 1. Design Steps (Identity & Doctrine — No Implementation)

| Order | Document ID | Title | Status |
|-------|-------------|-------|--------|
| 1 | **PHASE-001.1** | [Platform Identity](PHASE-001.1-PLATFORM-IDENTITY.md) | ✅ Canonical |
| 2 | **PHASE-001.2** | [North Star Outcome](PHASE-001.2-NORTH-STAR-OUTCOME.md) | ✅ Canonical |
| 3 | **PHASE-001.3** | [Core Principles (Platform Constitution)](PHASE-001.3-CORE-PRINCIPLES.md) | ✅ Canonical |
| 4 | **PHASE-001.4** | [Platform Boundaries & Design Guardrails](PHASE-001.4-PLATFORM-BOUNDARIES.md) | ✅ Canonical |
| 5 | PHASE-001.5 | Organizing Model | Pending |

## 2. Reference Systems

| Document | Purpose |
|----------|---------|
| [00-ID-CONVENTION.md](00-ID-CONVENTION.md) | Requirement ID naming |
| [../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md](../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md) | Expanded constitution (timeline + teaching) |
| [../master/MASTER-BUILD-SEQUENCE.md](../master/MASTER-BUILD-SEQUENCE.md) | 30-module long-range blueprint |

## 3. Implementation Rules

- One build step at a time — user uploads step to Cursor
- Reference requirement IDs in commits and code comments
- Evaluate every feature: [NS-013], [CT-001], [DG-015]
- Update `data/build-progress.json` every step
- Commit + push → Netlify auto-deploys
- All files on **H: drive only**

## Requirement ID Quick Reference

### Step 1.4 — Design Guardrails
```
DG-001 through DG-015  Platform boundaries
BG-001  Burt implementation guardrails
ED-001  Design First · Build Second · Validate Third · Iterate Fourth
```

### Step 1.3 — Core Principles
```
CP-001 through CP-015  Immutable principles
CT-001  Constitutional test (10 questions)
```

### Step 1.2 — North Star
```
NS-002  The North Star statement
NS-013  Five North Star questions
```

### Step 1.1 — Platform Identity
```
PI-001  Working name: ASYON
ER-001  Equal representation
```
