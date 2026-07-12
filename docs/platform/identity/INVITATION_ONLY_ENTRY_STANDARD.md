# Invitation-Only Entry Standard

**ITL-W1-001 · W1.4**

## Prohibited

Public signup, self-registration, OAuth account creation without invitation, bulk user import without sponsors.

## Permitted

```text
Valid Invitation + Approved Authentication Method = Identity Activation
```

## Entry Gate

`evaluateEntryGate(token, email)` returns: proceed, blocked, already_accepted, identity_review_required.

## Enforcement

- `POST /api/auth/register` returns 403 with invitation-only message
- `/register` page displays invitation-required guidance
- `PUBLIC_REGISTRATION_DISABLED` and `INVITATION_ONLY_ENTRY_REQUIRED` flags
