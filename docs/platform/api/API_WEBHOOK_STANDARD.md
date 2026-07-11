# API Webhook Standard

**System ID:** API-001

Outbound: HMAC signature · timestamp · event ID · replay protection · HTTPS · bounded retry · subscription pause on repeated failure. Headers: `X-Platform-Event-Id` · `X-Platform-Timestamp` · `X-Platform-Signature`
