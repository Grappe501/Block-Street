# Personal Growth & Leadership Development System

**Document ID:** PHASE-003.8  
**Artifact:** `PERSONAL_GROWTH_LEADERSHIP.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **This platform shouldn't just organize people. It should develop them.**

Most organizing platforms stop at contact management. We're building something closer to a **leadership operating system**. Skills are one part of growth — **leadership is much bigger**.

**Builds On:** [Participant Journey](PARTICIPANT_JOURNEY.md) · [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Personal Command Center](PERSONAL_COMMAND_CENTER.md) · [Civic Passport](PARTICIPANT_IDENTITY_DOCTRINE.md#pep-m20--civic-passport-architecture)

**Live spec:** `data/registry/personal-growth-leadership.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PGL-M01 | Purpose |
| PGL-M02 | Guiding principle |
| PGL-M03 | Growth philosophy |
| PGL-M04 | Growth domains |
| PGL-M05 | Skills framework |
| PGL-M06 | Interests |
| PGL-M07 | Learning pathways |
| PGL-M08 | Mentorship |
| PGL-M09 | Reflection |
| PGL-M10 | Growth timeline |
| PGL-M11 | Recognition |
| PGL-M12 | Future growth engine |
| PGL-M13 | Growth Graph architecture |
| PGL-M14 | Command Center integration |
| PGL-M15 | Journey integration |
| PGL-M16 | V1 scope |
| PGL-BG | Burt implementation guidance |
| AC-027 | Step 3.8 acceptance criteria |

---

## PGL-M01 — Purpose

**[PGL-M01]** This document defines how the platform **helps participants grow over time**.

**[PGL-M01a]** The objective is not simply to record participation — it is to **intentionally develop**:

- Leaders · Organizers · Volunteers · Mentors · Community builders

**[PGL-M01b]** Every participant should become **more capable** than when they first joined [JRN-M02].

**[PGL-M01c]** Terminology: **Personal Growth & Leadership Development System** (not "Skills list" alone).

---

## PGL-M02 — Guiding Principle

**[PGL-M02]**

> **People are the platform's greatest investment.**

**[PGL-M02a]** Communities become stronger when **people grow**.

**[PGL-M02b]** Leadership development should be a **core function** — not an optional feature bolted on after launch [OM-L1].

**[PGL-M02c]** Complementary principle from journey framework:

> **The platform exists to help people grow** [JRN-M02] — this step defines **how**.

---

## PGL-M03 — Growth Philosophy

**[PGL-M03]** Growth occurs through:

| Channel | Platform role |
|---------|---------------|
| **Experience** | Record + connect in Growth Graph [PGL-M13] |
| **Reflection** | Journals, summaries [PGL-M09] |
| **Service** | Volunteer, projects [VOL-001 future] |
| **Relationships** | PRN, mentorship [PGL-M08] |
| **Learning** | Pathways, Civic Academy [PGL-M07] |
| **Mentorship** | Accelerates all channels [PGL-M08] |
| **Leadership** | Journey stages [JRN-M05] |

**[PGL-M03a]** The software **supports — not replaces** — these experiences [PEP-M13].

**[PGL-M03b]** Growth is **never a competitive scoring system** — narrative over rank [CPP-001, OIS-M14].

---

## PGL-M04 — Growth Domains

**[PGL-M04]** The platform recognizes **five dimensions** of growth:

### Civic Knowledge

Understanding local government · Community issues · Volunteer opportunities · Civic participation · Public service · Future **Arkansas Civic Academy**

### Organizing Skills

Recruitment · Relationship building · Communication · Event planning · Committee facilitation · Volunteer coordination · Conflict resolution

### Leadership Skills

Listening · Decision making · Delegation · Mentorship · Strategic thinking · Problem solving · Team building

### Personal Development

Confidence · Public speaking · Time management · Goal setting · Reflection · Professional growth · Networking

### Community Impact

Volunteer service · Projects completed · Communities strengthened · People mentored · Teams developed · Relationships built — **emphasis on service** [PHQ-M12]

**[PGL-M04a]** Domains are **configurable** in registry — extensible without schema break [PGL-BG].

---

## PGL-M05 — Skills Framework

**[PGL-M05]** Participants may **record or develop** skills — separate from achievements [PGL-BG].

| Category | Example skills |
|----------|----------------|
| Communication | Public Speaking, Writing, Teaching |
| Creative | Graphic Design, Photography |
| Organizing | Event Planning, Community Outreach, Fundraising |
| Technical | Technology, Data, Research |
| Other | Languages |

**[PGL-M05a]** Future skills added via `personal-growth-leadership.json` registry — no redesign.

**[PGL-M05b]** Skills have **proficiency** (learning → practicing → teaching) — not points or levels for competition.

**[PGL-M05c]** V1: optional interest/skill tags on profile — no proficiency tracking.

---

## PGL-M06 — Interests

