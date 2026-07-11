# Honor System Migration Plan

**System ID:** AUTH-001

## Migration Steps

1. ✅ Inventory honor-system entry points → [AUTH_IDENTITY_INVENTORY.md](./AUTH_IDENTITY_INVENTORY.md)
2. ✅ Identify protected routes
3. ✅ Map assumed user IDs (`usr-001`, `usr-002` bootstrap)
4. ✅ Create canonical user records
5. ✅ Introduce authentication behind feature flags
6. ✅ Protect `/admin` and `/api/*` first
7. ✅ Add organization and workspace context
8. ✅ Invitation and onboarding foundation
9. ⏳ Test invited-user onboarding (acceptance test)
10. ✅ Remove honor-system bypasses from protected routes
11. ⏳ Validate no protected API remains open
12. Archive honor-system code path in participant/PHQ modules (deferred — PHQ honor affiliation remains for public signup)

## Feature Flag Transition

`AUTH_HONOR_SYSTEM_DISABLED=true` — protected areas require server-verified session.

## Data Attribution

| State | Meaning |
|-------|---------|
| `verified_user` | Mapped canonical user |
| `legacy_claimed` | Honor claim, not verified |
| `system_migration` | Migration-created |
| `unknown_legacy` | Cannot safely determine |

Do not falsely attribute historical actions without evidence.

## Monitoring

Track honor-system bypass attempts during migration via audit events.
