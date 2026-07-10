# Community Growth & Sustainability Framework

**Document ID:** PHASE-004.2  
**Artifact:** `COMMUNITY_GROWTH_SUSTAINABILITY.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **Healthy communities continually develop new people, preserve knowledge, and create opportunities for others.**

Communities are **living organisms** — born, growing, struggling, dormant, revived. This document establishes that Burt builds software supporting **real organizing**, not assuming every community is permanently "active."

Our objective is not simply to launch communities — it is to help them **thrive for decades**.

**Builds On:** [Community Constitution](COMMUNITY_CONSTITUTION.md) · [Status & Lifecycle Framework](../phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md) · [Community Identity](../phase-02/COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md) · [Participant Journey](../phase-03/PARTICIPANT_JOURNEY.md)

**Live spec:** `data/registry/community-growth-sustainability.json`

**Extends:** [STS-001] with community-specific lifecycle — does not replace universal status framework.

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CGS-M01 | Purpose |
| CGS-M02 | Guiding principle |
| CGS-M03 | Community philosophy |
| CGS-M04 | Lifecycle stages |
| CGS-M05 | Sustainability principles |
| CGS-M06 | Leadership succession |
| CGS-M07 | Institutional memory |
| CGS-M08 | Community health |
| CGS-M09 | Support during decline |
| CGS-M10 | Cross-community support |
| CGS-M11 | Community renewal |
| CGS-M12 | Community Health Check architecture |
| CGS-M13 | STS-001 integration |
| CGS-M14 | CCN hierarchy integration |
| CGS-M15 | V1 scope |
| CGS-BG | Burt implementation guidance |
| AC-035 | Step 4.2 acceptance criteria |

---

## CGS-M01 — Purpose

**[CGS-M01]** This document defines how communities are **created, developed, sustained, renewed, and preserved** throughout ASYON.

**[CGS-M01a]** Communities are treated as **living systems** that evolve over time — never "finished" [CGS-M03].

**[CGS-M01b]** The platform exists to help communities become **resilient, self-sustaining, and capable of developing future leaders** [CCN-M06, CCN-M10].

**[CGS-M01c]** Terminology: **Community Growth & Sustainability Framework** (not "lifecycle checklist" or "active/inactive flag").

---

## CGS-M02 — Guiding Principle

**[CGS-M02]**

> **Healthy communities continually develop new people, preserve knowledge, and create opportunities for others.**

**[CGS-M02a]** The measure of a successful community is **not simply activity** — it is **long-term resilience** [CGS-M08].

**[CGS-M02b]** Renewal is **natural** — not failure [CGS-M11, CGS-M09].

**[CGS-M02c]** Platform is **partner in community building, not supervisor** [CGS-M12 Health Check].

---

## CGS-M03 — Community Philosophy

**[CGS-M03]** Communities are **never finished**. Every community is always:

**Learning · Growing · Teaching · Adapting · Renewing · Building**

**[CGS-M03a]** The software should **evolve with them** — lifecycle independent from identity [CGS-BG].

**[CGS-M03b]** Dormant ≠ deleted. Decline ≠ shame. Struggle ≠ abandonment [CGS-M09].

---

## CGS-M04 — Lifecycle Stages

**[CGS-M04]** Seven stages — communities are living organisms:

### Stage 1 — Seed

Community **created**. Registry exists · Community page exists · Mission established · Waiting for participants · Waiting for organizers.

*Every community begins here* — including ADT-initialized counties/campuses [ADT-M08, ADT-M09 `needs_outreach`].

### Stage 2 — Sprout

**First participants arrive.** Initial registrations · First conversations · First relationships · First organizer · First invitation [RGE-001].

*Community begins forming.*

### Stage 3 — Growing

**Participation increases.** Committees form · Projects begin · Volunteer opportunities · Events organized · Identity develops · Momentum visible.

*Maps to CCN hierarchy Activity layer emerging.*

### Stage 4 — Established

**Operates consistently.** Regular meetings · Stable leadership · Recurring projects · Institutional knowledge · Mentorship · Strong volunteer participation.

### Stage 5 — Thriving

**Develops other communities.** Mentors neighboring campuses · Supports nearby counties · Launches committees · Shares resources · Develops leaders · **Statewide contributor**.

*Cross-community support flows outward [CGS-M10].*

### Stage 6 — Legacy

**Lasting infrastructure built.** Strong documentation · Leadership succession · Traditions · Community history · Long-term projects · Alumni involvement · **Institutional memory preserved** [CGS-M07, CCN-M13].

*Maps to CCN hierarchy Legacy layer.*

### Stage 7 — Renewal

**Natural transitions** — not failure. Leadership graduation · Membership decline · Changing priorities · New opportunities.

*Platform supports **rebuilding** [CGS-M11] — history, relationships, knowledge remain.*

**[CGS-M04a]** Lifecycle stored **independently** from Charter/identity [CGS-BG] — derived from participation signals where possible [JRN-M10 pattern].

**[CGS-M04b]** Transitions **append-only** on status timeline [STS-M16].

**[CGS-M04c]** Orchestrator: `deriveCommunityLifecycleStage(communityId)` — may cache, always rebuildable.

**[CGS-M04d]** Maps to STS county/institution organizing status where applicable — CGS adds **community-organism** semantics [CGS-M13].

---

## CGS-M05 — Sustainability Principles

**[CGS-M05]** Healthy communities:

| Principle |
|-----------|
| Welcome newcomers |
| Develop future leaders |
| Document knowledge |
| Share responsibility |
| Encourage participation |
| Celebrate service [CRA-001] |
| Adapt to change |

**[CGS-M05a]** **Sustainability depends upon people, not software** [CCN-M02a] — platform supports, never substitutes.

**[CGS-M05b]** Aligns with [CCN-M08] community responsibilities and [PEL-M10] community culture.

---

## CGS-M06 — Leadership Succession

**[CGS-M06]** Every community should **intentionally prepare future leaders**:

Mentorship · Shared responsibility · Leadership training · Knowledge transfer · Gradual transitions

**[CGS-M06a]** Communities should **never depend upon one individual** [CCN-M10].

**[CGS-M06b]** Succession tracked in institutional memory [CGS-M07] and Growth Graph at community level [CIS-001].

**[CGS-M06c]** OBE-001 may surface mentorship opportunities during succession gaps.

---

## CGS-M07 — Institutional Memory

**[CGS-M07]** Communities preserve:

Meeting notes · Guides · Traditions · Photos · Projects · Leadership history · Lessons learned

**[CGS-M07a]** Future organizers **inherit knowledge** — not recreate from scratch [CCN-M16 continuity].

**[CGS-M07b]** Implements via [Community Knowledge & Learning CKLS-001] + [Community Legacy System CLS-001] — CGS defines **why**.

**[CGS-M07c]** Append-only archive [KDG-M07, STS-M16] — never delete history on renewal.

---

## CGS-M08 — Community Health

**[CGS-M08]** Health evaluated **holistically** — guides support, **does not judge**:

| Indicator (examples) |
|----------------------|
| Participant retention |
| Volunteer engagement |
| Leadership development |
| Committee activity |
| Project completion |
| Relationship growth |
| Knowledge sharing |
| Community resilience |

**[CGS-M08a]** **Not vanity metrics** [OIS-M14, CCN-M14] — health metrics for community benefit [CIS-001].

**[CGS-M08b]** Health informs **OIS underserved signals** and cross-community support [CGS-M10] — not public ranking.

---

## CGS-M09 — Support During Decline

**[CGS-M09]** Communities occasionally need assistance:

Organizer relocation · Graduation · Volunteer burnout · Membership loss

**[CGS-M09a]** Platform support includes:

Suggested mentors · Neighboring communities · Leadership resources · Revival opportunities · Historical guidance

**[CGS-M09b]** **Objective is renewal** [Stage 7] — not marking community as failed.

**[CGS-M09c]** Community Companion [PEL-M11] tone: encouraging, never punitive.

**[CGS-M09d]** Thriving communities [Stage 5] paired as mentors via [CGS-M10].

---

## CGS-M10 — Cross-Community Support

**[CGS-M10]** Thriving communities help newer communities:

Mentorship · Resource sharing · Joint events · Leadership coaching · Project collaboration

**[CGS-M10a]** Creates **statewide ecosystem** — not isolated groups [CCN-M12, SCN-001].

**[CGS-M10b]** OBE-001 may suggest cross-community connections with explainable reasons [OBE-M06].

---

## CGS-M11 — Community Renewal

**[CGS-M11]** Communities should **always be able to restart**:

| Preserved on renewal |
|----------------------|
| History |
| Relationships |
| Knowledge |
| Charter (evolvable) |
| Status timeline |

**[CGS-M11a]** Participation may temporarily slow — **continuity preserved** [CCN-M16].

**[CGS-M11b]** Renewal workflows do **not delete** — they **reactivate** with context [CGS-BG].

**[CGS-M11c]** "Dormant" is a valid lifecycle state within Renewal — not archival deletion.

---

## CGS-M12 — Community Health Check Architecture

**[CGS-M12]** **Signature tool:** **Community Health Check** — reflection, not score.

**[CGS-M12a]** Not a grade. Not a leaderboard. **Partner, not supervisor** [CGS-M02c].

**[CGS-M12b]** Example reflection questions:

| Question |
|----------|
| Have you welcomed new members recently? |
| Are leadership responsibilities shared? |
| Do you have upcoming activities? |
| Are projects moving forward? |
| Is important knowledge documented? |
| Are experienced members mentoring newer participants? |
| Is anyone at risk of burnout? |

**[CGS-M12c]** Orchestrator: `runCommunityHealthCheck(communityId)` → reflective summary + optional support suggestions.

**[CGS-M12d]** Results visible to **community leaders** — not public rank [SEC-001, OIS-M14].

**[CGS-M12e]** Suggestions link to: mentors [CGS-M10], OBE opportunities, knowledge gaps [4.8], renewal resources [CGS-M09].

**[CGS-M12f]** Cadence: optional periodic prompt — respects Attention Budget [CAM-001]; never nagging.

**[CGS-M12g]** V1: question set spec + manual checklist; automated signals v1.1+.

---

## CGS-M13 — STS-001 Integration

**[CGS-M13]** CGS **extends** [STS-001] — one lifecycle philosophy, community-specific stages:

| STS layer | CGS layer |
|-----------|-----------|
| County/institution organizing status | Seed/Sprout entry |
| STS-M16 status timeline | Community lifecycle transitions |
| STS-M14 dashboard queries | Health + lifecycle on Community HQ [4.3] |
| `needs_outreach` [ADT-M09] | Seed stage default |

**[CGS-M13a]** Do **not** duplicate status tables — `community_lifecycle_events` references STS transition pattern [status-transition.schema.json].

**[CGS-M13b]** Participant lifecycle [JRN-001] and community lifecycle **interact** — participant growth may trigger community stage advances.

---

## CGS-M14 — CCN Hierarchy Integration

**[CGS-M14]** Lifecycle maps to [CCN-M03] hierarchy:

| CGS Stage | Hierarchy layer |
|-----------|-----------------|
| Seed, Sprout | Identity forming |
| Growing, Established | Activity |
| Thriving | Activity + cross-community |
| Legacy | Legacy |
| Renewal | Bridge back to Growing |

**[CGS-M14a]** Charter [CCN-M17] updates may accompany stage transitions — optional community reflection.

---

## CGS-M15 — V1 Scope

**[CGS-M15]** Design complete in Step 4.2:

| Deliverable | V1 |
|-------------|-----|
| Lifecycle philosophy + 7 stages | ✅ this document |
| Health Check spec | ✅ CGS-M12 |
| STS integration pattern | ✅ CGS-M13 |
| Derived lifecycle on hubs | stub from registration + invite counts |
| Automated Health Check + renewal workflows | v1.1 |

**[CGS-M15a]** Jul 12/14: counties/campuses display **Seed** (`needs_outreach`) accurately — not fake "active".

---

## CGS-BG — Burt Implementation Guidance

**[CGS-BG]** Implementation should:

1. **Represent lifecycle independently from identity** — stage ≠ Charter content [CGS-M04a]
2. **Track historical transitions** — append-only [STS-M16]
3. **Support leadership succession** — memory + mentorship links [CGS-M06]
4. **Preserve institutional memory** — never delete on renewal [CGS-M07, CGS-M11]
5. **Allow renewal without deleting history** — reactivate pattern [CGS-M11b]
6. **Design for long-term sustainability** — Health Check, not engagement hacks [CGS-M12]

**[CGS-BG-a]** Recommended structure:

```
src/lib/community/deriveCommunityLifecycleStage.ts
src/lib/community/runCommunityHealthCheck.ts
src/lib/community/communityLifecycleEvents.ts
```

**[CGS-BG-b]** Gate: no community dashboard assumes permanent "active" — lifecycle stage required.

---

## AC-035 — Acceptance Criteria

Step 4.2 is complete when:

- [x] **[AC-035a]** Community lifecycle stages fully documented. `[CGS-M04]`
- [x] **[AC-035b]** Sustainability philosophy established. `[CGS-M02, CGS-M05]`
- [x] **[AC-035c]** Leadership succession and institutional memory incorporated. `[CGS-M06, CGS-M07]`
- [x] **[AC-035d]** Renewal treated as natural stage. `[CGS-M11, CGS-M09]`
- [x] **[AC-035e]** Community Health Check architecture specified. `[CGS-M12]`
- [x] **[AC-035f]** Burt has blueprint for living, evolving communities. `[CGS-BG, community-growth-sustainability.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Seed → Sprout → Growing → Established → Thriving → Legacy → Renewal → decades of resilient organizing*
