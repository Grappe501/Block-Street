# Community Operating System Certification

**Document ID:** PHASE-004.14  
**Artifact:** `COMMUNITY_OPERATING_SYSTEM_CERTIFICATION.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Requirement:** COS-001 *(certification standard + Phase 4 closeout)*

> **Every community deserves the same high-quality organizing infrastructure.**

This is not simply a closeout. This document defines what a **complete community** looks like — the **finish line for every community** on the platform.

Burt can look at a campus, county, committee, or project and ask:

> **"Is this community fully built?"**

**Build Bible:** [PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md)  
**Live spec:** `data/registry/community-operating-system-certification.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| COS-M01 | Purpose |
| COS-M02 | Guiding principle |
| COS-M03 | Philosophy |
| COS-M04 | Required community components |
| COS-M05 | Certification levels |
| COS-M06 | Community readiness checklist |
| COS-M07 | Continuous improvement |
| COS-M08 | Platform responsibilities |
| COS-M09 | Arkansas Network Health Dashboard architecture |
| COS-M10 | Phase 4 complete — dual operating systems |
| COS-M11 | V1 scope |
| COS-BG | Burt implementation guidance |
| AC-047 | Step 4.14 acceptance criteria |

---

## COS-M01 — Purpose

**[COS-M01]** Defines the **minimum capabilities every community must possess** to function as a complete Community Operating System.

**[COS-M01a]** Applies uniformly to:

- Universities · counties · committees · projects
- Future high schools · alumni networks · community organizations

**[COS-M01b]** Communities may differ in **size and activity**, but share the **same operational framework** [CCN-M04 equal standing].

**[COS-M01c]** This is the **certification standard** — not a one-time badge, but a living measure of community completeness [COS-M07].

---

## COS-M02 — Guiding Principle

**[COS-M02]**

> **Every community deserves the same high-quality organizing infrastructure.**

**[COS-M02a]** **No community is too small to be well organized** — certification encourages capability, not size.

---

## COS-M03 — Philosophy

**[COS-M03]** A community is **not complete because it has members**.

**[COS-M03a]** A community is complete when it has systems to:

- Welcome people · coordinate work · preserve knowledge · develop future leaders

**[COS-M03b]** The platform provides those systems **consistently** — people create the culture [CCN-M02, CGS-M03].

**[COS-M03c]** Certification answers: **Is this community fully built?** — not **Is this community winning?**

---

## COS-M04 — Required Community Components

**[COS-M04]** Ten capability domains — every certified community includes:

### Identity [COS-M04a] — CCN-001 · CID-001 · CLS-001

Community name · mission · charter · type · location · history · traditions · community story

### People [COS-M04b] — TWG-001 · PGL-001 · REL-001

Participants · teams · mentors · leadership · alumni · relationships · volunteer roles

### Organizing [COS-M04c] — TWG-001 · MPS-001 · OEX-001

Teams · working groups · committees · projects · missions · volunteer opportunities · action plans

### Time [COS-M04d] — TSOS-001

Community calendar · meetings · events · volunteer shifts · milestones · recurring activities · timeline

### Communication [COS-M04e] — CCNET-001 · CCC-001

Announcements · discussions · Community Pulse · messages · knowledge sharing · search · moderation

### Knowledge [COS-M04f] — CKLS-001

Community Brain · playbooks · wiki · meeting notes · decision history · training · lessons learned

### Capabilities [COS-M04g] — CCE-001

Shared resources · templates · equipment · skills · services · meeting spaces · Capability Exchange participation

### Intelligence [COS-M04h] — CIS-001 · CGS-001

Community Health · Community Coach · opportunity recommendations · trend analysis · leadership development · growth insights · explainable recommendations

### Collaboration [COS-M04i] — SCN-001

Regional partnerships · campus partnerships · county partnerships · mentorship · volunteer exchanges · knowledge exchange · shared initiatives

### Legacy [COS-M04j] — CLS-001

Community Timeline · Community Story · leadership history · traditions · annual reports · scrapbook · alumni · institutional memory

