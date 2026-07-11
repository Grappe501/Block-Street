# Administration Capability Inventory — Build 8.2.1

**System ID:** ADM-001 · **Deliverable:** 8.2.1

## Existing Administrative Surfaces

| Surface | Location | Classification |
|---------|----------|----------------|
| Director Workbench | `/admin` | **Keep** — host Administration Center |
| Phase tabs (1–8) | `AdminDashboard.tsx` | **Keep** — operational visibility |
| Phase 8 AUTH panel | `AdminAuthenticationIdentity.tsx` | **Merge** — user admin under ADM |
| Build progress / constitution | Admin tabs | **Keep** — governance visibility |
| Environment config | `.env`, Netlify | **Move** — governed configuration registry |
| Auth feature flags | `data/auth/feature_flags.json` | **Merge** — admin feature-flag UI |
| Honor-system PHQ | `/join` | **Restrict** — not admin; separate module |

## Duplicated Controls

| Control | Locations | Resolution |
|---------|-----------|------------|
| User invitation | AUTH admin + ADM invitations | **Merge** under ADM with AUTH API |
| Session revocation | AUTH security center + ADM users | **Merge** — ADM calls AUTH engine |
| Feature flags | `data/auth/feature_flags.json` | **Extend** — `data/admin/feature_flags.json` |

## Hard-Coded Roles (Pre-8.2)

| Location | Assumption | Migration |
|----------|------------|-----------|
| `workspace_memberships.json` roles array | Inline role strings | Map to `Role` + `UserRoleAssignment` |
| Bootstrap users | `platform_administrator` in memberships | Canonical role assignments |

## Audit Data

| Store | Purpose |
|-------|---------|
| `data/auth/audit_events.jsonl` | Authentication events |
| `data/admin/audit_events.jsonl` | Administrative actions (new) |

## Migration Actions

1. ✅ Inventory complete
2. Wrap `/admin` with AUTH-001 session (done in 8.1)
3. Add server-side admin permission checks on `/api/admin/*`
4. Introduce administrative audit trail
5. Retire implicit superuser assumptions via scoped roles
