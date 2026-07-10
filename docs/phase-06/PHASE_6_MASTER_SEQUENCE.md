# Phase 6 Master Sequence — Growth Operating System

**Document ID:** PHASE-006  
**Status:** Canonical  
**Priority:** Critical

> **How does the platform grow itself?**

Not marketing. Not recruiting. **Growing communities organically.**

---

## Architectural Turning Point

Phases 1–5 built **infrastructure**. Phase 6 builds **growth**.

| Phase | Name | Question |
|-------|------|----------|
| **1** | Constitution | Why do we exist? |
| **2** | Digital Arkansas | What exists? |
| **3** | Human Operating System | Who participates? |
| **4** | Community Operating System | Where do people organize? |
| **5** | Action Operating System | How does work get done? |
| **6** | **Growth Operating System** | **How does the platform grow itself?** |

Until now we've been building infrastructure. Phase 6 is the engine that allows the platform to expand from **2 students → 20 → 200 → 2,000 → 20,000** without changing the architecture.

**Original vision fulfilled:** Every participant has a share link · QR code · personal network · every campus grows itself · every county grows itself · everything is relational [RGE-001, PRN-001, NET-001, NET-002].

---

## Growth Loop

```text
Relationships create communities
        ↓
Communities create action
        ↓
Action creates stories
        ↓
Stories attract new people
        ↓
New people create more relationships
        ↓
The platform grows naturally
```

This extends the [Civic Operating Loop](../phase-05/ACTION_CONSTITUTION.md) — growth is not a bolt-on; it is the **return path** from Legacy to New People.

---

## Guiding Principle

> **Communities grow one trusted relationship at a time.**

Phase 3 established this [RGE-M02]. Phase 6 operationalizes it at **platform scale**.

---

## Constitutional Principle — Invitation Impact Visibility

> **Every participant should be able to see the direct impact of the people they invited into the network.**

**Not as a competition. As a story.**

```text
You invited Alex.
Alex invited Jordan.
Jordan started a volunteer team.
That team organized a food drive.
The food drive became an annual campus tradition.
Three years later it has served 1,200 families.
```

**Because you invited one person, this happened.**

This principle [GCN-M12 · CP-016] reinforces relational organizing, celebrates long-term community impact, and shows that small actions ripple outward — without turning participation into a contest [CRA-001 appreciation not gamification].

**Live in:** [Personal Organizing Network PON-001 6.2](PERSONAL_ORGANIZING_NETWORK.md) · [Invitation & Connection System ICS-001 6.7](INVITATION_CONNECTION_SYSTEM.md) · [Community Knowledge Graph NISS-M17 6.13](NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) · [Growth Constitution GCN-M12](GROWTH_CONSTITUTION.md)

---

## Signature Architecture — Community Knowledge Graph [NISS-M17 · GOS-M16]

We've designed many specialized graphs. Phase 6.13 unifies them into one foundational model.

| Graph | Phase | Role |
|-------|-------|------|
| Relationship Graph | 2–3 | Who knows whom |
| Trust Graph | 3 | Depth of connection |
| Growth Graph | 3–6 | Personal and community development |
| Conversation Graph | 4 | Communication patterns |
| Capability Graph | 4 | What communities can share |
| Decision Graph | 5 | How choices became action |
| Improvement Graph | 5 | How lessons spread |
| Operational Graph | 5 | How operational events connect |
| Impact Chain | 5 | How actions led to change |
| Generational Graph | 6 | Mentorship lineages [LCN-M16] |
| Partnership Graph | 6 | Institutional connections [IPS-M13] |
| **Community Knowledge Graph** | **6** | **Unified model — the platform understands itself** |

The **Community Knowledge Graph (CKG)** implements the [Living Network Graph GOS-M16] vision. It is not a feature users interact with directly most of the time. It is the **underlying architecture** that powers the [Statewide Network Twin NISS-M16] and allows the platform to answer:

- Which counties could mentor neighboring counties?
- Which campuses consistently develop new leaders?
- Where are Welcome Week playbooks producing strongest long-term participation?
- Which initiatives create the most cross-campus collaboration?
- Which institutions still have no community launched?
- Where are communities requesting mentors?

**Orchestrator:** `getCommunityKnowledgeGraph(scope, filters?)` · alias `getLivingNetworkGraph()` · **Route:** `/network/graph` (admin/analyst) · **Network Twin:** `/network/twin`

---

## Step Sequence

