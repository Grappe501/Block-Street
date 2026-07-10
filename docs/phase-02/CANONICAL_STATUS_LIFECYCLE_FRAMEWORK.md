# Canonical Status & Lifecycle Framework

**Document ID:** PHASE-002.5  
**Artifact:** `CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **This is where the platform becomes an operating system instead of a static website.**  
> Steps 2.1–2.4 defined *what exists*. Step 2.5 defines *what state it is in*.

**Status-driven, not page-driven.** Almost everything Burt builds later queries status rather than hard-coding behavior.

**Builds On:** [PHASE-002.4 Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) · [PHASE-002.2 County Model](COUNTY_REGISTRY_MODEL.md) · [PHASE-002.3 Institution Model](INSTITUTION_REGISTRY_MODEL.md)

**Live catalog:** `data/registry/status-framework.json` · **Timeline schema:** `data/registry/schemas/status-transition.schema.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| STS-M01 | Purpose |
| STS-M02 | Guiding principle |
| STS-M03 | Lifecycle philosophy |
| STS-M04 | Universal status categories |
| STS-M05 | County lifecycle |
| STS-M06 | Institution lifecycle |
| STS-M07 | Participant lifecycle |
| STS-M08 | Committee lifecycle (future) |
| STS-M09 | Event lifecycle (future) |
| STS-M10 | Project lifecycle (future) |
| STS-M11 | Relationship lifecycle |
| STS-M12 | Status change rules |
| STS-M13 | Status ownership |
| STS-M14 | Dashboard integration |
| STS-M15 | Automation hooks (future) |
| STS-M16 | Status timeline architecture |
| STS-M17 | V1 status scope & legacy mapping |
| STS-M18 | UI behavior matrix |
| STS-BG | Burt implementation guidance |
| AC-014 | Step 2.5 acceptance criteria |

---

## STS-M01 — Purpose

**[STS-M01]** This document establishes the **universal status and lifecycle framework** used throughout the Arkansas Student & Youth Organizing Network.

**[STS-M01a]** Rather than isolated status systems per module, the platform adopts **one lifecycle philosophy** applied consistently across entities.

**[STS-M01b]** Every county, institution, participant, committee, event, project, and future object progresses through a defined lifecycle.

**[STS-M01c]** Status answers operational questions:

| Question | Status-driven answer |
|----------|---------------------|
| Should this county show "Help Us Launch"? | County organizing status |
| Should this campus show "Looking for Organizers"? | Institution organizing status |
| Should this participant be greeted as a mentor? | Participant lifecycle stage |
| Should this institution appear on outreach dashboard? | Organizing + visibility status |

*Aligns with:* [REL-M09] Organizing intelligence · [LS-P7] Outreach visibility

---

## STS-M02 — Guiding Principle

**[STS-M02]**

> **Everything has a lifecycle.**

**[STS-M02a]** Nothing is simply "created" — everything **progresses**, **evolves**, and can become **dormant or archived**.

**[STS-M02b]** The software should understand **where every entity is in its journey**.

**[STS-M02c]** Status describes **reality** — not aspiration.

---

## STS-M03 — Lifecycle Philosophy

**[STS-M03]** Each entity follows a lifecycle **appropriate to its type**.

**Status values communicate:**

| Dimension | Meaning |
|-----------|---------|
| Current condition | Where it is now |
| Organizing readiness | Can people organize here? |
| Operational readiness | Is the module active? |
| Verification state | Is data/identity confirmed? |
| Growth stage | How mature is the community? |
| Future actions | What should happen next? |

**[STS-M03a]** Status is **queryable data** — separate from entity identity [CNTY-M16, INST-M18].

**[STS-M03b]** Pages **render based on status** — they do not define status.

---

## STS-M04 — Universal Status Categories

**[STS-M04]** Every entity supports one or more categories from `status-framework.json`:

### Operational Status

`planning` · `active` · `paused` · `completed` · `archived`

### Verification Status

`pending_review` · `verified` · `needs_update` · `rejected` · `historical`

### Organizing Status

Primary driver for counties and institutions in V1:

`needs_outreach` · `initial_contact` · `organizer_assigned` · `building` · `growing` · `established` · `thriving` · `inactive`

### Visibility Status

`private` · `internal` · `public` · `featured` · `hidden`

### System Status

`healthy` · `warning` · `needs_attention` · `disabled` · `retired`

**[STS-M04a]** V1 entities use **organizing status** + **verification status** primarily. Other categories activate with future modules.

---

## STS-M05 — County Lifecycle

**[STS-M05]** Every county progresses **independently**. The county **never disappears** — status evolves.

