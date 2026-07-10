# Opportunity & Belonging Engine

**Document ID:** PHASE-003.13  
**Artifact:** `OPPORTUNITY_BELONGING_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Every participant should feel that there is always a meaningful next step waiting for them.**

This is where the platform begins acting like a **good community organizer** — not by telling people what to do, but by helping them discover where they **naturally belong**. We optimize for **belonging**, not engagement metrics.

**Builds On:** [Personal Digital Twin](PERSONAL_DIGITAL_TWIN.md) · [Participant Journey Framework](PARTICIPANT_JOURNEY.md) · [Statewide Outreach Intelligence](../phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md) · [Communication & Attention Management](COMMUNICATION_ATTENTION_MANAGEMENT.md) · [Project Constitution](../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md)

**Live spec:** `data/registry/opportunity-belonging-engine.json`

**Distinction:** [OIS-001] identifies **community-level opportunities** (Phase 2). [OBE-001] personalizes **participant-level belonging** (Phase 3) — consumes [PDT-001] Participant Context Engine.

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| OBE-M01 | Purpose |
| OBE-M02 | Guiding principle |
| OBE-M03 | Philosophy |
| OBE-M04 | Opportunity categories |
| OBE-M05 | Personalization philosophy |
| OBE-M06 | Explainability |
| OBE-M07 | Discovery |
| OBE-M08 | Opportunity Feed |
| OBE-M09 | Community benefit |
| OBE-M10 | Ethical recommendations |
| OBE-M11 | Future AI assistance |
| OBE-M12 | Community Marketplace architecture |
| OBE-M13 | PDT and OIS integration |
| OBE-M14 | Mission Board integration |
| OBE-M15 | V1 scope |
| OBE-BG | Burt implementation guidance |
| AC-032 | Step 3.13 acceptance criteria |

---

## OBE-M01 — Purpose

**[OBE-M01]** The Opportunity & Belonging Engine continuously helps participants discover **meaningful ways to connect, contribute, learn, and grow**.

**[OBE-M01a]** Rather than maximizing engagement metrics, the engine seeks to **strengthen relationships, build communities, and support participant development** [OM-L1, PEP-001].

**[OBE-M01b]** Recommendations should **always serve the participant** — not the platform [CAM-M02, TPS-M02].

**[OBE-M01c]** Terminology: **Opportunity & Belonging Engine** (not "Recommendation Engine" or "engagement optimizer").

**[OBE-M01d]** Constitutional alignment:

> **Participants choose their own path.** The platform helps discover possibilities — never narrows choices to algorithm predictions alone [OBE-M12].

---

## OBE-M02 — Guiding Principle

**[OBE-M02]**

> **Every participant should feel that there is always a meaningful next step waiting for them.**

**[OBE-M02a]** The platform exists to **reduce uncertainty** and make participation easier [JRN-M08, OIS-M15].

**[OBE-M02b]** Complementary to journey orchestrator [JRN-M10]: the engine **surfaces** next steps; the participant **chooses**.

**[OBE-M02c]** No journey dead-ends — even new members receive welcome opportunities [PEP-M12, ADT-M10].

---

## OBE-M03 — Philosophy

**[OBE-M03]** The engine should answer:

| Question | Category |
|----------|----------|
| **Where do I belong?** | Communities |
| **Who should I meet?** | People |
| **How can I help?** | Service |
| **What can I learn?** | Learning |
| **Where can I grow?** | Growth · Leadership |

**[OBE-M03a]** The platform should **never manipulate attention** [CAM-M10] — it should **create opportunities** [OIS-M11].

**[OBE-M03b]** Optimize for **belonging** — not clicks, time-on-site, or notification opens [OIS-M14, CRA-M03].

**[OBE-M03c]** Assistance — not prediction. Suggestions invite; participants decide [PDT-M09].

---

## OBE-M04 — Opportunity Categories

**[OBE-M04]** Recommendations fall into six categories:

### People

Meet a mentor · Welcome a new participant · Reconnect with someone · Collaborate with another organizer · Meet people with similar interests · Future alumni introductions

*Source: NET-001, PRN-M16, PGL mentorship [PGL-M09]*

### Communities

Join your campus community · Explore a nearby county · Join a committee · Support a neighboring campus · Participate in a regional initiative

*Source: CID-001, REG-001/002, OIS-M06/07*

### Service

Volunteer opportunities · Community projects · Campus activities · County initiatives · Special events · Future emergency response

*Source: VOL-001, OIS-M09*

### Learning

Leadership lessons · Organizing resources · Workshops · Training · Community stories · Future Civic Academy courses

*Source: PGL-M08, CRA-M09 stories*

### Leadership

Start a committee · Organize an event · Mentor someone · Lead a project · Help launch a community

*Leadership recommendations **match experience** [JRN-M06, PGL-M04] — never premature*

### Growth

Complete profile · Invite a friend · Attend first event · Develop a new skill · Celebrate milestone · Build relationships

*Steady progress — not gamified streaks [CRA-M03, OIS-M14]*

**[OBE-M04a]** Each opportunity has: `category`, `reason`, `actionLabel`, `priority`, `expiresAt?` [OIS-M16 card structure].

---

## OBE-M05 — Personalization Philosophy

**[OBE-M05]** Recommendations consider [via PDT-001 Participant Context]:

| Signal | Use |
|--------|-----|
| **Interests** | Learning, service, people matching |
| **Skills** | Leadership readiness, committee fit |
| **Journey stage** | Growth vs. leadership opportunities [JRN-M06] |
| **Communities** | Campus, county, committee context |
| **Relationships** | Mentorship, welcome, reconnect |
| **Volunteer history** | Similar service suggestions |
| **Leadership development** | PGL domains, experience level |
| **Current opportunities** | OIS community needs + Marketplace browse |

**[OBE-M05a]** Recommendations remain **relevant and understandable** — max 3–5 primary suggestions per surface [JRN-M08b, CAM-M13 budget].

**[OBE-M05b]** Orchestrator: `generateOpportunities(participantId, context: ParticipantContext)` — **never** queries tables directly [PDT-M12].

---

## OBE-M06 — Explainability

**[OBE-M06]** Every recommendation **must explain itself** [PDT-M09, TPS-M12b]:

| Example reason |
|----------------|
| "You expressed interest in environmental projects." |
| "Your county is organizing a volunteer event this weekend." |
| "Several classmates recently joined this committee." |
| "You've been mentoring new participants—here's a leadership workshop." |

**[OBE-M06a]** Participants always understand **why** something was recommended — `reason` field required on every opportunity card [OIS-M16a].

**[OBE-M06b]** Dismissed recommendations inform future ranking — **never** penalize the participant [PDT-M09c].

**[OBE-M06c]** Morning Brief includes opportunities with reasons — not mystery links [CAM-M14, PCC-M17].

---

## OBE-M07 — Discovery

**[OBE-M07]** The engine encourages **exploration** — expanding relationships, not filter bubbles:

| Discovery type | Example |
|----------------|---------|
| Nearby campuses | Cross-institution collaboration |
| Neighboring counties | Regional organizing |
| Community projects | Open Marketplace browse |
| Volunteer opportunities | County + campus feeds |
| Cross-campus collaboration | Shared interests + geography |

**[OBE-M07a]** Discovery complements personalization — Marketplace always **browseable** [OBE-M12].

**[OBE-M07b]** Objective: **expanding relationships** [PRN-M02] — not maximizing session length.

---

## OBE-M08 — Opportunity Feed

**[OBE-M08]** Participants should always have an **Opportunity Feed** — alive, hopeful, actionable [OIS-M11]:

| Feed section | Content |
|--------------|---------|
| **Today's opportunities** | Time-sensitive volunteer, events |
| **This week's events** | Calendar-aligned |
| **Communities needing help** | OIS underserved signals |
| **People to welcome** | New network members, campus joins |
| **Volunteer projects** | Service category |
| **Learning resources** | PGL pathways |

**[OBE-M08a]** Feed surfaces in **Command Center** [PCC-M07 Mission Board widget] and **HQ Opportunities section** [PHQ-M11].

**[OBE-M08b]** Feed respects **Attention Budget** — digest-eligible items consolidate [CAM-M13]; urgent community needs may elevate.

**[OBE-M08c]** Feed feels **alive** — refreshes on meaningful events, not artificial polling.

---

## OBE-M09 — Community Benefit

**[OBE-M09]** Recommendations benefit **communities as well as individuals** [OIS-M02, OM-L1]:

| Community signal | Individual match |
|------------------|------------------|
| County lacking organizers | Local participant with leadership interest |
| Committee needs volunteers | Participant with relevant skills/history |
| Campus launching first event | Connectors who can invite |
| Mentorship opportunities | Growth-stage participants |
| Future statewide initiatives | Regional collaborators |

**[OBE-M09a]** Platform **balances participant interests with community needs** — transparent, not manipulative [OBE-M10].

**[OBE-M09b]** Community need never overrides **participant autonomy** — suggest, don't assign.

**[OBE-M09c]** OIS underserved queries [OIS-M09] feed community-side of matching — PDT provides participant-side.

---

## OBE-M10 — Ethical Recommendations

**[OBE-M10]** The engine **must avoid**:

| Anti-pattern | Why |
|--------------|-----|
| Manipulative engagement | Dark patterns destroy trust [CAM-M10] |
| Artificial urgency | Fake countdowns, pressure tactics |
| Political persuasion | Platform is civic organizing — not partisan engine |
| Popularity bias | No "trending" people ranking [OIS-M14, CRA-M03] |
| Commercial influence | No sponsored opportunities |

**[OBE-M10a]** Recommendations remain **transparent and participant-centered** [SEC-001, TPS-M02].

**[OBE-M10b]** Unified anti-gamification stance with [CRA-M12b], [RGE-M13], [PGL-M03b], [OIS-M14].

**[OBE-M10c]** No A/B tests that optimize engagement at expense of belonging — metrics reviewed against OM-L1.

---

## OBE-M11 — Future AI Assistance

**[OBE-M11]** Future AI may assist by:

- Summarizing opportunities · Finding relevant projects · Introducing mentors
- Suggesting volunteer work · Explaining recommendations

**[OBE-M11a]** AI remains **advisory** — participants make final decisions [TPS-M15].

**[OBE-M11b]** AI reads via Participant Context Engine [PDT-M12] — explainable output only [PDT-M11].

**[OBE-M11c]** AI suggestions subject to **Attention Budget** and opt-in [CAM-M15].

---

## OBE-M12 — Community Marketplace Architecture

**[OBE-M12]** **Signature experience:** **Community Marketplace** — not commercial; a **marketplace of opportunities**.

**[OBE-M12a]** Participants browse and discover freely:

| Marketplace section |
|---------------------|
| Volunteer opportunities |
| Committees looking for members |
| Campus projects |
| County initiatives |
| Mentors offering guidance |
| Participants looking for collaborators |
| Leadership opportunities |
| Training opportunities |
| Community needs |

**[OBE-M12b]** Architecture:

```
Community Marketplace (open, searchable, browse)
        ↑ populated by communities, organizers, OIS signals
        ↑
