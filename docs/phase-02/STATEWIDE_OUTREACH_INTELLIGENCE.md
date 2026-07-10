# Statewide Outreach Intelligence & Opportunity Dashboard

**Document ID:** PHASE-002.6  
**Artifact:** `STATEWIDE_OUTREACH_INTELLIGENCE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **Most CRMs tell you what you have. This platform shows you what you don't have yet.**

The outreach dashboard is not just reporting — it is the **statewide mission board**.

**Behavioral shift:**

| Old question | New question |
|--------------|--------------|
| "How many members do we have?" | "Which campus still needs its first organizer?" |

**Builds On:** [PHASE-002.5 Status Framework](CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md) · [PHASE-002.4 Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) · [LS-P7](../build-steps/PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md) · [REL-M09](ARKANSAS_RELATIONSHIP_GRAPH.md)

**Live spec:** `data/registry/outreach-intelligence.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| OIS-M01 | Purpose |
| OIS-M02 | Guiding principle |
| OIS-M03 | Primary questions |
| OIS-M04 | Dashboard levels |
| OIS-M05 | State dashboard |
| OIS-M06 | County dashboard |
| OIS-M07 | Institution dashboard |
| OIS-M08 | Personal dashboard |
| OIS-M09 | Outreach intelligence |
| OIS-M10 | Representation heat map |
| OIS-M11 | Opportunity engine |
| OIS-M12 | Growth metrics philosophy |
| OIS-M13 | Outreach prioritization |
| OIS-M14 | Recognition philosophy |
| OIS-M15 | Action-oriented design |
| OIS-M16 | Mission Board architecture |
| OIS-M17 | V1 scope |
| OIS-M18 | Data derivation rules |
| OIS-BG | Burt implementation guidance |
| AC-015 | Step 2.6 acceptance criteria |

---

## OIS-M01 — Purpose

**[OIS-M01]** This document defines the **Statewide Outreach Intelligence System**.

**[OIS-M01a]** Its purpose is not simply to display statistics.

**[OIS-M01b]** It continuously identifies **opportunities for growth**, reveals **underserved communities**, and helps participants discover **where they can make the greatest impact**.

**[OIS-M01c]** The Outreach Dashboard serves as the platform's **statewide mission board**.

*Differentiator:* Opportunity-first, not inventory-first.

---

## OIS-M02 — Guiding Principle

**[OIS-M02]**

> **The map is never finished.**

**[OIS-M02a]** There is always:

- Another student to reach
- Another campus to activate
- Another county to strengthen
- Another organizer to develop
- Another relationship to build

**[OIS-M02b]** The dashboard should **inspire action** rather than simply report activity.

---

## OIS-M03 — Primary Questions

**[OIS-M03]** Every dashboard level answers:

| # | Question |
|---|----------|
| 1 | **Where are we strong?** |
| 2 | **Where are we growing?** |
| 3 | **Where do we need help?** |
| 4 | **Where can I contribute?** |
| 5 | **What should we do next?** |

**[OIS-M03a]** Final section always: **What can I do next?** [OIS-M15]

---

## OIS-M04 — Dashboard Levels

**[OIS-M04]** Same philosophy at every level — derived from **graph + status**, not separate systems.

| Level | Audience | Route (V1 target) |
|-------|----------|-------------------|
| **State** | Directors, statewide organizers | `/admin` · `/map` |
| **County** | County organizers | `/county/[slug]` + future dashboard |
| **Institution** | Campus organizers | `/schools/[slug]` + future dashboard |
| **Personal** | Every participant | `/dashboard/network` (V1) |

---

## OIS-M05 — State Dashboard

**[OIS-M05]** Displays **statewide progress** — query Registry + status + relationships.

### V1 Metrics (status/graph derived)

| Metric | Derivation |
|--------|------------|
| Counties represented | County organizing status ≥ `building` |
| Counties needing organizers | Status = `needs_outreach` |
| Active educational institutions | Institution status ≥ `building` |
| Institutions needing organizers | Status ∈ outreach filter [STS-M06] |
| Total participants | Count DB-USERS |
| Total personal networks | Count DB-NETWORKS |
| Recruitment momentum | Referral edges in date range |
| New communities launched | Status timeline transitions to `building` |

### Future metrics

Volunteer participation · Committee counts · Event activity

**[OIS-M05a]** Current bootstrap: `getRegistryStats()` on homepage/map — migrate to status queries in implementation.

---

## OIS-M06 — County Dashboard

**[OIS-M06]** County-specific progress:

