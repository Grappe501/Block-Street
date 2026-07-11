# API Architecture

**System ID:** API-001

```text
Clients → API Gateway → Auth → Context → Authorization → Policy → Rate Limit
  → Validation → Domain Service → Audit/Telemetry → Response Envelope → Client
```

Five API classes: Internal Application · Internal Service · Organization Integration · Public · Administrative

**Implementation:** `src/lib/api/gateway.ts` · `/api/v1/*` · `/api/admin/api/*`