| Step | Document | Requirement | Signature |
|------|----------|-------------|-----------|
| 6.1 | [Growth Constitution](GROWTH_CONSTITUTION.md) | GCN-001 | Belonging Index · CP-016 |
| 6.2 | [Personal Organizing Network](PERSONAL_ORGANIZING_NETWORK.md) | PON-001 | Impact Tree · invite link · QR |
| 6.3 | [Community Growth & Outreach System](COMMUNITY_GROWTH_OUTREACH_SYSTEM.md) | CGO-001 | Arkansas Coverage Map · Growth Dashboard · extends CGS-001 |
| 6.4 | [Community Leadership Development System](COMMUNITY_LEADERSHIP_DEVELOPMENT_SYSTEM.md) | CLD-001 | Leadership Constellation · extends PGL-001 |
| 6.5 | [Welcome & Belonging System](WELCOME_BELONGING_SYSTEM.md) | WBS-001 | First 30 Days Journey · extends JRN + PEL + OBE |
| 6.6 | [Community Growth Intelligence System](COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md) | CGIS-001 | Arkansas Growth Observatory · Deepen Before Expand |
| 6.7 | [Invitation & Connection System](INVITATION_CONNECTION_SYSTEM.md) | ICS-001 | Universal Invitation Builder · Dynamic QR · extends RGE-001 |
| 6.8 | [Community Culture & Recognition System](COMMUNITY_CULTURE_RECOGNITION_SYSTEM.md) | CCR-001 | Culture Garden · extends CRA-001 |
| 6.9 | [Community Expansion Framework](COMMUNITY_EXPANSION_FRAMEWORK.md) | CEF-001 | Community Foundry · Mutual Strengthening |
| 6.10 | [Institutional Partnership System](INSTITUTIONAL_PARTNERSHIP_SYSTEM.md) | IPS-001 | Arkansas Civic Ecosystem Map · Mutual Value |
| 6.11 | [Lifelong Community Network](LIFELONG_COMMUNITY_NETWORK.md) | LCN-001 | Generational Network · Open Door |
| 6.12 | [Public Community Network](PUBLIC_COMMUNITY_NETWORK.md) | PCN-001 | Arkansas Community Explorer · Community Personality |
| 6.13 | [Network Intelligence & Strategy System](NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) | NISS-001 | Statewide Network Twin · Community Knowledge Graph |
| 6.14 | [Growth OS Certification & Network Readiness](GROWTH_OPERATING_SYSTEM_CERTIFICATION_NETWORK_READINESS.md) | GOS-001 | Community Genome · Can the network grow itself? |

*Live master spec:* `data/growth/growth-operating-system.json`

---

## 6.1 — Growth Constitution

**Constitution of Growth** — governs every future expansion. Optimizes for **healthy growth**, not growth at any cost.

- **Guiding principle** — Healthy growth begins with meaningful relationships
- **Permanent choices** — Relationships over transactions · Belonging over engagement · Community over metrics · Leadership over followers
- **Eight growth principles** — Relationship First through Long-Term Thinking
- **Growth lifecycle** — Invitation → Registration → Welcome → Belonging → Participation → Contribution → Leadership → Mentorship → Legacy
- **Growth ethics** — No manipulation, spam, dark patterns — trust over rapid growth
- **Community readiness** — Strengthen communities, don't overwhelm them
- **Invitation Impact Visibility [CP-016 · GCN-M12]** — see the ripple of your invites as story
- **Belonging Index [GCN-M16]** — Are we building community people want to remain part of?

*Live spec:* `growth-constitution.json`

---

## 6.2 — Personal Organizing Network

**The feature that first inspired the platform** — not a referral program.

- **Personal invite identity** — link · code · QR · short URL · future NFC
- **Invitation journey** — Sent → Visited → Registered → Welcomed → First mission → Long-term participation
- **My Network** — people, relationships, missions, mentorship, stories — not statistics
- **Network Tree** — celebrates relationships, not competition
- **Welcome workflow** — invitations begin relationships
- **Impact Tree [PON-M16]** — ripple effects, not invite counts; implements CP-016

*Extends:* [PRN-001](../phase-03/PERSONAL_RELATIONSHIP_NETWORK.md) · [RGE-001](../phase-03/RELATIONSHIP_GROWTH_ENGINE.md)

*Live spec:* `personal-organizing-network.json`

---

## 6.3 — Community Growth & Outreach System

Every campus and county gets a **living growth strategy** — not just numbers, but a plan, a pipeline, and a picture of where the community is today and where it wants to go.

