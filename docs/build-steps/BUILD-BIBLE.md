# ASYON Build Bible

**Document ID:** BUILD-BIBLE  
**Status:** Canonical  
**Purpose:** Single authoritative index Burt reads before implementing any code.

> Phase 1 is the **Constitution of the Platform**.  
> Steps 1.1–1.8 define *what* we build and *how* we build it.  
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

**ID Convention:** [00-ID-CONVENTION.md](00-ID-CONVENTION.md)

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

---

## Burt's Implementation Protocol [ED-IQ]

Before writing code:

1. Has this been designed?
2. Is the architecture approved?
3. Does this align with the Constitution?
4. Does it strengthen organizing?
5. Can it scale?
6. Can future versions extend it?

If any answer is **no** → pause.

---

## After Every Implementation [ED-FD]

Conclude with:

- What was built
- What changed
- What was deferred
- Known limitations
- Recommendations for Version 2

Record in `docs/build-log/BUILD-LOG.md`.

---

## Phase Map

| Phase | Name | Status |
|-------|------|--------|
| **1** | Foundational Constitution (Steps 1.1–1.8) | ✅ Complete |
| **2** | Arkansas Organizing Registry | In progress |
| **3** | V1 Launch — Signup + Network | Pending (Jul 12–14) |
| **4+** | Teaching, voter registration, collective voice | Future |

**Master sequence:** `docs/master/MASTER-BUILD-SEQUENCE.md`  
**Expanded constitution:** `docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md`

---

## Phase 1.9 Recommendation (Pending)

Before deep Phase 2 work, consider **Master Traceability & Requirement ID System**:

- Unique IDs for every future requirement (`REG-001`, `NET-014`, `CNTY-023`)
- Traceability matrix: Constitutional principle → Design → Implementation → Test → Documentation

*Not yet approved — Steve to decide before Phase 2 deep implementation.*

---

*Phase 1 closed: 2026-07-10 · Burt: start Phase 2 at Arkansas Organizing Registry.*
