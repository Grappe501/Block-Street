# Administration Architecture

**System ID:** ADM-001

## Request Flow

```text
Authorized Administrator
  → Administration Gateway (/api/admin)
  → Identity Verification (AUTH-001)
  → Administrative Role Resolution
  → Organization / Workspace Scope
  → Permission and Policy Evaluation
  → Approval Gate (if required)
  → Domain Service
  → Audit Event
```

## Separation from Authentication

| Layer | Answers |
|-------|---------|
| AUTH-001 | Who is this person? |
| ADM-001 | What may they govern in this scope? |

## Implementation

| Component | Path |
|-----------|------|
| Admin engine | `src/lib/admin/engine.ts` |
| Permissions | `src/lib/admin/permissions.ts` |
| Roles | `src/lib/admin/roles.ts` |
| Approvals | `src/lib/admin/approvals.ts` |
| APIs | `src/app/api/admin/` |
| UI | `src/components/admin/AdminAdministrationPlatform.tsx` |
