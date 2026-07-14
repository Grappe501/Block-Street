# Version 1.0 Certification — Charter

**Phase status:** Active  
**Opened:** 2026-07-14  
**Prior phase:** Build 11.7 Living Intelligence — **Architecture Complete** (W1–W16)

## Role change

| Before | After |
|--------|--------|
| Architect invents systems | **Product Review Board** certifies truth |
| Burt implements new layers | Burt **proves** the platform matches intent |
| “What should we build?” | **“Did we build what we intended?”** |

## North-star question

> Did we actually build the platform we set out to build, and if not, what is still missing before Version 1 ships?

## Non-goals (during Certification)

- Do not invent Build 11.8 architecture layers.
- Do not expand Living Intelligence beyond evidence-based gap fills required for V1.
- Do not start Version 2 planning until Passes 1–9 are complete (Pass 10).

## Ten certification passes

| Pass | Name | Question |
|------|------|----------|
| 1 | Vision Audit | Did we build every capability we designed? |
| 2 | User Experience Audit | Do journeys work without friction? |
| 3 | Executive Audit | Can Steve / Kelly / chair / volunteer / student operate? |
| 4 | Architecture Audit | Are systems duplicated or fragmented? |
| 5 | Experience Audit | Does it feel premium? |
| 6 | LocalBrain Audit | Does LocalBrain feel intelligent (not a chatbot)? |
| 7 | Organization Audit | Can an organization actually operate? |
| 8 | Production Audit | Survive load, restore, rollback, fail gracefully? |
| 9 | Original Vision Audit | Drift check against founding intent |
| 10 | Version 2 Planning | Only after audits — what should V2 become? |

## Canonical artifact

**[V1_CERTIFICATION_MATRIX.md](./V1_CERTIFICATION_MATRIX.md)** — single source of truth for launch readiness.

Target size: **300–500 major capabilities** (not thousands of micro-features).  
Seeded from Launch Tracks A–J; expanded capability-by-capability during Pass 1+.

## Verdict vocabulary (Pass 1)

| Verdict | Meaning |
|---------|---------|
| **Complete** | Capability exists end-to-end (protocol + operable product surface where required) |
| **Partial** | Parts exist; gaps in UX, wiring, or operational completeness |
| **Missing** | Designed or implied; not found as product capability |
| **Needs redesign** | Built, but wrong shape for V1 intent |
| **Remove** | Do not certify for V1; defer or drop |

## Matrix columns

| Column | Meaning |
|--------|---------|
| Built | Artifact exists (page, API, service, or equivalent) |
| Works | Exercised and behaves correctly under intended use |
| UX Pass | Pass 2 / 5 bars cleared for that capability |
| Launch Ready | Safe to include in Version 1 ship decision |
| Notes | Gap, owner action, or evidence |

Symbols: `✅` pass · `⚠️` partial / risk · `❌` fail · `—` not yet audited

## Related docs

- [Launch Tracks A–J](./01_LAUNCH_TRACKS.md)
- [Pass 1 — Vision Audit](./passes/PASS_01_VISION_AUDIT.md)
- [Phase 11 Build Ledger](../phase-11/PHASE_11_BUILD_LEDGER.md) — 11.7 marked Architecture Complete
