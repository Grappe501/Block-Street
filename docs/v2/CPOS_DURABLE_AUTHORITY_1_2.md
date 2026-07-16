# CPOS Durable Authority 1.2

**Program ID:** `CPOS-DURABLE-AUTHORITY-1.2`  
**Predecessor:** `CPOS-DURABLE-AUTHORITY-1.1`

> Convert the authority resolver into active, measurable protection over highest-risk workflows.

## What changed

1. **Canonical scope protection pattern** — `src/lib/authority/scope-resolvers.ts` + registry-driven enforcement in `withApiGateway`.
2. **Full mutation registry** — `data/authority/protected-routes.json` covers all 455 mutations.
3. **Unprotected routes closed** — legacy CMS, notifications, missions, admin analytics migrated to scoped gates.
4. **Calendar demo actor removed** — `src/lib/calendar/assignments/actions.ts` uses real session + `calendar.manage`.
5. **Postgres shadow** — `src/lib/authority/shadow.ts` for appointments, denials, overrides (JSON canonical).

## Commands

```bash
npm run authority:inventory
npm run authority:registry
npm run test:mutation-inventory
npm run test:durable-authority
npm run test:authority-coverage
npm run test:authority-high-risk
npm run authority:shadow-compare
npm run test:authority-shadow-parity
npm run test:platform-hardening
npm run preflight:h-drive
```

## Coverage targets (this pass)

| Domain | Target |
|---|---|
| Appointments | 100% scope-protected |
| Onboarding | 100% scope-protected |
| Committee placement | 100% scope-protected |
| Direct communications | 100% protected |
| Invitations admin | 100% protected |
| Unprotected routes | 0 |
| Overall scope coverage | ≥ 15% |

## Posture after 1.2

```text
Scope enforcement active on priority workflows
Full mutation registry established
Unprotected routes closed
Postgres authority operating in shadow mode
Broad platform coverage still in progress
```

Not production-grade durable RBAC — Wave 3 continues base-gated → scope migration.