- **Community Growth Dashboard** — participants, volunteers, leadership pipeline, goals
- **Representation Map** — residence halls, departments, neighborhoods, underrepresented groups
- **Outreach Zones** — structured outreach without rigidity
- **Growth Goals & Campaigns** — locally determined; relationship-building emphasis
- **Community Readiness** — mentors, opportunities, welcome resources before growth
- **Growth Heat Map** — visibility into opportunity areas, not judgment
- **Arkansas Coverage Map [CGO-M16]** — statewide expansion map: counties, institutions, launch status, health, gaps

*Extends:* [Community Growth & Sustainability CGS-001](../phase-04/COMMUNITY_GROWTH_SUSTAINABILITY.md) into operational growth and outreach layer.

*Live spec:* `community-growth-outreach-system.json`

---

## 6.4 — Community Leadership Development System

The **leadership pipeline for the entire network** — not ambassadors as titles, but a continuous journey:

```text
Participant → Volunteer → Reliable Contributor → Team Organizer
→ Community Organizer → Mentor → Community Builder → Statewide Mentor
```

- **Leadership Profile** — stage, experience, mentorship, training, recognition
- **Leadership Opportunities** — accessible to everyone via Opportunity Exchange
- **Mentorship Network** — cross-campus, cross-county, normal community life
- **Leadership Succession** — emerging leaders, gaps, graduations, knowledge transfer
- **Leadership Constellation [CLD-M16]** — relationships not org charts

*Extends:* [Personal Growth & Leadership PGL-001](../phase-03/PERSONAL_GROWTH_LEADERSHIP.md) into network-wide leadership development.

*Live spec:* `community-leadership-development-system.json`

---

## 6.5 — Welcome & Belonging System

The **most important step in the Growth OS** — not HR onboarding, but belonging:

> People join because they are invited. They stay because they belong.

- **Welcome Journey** — invitation through leadership development
- **Welcome Guide** — person who invited, mentor, or welcome team
- **Belonging Checkpoints** — joined community? volunteered? met someone? returned?
- **First Mission Recommendation** — small experiences build confidence
- **First 30 Days Journey [WBS-M16]** — guided first month, not mandatory checklist

*Extends:* [Participant Journey JRN-001](../phase-03/PARTICIPANT_JOURNEY.md) · [PEL-001](../phase-03/PARTICIPANT_EXPERIENCE_LIFECYCLE.md) · [OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md)

*Live spec:* `welcome-belonging-system.json`

---

## 6.6 — Community Growth Intelligence System

The platform becomes **proactive instead of reactive** — visibility, not direction:

> Growth begins by understanding where people are—and where they are still missing.

- **Growth Awareness** — statewide participation, invitations, mentorship, relationships
- **Opportunity Detection** — campuses without organizers, mentor matches, communities ready to help
- **Representation + Trends + Outreach + Leadership Intelligence**
- **Deepen Before Expand [CGIS-M17]** — strengthen existing communities before launching new ones
- **Arkansas Growth Observatory [CGIS-M16]** — living executive view across five lenses

*Extends:* [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md)

*Live spec:* `community-growth-intelligence-system.json`

---

## 6.7 — Invitation & Connection System

The **platform front door** — not just links, but relationship-centered connection:

> Every invitation is an invitation into a community—not just a platform.

- **Invitation Types** — personal, community, event, mission, committee, organization (future)
- **Universal Invitation Builder [ICS-M15]** — who, what, how — generates landing page, QR, link, language
- **Dynamic QR Codes [ICS-M16]** — print once, update destination all year
- **Share Center** — text, email, social, flyers, badges · few seconds to share
- **Welcome Integration** — accept → Welcome Guide → First 30 Days → Impact Tree

*Extends:* [RGE-001](../phase-03/RELATIONSHIP_GROWTH_ENGINE.md) · [PON-001](PERSONAL_ORGANIZING_NETWORK.md) · [NET-002]

*Live spec:* `invitation-connection-system.json`

---

## 6.8 — Community Culture & Recognition System

**Culture, not competition** — what keeps communities healthy after launch excitement fades:

> Culture is built through the behaviors we celebrate.

- **Community Values** — respect, service, collaboration, hospitality + local identity
- **Recognition Categories** — welcoming, service, mentorship, collaboration, knowledge sharing, stewardship
- **Story-Based Recognition** — stories inspire more than titles
- **Traditions + Rituals + Appreciation**
- **Culture Garden [CCR-M14]** — visual metaphor for community culture, not leaderboards

*Extends:* [CRA-001](../phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md)

*Live spec:* `community-culture-recognition-system.json`

---

## 6.9 — Community Expansion Framework

The **most strategic expansion document** — how the platform grows beyond today's community types **without redesign**:

