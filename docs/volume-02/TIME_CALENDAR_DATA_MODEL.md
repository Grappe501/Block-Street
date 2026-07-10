# Build Volume 2.7 — Time & Calendar Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.7 · **DAB-008**  
**Artifact:** `TIME_CALENDAR_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.6 Event Data Model](EVENT_DATA_MODEL.md) [DAB-007] · [Experience Schema](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-SCH10] · Experience Service [ENG-DS]  
**Live spec:** `data/registry/time-calendar-data-model.json`

> Time is the **coordination system** that synchronizes people, communities, missions, institutions, and intelligence.

---

## Purpose

**[DAB-TIM01]** The Time & Calendar Data Model defines how **time is represented** throughout the Community Operating System.

**[DAB-TIM01a]** Time is not simply dates on a calendar. Time is the coordination system that synchronizes:

- People
- Communities
- Missions
- Institutions
- Intelligence

**[DAB-TIM01b]** Every participant, community, and organization should experience **one coherent view of time**.

---

## Guiding Principle

**[DAB-TIM02]**

> **Everything meaningful happens in time. The platform should understand time as a relationship, not just a timestamp.**

**[DAB-TIM02a]** Calendars become the **operational heartbeat** of the Community Operating System.

---

## Philosophy

**[DAB-TIM03]** Traditional software treats calendars as scheduling tools.

**[DAB-TIM03a]** The Community Operating System treats calendars as:

| Role | Meaning |
|------|---------|
| Planning | Forward coordination |
| Coordination | Multi-party alignment |
| Institutional memory | Historical rhythms [LHE-001] |
| Volunteer management | Capacity and commitment |
| Leadership development | Pathway scheduling |
| Mission execution | Deadlines and milestones |
| Community rhythms | Traditions and cadence |

**[DAB-TIM03b]** Time becomes a **shared operating layer**.

---

## Calendar Philosophy

**[DAB-TIM04]** Every significant entity may own one or more calendars.

Examples: Participant · Community · County · Institution · Mission · Committee · Initiative · Partner · Event

**[DAB-TIM04a]** Every calendar is part of a **larger network** — events may appear on multiple calendars simultaneously.

**[DAB-TIM04b]** Calendars are **first-class entities** [DAB-SCH10], not UI-only views.

---

## Calendar Hierarchy

**[DAB-TIM05]** Calendars nest within a statewide coordination hierarchy:

```text
Platform Calendar
        ↓
State Calendar
        ↓
Regional Calendar
        ↓
County Calendar
        ↓
Institution Calendar
        ↓
Community Calendar
        ↓
Committee Calendar
        ↓
Mission Calendar
        ↓
