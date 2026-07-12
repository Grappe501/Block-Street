# Webhook Standard

## Subscriptions

`POST /api/v1/objectives/webhooks` creates institution-scoped, event-scoped subscriptions.

## Signing

- HMAC-SHA256 over `{timestamp}.{body}`
- Headers: `X-Objective-Timestamp`, `X-Objective-Signature`
- Replay window: 300 seconds

## Delivery

Webhook deliveries enqueue on matching outbox events. Failed deliveries retry with exponential backoff (max 5 attempts).
