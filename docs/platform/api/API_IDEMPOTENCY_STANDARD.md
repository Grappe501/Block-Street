# API Idempotency Standard

**System ID:** API-001

Header: `Idempotency-Key`. Safe for create, send, import, campaign operations. Same key + same body → original response. Same key + different body → `IDEMPOTENCY_CONFLICT`. Records expire after 24 hours.