Participant Calendar
```

**[DAB-TIM05a]** Events may appear across **multiple calendars** simultaneously — scoped by visibility and subscription.

---

## Calendar Types

**[DAB-TIM06]** Seven primary calendar types.

### Personal Calendar

**[DAB-TIM06a]** Owned by participants. Contains: volunteer commitments · meetings · training · mentorship · assignments · reminders · personal goals

### Community Calendar

**[DAB-TIM06b]** Contains: meetings · volunteer opportunities · celebrations · training · community traditions · planning sessions

### County Calendar

**[DAB-TIM06c]** Contains: county-wide activities · partner events · leadership gatherings · shared initiatives · regional coordination

### Institution Calendar

**[DAB-TIM06d]** Contains: academic events · community engagement · recruitment · volunteer opportunities · campus activities

### Mission Calendar

**[DAB-TIM06e]** Tracks: planning · milestones · deadlines · volunteer assignments · deliverables · mission review

### Initiative Calendar

**[DAB-TIM06f]** Supports long-term strategic efforts: community launches · leadership development · annual campaigns · regional expansion

### Organizational Calendar

**[DAB-TIM06g]** Represents partner organizations — allows coordinated scheduling [DAB-SCH13]

---

## Calendar Object

**[DAB-TIM07]** Every calendar includes:

| Field | Purpose |
|-------|---------|
| Canonical ID | Stable identifier |
| Owner | Participant, community, institution, etc. |
| Calendar Type | Personal, community, mission, … |
| Visibility | Permission class |
| Time Zone | Display and recurrence anchor |
| Permissions | Who may view, edit, subscribe |
| Subscriptions | Linked subscriber calendars |
| Metadata | Color, slug, sync tokens |
| History | Lifecycle and audit trail |

**[DAB-TIM07a]** Calendars become **first-class entities** — not derived UI constructs.

---

## Event Object

**[DAB-TIM08]** Every calendar event includes:

Title · Description · Start · End · Duration · Location · Participants · Community Context · Mission Context · Attachments · Related Stories · Knowledge Links

**[DAB-TIM08a]** Events become **connected objects** — linked to missions, knowledge, and geographic context [DAB-E08].

**[DAB-TIM08b]** `starts_at` / `ends_at` stored **UTC**; display in owner/participant timezone [DAB-TIM14].

**[DAB-TIM08c]** On schedule/attendance: emit experience events to Community Event Ledger [DAB-EVT06e].

---

## Recurrence Model

**[DAB-TIM09]** Support:

- Daily · Weekly · Monthly · Yearly
- Custom recurrence
- Exceptions

**[DAB-TIM09a]** Recurrence should remain **configurable** — iCalendar RRULE compatible (RFC 5545) for federation.

**[DAB-TIM09b]** Exception records override individual occurrences without breaking the series.

**[DAB-TIM09c]** Materialized occurrences generated within rolling horizon for search and conflict detection.

---

## Time Zones

**[DAB-TIM10]** The platform stores **canonical UTC timestamps** while presenting times in each participant's preferred time zone.

**[DAB-TIM10a]** Platform default: `America/Chicago` (Arkansas V1).

**[DAB-TIM10b]** Future expansion beyond Arkansas should require **no redesign**.

**[DAB-TIM10c]** DST handled by timezone database — never manual offset math.

---

## Availability Model

**[DAB-TIM11]** Participants may define:

- Availability blocks
- Preferred meeting times
- Volunteer availability
- Travel constraints
- Quiet hours
- Vacation

**[DAB-TIM11a]** Availability supports **intelligent scheduling** via Temporal Intelligence Engine [DAB-TIM25].

---

## Scheduling Relationships

**[DAB-TIM12]** Scheduling connects:

Participants · Communities · Missions · Events · Facilities · Transportation · Partners · Mentors

**[DAB-TIM12a]** Scheduling becomes **relationship-aware** — aligned with Relationship Ledger [DAB-REL02] and Capacity schema [DAB-SCH14].

---

## Calendar Subscriptions

**[DAB-TIM13]** Participants may subscribe to:

Community · County · Mission · Leadership · Institution · Partner calendars

**[DAB-TIM13a]** Subscriptions remain **permission-aware** — authorization before content exposure.

---

## Shared Calendars

**[DAB-TIM14]** Communities may expose:

- Public calendar
- Member calendar
- Leadership calendar
- Planning calendar
- Private coordination calendar

**[DAB-TIM14a]** Visibility remains **configurable** per calendar layer.

---

## Reminder Objects

**[DAB-TIM15]** Reminders become **their own entity** — independent from events.

Support:

- Time offsets
- Escalation
- Channels
- Acknowledgment
- Repeat rules
- Reminder history

**[DAB-TIM15a]** Reminder delivery via Communication Architecture [ENG-012 · AME-001] — scheduling separate from notifications [DAB-TIM26].

---

## Timeline Integration

**[DAB-TIM16]** Every calendar event automatically contributes to:

Participant Timeline · Community Timeline · Mission Timeline · County Timeline · Institution Timeline · Platform Timeline

**[DAB-TIM16a]** Scheduling strengthens **historical memory** [DAB-EVT17 · LHE-001].

**[DAB-TIM16b]** One scheduled event may appear in **multiple timelines** — privacy filtered per viewer.

---

## Notification Integration

**[DAB-TIM17]** Calendars integrate with:

- Notification Engine
- Attention Management Engine [AME-001]
- Communication Preferences
- Digest generation

**[DAB-TIM17a]** Scheduling and communication remain **coordinated** — respect attention budget.

---

## Knowledge Integration

**[DAB-TIM18]** Calendar events may reference:

Stories · Lessons · Playbooks · Community Brain · Mission Library

**[DAB-TIM18a]** Knowledge becomes part of **planning** — not just post-event capture [DAB-SCH12].

---

## Geographic Integration

**[DAB-TIM19]** Calendar events support:

Venue · Campus · County · Map location · Travel estimates · Future routing

**[DAB-TIM19a]** Calendars and **maps work together** [Registry schema · geo metadata].

---

## AI Scheduling

**[DAB-TIM20]** AI may:

- Recommend meeting times
- Detect conflicts
- Suggest volunteer assignments
- Recommend event spacing
- Identify overcommitted leaders
- Summarize upcoming commitments

**[DAB-TIM20a]** AI **recommends but does not schedule** without participant approval [CIF-001 · DAB-PH10].

**[DAB-TIM20b]** Recommendations are explainable — cite availability, history, and capacity signals.

---

## Calendar Federation

**[DAB-TIM21]** Support synchronization with:

Google Calendar · Microsoft Outlook · Apple Calendar · ICS · Future providers

**[DAB-TIM21a]** Synchronization should remain **modular and replaceable** — federation adapters isolated from core calendar model.

---

## Future Calendar Types

**[DAB-TIM22]** Potential future calendars:

Campaign · Legislative · Housing · Scholarship · Career · Research

**[DAB-TIM22a]** The architecture should expand through **addition** without redesign [DAB-SCH31].

---

## Temporal Intelligence Engine

**[DAB-TIM23]** **Major Architectural Recommendation:** Create a **Temporal Intelligence Engine** that sits above the calendar system.

**[DAB-TIM23a]** Traditional calendar software manages events. The Temporal Intelligence Engine understands **time as a strategic resource**.

**[DAB-TIM23b]** It continuously evaluates:

- Personal availability
- Community rhythms
- Mission deadlines
- Leadership workload
- Volunteer capacity
- Institutional schedules
- County-wide events
- Historical participation patterns
- Seasonal trends

**[DAB-TIM23c]** Rather than simply warning about conflicts, it can answer:

- When is the best time to launch a volunteer campaign?
- Which week has historically produced the strongest attendance?
- Which leaders are becoming overcommitted?
- What recurring events are likely to compete for attention?
- When should communities coordinate statewide initiatives?

**[DAB-TIM23d]** The engine draws from:

Calendars · Community Event Ledger [DAB-EVT21] · Living History Engine [LHE-001] · Community Knowledge Graph [DAB-006] · Digital Twins [LDT-001] · Attention Management Engine [AME-001]

**[DAB-TIM23e]** Provides **explainable scheduling recommendations** — transforms calendars from passive tools into intelligent coordination.

**[DAB-TIM23f]** Live spec: `data/registry/time-calendar-data-model.json` · `temporalIntelligenceEngine`

---

## Burt Implementation Guidance

**[DAB-TIM24]** Implementation should:

1. Treat calendars as **first-class entities**
2. Keep **scheduling separate from notifications**
3. Build **relationship-aware events**
4. Support **multiple overlapping calendars**
5. Preserve **historical event participation**
6. Design **synchronization as a replaceable integration**
7. Consult Temporal Intelligence Engine spec before scheduling features

**[DAB-TIM24a]** Physical storage maps to Experience schema [DAB-SCH10]: Calendar · Schedule · Event · Venue · Registration · Attendance · CheckIn.

---

## AC-113 — Acceptance Criteria

Volume 2.7 is complete when:

- [x] **[AC-113a]** Calendar philosophy is documented. `[DAB-TIM04]`
- [x] **[AC-113b]** Calendar hierarchy and object model are defined. `[DAB-TIM05–TIM08]`
- [x] **[AC-113c]** Scheduling, recurrence, availability, reminders, and federation are established. `[DAB-TIM09–TIM15, TIM21]`
- [x] **[AC-113d]** Timeline, knowledge, geographic, and AI integrations are incorporated. `[DAB-TIM16–TIM20]`
- [x] **[AC-113e]** Temporal Intelligence Engine specified. `[DAB-TIM23]`
- [x] **[AC-113f]** Burt has a complete blueprint for time as a foundational capability. `[DAB-TIM24]`

---

**Next step:** [2.8 — Media & Document Model](MEDIA_DOCUMENT_MODEL.md) [DAB-009]

**End of Volume 2.7.**
