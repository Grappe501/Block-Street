# Calendar Event Preparation Checklist Protocol

## Status transitions

```
not_started → in_progress | ready | waived | not_applicable
in_progress → ready | not_started | waived
blocked → in_progress | not_started
ready | waived | not_applicable → (terminal)
```

## Communication states (promotion / reminder)

`not_prepared` → `draft` → `ready_for_manual_send` → `sent_manually` → `provider_confirmed`

No automated sends in Wave 3B.

## Readiness

- **Materials:** required blocking items within 48h of start
- **Promotion:** required items within 72h for public-facing events
