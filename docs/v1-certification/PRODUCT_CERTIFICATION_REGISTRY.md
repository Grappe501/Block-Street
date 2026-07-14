# Product Certification Registry

**Status:** Canonical ledger · accepted 2026-07-14  
**Authority:** [`GOVERNING_PRODUCT_TRUTH.md`](./GOVERNING_PRODUCT_TRUTH.md)  
**Purpose:** Single executive view of what has been **proven for Humans**, independent of Build Control percentages.

> A feature is **implemented** when the code exists.  
> A feature is **launchable** when the human journey succeeds.  
> A feature is **certified** only at **CERTIFIED PRESENT**.

---

## Product truth hierarchy (locked)

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

---

## Journey lifecycle (every row)

```text
Not Started
  → Implemented
  → Human Tested
  → Evidence Collected
  → CERTIFIED PRESENT
  → Regression Protected
```

| Status | Meaning |
|--------|---------|
| Not Started | No certified journey defined or work not begun |
| Implemented | Code/surfaces exist; not human-proven |
| Human Tested | Production or recorded human run attempted |
| Evidence Collected | Six-axis evidence pack stored |
| CERTIFIED PRESENT | Gate passed; may claim launchable for that journey only |
| Regression Protected | Automated or repeatable smoke prevents silent break |

---

## Master journey ledger

| Journey ID | Journey | Gate / notes | Status |
|------------|---------|--------------|--------|
| V1-JRN-INVITE-CHAIN-01 | Invite Chain (Steve → accept → place → network → share) | [`V1_INVITE_CHAIN_CERTIFICATION_GATE.md`](./V1_INVITE_CHAIN_CERTIFICATION_GATE.md) | **Pending** |
| V1-JRN-ONBOARDING-01 | New User first session after invite | Depends on invite chain | Not Started |
| V1-JRN-SHARE-01 | Network Sharing / recruit via `/s/{slug}` | Share + QR + referral | Not Started |
| V1-JRN-RETURN-01 | Returning Member resume session | Persist place + network | Not Started |
| V1-JRN-COMMUNITY-01 | Community Room | V2-C | Not Started |
| V1-JRN-LOCALBRAIN-01 | LocalBrain Shell | V2-D | Not Started |
| V1-JRN-OPERATOR-01 | Operator Command daily work | V2-A | Not Started |
| V1-JRN-ASSURANCE-01 | Assurance / certification view | V2-F | Not Started |

Evidence folders: `data/v1-certification/journeys/{Journey-ID}/`

---

## Launch doctrine (current)

| Layer | State |
|-------|--------|
| Implementation · PHASE-001.7 | COMPLETE |
| Certification · Invite Chain | **PENDING** |
| Production | Soft Beta Only (invite-gated) |
| Large Scale Launch | **NOT APPROVED** |

No expansion of public availability until `V1-JRN-INVITE-CHAIN-01` is **CERTIFIED PRESENT**.

---

## How to update this ledger

1. Change status only with linked evidence (or explicit fail notes).
2. Never mark CERTIFIED PRESENT from Build Control alone.
3. Close product-changing work with validate → commit → `git push origin HEAD`.
