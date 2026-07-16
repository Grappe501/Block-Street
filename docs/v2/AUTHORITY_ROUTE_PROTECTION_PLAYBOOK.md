# Authority Route Protection Playbook

## Canonical pattern

Every scope-protected mutation provides:

```typescript
withApiGateway(handler, {
  permission: "business.action",
  endpoint: "/api/v1/example",
  scopeResolver: exampleScopeResolver, // or registry name
});
```

Registry fallback: if `scopeResolver` is omitted, `withApiGateway` loads `data/authority/protected-routes.json`.

## Scope resolver rules

1. Scope comes from the **authoritative record** (institution, county, committee), not caller claims alone.
2. Reject body scope when it disagrees with the resource's true scope.
3. Use action-specific permissions (`appointments.create`, not `appointments.manage`) where practical.

## Priority order

1. Appointments and leadership
2. Invitations and recruitment
3. Onboarding
4. Committee membership and placement
5. Direct communications
6. Calendar actor safety
7. Legacy admin and AI routes

## Legacy route migration

For routes using `withCms`, `withNotifications`, or raw handlers:

1. Add scoped check in the domain HTTP wrapper, or
2. Wrap with `withLegacyScopedMutation` from `src/lib/authority/legacy-gateway.ts`
3. Register in `protected-routes.json` via `npm run authority:registry`

## Wave 2 onboarding contract

| Actor | Allowed | Denied |
|---|---|---|
| Volunteer | `profile.update_self`, `onboarding.complete_self` | `onboarding.approve`, `appointments.create` |
| Outreach | `recruits.view`, `onboarding.manage`, `placement.recommend` | `placement.confirm`, `appointments.create` |
| Volunteer Manager | `placement.confirm`, `committee.assign_member` | `communications.send_email` (broadcast) |

## Measuring progress

```bash
npm run authority:inventory   # mutation counts
npm run authority:registry    # registry + coverage-summary
npm run test:authority-coverage
```