```
needs_outreach
    ↓
initial_organizer          (maps: initial_contact / organizer_assigned)
    ↓
building
    ↓
active_community           (maps: active / established)
    ↓
growing_community          (maps: growing)
    ↓
established_community      (maps: established)
    ↓
thriving_community         (maps: thriving)
```

| Status key | UI label (V1) | Show "Help Us Launch"? |
|------------|---------------|------------------------|
| `needs_outreach` | Needs Outreach | ✅ Yes |
| `building` | Building | Partial |
| `active_community` | Active | No — recruiting |
| `thriving_community` | Thriving | No |

**[STS-M05a]** Default for uncontacted counties: `needs_outreach`.

---

## STS-M06 — Institution Lifecycle

**[STS-M06]** Each institution has its own organizing lifecycle:

```
not_contacted              (maps: needs_outreach)
    ↓
outreach_started           (maps: initial_contact)
    ↓
organizer_assigned
    ↓
participant_registration   (maps: building)
    ↓
campus_community           (maps: active / established)
    ↓
growing_campus             (maps: growing)
    ↓
established_campus         (maps: established / thriving)
```

| Status key | UI label (V1) | Show "Looking for Organizers"? |
|------------|---------------|-------------------------------|
| `needs_outreach` | Looking for Organizers | ✅ Yes |
| `needs_organizer` | Looking for Organizers | ✅ Yes (legacy alias) |
| `building` | Building | Partial |
| `active` | Active | No — join & recruit |

**[STS-M06a]** Outreach dashboard includes institutions where organizing status ∈ `{needs_outreach, initial_contact, organizer_assigned}`.

---

## STS-M07 — Participant Lifecycle

**[STS-M07]** Participants evolve through participation — **leadership emerges naturally**, not by admin designation [CP-003].

```
registered
    ↓
verified
    ↓
engaged
    ↓
contributor
    ↓
organizer
    ↓
mentor
    ↓
alumni
    ↓
community_supporter
```

**[STS-M07a]** V1 implements: `registered` (on signup). Later stages computed from activity.

**[STS-M07b]** Greet as mentor when lifecycle stage ≥ `mentor` — status query, not hard-coded role field.

*Operational — not stored in Registry node; lives in DB-USERS.*

---

## STS-M08 — Committee Lifecycle (Future)

**[STS-M08]** Not V1 [LS-DEF]:

```
draft → recruiting → active → established → completed → archived
```

Schema hook only in V1.

---

## STS-M09 — Event Lifecycle (Future)

**[STS-M09]** Not V1:

```
planned → published → registration_open → in_progress → completed → archived
```

---

## STS-M10 — Project Lifecycle (Future)

**[STS-M10]** Not V1:

```
idea → planning → building → launching → operating → completed → historical
```

---

## STS-M11 — Relationship Lifecycle

**[STS-M11]** Relationships (edges) also have states:

```
invitation_sent → joined → active → mentoring → historical
```

| Applies to | Edge types |
|------------|------------|
| Referrals | `invited_by` / `invited` |
| Network | `connected_to` |
| Mentorship | `mentors` (future) |

**[STS-M11a]** Stored on relationship record `status` field [relationship-record.schema.json] + timeline.

---

## STS-M12 — Status Change Rules

**[STS-M12]** Status changes must be:

| Property | Requirement |
|----------|-------------|
| **Observable** | Visible in admin and relevant UI |
| **Auditable** | Logged with actor and reason |
| **Timestamped** | ISO datetime on every transition |
| **Reversible** | Where appropriate (not for verified→rejected without review) |
| **Historically preserved** | Never silent overwrite — append to timeline |

**[STS-M12a]** Platform understands **how communities evolve over time** [STS-M16].

---

## STS-M13 — Status Ownership

**[STS-M13]** Who updates status:

### Automatic (system)

| Trigger | Status change |
|---------|---------------|
| Registration completed | Participant → `registered` |
| Invitation accepted | Relationship → `joined` |
| Event end datetime passed | Event → `completed` |
| Participant threshold met | Institution → `building` (future rule) |

### Administrative review

| Action | Status |
|--------|--------|
| Data verification | Verification → `verified` |
| Featured designation | Visibility → `featured` |
| New institution approval | Registry + verification |

**[STS-M13a]** Steve approves constitutional status rule changes [TR-SR].

---

## STS-M14 — Dashboard Integration

**[STS-M14]** **Status powers dashboards** — nothing relies on hard-coded logic.

| Dashboard query | Status filter |
|-----------------|---------------|
| Counties needing outreach | County organizing = `needs_outreach` |
| Campuses building momentum | Institution organizing = `building` |
| Participants ready for mentorship | Participant lifecycle = `engaged`+ |
| Projects requiring volunteers | Project = `operating` (future) |
| Upcoming events | Event = `published` / `registration_open` (future) |
| Outreach gap dashboard [Step 2.6] | Aggregates organizing status across graph |

