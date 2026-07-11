# Notification Delivery Runbook

**System ID:** NTF-001

**Providers:** Email (primary + fallback) · SMS · Push (readiness) · In-app (platform)

**Retry:** Immediate → 5m → 30m → 2h → dead-letter. Non-retryable: invalid destination, revoked consent, hard bounce, malformed template.

**Failover:** No duplicate delivery on provider switch. Administrative alert on sustained failure.