**[PGL-M06]** Participants identify **interests** to discover communities and projects:

Education · Environment · Healthcare · Economic Development · Arts · Agriculture · Technology · Community Service · Youth Leadership

**[PGL-M06a]** Interests power **discovery** [Step 3.13] and **Mission Board** alignment [PCC-M07].

**[PGL-M06b]** V1: optional multi-select on registration or profile — honor-system.

---

## PGL-M07 — Learning Pathways

**[PGL-M07]** Future structured learning:

| Pathway | Integration |
|---------|-------------|
| Leadership tracks | Journey stages [JRN-M05] |
| Volunteer training | VOL-001 Phase 5 |
| Organizing curriculum | Phase 5–6 |
| Community projects | Phase 4 |
| Skill certifications | future |
| **Arkansas Civic Academy** | signature future program |

**[PGL-M07a]** Platform supports **lifelong learning** — alumni stage included [JRN-M05j].

**[PGL-M07b]** Command Center **Learning widget** [PCC-M11] surfaces available pathways.

**[PGL-M07c]** V1: Learning widget placeholder + link to growth philosophy.

---

## PGL-M08 — Mentorship

**[PGL-M08]** Growth is **accelerated through relationships** [PRN-M16, RGE-M02].

| Capability | Status |
|------------|--------|
| Find mentor | Step 3.13 recommendations |
| Become mentor | Journey mentor stage [JRN-M05g] |
| Mentorship history | Trust Graph + Growth Graph edges |
| Learning goals | future |
| Shared milestones | Civic Passport [CPP-001] |

**[PGL-M08a]** Mentorship should become part of **organizing culture** — not HR program.

**[PGL-M08b]** Edge type: `mentors` [REL-M10, PRN-M06] — directional, consent-based.

---

## PGL-M09 — Reflection

**[PGL-M09]** Participants reflect to transform experience into learning:

| Format | Purpose |
|--------|---------|
| Lessons learned | Post-event, post-project |
| Volunteer experiences | Service narrative |
| Leadership journals | Private by default [SEC-001] |
| Project summaries | Team + personal |
| Future portfolio | Career + civic export |

**[PGL-M09a]** Reflection entries append to **Civic Passport** and **Growth Graph** [PGL-M13].

**[PGL-M09b]** V1: optional mission refinement prompt — full journals post-launch.

---

## PGL-M10 — Growth Timeline

**[PGL-M10]** Every significant experience contributes to growth — append-only [KDG-M07]:

| Milestone | Journey cross-ref |
|-----------|-------------------|
| First event | JRN-M07 |
| First volunteer activity | JRN-M07 |
| First committee | JRN-M07 |
| First organizer role | JRN-M05e |
| First mentorship | JRN-M07 |
| Leadership milestones | [CRA-001] |

**[PGL-M10a]** **Civic Passport becomes a narrative of growth** [CPP-001] — not a scorecard.

**[PGL-M10b]** Growth timeline is a **view** over Growth Graph nodes — not duplicate storage.

---

## PGL-M11 — Recognition

**[PGL-M11]** Recognition celebrates **development** — not competition [CRA-001, OIS-M14]:

- Learned a new skill · Mentored someone · Completed leadership training
- Served the community · Built a successful project

**[PGL-M11a]** Recognition **reinforces learning** — visible in Command Center Recognition widget [PCC-M13] [CRA-001].

**[PGL-M11b]** Never popularity-based badges or leaderboards [PEP-M13, PRN-M13b].

---

## PGL-M12 — Future Growth Engine

**[PGL-M12]** Future AI/recommendations may suggest [Step 3.13]:

Learning resources · Leadership opportunities · Mentors · Projects · Committees · Volunteer opportunities

**[PGL-M12a]** Recommendations support **participant goals** (mission + interests) — not platform engagement metrics.

**[PGL-M12b]** Requires Growth Graph traversal [PGL-M13] + Trust Graph [PRN-M16] + privacy [SEC-001].

---

## PGL-M13 — Growth Graph Architecture

**[PGL-M13]** Introduce the **Growth Graph** — a defining innovation connecting experiences over time.

> Instead of asking *"What has this participant done?"* the platform answers *"How has this participant grown?"*

**[PGL-M13a]** Example growth chain:

```text
Attended Event
        ↓
Met Organizer
        ↓
Joined Committee
        ↓
Volunteered
        ↓
Organized Event
        ↓
Mentored New Participant
        ↓
Launched New Campus Group
```

**[PGL-M13b]** Growth Graph structure:

```
GrowthGraph
├── nodes: GrowthExperience[]     # typed events
├── edges: led_to[]               # causal / sequential links
├── domains: GrowthDomain[]       # PGL-M04 tagging
└── orchestrator: buildGrowthNarrative(participantId) → GrowthStory
```

**[PGL-M13c]** Experience node types:

