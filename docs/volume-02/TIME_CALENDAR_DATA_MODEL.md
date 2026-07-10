# Build Volume 2.7 — Time & Calendar Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.7 · **DAB-008**  
**Artifact:** `TIME_CALENDAR_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.6 Event Data Model](EVENT_DATA_MODEL.md) [DAB-007] · Experience Service [ENG-DS]  
**Live spec:** `data/registry/time-calendar-data-model.json`

---

## DAB-TIM01 — Purpose

**[DAB-TIM01]** Defines calendars, scheduling, availability, recurrence, time zones, reminders, and timeline integration — supporting **Personal, Community, and Network** calendars.

---

## DAB-TIM02 — Calendar Objects

**[DAB-TIM02a]** Table: `action.calendars`:

```text
calendars (
  id, calendar_type,    -- personal | community | mission | network
  owner_id,             -- participant or community id
  name, slug, timezone, color, visibility, sync_token
)
```

**[DAB-TIM02b]** Default calendars auto-created: one personal per participant, one per community, one network-wide (read-mostly).

---

## DAB-TIM03 — Calendar Events

**[DAB-TIM03a]** Extends [Event entity DAB-E08](CANONICAL_ENTITY_DICTIONARY.md) with scheduling fields:

```text
events (scheduling extension)
  calendar_id, all_day, starts_at, ends_at, timezone,
  recurrence_rule, recurrence_parent_id, location_ref,
  virtual_link, capacity, rsvp_required
```

**[DAB-TIM03b]** `starts_at` / `ends_at` stored **UTC**; display in `timezone`.

---

## DAB-TIM04 — Recurrence

**[DAB-TIM04a]** `recurrence_rule` — iCalendar RRULE string (RFC 5545).

**[DAB-TIM04b]** Exceptions table: `action.event_recurrence_exceptions (event_id, exception_date, override_json)`.

**[DAB-TIM04c]** Materialized occurrences generated for search/index within horizon (90 days rolling).

---

## DAB-TIM05 — Availability

**[DAB-TIM05a]** Table: `action.availability_blocks`:

```text
participant_id, day_of_week, start_time, end_time, timezone, effective_from, effective_to
```

**[DAB-TIM05b]** Used for mentor matching and scheduling suggestions V1.1+.

---

## DAB-TIM06 — Reminders

**[DAB-TIM06a]** Table: `action.event_reminders`:

```text
event_id, participant_id, remind_at, channel, status, sent_at
```

**[DAB-TIM06b]** Reminder delivery via Communication Architecture [ENG-012 · AME-001].

---

## DAB-TIM07 — RSVP & Attendance

**[DAB-TIM07a]** Table: `action.event_rsvps (event_id, participant_id, response, responded_at)`.

**[DAB-TIM07b]** On check-in: emit `event.attended` domain event → graph edge `participated_in`.

---

## DAB-TIM08 — Timeline Integration

**[DAB-TIM08a]** Scheduled/completed events appear on community and mission timelines [LHE-001].

**[DAB-TIM08b]** Personal calendar feeds participant timeline — privacy filtered [TPS-001].

---

## DAB-TIM09 — Time Zone Rules

**[DAB-TIM09a]** Platform default: `America/Chicago` (Arkansas).

**[DAB-TIM09b]** Participant preference overrides display; storage always UTC.

**[DAB-TIM09c]** DST handled by timezone database — never manual offset math.

---

## AC-113 — Acceptance Criteria

- [x] **[AC-113a]** Calendar and event scheduling objects documented. `[DAB-TIM02, TIM03]`
- [x] **[AC-113b]** Recurrence, availability, and reminders defined. `[DAB-TIM04–TIM06]`
- [x] **[AC-113c]** RSVP, timeline integration, and timezone rules established. `[DAB-TIM07–TIM09]`

---

**Next step:** [2.8 — Media & Document Model](MEDIA_DOCUMENT_MODEL.md) [DAB-009]

**End of Volume 2.7.**