**[COS-M04k]** Orchestrator: `assessCommunityCompleteness(communityId)` — returns component status per domain.

---

## COS-M05 — Certification Levels

**[COS-M05]** Six progressive levels — **recognition of growth, not superiority**:

| Level | Name | Criteria |
|-------|------|----------|
| 1 | **Registered** | Community exists · basic info complete · visible on Arkansas map · accepting participants |
| 2 | **Organized** | Mission established · participants active · calendar functioning · basic communication |
| 3 | **Operational** | Teams active · projects underway · volunteer coordination · knowledge captured · Community Pulse active |
| 4 | **Collaborative** | Cross-community partnerships · knowledge exchange · mentorship · regional participation · shared missions |
| 5 | **Sustainable** | Leadership succession documented · Community Brain mature · legacy preserved · healthy volunteer pipeline · institutional memory |
| 6 | **Model Community** | Develops other communities · shares playbooks · mentors organizers · creates reusable capabilities · strengthens statewide ecosystem — **service recognition, not superiority** |

**[COS-M05a]** Level 6 celebrates **contribution to the movement** [CRA-001] — never ranks communities against each other [CIS-M03d].

**[COS-M05b]** Orchestrator: `getCommunityCertificationLevel(communityId)`.

---

## COS-M06 — Community Readiness Checklist

**[COS-M06]** Every community should **periodically review**:

- ✓ Mission is current
- ✓ Calendar active
- ✓ Teams functioning
- ✓ Projects progressing
- ✓ Volunteers welcomed
- ✓ Knowledge documented
- ✓ Leadership developing
- ✓ Legacy preserved
- ✓ Community needs published [OEX-001]
- ✓ Collaboration opportunities explored [SCN-001]
- ✓ New participants have a clear path to contribute [OBE-001, CCC-M08]

**[COS-M06a]** Integrates [Community Health Check CGS-M05] — reflection tool, not audit.

**[COS-M06b]** Community Coach may surface checklist gaps [CIS-M14] — suggests, never judges.

---

## COS-M07 — Continuous Improvement

**[COS-M07]** Certification is **not permanent** — communities evolve.

**[COS-M07a]** Platform encourages **reflection and continual improvement** — not one-time achievement [CGS-M renewal philosophy].

**[COS-M07b]** Level may increase or **prompt renewal reflection** when capabilities lapse — guides support, never shame [CGS-M08a].

---

## COS-M08 — Platform Responsibilities

**[COS-M08]** The platform commits to providing every community:

- Reliable infrastructure · training resources · organizing tools
- Knowledge preservation · search · security · scalable architecture

**[COS-M08a]** **Intelligence, not vanity analytics** [CIS-001] — platform serves the community, does not extract from it [CCN-M14].

**[COS-M08b]** Equal infrastructure for every community type [COS-M02] — specialization allowed, core model unchanged [COS-BG].

---

## COS-M09 — Arkansas Network Health Dashboard Architecture

**[COS-M09]** **Arkansas Network Health Dashboard** — signature statewide experience tying Phase 4 together.

**[COS-M09a]** Does **not rank communities** — answers executive movement questions:

- Which campuses still need organizers?
- Which counties have no active projects?
- Where are leadership transitions approaching?
- Which communities are thriving and willing to mentor others?
- Where are volunteer requests going unanswered?
- Which playbooks are reused most often?
- What statewide missions connect the most communities?
- Which regions could benefit from additional support?

**[COS-M09b]** Living network visualization — **not red/yellow/green scores**:

```text
Arkansas Map
        │
        ├── Communities growing
        ├── Relationships expanding
        ├── New missions launching
        ├── Knowledge spreading
        ├── Partnerships forming
        └── Leaders emerging
```

**[COS-M09c]** **Executive view of the entire movement** — complements [Outreach Intelligence OIS-001] opportunity gaps and [Arkansas Collaboration Map SCN-M14] and [Arkansas Living History CLS-M10].

**[COS-M09d]** Draws from CIS, OEX, SCN, CLS, CCE, CKLS — unified statewide health narrative.

