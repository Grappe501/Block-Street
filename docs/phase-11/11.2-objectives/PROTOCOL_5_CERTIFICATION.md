# Protocol 5 Certification — CAE-11.2-W5

**Build:** 11.2 · **Version:** 0.8.5-obj-w5

## Gates

| Gate | Requirement |
|------|-------------|
| G01 | API documentation present |
| G02 | API and integration modules exist |
| G03 | Constitution tests pass (no CRUD bypass) |
| G04 | Event catalog covers W3 producers |
| G05 | Search institution scope enforced |
| G06 | Initiative upstream guard |
| G07 | Webhook HMAC signing |
| G08 | Consumer idempotency receipts |

## Validate

```bash
npm run phase11:11.2:w5:all
```

## Definition of Done

- Complete versioned API surface under `/api/v1/objectives`
- Commands invoke W3 only; reads use projections
- Immutable events publish on every mutation
- Integrations subscribe via outbox dispatch
- AI cannot mutate execution
- Webhooks, observability, and rate limiting specified
