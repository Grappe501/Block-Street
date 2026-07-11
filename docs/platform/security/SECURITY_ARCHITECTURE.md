# Security Architecture

**System ID:** SEC-001

```text
Identity → Authentication → Session → Context → Authorization → Policy → Protected Service → Protected Data → Audit → Monitoring → Incident/Recovery
```

Defense-in-depth across people, identity, application, API, data, infrastructure, operations, and recovery.

**Implementation:** `src/lib/security/engine.ts`
