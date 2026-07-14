# Duplicated or Conflicting Systems

## DUP-001

- Systems: Communications Daily Brief (11.7-COM) · LocalBrain briefings API (11.7-LIX W3)
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — needs Pass 4
- Evidence: src/app/(site)/communications/brief/page.tsx, src/app/api/v1/localbrain/briefings

## DUP-002

- Systems: Communications UX · LocalBrain conversations API (W6)
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — needs Pass 4
- Evidence: src/app/(site)/communications/, src/app/api/v1/localbrain/conversations

## DUP-003

- Systems: Learning 11.12 UX · LocalBrain learning API (W7)
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — needs Pass 4
- Evidence: src/app/(site)/learning/, src/app/api/v1/localbrain/learning

## DUP-004

- Systems: api/v1/calendar · api/v1/workspace/calendar · LocalBrain organizer time surfaces
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — no calendar UI; Pass 4
- Evidence: src/app/api/v1/calendar

## DUP-005

- Systems: notifications under /api/notifications · communications/notifications · site/notifications
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — Pass 4
- Evidence: src/app/(site)/communications/notifications/page.tsx, src/app/(site)/notifications/page.tsx, src/app/(site)/notifications/preferences/page.tsx, src/app/api/admin/notifications/failures/route.ts, src/app/api/admin/notifications/overview/route.ts, src/app/api/admin/notifications/queue/route.ts, src/app/api/admin/notifications/templates/route.ts, src/app/api/notifications/batch-request/route.ts

## DUP-006

- Systems: Multiple dashboard shells: admin, operations, learning, communications, initiatives
- Classification: DUPLICATED OR CONFLICTING
- Canonical: Unresolved — Pass 4 / Pass 5
- Evidence: admin, operations, learning, communications, initiatives