**[STS-M14a]** Admin Launch tab and `/map` stats derive from status queries.

---

## STS-M15 — Automation Hooks (Future)

**[STS-M15]** Future workflows triggered by status transitions — framework supports without redesign:

- Welcome resources on `registered`
- Notify organizers when county reaches `growing_community`
- Highlight institutions at `needs_outreach`
- Recommend mentors when participant → `engaged`

**[STS-M15a]** Document hooks only in V1; implement post-launch [GM-ROAD].

---

## STS-M16 — Status Timeline Architecture

**[STS-M16]** **Architectural enhancement:** Every major entity maintains a **Status Timeline** — not just current status.

**Example — Institution timeline:**

```
2026-07-01  needs_outreach      (seed)
2026-07-08  organizer_assigned  (admin)
2026-07-12  building            (first registration)
2026-07-20  growing             (10 participants)
```

**[STS-M16a]** Unlocks:

- Growth trend analysis · Progress reports · Milestone recognition
- Historical dashboards · Forecasting · Community development storytelling

**[STS-M16b]** Platform knows **where things are** AND **how they got there**.

### Timeline Record Schema

| Field | Description |
|-------|-------------|
| `id` | `STS-{entityId}-{sequence}` |
| `entityId` | e.g. `INST-uca` |
| `entityType` | County · Institution · Participant · etc. |
| `category` | organizing · verification · operational · etc. |
| `fromStatus` | Previous value (null if initial) |
| `toStatus` | New value |
| `changedAt` | ISO datetime |
| `changedBy` | system · admin · user id |
| `reason` | Optional note |
| `metadata` | Future automation context |

**[STS-M16c]** DB table: `DB-STATUS-TIMELINE` (or `status_transitions`). Current status = latest timeline entry per category (cached on entity for read performance).

---

## STS-M17 — V1 Status Scope & Legacy Mapping

**[STS-M17]** V1 implements organizing status for **County** and **Institution** only.

### Legacy bootstrap → canonical mapping

| Legacy (`institutions.json`) | Canonical organizing status |
|------------------------------|----------------------------|
| `needs_organizer` | `needs_outreach` |
| `building` | `building` |
| `active` | `active_community` / `campus_community` |

**[STS-M17a]** Code may read legacy values until Step 2.9 migration — UI labels map through `status-framework.json`.

**[STS-M17b]** Counties gain organizing status field in Step 2.9 seed (default: `needs_outreach`).

---

## STS-M18 — UI Behavior Matrix

**[STS-M18]** Status → UI behavior (query, don't hard-code):

| Entity | Status | Page behavior |
|--------|--------|---------------|
| County | `needs_outreach` | Show "Help Us Launch" CTA |
| County | `building`+ | Show join + youth hub |
| Institution | `needs_outreach` | Show "Looking for Organizers" |
| Institution | `building` | Show "Building" badge + join |
| Institution | `active`+ | Show join + recruit CTA |
| Participant | `mentor`+ | Greet as mentor (future) |

**[STS-M18a]** Replace inline checks like `representationStatus === "building"` with status framework lookups when implementing [STS-BG].

---

## STS-BG — Burt Implementation Guidance

**[STS-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | Represent status **separately** from entity identity |
| 2 | **Never embed business logic in page code** — query status |
| 3 | Treat status as **queryable data** (DB + API) |
| 4 | **Preserve historical transitions** in timeline table |
| 5 | Design workflows that **respond to status** not assumptions |
| 6 | Read labels/UI mapping from `status-framework.json` |
| 7 | Dashboard filters = status queries over graph [REL-M09] |
| 8 | V1: organizing status on county + institution; participant on signup |

**Anti-pattern:** `if (slug === 'pulaski') showHelpUsLaunch()` — always wrong.

---

## AC-014 — Acceptance Criteria

Step 2.5 is complete when:

- [x] **[AC-014a]** Universal lifecycle philosophy documented. `[STS-M02, STS-M03]`
- [x] **[AC-014b]** Status categories standardized. `[STS-M04, status-framework.json]`
- [x] **[AC-014c]** Major entity lifecycles defined. `[STS-M05–M11]`
- [x] **[AC-014d]** Status transitions designed for audit and automation. `[STS-M12, STS-M16]`
- [x] **[AC-014e]** Dashboard integration documented. `[STS-M14]`
- [x] **[AC-014f]** Status timeline architecture established. `[STS-M16]`
- [x] **[AC-014g]** Burt has consistent framework for status-driven behavior. `[STS-BG, STS-M18]`

---

**Next Step:** 2.6 — Outreach Gap Dashboard Requirements (`OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md`)

*Trace: STS-M14 → REL-M09 → Launch tab · LS-P7 · LS-CHK*
