# Notification Failure Runbook

**System ID:** NTF-001

**Dead-letter queue:** Failed notifications with recipient, channel, failure code, retry eligibility, source module

**Suppression:** Hard bounce · complaint · unsubscribe · invalid number → stop future sends

**Storm protection:** Per-user/source/event caps · circuit breaker · queue pause · admin alert
