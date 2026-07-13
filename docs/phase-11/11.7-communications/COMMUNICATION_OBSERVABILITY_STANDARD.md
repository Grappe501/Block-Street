# Communication Observability Standard

## Request Tracing

Every command envelope carries `request_id` and `correlation_id` from API gateway context.

## Outbox Metrics

`publishPendingCommunicationOutbox` returns:

- `processed`, `published`, `failed` counts
- `duration_ms`
- `published_ids`, `failed_ids`

## Admin Endpoint

`GET /api/v1/communications/events/outbox` lists pending outbox records for operational monitoring.

## Projection Status

Analytics projections include `projection_status` and `source_sequence` for staleness detection.
