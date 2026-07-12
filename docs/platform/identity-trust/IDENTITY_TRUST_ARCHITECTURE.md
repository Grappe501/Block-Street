# Identity Trust Architecture

**System ID:** ITF-001 / ITL-001

## Layer Position

```text
Identity Trust Layer (ITL-001)
├── Human Identity Registry
├── Invitation Network
├── Sponsor Accountability
├── Verification Engine
├── Public Identity Policy
├── Identity Review Process
├── Invite Tree
├── Trust Levels
├── Institution Membership
├── Cross-Institution Identity
├── Audit Lineage
└── Privacy Controls
```

AUTH-001 provides authentication mechanics. ITL-001 provides **constitutional human assurance** — who may enter, how trust is established, and how identity is displayed.

## Data Model

- **HumanIdentityRecord** — legal name (optional), public name (required), display name (optional), trust level, sponsor link
- **TrustInvitationRecord** — permanent sponsor agreement, reason, institution, intended role
- **VerificationRecord** — private verifier, relationship, method, confidence
- **IdentityReview** — challenge workflow with outcomes: verified, needs more evidence, restricted, removed

## Integration Points

- Wraps `src/lib/auth/invitations.ts` for token lifecycle
- `POST /api/v1/identity-trust/register` — invitation-only account creation
- Auth feature flags: `AUTH_INVITATION_ONLY_MODE` aligned with `ITL_INVITATION_ONLY_MODE`

## Accountability

Every action includes institution, organization, verified user, and audit trail. Sponsors do **not** own invited accounts — they initiated trust.
