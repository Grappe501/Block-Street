# Pass 1 — Vision Audit

**Question:** Did we build every capability we designed?  
**Method:** Capability-by-capability against Launch Tracks A–J (not line-by-line code review).  
**Date:** 2026-07-14  
**Outcome:** Initial gap analysis seeded into [V1_CERTIFICATION_MATRIX.md](../V1_CERTIFICATION_MATRIX.md)

## Executive finding

**Protocol depth is high; product depth is uneven.**

Build 11.7 Living Intelligence (W1–W16) is **Architecture Complete** — modules, thin `/api/v1/localbrain/*` gateways, and wave test scripts exist. That does **not** mean Version 1 product surfaces exist for those capabilities.

Real Next.js product concentration today:

| Stronger product surfaces | Weak / missing product surfaces |
|---------------------------|----------------------------------|
| Identity / invite / auth | LocalBrain application shell |
| Initiatives / objectives / missions | Context / attention / focus UX |
| Communications workbench (COM) | Calendar pages (API only) |
| Learning workbench | Advanced LIX (research→genesis) product UI |
| Admin / identity ops | Wiring site pages → LocalBrain APIs (effectively none) |

**Overall V1 vision readiness (Pass 1):** **Partial** — major designed capabilities exist as protocol; launch-critical product journeys are incomplete.

## Track scoreboard

| Track | Theme | Pass 1 verdict | Evidence summary |
|-------|--------|----------------|------------------|
| A | Foundation & production | **Partial** | Custom auth/session, civic-action store, large API surface; ledger/header drift; production verification incomplete |
| B | Identity, LocalBrain, first-run | **Partial** | Invite/login/MFA exist; onboarding thin; **no LocalBrain page/UI**; middleware refs to select-org without pages |
| C | Executive daily OS | **Partial** | COM Daily Brief + ops/objectives “today”; LIX briefing/EA APIs unused by site pages; no calendar UI |
| D | Collaboration / teams | **Partial** | Initiative people + join flows; no dedicated team-spaces product; LIX conversation APIs not UI-bound |
| E | Knowledge / memory | **Partial** | Learning/knowledge UX + COM knowledge; LIX memory/promote APIs; no personal LocalBrain memory UX |
| F | Missions / ops | **Partial** | Strong initiatives/ops pages; LIX organizer APIs without matching LocalBrain UI |
| G | Communications | **Partial** | Broad COM UX; separate from LocalBrain conversation stack (duplication risk → Pass 4) |
| H | Admin / governance | **Partial** | Admin/identity/ops pages; not full institutional day-to-day console |
| I | Quality / security | **Partial** | MFA, middleware, wave certs; production-scale and “run our own org” unproven |
| J | Beta / adoption | **Partial / Missing product** | Launch docs under `docs/platform/launch/`; readiness scripts exist; no proven new-org success path in product |

## Structural split (do not confuse)

| Layer | Status | Implication for V1 |
|-------|--------|-------------------|
| Living Intelligence protocol (11.7 W1–W16) | Architecture Complete | Certify as **platform capability inventory**, not as shipped UX |
| Communications / Learning / Ops / Identity product UX | Partial | Highest leverage for “works for humans” |
| LocalBrain-facing product | **Missing** | Track B/C/E/G LocalBrain bar fails until UX exists and feels intelligent (Pass 6) |

## Verdict distribution (seed matrix)

Seeded ~120 major capabilities in the matrix (expand toward 300–500 in subsequent Pass 1 sweeps).

Approximate Pass 1 mix:

| Verdict | Role |
|---------|------|
| Complete | Few — mostly auth entry points and mature COM/ops/learning pages at “surface exists” bar |
| Partial | Majority of V1 tracks |
| Missing | LocalBrain UI, calendar UI, org/workspace selectors, advanced LIX product surfaces |
| Needs redesign | Likely COM vs LIX briefing/conversation/search dual stacks (confirm in Pass 4) |
| Remove | None certified yet — decide after Pass 9 drift check |

## What this means for work

1. **Stop designing new Living Intelligence waves.**
2. Use the matrix as the only backlog for V1 ship decisions.
3. Next certification work: deepen Pass 1 coverage to 300–500 capabilities, then Pass 2 journeys on Track B first slice.
4. Implementation work that is still allowed: **close matrix gaps** (especially LocalBrain product presence), not invent new architecture.

## Evidence anchors (repository)

- Pages: `src/app/(site)/**/page.tsx` (~99 routes) — strong in communications, learning, initiatives; no `/localbrain`, no `/calendar`
- LocalBrain APIs: `src/app/api/v1/localbrain/**` (~150+)
- Site pages calling LocalBrain APIs: **none found** in Pass 1 scan
- Ledger: `docs/phase-11/PHASE_11_BUILD_LEDGER.md` §11.7-lix W1–W16 Complete
- Launch standards (docs): `docs/platform/launch/`

## Pass 1 exit criteria (not yet met)

- [ ] Matrix ≥300 capabilities with Pass 1 verdicts
- [ ] Every Launch Track has explicit Complete/Partial/Missing/Needs redesign/Remove coverage
- [ ] Dual-system candidates listed for Pass 4
- [ ] No silent “assumed complete” items for V1 ship
