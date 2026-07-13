# CAE-11.6-W4 — Organization & Governance Protocol

**Protocol ID:** `CAE-11.6-W4`  
**System:** OPS-001

## Constitutional Principle

> Institutions are collections of accountable Humans working through defined organizational structures—not collections of permissions.

## API Namespace

OPS canonical organization APIs use **`/api/v1/operations/*`**:

| Spec path | OPS implementation |
|-----------|---------------------|
| `/api/v1/institutions` | `/api/v1/operations/institutions` |
| `/api/v1/organizations` | `/api/v1/operations/organizations` |
| `/api/v1/organization-tree` | `/api/v1/operations/organization-tree` |
| `/api/v1/governance` | `/api/v1/operations/governance` |
| `/api/v1/memberships` | `/api/v1/operations/memberships` |
| `/api/v1/federation/join` | `/api/v1/operations/federation/join` |

Legacy institution provisioning remains at `/api/v1/institutions/*`.

## Federation

Federations enable multi-institution collaboration while preserving identity, governance, data, and autonomy.
