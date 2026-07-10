# Implementation Volumes — Index

**Document ID:** VOL-INDEX · **IVS-001**  
**Status:** Canonical  
**Live spec:** `data/registry/implementation-volumes.json`

> **Volume 0** defines *what* the Community Operating System is.  
> **Volumes 1–6** define *how* it is built, stored, experienced, intelligently assisted, operated, and felt.

---

## The Natural Pause

Phases 1–6 designed the **product** — the living systems, entities, and capabilities of the COS.

The next design cycle designs the **factory** — the engineering foundation every feature will rely on.

**Do not begin Phase 7** until Burt has these implementation bibles. Without them, excellent feature documents still force thousands of ad-hoc architectural decisions during coding.

| Layer | Question | Document |
|-------|----------|----------|
| **Volume 0** | What is the COS? | [MASTER_ARCHITECTURE_BIBLE.md](MASTER_ARCHITECTURE_BIBLE.md) [MAB-001] |
| **Volume 1** | How is the software built? | [ENGINEERING_ARCHITECTURE_BIBLE.md](ENGINEERING_ARCHITECTURE_BIBLE.md) [EAB-001] · [14 steps](volume-01/VOLUME_1_MASTER_SEQUENCE.md) (1/14 done) |
| **Volume 2** | What is the canonical data model? | [DATA_ARCHITECTURE_BIBLE.md](DATA_ARCHITECTURE_BIBLE.md) [DAB-001] |
| **Volume 3** | What does every screen and flow look like? | [USER_EXPERIENCE_BIBLE.md](USER_EXPERIENCE_BIBLE.md) [UXB-001] |
| **Volume 4** | How does AI work technically? | [AI_INTELLIGENCE_BIBLE.md](AI_INTELLIGENCE_BIBLE.md) [AIB-001] |
| **Volume 5** | How is the system operated and launched? | [OPERATIONS_LAUNCH_BIBLE.md](OPERATIONS_LAUNCH_BIBLE.md) [OLB-001] |
| **Volume 6** | How should people *feel* at every stage? | [EXPERIENCE_DESIGN_BIBLE.md](EXPERIENCE_DESIGN_BIBLE.md) [EDB-001] |

---

## Read Order for Burt

```text
Volume 0   Master Architecture Bible       ← product constitution
Volume 1   Engineering Architecture        ← system factory
Volume 2   Data Architecture               ← database factory
Volume 3   User Experience                 ← UI factory
Volume 4   AI & Intelligence               ← intelligence factory
Volume 5   Operations & Launch             ← operations factory
Volume 6   Experience Design               ← culture & feeling factory
BUILD-BIBLE + Phase docs                   ← feature detail (subordinate on conflict)
Production code                            ← only after volumes read
Phase 7+                                   ← after factory layer complete
```

---

## Precedence

1. **Volume 0** — terminology, boundaries, constitutional coherence
2. **Volumes 1–6** — implementation standards (engineering, data, UX, AI, ops, experience)
3. **Phase documents (1–6)** — feature and domain detail
4. **BUILD-BIBLE** — traceability gate

When Volume 1–6 conflict with a phase doc on *implementation*, the volume wins. When they conflict with Volume 0 on *principles*, Volume 0 wins.

---

## Alignment Goal

When Volumes 1–6 are complete, the project will have:

- A **product specification** (Phases 1–6 + Volume 0)
- An **engineering specification** (Volume 1)
- A **data specification** (Volume 2)
- A **UX specification** (Volume 3)
- An **AI specification** (Volume 4)
- An **operational specification** (Volume 5)
- An **experience specification** (Volume 6)

All aligned. Implementation proceeds with confidence — not invention under pressure.

---

**End of Volumes Index.** · *Expand each volume toward full depth before Phase 7.*
