# Admin Scope Model

**System ID:** ADM-001

## Scope Types

`platform` · `organization` · `workspace` · `service` · `data_domain` · `incident`

## Enforcement

Every administrative API validates:
1. Actor has required permission
2. Target resource falls within actor's scope
3. MFA elevation if `requires_mfa`
4. Approval if `requires_approval`

## Example

Organization Administrator for `org-washington-county` may manage county workspaces but cannot access `org-statewide-campaign`.

**Implementation:** `assertAdminPermission()` in `src/lib/admin/engine.ts`
