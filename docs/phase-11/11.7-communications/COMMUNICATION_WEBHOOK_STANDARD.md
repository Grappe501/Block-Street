# Communication Webhook Standard

**Requirements:** CAE-11.7-W5-WHK-*

## Subscription Model

Institution-scoped subscriptions with event type and version filters. Secrets stored by reference, never returned after creation.

## Signing

HMAC-SHA256 over `{timestamp}.{body}`. Headers:

- `X-Communication-Timestamp`
- `X-Communication-Signature`

## Replay Resistance

Signatures rejected when timestamp skew exceeds 300 seconds.

## Delivery

`deliverWithRetry` attempts up to 3 deliveries with exponential backoff delays.
