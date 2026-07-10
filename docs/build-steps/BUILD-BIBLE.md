# ASYON Build Bible

**Document ID:** BUILD-BIBLE  
**Status:** Canonical  
**Purpose:** Single authoritative index Burt reads before implementing any code.

> Phase 1 is the **Constitution of the Platform**.  
> Steps 1.1–1.9 define *what* we build, *how* we build it, and *how every requirement is tracked*.  
> Phase 2 onward defines *implementation details* for each capability.

**Platform:** ASYON — Arkansas Student & Youth Organizing Network  
**Live:** https://block-street.netlify.app/  
**Repo:** https://github.com/Grappe501/Block-Street

---

## Read Order

| Order | Step | Document | Question It Answers |
|-------|------|----------|---------------------|
| 1 | 1.1 | [Platform Identity](PHASE-001.1-PLATFORM-IDENTITY.md) | Who are we? |
| 2 | 1.2 | [North Star Outcome](PHASE-001.2-NORTH-STAR-OUTCOME.md) | Where are we going? |
| 3 | 1.3 | [Core Principles](PHASE-001.3-CORE-PRINCIPLES.md) | What do we stand for? |
| 4 | 1.4 | [Platform Boundaries](PHASE-001.4-PLATFORM-BOUNDARIES.md) | What must we never do? |
| 5 | 1.5 | [Organizing Model](PHASE-001.5-ORGANIZING-MODEL.md) | How do people organize? |
| 6 | 1.6 | [Growth Model](PHASE-001.6-GROWTH-MODEL.md) | How does the platform evolve? |
| 7 | 1.7 | [Launch Success](PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md) | When is V1 ready? |
| 8 | 1.8 | [Implementation Doctrine](PHASE-001.8-IMPLEMENTATION-DOCTRINE.md) | How does Burt build it? |
| 9 | 1.9 | [Master Traceability](PHASE-001.9-MASTER-TRACEABILITY.md) | Why does every feature exist? |

**Requirements registry:** `data/requirements-registry.json` · Admin **Traceability** tab

---

## Production Code Gate [TR-MOTTO]

> **If it cannot be traced, it should not be built.**

Before any production code:

1. Locate requirement in `requirements-registry.json`
2. Verify [TR-BR] checklist (6 items)
3. Commit with requirement IDs
4. Update registry status on completion

---

## The Three Filters

Apply before every feature decision:

### 1. North Star [NS-013]

> **Does this help us reach the North Star?**

If no — not in V1.

### 2. Constitutional Test [CT-001]

Does it align with Core Principles [CP-*] and Guardrails [DG-*]?

### 3. Launch Filter [LS-002]

V1 must answer for every visitor:

1. **Where do I belong?**
2. **How do I get involved?**
3. **How do I invite others?**

---

## Standing Doctrines

| ID | Doctrine |
|----|----------|
| [ED-001] | Design First · Build Second · Validate Third · Iterate Fourth |
| [ED-003] | Design completely. Build deliberately. Validate thoroughly. Improve continuously. |
| [ED-GR] | Never implement without approved design |
| [ED-VS] | Build vertically — complete one capability end-to-end |
| [TR-MOTTO] | If it cannot be traced, it should not be built |
| [GM-002] | Launch early. Learn quickly. Improve continuously. |

---

## Conflict Resolution [BG-001]

```
1. Platform Constitution [CP-*]
2. Design Guardrails [DG-*]
3. North Star [NS-*]
4. Feature request / convenience
```

---

## Critical Dates

| Date | Milestone |
|------|-----------|
| **Jul 12, 2026** | Leader testing |
| **Jul 14, 2026** | Launch call (~50 students) |
| **Fall 2026** | Voter registration push |
| **Nov 3, 2026** | Election |

---

## V1 Launch Checklist [LS-CHK]

Live tracker: `data/launch-readiness.json` · Admin **Launch** tab

**Jul 12 minimum:** Registration · Network boards · Share links/QR · Campus/county assignment

**Critical pending requirements:** USR-001 · NET-001 · NET-002 · NET-003

---

## Burt's Implementation Protocol

### Before writing code [ED-IQ + TR-BR]

1. Requirement exists and is approved
2. Has this been designed?
3. Dependencies complete
4. Acceptance criteria and test IDs defined
5. Does this align with the Constitution?
6. Documentation location established

If any answer is **no** → pause.

### After every implementation [ED-FD]

- What was built · What changed · What was deferred
- Known limitations · Recommendations for Version 2
- Update `requirements-registry.json` status fields
- Record in `docs/build-log/BUILD-LOG.md`

---

## Phase Map

| Phase | Name | Status |
|-------|------|--------|
| **1** | Foundational Constitution (Steps 1.1–1.9) | ✅ Complete |
| **2** | Arkansas Organizing Registry (Steps 2.1–2.10) | In progress (2.1 ✅) |
| **3** | V1 Launch — Signup + Network | Pending (Jul 12–14) |
| **4+** | Teaching, voter registration, collective voice | Future |

**Master sequence:** `docs/master/MASTER-BUILD-SEQUENCE.md`  
**ID convention:** `docs/build-steps/00-ID-CONVENTION.md`  
**Expanded constitution:** `docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md`

---

*Phase 1 closed: 2026-07-10 (Steps 1.1–1.9) · Burt: Phase 2 — Arkansas Organizing Registry*
