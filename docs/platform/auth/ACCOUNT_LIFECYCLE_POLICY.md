# Account Lifecycle Policy

**System ID:** AUTH-001

## States

| State | Access |
|-------|--------|
| Invited | Invitation pending — no full access |
| Pending Verification | Limited until email/provider verified |
| Active | Normal access per memberships |
| Restricted | Sign-in allowed; capabilities limited (training, policy pending) |
| Suspended | No protected access; sessions revoked |
| Archived | Historical attribution preserved; no active access |
| Deletion Pending | Grace period before anonymization |
| Deleted / Anonymized | PII removed per retention policy |

## Transitions

Every transition is governed, logged in `audit_events.jsonl`, and may trigger session revocation.

## Administrator Actions

Authorized administrators may restrict, suspend, or restore accounts. They may **not**:

- View passwords or recovery codes
- Impersonate without governed support mechanism
- Silently change credentials
- Bypass audit logging

## Recovery

Governed via `AccountRecoveryRequest` — verified email, MFA recovery code, or administrator-assisted recovery with audit trail and user notification.

## Historical Attribution

Legacy honor-system records use attribution states: `verified_user`, `legacy_claimed`, `system_migration`, `unknown_legacy`. Never falsely attribute to verified users without evidence.
