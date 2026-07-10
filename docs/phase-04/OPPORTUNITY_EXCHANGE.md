# Opportunity Exchange

**Document ID:** PHASE-004.12  
**Artifact:** `OPPORTUNITY_EXCHANGE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** OEX

> **No willing volunteer should wonder where they can help. No community should struggle alone if help exists elsewhere.**

This is where the platform begins to feel like a **living ecosystem** instead of a website.

Most platforms wait for users to search. ASYON constantly surfaces **ways to help and ways to be helped**.

"Community Marketplace" is too commercial — we're not buying and selling. We're **connecting people with opportunities**.

The **Opportunity Exchange** is the central place where communities, participants, teams, and missions meet.

**Requirement:** OEX-001 *(implements statewide discovery layer; complements [OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) participant belonging and [CCE-001](COMMUNITY_CAPABILITY_EXCHANGE.md) capability supply)*

**Builds On:** [Opportunity & Belonging Engine](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · [Community Capability Exchange](COMMUNITY_CAPABILITY_EXCHANGE.md) · [Statewide Collaboration Network](STATEWIDE_COLLABORATION_NETWORK.md) · [Mission & Project System](MISSION_PROJECT_SYSTEM.md) · [Time & Scheduling OS](TIME_SCHEDULING_OPERATING_SYSTEM.md) · [Personal Digital Twin](../phase-03/PERSONAL_DIGITAL_TWIN.md)

**Live spec:** `data/registry/opportunity-exchange.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| OEX-M01 | Purpose |
| OEX-M02 | Guiding principle |
| OEX-M03 | Philosophy |
| OEX-M04 | Opportunity categories |
| OEX-M05 | Opportunity profiles |
| OEX-M06 | Personalized discovery |
| OEX-M07 | Opportunity map |
| OEX-M08 | Opportunity feed |
| OEX-M09 | Matching |
| OEX-M10 | Community needs |
| OEX-M11 | Success stories |
| OEX-M12 | Future AI assistance |
| OEX-M13 | Community Needs Index architecture |
| OEX-M14 | Platform integrations |
| OEX-M15 | V1 scope |
| OEX-BG | Burt implementation guidance |
| AC-045 | Step 4.12 acceptance criteria |

---

## OEX-M01 — Purpose

**[OEX-M01]** The **Opportunity Exchange (OEX)** is the **statewide discovery engine for meaningful participation**.

**[OEX-M01a]** It continuously connects people, communities, teams, and missions based on:

- Interests · skills · availability · location · community needs

**[OEX-M01b]** Objective: make it **easy for every participant to find a meaningful place to contribute** [OBE-M01, PEL-M13].

**[OEX-M01c]** OEX reduces the distance between **willingness and action**.

---

## OEX-M02 — Guiding Principle

**[OEX-M02]**

> **No willing volunteer should wonder where they can help. No community should struggle alone if help exists elsewhere.**

**[OEX-M02a]** The Exchange **surfaces opportunities proactively** — participants should not have to hunt for where they belong [OBE-M03].

---

## OEX-M03 — Philosophy

**[OEX-M03]** The Exchange is **not a job board**. It is a **community connector**.

**[OEX-M03a]** Every opportunity represents a chance to:

- Serve · learn · lead · meet people · strengthen a community · build relationships

**[OEX-M03b]** **Belonging through meaningful contribution** [OBE-001] — not engagement optimization.

**[OEX-M03c]** Opportunities are **relational**, not transactional — no commercial framing.

---

## OEX-M04 — Opportunity Categories

**[OEX-M04]** Seven opportunity categories:

### Volunteer Opportunities [OEX-M04a]

Food drives · campus welcome events · community cleanup · tutoring · transportation · photography · event setup · registration assistance

### Leadership Opportunities [OEX-M04b]

Committee coordinator · project leader · mentor · training facilitator · regional organizer · campus ambassador · county coordinator — **leadership grows through service** [PGL-001]

### Learning Opportunities [OEX-M04c]

Workshops · leadership training · community conversations · skill development · volunteer orientation · future Arkansas Civic Academy

### Collaboration Opportunities [OEX-M04d]

Communities seeking partners · shared events · joint projects · regional initiatives · knowledge exchange · volunteer exchanges [SCN-001]

### Mentorship Opportunities [OEX-M04e]

Become a mentor · find a mentor · leadership coaching · career guidance · organizing support · peer learning

### Resource Requests [OEX-M04f]

Need volunteers · meeting space · photographer · translator · technology · supplies — communities **openly request help** [CCE-001 requests]

### Mission Opportunities [OEX-M04g]

Join a mission · launch a mission · support existing work · continue unfinished work · expand successful projects [MPS-001]

