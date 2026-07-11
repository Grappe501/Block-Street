# Observability Guide

**System ID:** MON-001

**Operators:** Use Executive dashboard for platform health; Engineering for diagnostics; correlate deployment markers from DPL-001 with error spikes.

**Developers:** Emit structured logs with correlation_id. Never log secrets or full PII. Expose `/health` endpoints per service.

**Acceptance:** `AC-184` — 20-step MON-001 acceptance test