| Type | Source |
|------|--------|
| `event_attended` | Phase 5 events |
| `relationship_formed` | PRN edges |
| `committee_joined` | Phase 4 |
| `volunteer_service` | VOL-001 |
| `event_organized` | Phase 5 |
| `mentorship` | `mentors` edge |
| `skill_developed` | PGL-M05 |
| `reflection` | PGL-M09 |
| `milestone` | JRN-M07 |

**[PGL-M13d]** `led_to` edges capture **how one experience led to the next** — optional participant confirmation, system-inferred where clear.

**[PGL-M13e]** Growth Graph powers:

| Use | Step |
|-----|------|
| Personalized recommendations | 3.13 |
| Leadership development paths | 3.14 |
| Mentorship matching | 3.13 |
| Storytelling / Civic Passport | CPP-001 |
| Impact reporting | Phase 6 |
| Future AI coaching | Phase 6 |

**[PGL-M13f]** V1: schema spec + registration/join as first nodes; full graph population post-events/committees.

**[PGL-M13g]** Distinct from Trust Graph [PRN-M16]: Trust Graph = **relationship depth**; Growth Graph = **development narrative**.

---

## PGL-M14 — Command Center Integration

**[PGL-M14]** Growth surfaces in Personal Command Center [PCC-001]:

| Widget | Growth content |
|--------|----------------|
| **Learning** [PCC-M11] | Pathways, Civic Academy future |
| **Growth** [PCC-M15] | Journey progress, next milestones |
| **Impact** [PCC-M12] | Community impact domain |
| **Recognition** [PCC-M13] | Development celebrations |
| **Morning Brief** [PCC-M17] | "One milestone from Mentor" |

**[PGL-M14a]** Aggregator: `assembleGrowthSection(participantId)` — extends `assembleCommandCenter()` [PCC-BG].

---

## PGL-M15 — Journey Integration

**[PGL-M15]** Growth Graph feeds **journey orchestrator** [JRN-M10]:

| Journey stage | Growth signals |
|---------------|----------------|
| Connector | First invites, events |
| Contributor | Volunteer, projects |
| Organizer | Events organized, committees |
| Leader / Mentor | Mentorship edges, teams |
| Community Builder | New communities launched |

**[PGL-M15a]** Journey stage is **derived from Growth Graph** — consistent with orchestration layer architecture [JRN-M10].

---

## PGL-M16 — V1 Scope

**[PGL-M16]** Design complete in Step 3.8; implementation largely post-V1 launch:

| Deliverable | V1 |
|-------------|-----|
| Growth philosophy + domains | ✅ this document |
| Growth Graph schema | ✅ spec |
| Skills + interests registry | ✅ JSON catalog |
| Profile interest tags | optional on signup |
| Learning widget placeholder | ✅ in PCC |
| Reflection | mission prompt only |
| Full pathways / mentorship UI | v1.1+ |

**[PGL-M16a]** Jul 12/14: growth **philosophy embedded** in copy and journey — not full Growth Graph UI.

---

## PGL-BG — Burt Implementation Guidance

**[PGL-BG]** Implementation should:

1. **Separate skills from achievements** — skills = capability; achievements = events/milestones
2. **Support configurable growth domains** — registry-driven [PGL-M04]
3. **Allow future learning systems** — Civic Academy plugin architecture [PGL-M07]
4. **Preserve participant history** — append-only growth nodes [PGL-M10]
5. **Avoid competitive scoring** — no growth points, no leaderboards [PGL-M03b]
6. **Design for lifelong participation** — alumni growth continues [JRN-M05j]

**[PGL-BG-a]** Recommended file structure:

```
src/lib/growth/buildGrowthNarrative.ts
src/lib/growth/growthGraph.ts
src/lib/growth/assembleGrowthSection.ts
data/registry/personal-growth-leadership.json
data/registry/growth-experience-types.json
```

**[PGL-BG-b]** Database: `growth_experiences` + `growth_edges` — or extend `relationship_events` pattern with growth type enum.

---

## AC-027 — Acceptance Criteria

Step 3.8 is complete when:

- [x] **[AC-027a]** Personal growth philosophy documented. `[PGL-M01, PGL-M03]`
- [x] **[AC-027b]** Five growth domains established. `[PGL-M04]`
- [x] **[AC-027c]** Skills, interests, and learning pathways defined. `[PGL-M05, PGL-M06, PGL-M07]`
- [x] **[AC-027d]** Mentorship and reflection incorporated. `[PGL-M08, PGL-M09]`
- [x] **[AC-027e]** Growth Graph architecture specified. `[PGL-M13]`
- [x] **[AC-027f]** Command Center and journey integration documented. `[PGL-M14, PGL-M15]`
- [x] **[AC-027g]** Burt has blueprint for leadership development throughout platform. `[PGL-BG, personal-growth-leadership.json]`

---

**Next Step:** 3.12 — Participant Knowledge Graph

*Trace: Experience → Growth Graph → Civic Passport narrative → Journey stage → Command Center Growth widget*