| Metric | V1 | Future |
|--------|-----|--------|
| Institutions represented | Graph: county contains institutions with status ≥ building | ✅ |
| Institutions needing outreach | Status filter on contained institutions | ✅ |
| New participants | Participant `resides_in` county, date range | DB |
| Community activity | Activity feed | Future |
| Volunteer opportunities | Project edges | Future |
| Upcoming events | Event `occurs_in` county | Future |
| Growth trends | Status timeline [STS-M16] | V1.1 |

---

## OIS-M07 — Institution Dashboard

**[OIS-M07]** Campus-specific progress:

| Metric | V1 | Future |
|--------|-----|--------|
| Participant growth | `attends` edge count over time | DB |
| New organizers | Participant lifecycle → organizer | Future |
| Representation status | Organizing status display | ✅ |
| Recruitment activity | Referral subgraph | DB |
| Events / Projects / Committees | Future modules | — |

---

## OIS-M08 — Personal Dashboard

**[OIS-M08]** Individual contribution view [NET-001]:

| Section | V1 |
|---------|-----|
| My network | Network board |
| People invited | Referral count |
| Personal milestones | Future |
| Suggested next actions | Opportunity engine [OIS-M11] |
| Mentorship / Committees / Events | Future |

---

## OIS-M09 — Outreach Intelligence

**[OIS-M09]** Platform **continuously identifies opportunities** — surfaces them automatically.

| Opportunity | Detection rule |
|-------------|----------------|
| Institution has no organizer | organizing status = `needs_outreach` |
| County has no organizer | county organizing status = `needs_outreach` |
| County has participants but no committees | participants > 0 AND committees = 0 (future) |
| High interest, low activity | Signups > threshold, status still building |
| County has no upcoming events | No event edges with future date (future) |
| Nearby county needs volunteers | Graph: adjacent county + low participation (future) |
| Institution approaching milestone | Status timeline threshold (future) |

**[OIS-M09a]** Software surfaces opportunities — administrators don't hunt manually.

---

## OIS-M10 — Representation Heat Map

**[OIS-M10]** Arkansas map visually communicates organizing strength [LS-P7].

| Status | Map color semantics |
|--------|---------------------|
| Needs Outreach | High-attention (warm) |
| Building | In progress |
| Growing | Momentum |
| Established | Stable |
| Thriving | Strong |

**[OIS-M10a]** V1: county list on `/map` with status badges. V1.1: interactive SVG heat map.

**[OIS-M10b]** Participants immediately understand **where attention is needed**.

*Maps to:* `status-framework.json` organizing statuses

---

## OIS-M11 — Opportunity Engine

**[OIS-M11]** Present **opportunities**, not problems — hopeful, action-oriented language.

| Opportunity type | Example copy |
|------------------|--------------|
| First organizer | "Be the first organizer at {campus}." |
| County launch | "Help launch {county} County." |
| Join team | "Join the team at {campus} — organizers are building." |
| Mentor | "Mentor a new participant in {county}." |
| Committee | "Start a committee at {campus}." (future) |
| Event | "Host an event in {county}." (future) |
| Invite | "Invite classmates — {n} friends haven't invited anyone yet." |

**[OIS-M11a]** Each opportunity links to **clear next action** (join, invite, register).

---

## OIS-M12 — Growth Metrics Philosophy

**[OIS-M12]** Value **healthy growth** over raw numbers [CP-003, DG-007].

| Metric type | Examples |
|-------------|----------|
| Relationships | New referral edges, network depth |
| Engagement | Returning participants, volunteer hours (future) |
| Representation | Counties/institutions reaching `building`+ |
| Leadership | Natural progression participant → organizer → mentor |
| Community strength | Committee/project completion (future) |

**[OIS-M12a]** Emphasize **community strength** — not vanity counts alone.

---

## OIS-M13 — Outreach Prioritization

**[OIS-M13]** Future transparent priority factors (guide effort, not determine value):

- No current organizers · Low participation · High student population
- Geographic gaps · Requests for support

**[OIS-M13a]** Maps to `outreachPriority` on county/institution records [CNTY-M08, INST-M10].

**[OIS-M13b]** V1: `v1Priority` flag + organizing status sort order.

---

## OIS-M14 — Recognition Philosophy

**[OIS-M14]** Celebrate **contribution** — encourage collaboration, not unhealthy competition [STS-M12, CP-003].

| Milestone | Recognition |
|-----------|-------------|
| First organizer in county | County launch badge |
| Campus launch | Institution milestone |
| Mentorship | Mentor recognition (future) |
| Volunteer impact | Hours milestone (future) |
| Project completion | Community project badge (future) |
| Relationship building | Network growth milestones |

