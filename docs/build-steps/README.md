# Burt — Start Here

> Read [BUILD-BIBLE.md](BUILD-BIBLE.md) before writing code.

## The One Question [NS-013]

> **Does this help us reach the North Star?** If no — it doesn't belong in V1.

## Burt's Operating Manual [ED-003]

> **Design completely. Build deliberately. Validate thoroughly. Improve continuously.**

Full protocol: [PHASE-001.8-IMPLEMENTATION-DOCTRINE.md](PHASE-001.8-IMPLEMENTATION-DOCTRINE.md)

## Growth Philosophy [GM-002]

> **Launch early. Learn quickly. Improve continuously.**

---

## Phase 1 — Constitution Complete ✅

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

**Build Bible:** [BUILD-BIBLE.md](BUILD-BIBLE.md) — authoritative index for Steps 1.1–1.8

---

## Launch Readiness [LS-CHK]

> How do we know V1 is ready? **10-item checklist** in PHASE-001.7.  
> Live tracker: `data/launch-readiness.json` · Admin **Launch** tab

**Three questions:** Where do I belong? · How do I get involved? · How do I invite others?

**Jul 12 minimum:** Registration, network board, share link/QR, campus/county assignment.

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

## Implementation Rules [ED-GR, ED-VS]

- One build step at a time — user uploads step to Cursor
- Reference requirement IDs in commits
- Build vertically — complete end-to-end [GM-P2, ED-VS]
- V1 scope only for July 14 — defer the rest [GM-V1, LS-DEF]
- Update `data/build-progress.json` every step
- Commit + push → Netlify auto-deploys
- H: drive only
- Conclude with ED-FD deliverable summary in BUILD-LOG

## ID Quick Reference

```
BUILD-BIBLE  Authoritative Phase 1 index
ED-001       Design → Build → Validate → Iterate
ED-GR        Never implement without approved design
ED-VS        Vertical slice development
GM-V1        V1 launch scope (July 2026)
LS-CHK       Launch readiness checklist
OM-L1        Individual = database root
NS-013       Five North Star questions
```
