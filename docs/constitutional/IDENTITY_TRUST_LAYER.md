# Identity Trust Layer (ITL-001)

**Framework:** ITF-001 · **Layer:** ITL-001 · **Builds on:** AUTH-001

## Constitutional Principle

> Every account represents one real, accountable human being.

The Identity Trust Layer is the **root of trust** for the entire platform. It is not onboarding — it is constitutional infrastructure. Missions, messaging, voting, leadership development, analytics, and collaboration all inherit the assurance that participants are identifiable, accountable humans.

## One Way In

There is no public signup page. Account creation follows:

```text
Existing Trusted Member → Creates Invitation → Invitation Accepted
→ Identity Verification → Account Created → Trust Established
```

## Identity vs Reputation

**Identity verification** and **reputation** are separate. A rural volunteer with one sponsor remains a **Sponsored Member** — they are not removed because only one person knows them. Two **independent** verifications unlock **Trusted** status. Absence of verification after a review period triggers **identity review**, not automatic removal.

## Trust Levels

| Level | Label | Public Badge |
|-------|-------|--------------|
| 0 | Pending Invitation | Pending |
| 1 | Sponsored | Sponsored Member |
| 2 | Verified | Verified Human |
| 3 | Trusted | Trusted |
| 4 | Institution Leader | Leader |

Trust levels are **not a social score**. They reflect identity assurance only.

## Subsystems

- Human Identity Registry
- Invitation Network
- Sponsor Accountability
- Verification Engine
- Public Identity Policy
- Identity Review Process
- Invite Tree
- Trust Levels
- Institution Membership
- Cross-Institution Identity
- Audit Lineage
- Privacy Controls

## Implementation

| Component | Path |
|-----------|------|
| Engine | `src/lib/identity-trust/engine.ts` |
| Data | `data/identity-trust/store.json` |
| Policy | `data/identity-trust/trust_policy.json` |
| Admin UI | `src/components/admin/AdminIdentityTrustLayer.tsx` |
| Registry | `data/registry/identity-trust-framework.json` |

## Related Documentation

- [Trust Levels](docs/platform/identity-trust/TRUST_LEVELS.md)
- [Sponsor Agreement](docs/platform/identity-trust/SPONSOR_AGREEMENT.md)
- [Verification Standard](docs/platform/identity-trust/VERIFICATION_STANDARD.md)
- [Privacy Policy](docs/platform/identity-trust/PRIVACY_POLICY.md)
- [API Reference](docs/platform/identity-trust/API_REFERENCE.md)
- [Test Plan](docs/platform/identity-trust/TEST_PLAN.md)