**[OIS-M14a]** Recognition derived from **status timeline** transitions [STS-M16].

---

## OIS-M15 — Action-Oriented Design

**[OIS-M15]** Every dashboard answers:

| Section | Content |
|---------|---------|
| **What happened?** | Recent activity, growth, transitions |
| **What matters?** | Opportunities, gaps, priorities |
| **What can I do next?** | Single clear CTA |

**[OIS-M15a]** No dashboard dead-ends — always a meaningful next step [LS-P3].

---

## OIS-M16 — Mission Board Architecture

**[OIS-M16]** **Signature feature:** Mission Board — not primarily numbers and charts, but **living opportunity cards**.

**Example cards:**

```
"Pulaski County needs its first youth committee."
"Three students are waiting for an organizer at UA Little Rock."
"Faulkner County is one event away from reaching its next milestone."
"You have five friends who haven't invited anyone yet."
"This nearby campus is looking for volunteers."
```

**[OIS-M16a]** Card structure:

| Field | Description |
|-------|-------------|
| `id` | `OPP-{uuid}` |
| `type` | opportunity type from catalog |
| `title` | Human-readable headline |
| `body` | Supporting detail |
| `entityId` | Related county/institution/participant |
| `priority` | critical · high · medium · low |
| `actionLabel` | CTA text |
| `actionUrl` | Deep link |
| `audience` | state · county · institution · personal |

**[OIS-M16b]** Mission Board transforms platform from analytics tool → **living list of meaningful opportunities**.

**[OIS-M16c]** V1 Mission Board surfaces:

- Institutions needing organizers (from status query)
- Counties needing outreach
- Personal invite prompts (when network data live)

**Routes:** State Mission Board → `/admin` or `/map` · Personal → network dashboard

---

## OIS-M17 — V1 Scope

**[OIS-M17]** Version 1 delivers:

| Deliverable | Status |
|-------------|--------|
| State stats on homepage/map | Partial (registry counts) |
| Institution/county outreach lists | Partial (status badges) |
| Mission Board card spec | ✅ This document |
| Heat map visual | List only; SVG deferred |
| County/institution dashboards | Hub pages only |
| Personal opportunity cards | Requires NET-001 + USR-001 |
| Full opportunity engine | Rules documented; partial V1 |

**[OIS-M17b]** Full implementation after DB + signup live [Phase 3].

---

## OIS-M18 — Data Derivation Rules

**[OIS-M18]** All dashboard content derives from:

```
Registry nodes (county, institution)
    +
Status framework (organizing status, timeline)
    +
Relationship graph (contains, attends, invited_by)
    +
Operational DB (participants, networks)
    =
Outreach intelligence queries
```

**[OIS-M18a]** **No hard-coded metrics** [OIS-BG]. Query definitions live in `outreach-intelligence.json`.

**[OIS-M18b]** Reusable dashboard components consume **query results**, not raw page data.

---

## OIS-BG — Burt Implementation Guidance

**[OIS-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | Use **Registry + status + graph** as foundation |
| 2 | Derive all metrics from queries — **no hard-coded** county/institution lists |
| 3 | Build **Mission Board** as card list, not chart-first |
| 4 | Use **hopeful language** in opportunity copy [OIS-M11] |
| 5 | Support **future analytics** without redesign |
| 6 | **Reusable components** across state/county/institution/personal |
| 7 | **Mobile-first** — mission cards readable on phone [ED-MF] |
| 8 | Connect to Admin Launch tab + public `/map` |

---

## AC-015 — Acceptance Criteria

Step 2.6 is complete when:

- [x] **[AC-015a]** Outreach dashboard philosophy documented. `[OIS-M01, OIS-M02]`
- [x] **[AC-015b]** Dashboard behavior defined at all four levels. `[OIS-M04–M08]`
- [x] **[AC-015c]** Opportunity-based organizing established. `[OIS-M09, OIS-M11]`
- [x] **[AC-015d]** Mission Board architecture specified. `[OIS-M16]`
- [x] **[AC-015e]** Heat map and visualization concepts identified. `[OIS-M10]`
- [x] **[AC-015f]** Burt has blueprint for statewide intelligence layer. `[OIS-BG, outreach-intelligence.json]`

---

**Next Step:** 2.8 — Registry Source & Verification Protocol

*Trace: LS-P7 → OIS-M05 → status-framework dashboardQueries → Mission Board [OIS-M16]*
