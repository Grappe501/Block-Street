# Tracing Standard

**System ID:** MON-001

Every request carries `correlation_id` and `request_id`. Traces span client → gateway → services → providers with duration, failure, and retry metadata.

**Data:** `data/monitoring/traces.json`
