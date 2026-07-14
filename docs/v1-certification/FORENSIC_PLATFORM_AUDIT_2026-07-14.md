# Forensic Platform Audit — ASYON / Block Street

**Date:** 2026-07-14  
**Audience:** Steve Grappe · Ernie (architecture) · Build Control  
**Tip commit at publish:** includes invite Wave1 fix `180c503`  
**Interactive canvas:** Cursor canvas `asyon-forensic-platform-audit.canvas.tsx`

---

## Executive verdict

| Lens | Score | Meaning |
|------|------:|---------|
| PHASE-001.7 Launch Ready (narrow V1 path) | **100%** | Belong / get involved / invite on Netlify Blobs |
| V1 Certification Pass 1 vision fulfillment | **20.2%** | 444 capabilities · **0 CERTIFIED PRESENT** |
| Mission alignment (experienced full product) | **~40 / 100** | Thin organizing home vs full Living Intelligence OS |
| Jul 14 invite path alone | **~65 / 100** | Coherent loop; not yet design-system polished |
| Overall UI maturity | **4.5 / 10** | Functional; Director overloaded; Inter/generic |
| Invite-path UI | **6.5 / 10** | Clear narrow journey |
| **Large-scale launch readiness** | **~25% · NO** | No Postgres · no tenancy proof · no journey certification |

**Bottom line:** We met the *narrow* July 14 organizing-home success definition. We did **not** meet the Living Intelligence / Community Operating System vision as a certified human product. Build Control “100%” counts phase ledgers; Cert Pass 1 counts six-axis product truth.

---

## Mission & goals

### North Star (NS-002)

> Every young Arkansan has an organizing home, a trusted network, and the tools to build relationships, develop leadership, strengthen their community, and participate in civic life.

**Met partially:** invite-gated home place + personal network + statewide place pages.  
**Not met:** durable multi-tenant scale, daily LocalBrain, calendar UI, committees (explicitly deferred), federated ops proof.

### PHASE-001.7 three questions

| Question | Status | Evidence |
|----------|--------|----------|
| Where do I belong? | Done | `/choose-place`, hubs, home-place cookie |
| How do I get involved? | Done | Invite accept → place → `/network` |
| How do I invite others? | Done | `/start`, `/s/{slug}`, QR |

### Master Architecture Bible posture

Phases 1–6 “design done” and Phase 7–11 engines ≠ shippable daily product. MAB launch was always progressive Beta → Statewide with validation gates (UAT, a11y, security, DB). Those gates are largely unmet.

---

## What works

1. **Steve invite chain** — `/start` → Wave1 invite → `/invite/{token}` (fix `180c503`: create + Blobs flush + accept refresh).
2. **Place lock** — `/choose-place` + middleware map hide after commit.
3. **Personal network** — `/network`, share slug, QR PNG, referral cookie.
4. **Digital Arkansas** — 75 counties · 67 post-secondary · 272 HS · private/charter hubs.
5. **Directory search** — `/directory` + outreach counts.
6. **Institutional workbenches** — Initiatives, Communications, Learning (strongest depth UIs).
7. **Deploy path** — GitHub `main` → Netlify auto-deploy.

---

## What needs improvement

### P0
- Freeze dual narrative (Launch Ready ≠ Living Intelligence complete).
- Production Postgres / tenancy (`databaseStatus: not_connected`).
- CERTIFIED PRESENT path — Pass 2 human journeys.
- Production invite E2E after Blobs durability fix.

### P1
- Collapse Director ~49 tabs (~70% doctrine viewers).
- LocalBrain **one** consumer page over 158 APIs.
- Deduplicate COM vs LIX briefings / Learning vs W7.
- Landing copy honesty vs LS-DEF (no committee marketing until built).
- Mobile + a11y smoke on invite + network + map.

### P2
- Design system beyond Inter + commodity blue.
- Spanish onboarding path.
- Calendar thin-slice or explicit deferral in all claims.

---

## UI rating detail

| Dimension | Rating | Notes |
|-----------|--------|------|
| Clarity of Jul 14 path | 7/10 | Clear; founder email hardcoding is brittle |
| Visual craft | 3.5/10 | Generic stack |
| Admin/operator UX | 3/10 | Tab overload |
| Institutional workbenches | 6/10 | Real but dense |
| Empty states / delight | 3/10 | Sparse |
| Accessibility | Unknown | Pass 1: unverified |
| **Overall** | **4.5/10** | |

---

## Large-scale launch?

**No.** Soft leader-chain launch: **conditional yes** after:

1. Fresh invite E2E on production.
2. Steve + 5–10 humans smoke belong → recruit.
3. Explicit “invite-only beta” messaging on landing.

Blockers for statewide scale: no Postgres, CERTIFIED PRESENT = 0, hardening track ~5%, RBAC/isolation not proven, LocalBrain not productized, dual stacks unresolved.

---

## Version 2 — additive upgrade lanes

NASA / Google posture: **never destroy live surfaces**. Every wave is an overlay.

| Lane | Scope |
|------|--------|
| **V2-A Operator Command** | Participants / invites / growth / audit; doctrine → Architecture Library |
| **V2-B Persistence Port** | Blobs → Postgres behind same orchestrators |
| **V2-C Community Room MVP** | Pulse + roster + today on `CommunityWorkspace` |
| **V2-D LocalBrain Shell** | Single My Brief / context page |
| **V2-E Network Graph 1.1** | Depth, conversion, outreach gaps |
| **V2-F Assurance Dashboard** | Productize Wave1–2 sponsor trust |

Certification continues Pass 2–9 **without inventing Phase 11.8** until Pass gates reopen architecture.

---

## Standing deploy protocol

Every agent/build interaction that changes the product **must end with**:

1. Additive implementation only (no silent UX demolition).
2. Update `data/build-progress.json` / `data/launch-readiness.json` / registries when status changes.
3. Typecheck critical paths.
4. `git commit` (why-focused).
5. **`git push origin HEAD`** → Netlify auto-deploy so Build Control and production update together.

Canonical Cursor rule: `.cursor/rules/netlify-deploy-closeout.mdc`

---

## Sources

- `docs/v1-certification/PASS_01_EXECUTIVE_SUMMARY.md`
- `data/launch-readiness.json`
- `data/build-progress.json`
- `docs/build-steps/PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md`
- `docs/master/MASTER_ARCHITECTURE_BIBLE.md`
- `docs/phases/PHASE-04-SIGNUP-NETWORK-BOARD.md`
- `docs/phase-11/PHASE_11_BUILD_LEDGER.md`
