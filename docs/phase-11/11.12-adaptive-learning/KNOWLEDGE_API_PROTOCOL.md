# Knowledge API Protocol

**Protocol:** CAE-11.12-W5 · **Subsystem:** KNW-API-001

## Doctrine

- Every protected mutation dispatches a typed Wave 3 command.
- APIs expose projections, not raw persistence models.
- Institution context is server-validated on every request.
- High-impact actions require idempotency keys.
- AI tutor endpoints are read-only and assessment-safe.

## Request Context

Resolved per request: `actor_human_id`, `institution_id`, `membership_id`, `locale`, `timezone`, `permissions`, `request_id`, `correlation_id`, optional `idempotency_key`.

## Error Envelope

Domain errors map to structured API errors with `human_blocked` guidance when applicable.

## Public Credential Verification

`GET /api/public/v1/credentials/verify/{code}` exposes only approved public fields — never private assessment data.