---

## OEX-M05 — Opportunity Profiles

**[OEX-M05]** Every opportunity receives a **structured profile**:

| Field | Purpose |
|-------|---------|
| Title · Description · Purpose | Why it matters |
| Community · Mission | Context |
| Skills needed · Time commitment | Fit |
| Location · Dates · Capacity | Logistics |
| Organizer · Current participants | Who's involved |
| Related resources | Links to CKLS, CCE |

**[OEX-M05a]** Every opportunity should **clearly explain why it matters** — not just what needs doing.

**[OEX-M05b]** Opportunities are **reusable entities** — distinct from but linked to projects [OEX-BG].

---

## OEX-M06 — Personalized Discovery

**[OEX-M06]** Participants receive opportunities based on:

- Interests · skills · journey stage [JRN-001]
- Communities · location · relationships [PDT-001]
- Volunteer history · availability

**[OEX-M06a]** Discovery should feel **natural rather than random** — explainable [OBE-M06, TPS-M12].

**[OEX-M06b]** OBE-001 provides **participant-level personalization**; OEX-001 provides **statewide opportunity corpus + community needs** — complementary layers.

**[OEX-M06c]** Orchestrator: `discoverOpportunities(participantId, filters)`.

---

## OEX-M07 — Opportunity Map

**[OEX-M07]** Participants may browse opportunities by:

- County · campus · region · mission · date · skill · community

**[OEX-M07a]** The map helps participants **visualize activity across Arkansas** [ADT-001, PAGE-MAP].

**[OEX-M07b]** Distinct from [Arkansas Collaboration Map SCN-M14] — OEX map shows **open opportunities**; SCN map shows **active collaborations**.

**[OEX-M07c]** Orchestrator: `queryOpportunityMap(filters)`.

---

## OEX-M08 — Opportunity Feed

**[OEX-M08]** Every participant receives a **personalized Opportunity Feed**.

**[OEX-M08a]** Examples:

- Today's opportunities · nearby events · communities needing help
- Leadership openings · volunteer requests · mentorship opportunities

**[OEX-M08b]** Feed surfaces in [Personal Command Center PCC-M07], [Community Command Center CCC-M08], and Morning Brief [CAM-001] — respects attention budget.

**[OEX-M08c]** Feed should remain **fresh and relevant** — not stale bulletin board.

**[OEX-M08d]** Orchestrator: `assembleOpportunityFeed(participantId, lastVisitAt)`.

---

## OEX-M09 — Matching

**[OEX-M09]** The platform intelligently connects:

| From | To |
|------|-----|
| Participants | Missions |
| Communities | Volunteers |
| Mentors | New organizers |
| Projects | Skilled participants |
| Counties | Partner campuses |

**[OEX-M09a]** Matching remains **transparent and explainable** [OBE-M06, CIS-M12] — never black box.

**[OEX-M09b]** Orchestrator: `matchNeedsToCapabilities(needId)` — core of Community Needs Index [OEX-M13].

---

## OEX-M10 — Community Needs

**[OEX-M10]** Communities should **easily publish needs**:

- Committee members · event volunteers · photographer · mentor · trainer

**[OEX-M10a]** Needs become **visible statewide** — not buried in local silos [SCN-001].

**[OEX-M10b]** Orchestrator: `publishCommunityNeed(communityId, need)`.

---

## OEX-M11 — Success Stories

**[OEX-M11]** Completed opportunities become **stories**:

- Volunteer reflections · community impact · relationships formed · lessons learned · recognition [CRA-001]

**[OEX-M11a]** Success **encourages future participation** — feeds Opportunity Feed and [Community Legacy CLS-001].

**[OEX-M11b]** Append-only — accomplishments preserved across leadership transitions [CGS-M11].

---

## OEX-M12 — Future AI Assistance

**[OEX-M12]** Future AI may:

- Recommend opportunities · suggest volunteers · identify unmet needs
- Recommend collaborations · explain recommendations · surface overlooked opportunities

**[OEX-M12a]** AI **supports discovery without making decisions** [KDG-M16, OBE-M06].

---

## OEX-M13 — Community Needs Index Architecture

**[OEX-M13]** **Community Needs Index** — signature feature of OEX.

**[OEX-M13a]** Instead of communities simply posting opportunities, maintain a **living index** of needs and offers:

**Communities publish needs:**

- Volunteers · skills · equipment · training · mentorship · partnerships · meeting space · project assistance

**Participants and communities publish offers:**

- Available skills · volunteer time · equipment · mentorship · partnership interest [CCE-001]

**[OEX-M13b]** The platform **continuously compares needs with available capabilities**:

