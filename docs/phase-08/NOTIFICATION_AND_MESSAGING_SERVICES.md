# Build 8.4 — Notification and Messaging Services

**Document ID:** BUILD-008.4 · **NTF-001**  
**Status:** Canonical · **Phase:** 8

> What does this user need to know, through which channel, at what time, with what urgency, and under what consent and approval rules?

**Builds on:** [CMS-001](../phase-08/CMS_AND_CONTENT_SERVICES.md) · [ADM-001](../phase-08/ADMINISTRATION_PLATFORM.md) · [AUTH-001](../phase-08/AUTHENTICATION_AND_IDENTITY.md)  
**Live spec:** `data/registry/notification-services.json` · **API:** `/api/notifications`, `/api/admin/notifications`

---

## Governing Principle

> The platform should interrupt a user only when the value of the message exceeds the cost of the interruption.

---

## Core Outcomes

Canonical notification model · policy engine · in-app center · email/SMS delivery foundation · preferences · quiet hours · deduplication/grouping · consent · campaign approval · delivery tracking · retry/dead-letter · analytics

---

## APIs

**User:** `GET /api/notifications` · `/unread-count` · `POST /request` · `/read` · `/dismiss` · `/snooze` · preferences · quiet-hours · consents  
**Campaigns:** `POST /api/notifications/campaigns` · `/preview` · `/approve` · `/send`  
**Admin:** `GET /api/admin/notifications/overview` · `/queue` · `/failures` · `/templates`

**Acceptance:** `AC-181`

---

## Related Documentation

`docs/platform/notifications/` — architecture, canonical model, events, priority, preferences, consent, templates, approval, delivery/failure runbooks, security, migration, test plan
