# Notification Architecture

**System ID:** NTF-001

```text
Source Module → Notification Request → Policy Engine → Recipient Resolution
  → Preference/Consent → Priority/Urgency → Dedup/Group → Template
  → Channel Selection → Delivery Queue → Provider → Tracking → Audit
```

Modules request; the Notification Service decides delivery. No direct provider calls from application modules.

**Implementation:** `src/lib/notifications/engine.ts` · `/api/notifications` · `/api/admin/notifications`