> The platform should be infinitely extensible while remaining recognizably the same.

- **Community Types** — configuration not code; high schools, alumni, states supported architecturally
- **Community Blueprint** — same foundation for every new community (CCC, Brain, Growth, Legacy…)
- **Launch Checklist + Expansion Readiness** — intentional launch; Deepen Before Expand
- **Community Foundry [CEF-M15]** — guided provisioning of entire community stack
- **Mutual Strengthening [CEF-M16]** — every new community strengthens network; network strengthens community

*Extends:* [COS-001](../phase-04/COMMUNITY_OPERATING_SYSTEM.md) · [CCN-001](../phase-04/COMMUNITY_CONSTITUTION.md)

*Live spec:* `community-expansion-framework.json`

---

## 6.10 — Institutional Partnership System

Bridge between community organizing and the **broader civic ecosystem**:

- Universities · community colleges · student organizations · nonprofits
- Libraries · museums · community organizations · public institutions
- Businesses supporting service (partnership not sponsorship) · professional associations
- **Arkansas Civic Ecosystem Map [IPS-M13]** — communities and institutions connected statewide
- **Mutual Value [IPS-M14]** — every partnership benefits both sides · extends [SCN-001]

*Live spec:* `institutional-partnership-system.json`

---

## 6.11 — Lifelong Community Network

Solve the student-org weakness: **graduation should not reset the organization**.

- Long-term journey — student through lifelong participant; relationship evolves, never ends
- Alumni communities · continuing participation · mentorship pipeline across generations
- Lifelong timeline · knowledge preservation · geographic continuity · easy reconnection
- **Generational Network [LCN-M16]** — communities as living generations, not just current members
- **Open Door [LCN-M17 · CP-020]** — always a meaningful path back · extends [CLS-001, JRN-001]

*Live spec:* `lifelong-community-network.json`

---

## 6.12 — Public Community Network

Not a passive public page — a **living window into community activity**:

- Public community, institution, and county profiles · activity feed · public calendar
- Opportunity Explorer · Story Showcase · join pathways · strict privacy boundaries
- **Arkansas Community Explorer [PCN-M16]** — interactive statewide discovery for first-time visitors
- **Community Personality [PCN-M17]** — shared architecture, local identity · extends [CST-001]

*Live spec:* `public-community-network.json`

---

## 6.13 — Network Intelligence & Strategy System

Where six phases **come together** — not analytics, **strategic self-awareness**:

- Strategic awareness · statewide coverage · unified community health
- Leadership · collaboration · opportunity · knowledge intelligence
- Explainability · privacy · advisory forecasting
- **Statewide Network Twin [NISS-M16]** — living ecosystem model, strategic queries
- **Community Knowledge Graph [NISS-M17]** — unified graph architecture implementing [GOS-M16]

*Live spec:* `network-intelligence-strategy-system.json`

---

## 6.14 — Growth Operating System Certification & Network Readiness

> **Can this network now grow itself?**

If yes — communities reproduce without founder-dependent management — **Phase 6 complete**.

- Twelve growth capability domains (6.1–6.13) · six readiness levels · growth readiness checklist
- **Community Genome [GOS-M10]** — common DNA instantiated by Community Foundry
- **Network Readiness Dashboard** · self-expanding ecosystem milestone (Level 6)
- **Six-phase architecture complete** · Volume 0 Master Architecture Bible complete [MAB-001]

*Live spec:* `growth-operating-system-certification-network-readiness.json`

---

## What Phase 6 Builds

When finished, **every participant** has:

- Their own invite network · QR code · relationship tree
- Their own recruiting dashboard · mentorship pathway
- **Invitation Impact Story** — see the ripple of their invites

**Every community** has:

- Growth goals · Growth dashboards · Ambassador network
- Community expansion tools

The platform itself begins **expanding organically** — without architectural redesign [AOS-M10d, COS-M10].

---

## Four Operating Systems

| Phase | System | Question |
|-------|--------|----------|
| 3 | Human Operating System | Who participates and how do they grow? |
| 4 | Community Operating System | Where do people organize? |
| 5 | Action Operating System | How does work get done? |
| 6 | **Growth Operating System** | **How does the platform grow itself?** |

---

## Evaluation Question [PEL-M13]

> Does this strengthen relationships, deepen belonging, and help people grow into community builders?

Growth that violates this question is **not growth** — it is extraction [RGE-M13].

---

*Prior phase complete:* [Phase 5 Action Operating System](../phase-05/PHASE_5_MASTER_SEQUENCE.md)  
*Next phase:* Phase 7 — Intelligence Layer
