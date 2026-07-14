# ASYON Governing Product Truth — Operator Acceptance

**Accepted:** 2026-07-14  
**Authority:** This stack overrides Build Control percentages on readiness conflicts.

## Governing document hierarchy

| Rank | Document | Role |
|-----:|----------|------|
| 1 | [`GOVERNING_PRODUCT_TRUTH.md`](./GOVERNING_PRODUCT_TRUTH.md) | Highest authority for product readiness |
| 2 | [`FORENSIC_PLATFORM_AUDIT_2026-07-14.md`](./FORENSIC_PLATFORM_AUDIT_2026-07-14.md) | Canonical certification baseline |
| 3 | [`V1_INVITE_CHAIN_CERTIFICATION_GATE.md`](./V1_INVITE_CHAIN_CERTIFICATION_GATE.md) | Production gate for invite journey |
| 4 | [`PRODUCT_CERTIFICATION_REGISTRY.md`](./PRODUCT_CERTIFICATION_REGISTRY.md) | Master ledger of all human journeys |
| 5 | [`../v2/V2_ADDITIVE_PROGRAM.md`](../v2/V2_ADDITIVE_PROGRAM.md) | V2 execution order (additive only) |
| 6 | [`../v2/AUDIENCE_SECTIONING_DOCTRINE.md`](../v2/AUDIENCE_SECTIONING_DOCTRINE.md) | Who sees what — Field Plan prep |

## Product truth hierarchy

```text
Human Certification
        ↑
Forensic Audit
        ↑
Journey Gates
        ↑
Implementation Metrics
        ↑
Build Percentages
```

| Term | Meaning |
|------|---------|
| **Implemented** | Code exists |
| **Launchable** | Human journey succeeds |
| **Certified** | CERTIFIED PRESENT via defined gate |

**“100%” in Build Control is not a product-launch claim** unless the journey is CERTIFIED PRESENT.

## Accepted baseline

| Item | Status |
|------|--------|
| PHASE-001.7 narrow launch bar | **Complete** (implementation) |
| Invite Chain certification | **Pending** (`V1-JRN-INVITE-CHAIN-01`) |
| Production posture | Soft Beta Only |
| Large-scale launch | **NOT APPROVED** |
| V2 posture | Additive overlays only |
| Closeout | validate → commit → `git push origin HEAD` → Netlify |

## Launch doctrine (current)

```text
Implementation:   PHASE-001.7 = COMPLETE
Certification:    Invite Chain = PENDING
Production:       Soft Beta Only
Large Scale:      NOT APPROVED
```

No expansion of public availability until `V1-JRN-INVITE-CHAIN-01` is CERTIFIED PRESENT.

## V2 execution order (fixed)

```text
V2-A  Operator Command
V2-B  Blobs → Postgres
V2-C  Community Room MVP
V2-D  LocalBrain Shell
V2-E  Network Graph
V2-F  Assurance Dashboard
```

## Storage doctrine

```text
Project Truth → H:\Block-Street
```

Cursor canvases on `C:\` = IDE artifacts only — not source of record — not precedent for Regnat Populus or other projects. H-drive-only remains the standard for new platforms.

## Immediate next proof

Production journey **`V1-JRN-INVITE-CHAIN-01`** per invite-chain gate — six-axis evidence → CERTIFIED PRESENT.

## Continuous agent ops

Standing build authority and elimination of **Run** interrupts: [`../v2/CONTINUOUS_AGENT_OPS.md`](../v2/CONTINUOUS_AGENT_OPS.md)  
(Agent: never request Smart Mode approval on first shell attempt; Steve: one-time Cursor allowlist.)