Opportunity & Belonging Engine (personalized suggestions)
        ↑ consumes ParticipantContext [PDT-001]
        ↑
Mission Board + Opportunity Feed (curated top suggestions)
```

**[OBE-M12c]** Engine powers **personalized suggestions**; Marketplace remains **open and searchable** — guidance + freedom [OBE-M01d].

**[OBE-M12d]** Route future: `/opportunities` or `/marketplace` [PAGE-OPP] — V1 stub linked from PCC.

**[OBE-M12e]** Marketplace listings have **community attribution** — who posted, why it matters, how to join.

---

## OBE-M13 — PDT and OIS Integration

**[OBE-M13]** Integration layers:

| Layer | Role in OBE |
|-------|-------------|
| **PDT-001** | `buildParticipantContext()` — interests, stage, relationships, gaps |
| **JRN-M10** | Orchestrator output — derived stage, suggested next steps |
| **OIS-001** | Community-level underserved signals, Mission Board card templates [OIS-M16] |
| **OIS-M11** | Hopeful opportunity language patterns |
| **CAM-001** | Delivery channel + Attention Budget for opportunity notifications |

**[OBE-M13a]** Flow:

```
buildParticipantContext(participantId)
    + queryOISOpportunities(county, campus, status)
    + journeyOrchestrator.suggestedNextSteps(participantId)
    → generateOpportunities()
    → rank by belonging fit (not engagement score)
    → attach reason to each
    → applyAttentionBudget() before notify
