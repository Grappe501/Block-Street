# Human Identity Registry

**ITL-HIR-001**

## Global Human ID

Every human receives a permanent `GHID-*` identifier. Never deleted — only archived.

## Identity Model

- Legal name (optional)
- Public name (required)
- Preferred name / display name (optional)
- Known alias (approved exception)
- Identity status: active | dormant | restricted | archived
- Immutable identity history ledger

## APIs

- `GET /api/v1/identity-trust/identities`
- `GET /api/v1/identity-trust/identity`
- `GET /api/v1/identity-trust/timeline`
- `GET /api/v1/identity-trust/search`
