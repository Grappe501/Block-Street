# Authority Coverage Gaps

**Updated:** CPOS-DURABLE-AUTHORITY-1.2

## Closed in 1.2

- 30 formerly unprotected routes (CMS, notifications, missions, admin analytics, AI legacy, misc)
- 4 calendar server actions using demo user
- Priority domain registry contracts (onboarding, invitations, communications, workforce)

## Remaining high-risk base-gated routes

~393 routes still use permission checks without live `scopeResolver` in source. Registry records their target resolver; enforcement activates as routes add explicit resolvers or rely on registry fallback in `withApiGateway`.

### Highest priority for Wave 3

1. `/api/admin/role-assignments` — appointment creation (admin legacy)
2. `/api/v1/organizational-units/{id}/leadership` — leadership assignment
3. `/api/v1/communications/*` — direct send scaffold
4. `/api/v1/localbrain/*` — AI platform mutations (base-gated)
5. `/api/invitations` — legacy invitation POST (base-gated)

## CSRF and validation

Newly scope-protected routes identify `validationSchema` in registry. Implementation of Zod/schema enforcement is Wave 3.

## Do not inflate coverage

Routes classified `legacy_unused` or `public_by_design` require evidence in registry `notes` field.
