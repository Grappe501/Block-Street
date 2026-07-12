# Wave 5 Certification — CAE-11.1-W5

**Subsystem:** INI-API-001  
**Certification runner:** `npm run phase11:11.1:w5`

## Gates

| Gate | Description |
|------|-------------|
| G01 | API documentation present |
| G02 | API + integration modules present |
| G03 | Constitution tests (no CRUD bypass) |
| G04 | Event catalog registered |
| G05 | Search visibility enforcement |
| G06 | Import authority guard |
| G07 | Webhook HMAC signing |
| G08 | Consumer idempotency receipts |

## Automated Tests

`src/lib/civic-action/builds/11.1/w5-tests.ts`

- Strip untrusted identity fields
- Lifecycle action route map
- Event catalog covers W3 producers
- Consumer idempotency
- Import rejects fabricated Active/Approved rows
- Mission guard blocks paused initiatives
- Webhook signature roundtrip
- Institution-scoped collection query
- Search member visibility scope

## Certification Command

```bash
npm run phase11:11.1:w5:all   # typecheck + W5 gate
```

## Acceptance Scenario

The full 64-step acceptance scenario from the Wave 5 spec is satisfied at the architectural level:

- Governed API surface exists under `/api/v1/initiatives`
- Writes route through W3 commands
- Events are durable with outbox + replay boundaries
- Search, notifications, calendar, and analytics are event-driven projections
- Import/export and webhooks enforce authority and signing rules

Operational hardening (production outbox transport, live notification delivery, step-up auth) is deferred and documented.