```

**[OBE-M13b]** No duplicate opportunity logic in PCC, HQ, or Morning Brief — all consume `generateOpportunities()`.

---

## OBE-M14 — Mission Board Integration

**[OBE-M14]** Mission Board [OIS-M16, PCC-M07] is the **primary presentation surface**:

| Card field | OBE source |
|------------|------------|
| `title` | Opportunity headline |
| `reason` | OBE-M06 explanation |
| `actionLabel` | Join · Welcome · Volunteer · Learn · Invite |
| `category` | OBE-M04 key |
| `priority` | Belonging fit + community need balance |
| `href` | Deep link to opportunity or Marketplace listing |

**[OBE-M14a]** V1: 2–4 static/rule-based cards from registration context + county status [OIS-M16c].

**[OBE-M14b]** V1.1+: full engine with PDT context + Marketplace backend.

**[OBE-M14c]** HQ Opportunities section [PHQ-M11] mirrors Mission Board — same engine, condensed view.

---

## OBE-M15 — V1 Scope

**[OBE-M15]** Design complete in Step 3.13; implementation post-V1 core:

| Deliverable | V1 |
|-------------|-----|
| Philosophy + Marketplace spec | ✅ this document |
| Category taxonomy + ethics | ✅ JSON |
| Rule-based Mission Board cards | 2–4 cards post-registration |
| Full PDT-powered engine | v1.1 |
| Marketplace browse UI | v1.1 |
| AI opportunity assistant | v1.2+ |

**[OBE-M15a]** Jul 12/14: **meaningful next step always visible** — invite friend, explore county, complete mission [JRN-M08].

**[OBE-M15b]** ANL-001 (Phase 6 analytics) measures **community health** — OBE-001 does not optimize for analytics metrics.

---

## OBE-BG — Burt Implementation Guidance

**[OBE-BG]** Implementation should:

1. **Separate recommendation logic from presentation** — `generateOpportunities()` vs Mission Board UI [OBE-M14]
2. **Use explainable rules** — every card has `reason` [OBE-M06]
3. **Support future AI enhancements** — AI plugs into same orchestrator [OBE-M11]
4. **Respect privacy settings** — visibility on people/community suggestions [SEC-001]
5. **Optimize for belonging** — ranking function favors fit + community need, not engagement [OBE-M03b]

**[OBE-BG-a]** Recommended file structure:

```
src/lib/opportunities/generateOpportunities.ts
src/lib/opportunities/rankByBelongingFit.ts
src/lib/opportunities/explainOpportunity.ts
src/lib/marketplace/listMarketplaceOpportunities.ts
```

**[OBE-BG-b]** Production gate: no opportunity surface ships without `reason` field and PDT context consumption [PDT-M15b].

**[OBE-BG-c]** `Opportunity` type — shared contract for PCC, HQ, Morning Brief, Marketplace.

---

## AC-032 — Acceptance Criteria

Step 3.13 is complete when:

- [x] **[AC-032a]** Opportunity philosophy documented. `[OBE-M01, OBE-M03]`
- [x] **[AC-032b]** Recommendation categories established. `[OBE-M04]`
- [x] **[AC-032c]** Explainability required. `[OBE-M06]`
- [x] **[AC-032d]** Ethical recommendation principles defined. `[OBE-M10]`
- [x] **[AC-032e]** Community Marketplace architecture specified. `[OBE-M12]`
- [x] **[AC-032f]** PDT and Mission Board integration documented. `[OBE-M13, OBE-M14]`
- [x] **[AC-032g]** Burt has blueprint for participant-centered opportunity discovery. `[OBE-BG, opportunity-belonging-engine.json]`

---

**Next Step:** 3.15 — Phase 3 Build Bible

*Trace: Context assembled → belonging-ranked opportunity → explained suggestion → participant chooses → community strengthened*
