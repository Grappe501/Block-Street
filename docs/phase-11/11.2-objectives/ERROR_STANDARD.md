# Error Standard

Every API error returns:

| Field | Purpose |
|-------|---------|
| `code` | Machine-readable error code |
| `message` | Technical message |
| `human_blocked` | Teaching explanation with recovery action |
| `requirement_ids` | Constitutional requirement references |
| `retryable` | Whether safe to retry |
| `field_errors` | Per-field validation (422) |

## HTTP Status Mapping

- 404 — not found (institution-filtered)
- 403 — permission denied / institution mismatch
- 409 — version or idempotency conflict
- 422 — validation / transition not allowed
- 423 — archived read-only

Correlation ID is always returned in response headers (`X-Correlation-Id`).
