# Implementation Volumes — Index

**Document ID:** VOL-INDEX · **IVS-001**  
**Status:** Canonical  
**Live spec:** `data/registry/implementation-volumes.json`

> **Volume 0** defines *why* the Community Operating System exists.  
> **Volumes 1–8** define *how* it is built, stored, behaves, experienced, connects, intelligently assisted, operated, and felt.

---

## The Natural Pause

Phases 1–6 designed the **product** — the living systems, entities, and capabilities of the COS.

The next design cycle designs the **factory** — the engineering foundation every feature will rely on.

**Do not begin Phase 7** until Burt has these implementation bibles. Without them, excellent feature documents still force thousands of ad-hoc architectural decisions during coding.

| Layer | Question | Document |
|-------|----------|----------|
| **Volume 0** | Why does the COS exist? | [MASTER_ARCHITECTURE_BIBLE.md](MASTER_ARCHITECTURE_BIBLE.md) [MAB-001] |
| **Volume 1** | How is the software built? | [ENGINEERING_ARCHITECTURE_BIBLE.md](ENGINEERING_ARCHITECTURE_BIBLE.md) [EAB-001] · [14 steps](../volume-01/VOLUME_1_MASTER_SEQUENCE.md) (13/14 · 1.5 API pending) |
| **Volume 2** | How is information organized? | [DATA_ARCHITECTURE_BIBLE.md](DATA_ARCHITECTURE_BIBLE.md) [DAB-001] · [14 steps](../volume-02/VOLUME_2_MASTER_SEQUENCE.md) ✅ complete |
| **Volume 3** | How does the platform behave? | [PLATFORM_BEHAVIOR_BIBLE.md](PLATFORM_BEHAVIOR_BIBLE.md) [PBA-001] · [14 engines](../volume-03/VOLUME_3_MASTER_SEQUENCE.md) ✅ complete |
| **Volume 4** | What does using the platform feel like? | [USER_EXPERIENCE_PRODUCT_ARCHITECTURE.md](USER_EXPERIENCE_PRODUCT_ARCHITECTURE.md) [UXB-001] · [14 layers](../volume-04/VOLUME_4_MASTER_SEQUENCE.md) 13/14 complete |
| **Volume 5** | How does the platform connect to the outside world? | [PLATFORM_SERVICES_INTEGRATION_ARCHITECTURE.md](PLATFORM_SERVICES_INTEGRATION_ARCHITECTURE.md) [PSI-001] · [14 steps](../volume-05/VOLUME_5_MASTER_SEQUENCE.md) 1/14 |
| **Volume 6** | How does AI work technically? | [AI_INTELLIGENCE_BIBLE.md](AI_INTELLIGENCE_BIBLE.md) [AIB-001] |
| **Volume 7** | How is the system operated and launched? | [OPERATIONS_LAUNCH_BIBLE.md](OPERATIONS_LAUNCH_BIBLE.md) [OLB-001] |
| **Volume 8** | How should people *feel* at every stage? | [EXPERIENCE_DESIGN_BIBLE.md](EXPERIENCE_DESIGN_BIBLE.md) [EDB-001] |

---

## Read Order for Burt

```text
Volume 0   Master Architecture Bible       ← product constitution
Volume 1   Engineering Architecture        ← system factory
Volume 2   Data Architecture               ← information factory
Volume 3   Platform Behavior                ← operational brain
Volume 4   User Experience                 ← UI factory
Volume 5   Platform Services               ← integration factory
Volume 6   AI & Intelligence               ← intelligence factory
Volume 7   Operations & Launch             ← operations factory
Volume 8   Experience Design               ← culture & feeling factory
BUILD-BIBLE + Phase docs                   ← feature detail (subordinate on conflict)
Production code                            ← only after volumes read
Phase 7+                                   ← after factory layer complete
```

---

## Foundation Stack (Volumes 0–5)

| Volume | Defines |
|--------|---------|
| **Volume 0** | **Why** the Community Operating System exists |
| **Volume 1** | **How** the software is engineered |
| **Volume 2** | **How** information is represented |
| **Volume 3** | **How** the system behaves |
| **Volume 4** | **How** people experience the platform |
| **Volume 5** | **How** the platform connects to the outside world |

Together, Volumes 0–5 provide a comprehensive foundation before feature-specific implementation volumes.

---

## Precedence

1. **Volume 0** — terminology, boundaries, constitutional coherence
2. **Volumes 1–8** — implementation standards (engineering, data, behavior, UX, platform services, AI, ops, experience)
3. **Phase documents (1–6)** — feature and domain detail
4. **BUILD-BIBLE** — traceability gate

When Volumes 1–7 conflict with a phase doc on *implementation*, the volume wins. When they conflict with Volume 0 on *principles*, Volume 0 wins.

---

## Alignment Goal

When Volumes 1–8 are complete, the project will have:

- A **product specification** (Phases 1–6 + Volume 0)
- An **engineering specification** (Volume 1)
- A **data specification** (Volume 2)
- An **operational behavior specification** (Volume 3)
- A **UX specification** (Volume 4)
- A **platform services specification** (Volume 5)
- An **AI specification** (Volume 6)
- An **operational launch specification** (Volume 7)
- An **experience specification** (Volume 8)

All aligned. Implementation proceeds with confidence — not invention under pressure.

---

**End of Volumes Index.** · *Expand each volume toward full depth before Phase 7.*
