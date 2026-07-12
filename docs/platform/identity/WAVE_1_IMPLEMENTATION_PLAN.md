# Wave 1 Implementation Plan

**Wave ID:** ITL-W1-001 · **Status:** Implemented

## Systems

- ITL-HIR-001 — Human Identity Registry
- ITL-INV-001 — Invitation Network
- ITL-SPN-001 — Sponsor Accountability

## Build Steps

| Step | Name | Status |
|------|------|--------|
| W1.1 | Identity Constitution and Invariants | Done |
| W1.2 | Canonical Human Registry | Done |
| W1.3 | Public Human Name and Alias Model | Done |
| W1.4 | Invitation-Only Entry Gate | Done |
| W1.5 | Invitation Lifecycle Engine | Done |
| W1.6 | Sponsor Attestation and Responsibility | Done |
| W1.7 | Invitation Scope and Membership Creation | Done |
| W1.8 | Duplicate and Existing-Human Resolution | Done |
| W1.9 | Invite Limits and Privilege Controls | Done |
| W1.10 | Lineage, Audit, and Traceability | Done |
| W1.11 | Identity and Sponsor Operations | Done |
| W1.12 | Wave 1 Certification | Done |

## Implementation

- Engine: `src/lib/identity-trust/wave1/`
- Flags: `data/identity-trust/wave1_flags.json`
- Policy: `data/identity-trust/wave1_policy.json`

## Governing Rule

> No invitation, no account. No accountable sponsor, no invitation. No canonical human identity, no platform access.
