# Admin Permission Registry

**System ID:** ADM-001

## Structure

`resource.action` — e.g. `users.view`, `users.suspend`, `roles.assign`, `data.export`

## Categories

View · Create · Edit · Approve · Publish · Assign · Export · Delete · Configure · Execute · Restore · Audit · Delegate

## Risk Levels

| Level | Examples |
|-------|----------|
| low | `audit.view`, `users.view` |
| moderate | `users.invite`, `workspaces.create` |
| high | `users.suspend`, `roles.assign` |
| critical | `data.export`, `security.policy.update`, `organizations.archive` |

## Effective Permission

```text
Assigned Roles + Direct Grants + Policy Grants
  - Explicit Denials - Scope Restrictions - Account Restrictions
```

**Data:** `data/admin/permissions.json` · `data/admin/role_permissions.json`
