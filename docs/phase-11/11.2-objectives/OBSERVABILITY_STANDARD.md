# Observability Standard

Every request through `withApiGateway` logs:

- Latency
- Institution
- Route / endpoint
- Permission result
- Correlation ID
- Request ID

## Command Observability

Command envelopes carry `request_id`, `correlation_id`, and `command_id` for end-to-end tracing from API → domain → outbox → integrations.

## Monitoring Targets

- API latency (dashboard <1s target from W4)
- Outbox queue depth and failed deliveries
- Webhook delivery success rate
- Consumer idempotency skip rate