**[COS-M09e]** Orchestrator: `queryArkansasNetworkHealth(filters)`.

**[COS-M09f]** V1: spec + dashboard schema stub — full interactive dashboard future [PAGE-ADMIN, PAGE-MAP].

---

## COS-M10 — Phase 4 Complete — Dual Operating Systems

**[COS-M10]** With Phase 4 complete, the platform has **two foundational operating systems**:

### Phase 3 — Human Operating System

Personal Headquarters · Civic Passport · Relationship Network · Digital Twin · Growth System · Timeline · Opportunity Engine [OBE-001]

### Phase 4 — Community Operating System

| Step | Module |
|------|--------|
| 4.1 | Community Constitution [CCN-001] |
| 4.2 | Growth & Sustainability [CGS-001] |
| 4.3 | Command Center [CCC-001] |
| 4.4 | Teams [TWG-001] |
| 4.5 | Missions [MPS-001] |
| 4.6 | Time OS [TSOS-001] |
| 4.7 | Communication Network [CCNET-001] |
| 4.8 | Knowledge & Learning [CKLS-001] |
| 4.9 | Capability Exchange [CCE-001] |
| 4.10 | Intelligence [CIS-001] |
| 4.11 | Collaboration Network [SCN-001] |
| 4.12 | Opportunity Exchange [OEX-001] |
| 4.13 | Legacy [CLS-001] |
| 4.14 | Certification [COS-M01–M09] |

**[COS-M10a]** We no longer have the design for a **website**. We have the design for a **statewide civic operating system** — launch with colleges and counties, expand to trade schools, high schools, alumni networks, and beyond Arkansas **without changing core architecture** [CCN-M01, ADT-001].

**[COS-M10b]** Evaluation question for all future phases [PEL-M13]:

> Does this strengthen relationships, deepen belonging, and help people grow into community builders?

---

## COS-M11 — V1 Scope

**[COS-M11]** V1 deliverables:

| Capability | V1 |
|------------|-----|
| Certification framework documented | ✅ |
| Ten required component domains | ✅ |
| Six certification levels | ✅ |
| Readiness checklist | ✅ |
| Network Health Dashboard spec | ✅ |
| Phase 4 Build Bible | ✅ |
| Automated certification scoring | Future |
| Full dashboard UI | Future |

---

## COS-BG — Burt Implementation Guidance

**[COS-BG]** Implementation should:

1. **Treat certification as reusable framework** — same foundation for every community type
2. **Build every community type from same architectural foundation** — allow specialization without changing core [CCN-M17 Charters]
3. **Support future certification metrics** — level computation from component assessment
4. **Maintain flexibility for future community types** — high school, alumni, partner org
5. **Separate certification from vanity ranking** — health dashboard guides support [COS-M09a]

**[COS-BG-a]** Suggested files:

- `src/lib/cos/assessCommunityCompleteness.ts`
- `src/lib/cos/getCommunityCertificationLevel.ts`
- `src/lib/cos/queryArkansasNetworkHealth.ts`
- `src/components/admin/ArkansasNetworkHealthDashboard.tsx`

---

## AC-047 — Acceptance Criteria

Step 4.14 is complete when:

- [x] **[AC-047a]** Community Operating System certification framework documented. `[COS-M01, COS-M03]`
- [x] **[AC-047b]** Required community capabilities defined. `[COS-M04]`
- [x] **[AC-047c]** Certification levels established. `[COS-M05]`
- [x] **[AC-047d]** Continuous improvement principles incorporated. `[COS-M07]`
- [x] **[AC-047e]** Arkansas Network Health Dashboard architecture specified. `[COS-M09]`
- [x] **[AC-047f]** Phase 4 dual-OS summary complete. `[COS-M10]`
- [x] **[AC-047g]** Burt has complete blueprint for fully functional organizing environments. `[COS-BG, community-operating-system-certification.json, PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md]`

---

**Phase 4 Status:** Complete  
**Next Phase:** Phase 5 — Action Operating System

*Trace: Every community receives equal infrastructure → certification measures completeness → Network Health Dashboard guides statewide support → civic OS ready to launch*
