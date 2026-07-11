# Admin Role Catalog

**System ID:** ADM-001

## System Roles

| Role ID | Name | Scope | Risk |
|---------|------|-------|------|
| `platform_administrator` | Platform Administrator | platform | critical |
| `organization_administrator` | Organization Administrator | organization | high |
| `workspace_administrator` | Workspace Administrator | workspace | high |
| `identity_administrator` | Identity Administrator | organization | high |
| `access_administrator` | Access Administrator | organization | high |
| `security_administrator` | Security Administrator | platform | critical |
| `read_only_auditor` | Read-Only Auditor | organization | low |
| `support_administrator` | Support Administrator | organization | moderate |
| `incident_commander` | Incident Commander | platform | critical |

## Custom Roles

Organizations may define custom roles (e.g. `county_organizer`) validated against permission registry.

## Assignment Rules

- Temporary assignments support `expires_at`
- High-risk role assignment requires approval
- Requester cannot self-approve separation-of-duties actions

**Data:** `data/admin/roles.json` · `data/admin/user_role_assignments.json`