```text
Pulaski County
Needs:
• Graphic designer
• Photographer
• Volunteer coordinator
        ↓
Platform searches Capability Graph + PDT
        ↓
Finds:
• UCA student skilled in design
• Benton County photographer willing to travel
• Philander Smith volunteer coordinator available to mentor
```

**[OEX-M13c]** Transforms OEX into a **mutual aid network** — not a bulletin board.

**[OEX-M13d]** Communities are no longer limited to people immediately around them — connected to **collective strengths of the statewide network** [SCN-001, CCE-M13].

**[OEX-M13e]** Orchestrator: `queryCommunityNeedsIndex(filters)` · `matchNeedsToCapabilities(needId)`.

**[OEX-M13f]** V1: spec + index schema stub — full continuous matching future.

---

## OEX-M14 — Platform Integrations

**[OEX-M14]** OEX integrates across the platform:

| Module | Integration |
|--------|-------------|
| [OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) | Participant personalization layer |
| [PDT-001](../phase-03/PERSONAL_DIGITAL_TWIN.md) | Context for discovery |
| [CCE-001](COMMUNITY_CAPABILITY_EXCHANGE.md) | Capability supply side |
| [SCN-001](STATEWIDE_COLLABORATION_NETWORK.md) | Collaboration opportunities |
| [MPS-001](MISSION_PROJECT_SYSTEM.md) | Mission opportunities |
| [TSOS-001](TIME_SCHEDULING_OPERATING_SYSTEM.md) | Dates, availability, timeline |
| [CCC-001](COMMUNITY_COMMAND_CENTER.md) | Opportunity widget [CCC-M08] |
| [PCC-001](../phase-03/PERSONAL_COMMAND_CENTER.md) | Personal opportunity feed |
| [CIS-001](COMMUNITY_INTELLIGENCE_SYSTEM.md) | Unmet needs intelligence |
| [CRA-001](../phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md) | Success stories |
| [OIS-001](../phase-02/OUTREACH_INTELLIGENCE_SYSTEM.md) | Community-level opportunity signals |

**[OEX-M14a]** Three-layer opportunity stack:

```text
OIS-001  →  community-level signals (Phase 2)
OEX-001  →  statewide needs + capability matching (Phase 4)
OBE-001  →  participant personalization (Phase 3)
```

---

## OEX-M15 — V1 Scope

**[OEX-M15]** V1 deliverables:

| Capability | V1 |
|------------|-----|
| Philosophy + seven categories | ✅ Documented |
| Community Needs Index spec | ✅ Architecture + schema stub |
| Opportunity entity schema | ✅ Defined |
| Matching principles + explainability | ✅ Required |
| Opportunity feed contract | ✅ Spec |
| Full continuous matching engine | Future |
| AI recommendations | Future |

---

## OEX-BG — Burt Implementation Guidance

**[OEX-BG]** Implementation should:

1. **Treat opportunities as reusable entities** — separate from projects, linkable to missions
2. **Support advanced filtering** — county, campus, skill, date, mission, community
3. **Design explainable matching** — every suggestion traceable [OBE-M06]
4. **Integrate with Time OS** [TSOS-001] — availability and scheduling
5. **Support future AI recommendations** — advisory only
6. **Index needs and offers separately** — Community Needs Index as queryable structure

**[OEX-BG-a]** Suggested files:

- `src/lib/oex/publishCommunityNeed.ts`
- `src/lib/oex/queryCommunityNeedsIndex.ts`
- `src/lib/oex/matchNeedsToCapabilities.ts`
- `src/lib/oex/assembleOpportunityFeed.ts`
- `src/lib/oex/queryOpportunityMap.ts`
- `src/lib/oex/discoverOpportunities.ts`
- `src/components/ccc/widgets/OpportunityWidget.tsx`

---

## AC-045 — Acceptance Criteria

Step 4.12 is complete when:

- [x] **[AC-045a]** Opportunity Exchange philosophy documented. `[OEX-M01, OEX-M03]`
- [x] **[AC-045b]** Opportunity categories defined. `[OEX-M04, OEX-M05]`
- [x] **[AC-045c]** Matching and discovery principles established. `[OEX-M06, OEX-M09]`
- [x] **[AC-045d]** Community needs and success stories incorporated. `[OEX-M10, OEX-M11]`
- [x] **[AC-045e]** Community Needs Index architecture specified. `[OEX-M13]`
- [x] **[AC-045f]** Platform integrations documented. `[OEX-M14]`
- [x] **[AC-045g]** Burt has blueprint for statewide opportunity discovery. `[OEX-BG, opportunity-exchange.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Community publishes need → Needs Index matches capability → participant discovers → serves → success story → mutual aid network strengthens Arkansas*
