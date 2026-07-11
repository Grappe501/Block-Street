# Authentication Test Plan

**System ID:** AUTH-001

## Unit Tests (Target)

- Identity creation and provider linking
- Invitation state transitions
- Membership resolution
- Session expiration and revocation
- Account state enforcement
- MFA policy evaluation
- Recovery code consumption

## Integration Tests (Target)

- Email/password login and logout
- Passwordless link flow
- Invitation accept → membership created
- Organization/workspace context switch
- Session revocation and logout-all
- MFA challenge
- Suspended account denial

## Authorization Boundary Tests

- Unauthenticated users cannot access protected routes
- Users cannot modify another user's profile
- Users cannot accept invitations for wrong identity
- Users cannot switch to orgs/workspaces without membership
- Expired/consumed tokens rejected
- Client-side manipulation cannot bypass server checks

## Security Tests

- Brute-force throttling (foundation)
- Session fixation prevention
- Token replay protection
- CSRF via SameSite cookies
- Open redirect prevention on login `next` param
- Email enumeration resistance
- MFA bypass attempts
- Expired/revoked session behavior

## Acceptance Test Flow

1. Admin invites user → 2. User opens invitation → 3. User authenticates → 4. Canonical identity resolved → 5. Membership accepted → 6. Onboarding → 7. Workspace entry → 8. Cross-workspace denied → 9. Session management → 10. Admin suspends → 11. Access revoked → 12. Historical attribution preserved → 13. Restore → 14. Re-auth → 15. MFA for admin action → 16. Audit trail complete

## Manual Verification

```bash
npm run build
# Login: /admin/login — director@block-street.local / (see AUTH_BOOTSTRAP_PASSWORD)
# Security center: /account/security
# Context: POST /api/identity/context
```
