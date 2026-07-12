# Initiative API Constitution

**Requirement family:** CAE-11.1-W5-API-*

## Governing Principle

> Every interface must preserve the Initiative constitution, regardless of which application, integration, service, or Human calls it.

## Invariants (enforced)

| ID | Rule | Enforcement |
|----|------|-------------|
| API-001 | Every write invokes a W3 command | `command-service.ts` |
| API-002 | No unrestricted CRUD | No generic `PUT` status endpoints |
| API-003 | Resolved actor + institution | `api/context.ts` |
| API-004 | Explicit lifecycle actions | `/actions/{action}` routes |
| API-007 | Request + correlation IDs | API gateway + command envelope |
| API-008 | Idempotency for high-impact | `HIGH_IMPACT_ACTIONS` guard |
| API-009 | Strip client authority fields | `stripUntrustedIdentityFields` |
| API-010 | Structured domain errors | `api/errors.ts` |
| API-013 | Institution + visibility filters | `query-service.ts` |
| API-016 | Permissions are advisory | permissions route note |
| API-017 | Server reauthorizes mutations | W3 `domain-service.ts` |

## Response Envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "req_…",
    "correlation_id": "…",
    "contract_version": "11.1-w5.1"
  }
}
```

## Error Semantics

| HTTP | Meaning |
|------|---------|
| 401 | Unauthenticated |
| 403 | Unauthorized |
| 404 | Not found / hidden by scope |
| 409 | Version or idempotency conflict |
| 422 | Domain validation failure |
| 423 | Archived read-only |

## Versioning

External prefix: `/api/v1/initiatives`  
Contract field: `meta.contract_version`  
Breaking changes require new API version and migration guidance.
