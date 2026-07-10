# Experience & Event Operating System

**Document ID:** PHASE-005.5  
**Artifact:** `EXPERIENCE_EXPERIENCE_EVENT_OPERATING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** EEOS

> **People may attend for the event, but they return because of the experience.**

Most software builds an **event manager**. We are not organizing events — we are creating **experiences that build community**. An event is the container; the **experience** is what people remember.

**Requirement:** EEOS-001 · **Supersedes:** EVOS-001 (Event Operating System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Volunteer Development System VDS-001](VOLUNTEER_DEVELOPMENT_SYSTEM.md) · [Execution OS EOS-001](EXECUTION_OPERATING_SYSTEM.md) · [Time & Scheduling OS TSOS-001](../phase-04/TIME_SCHEDULING_OPERATING_SYSTEM.md) · [Community Legacy CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) · [Civic Journey Timeline CJT-001](../phase-03/CIVIC_JOURNEY_TIMELINE.md)

**Live spec:** `data/registry/experience-event-operating-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| EEOS-M01 | Purpose |
| EEOS-M02 | Guiding principle |
| EEOS-M03 | Experience philosophy |
| EEOS-M04 | Experience types |
| EEOS-M05 | Experience lifecycle |
| EEOS-M06 | Experience Headquarters |
| EEOS-M07 | Registration |
| EEOS-M08 | Check-in system |
| EEOS-M09 | Agenda builder |
| EEOS-M10 | Volunteer coordination |
| EEOS-M11 | Live operations |
| EEOS-M12 | Experience capture |
| EEOS-M13 | Follow-up |
| EEOS-M14 | Experience analytics |
| EEOS-M15 | Accessibility |
| EEOS-M16 | Future AI assistance |
| EEOS-M17 | Experience Playbook |
| EEOS-M18 | Mission Library relationship |
| EEOS-M19 | Platform integrations |
| EEOS-M20 | V1 scope |
| EEOS-BG | Burt implementation guidance |
| AC-052 | Step 5.5 acceptance criteria |

---

## EEOS-M01 — Purpose

**[EEOS-M01]** The **Experience & Event Operating System (EEOS)** provides the framework for **designing, coordinating, delivering, and preserving meaningful community experiences**.

**[EEOS-M01a]** Events are opportunities to **strengthen relationships, develop leaders, welcome new participants, and create lasting memories** [ACN-M16 celebration, PEL-M01 belonging].

**[EEOS-M01b]** Every experience should contribute to **both the immediate mission and the long-term growth of the community** [ACN-M04 Civic Operating Loop].

**[EEOS-M01c]** Experiences are **first-class entities** — not calendar entries attached to missions as an afterthought [EEOS-BG].

---

## EEOS-M02 — Guiding Principle

**[EEOS-M02]**

> **People may attend for the event, but they return because of the experience.**

**[EEOS-M02a]** The platform should help communities create experiences that **people want to be part of** [OBE-M01 belonging, CGS-M01 community growth].

**[EEOS-M02b]** Logistics serve experience — not the reverse [MDS-M02 clarity before action at gathering scale].

---

## EEOS-M03 — Experience Philosophy

**[EEOS-M03]** Every experience should answer:

| Question | EEOS component |
|----------|----------------|
| Why are we gathering? | Mission link [MDS-M05] · purpose on HQ [EEOS-M06] |
| Who should feel welcome? | Registration [EEOS-M07] · accessibility [EEOS-M15] |
| What relationships might begin here? | Check-in → timeline [EEOS-M08, CJT-001] |
| What memories do participants leave with? | Experience capture [EEOS-M12] |
| What will our community learn? | Follow-up · Playbook [EEOS-M13, EEOS-M17] |

**[EEOS-M03a]** **The experience matters as much as the logistics** [ACN-M07 people before paperwork — but never logistics without purpose].

---

## EEOS-M04 — Experience Types

**[EEOS-M04]** Configurable experience types — examples:

| Category | Examples |
|----------|----------|
| Service | Community service, volunteer days |
| Leadership | Leadership training, workshops |
| Welcome | Welcome events, orientations |
| Gathering | Campus meetings, county gatherings, town halls |
| Civic | Debate watch parties, study groups |
| Social | Social events, celebrations |
| Recognition | Recognition ceremonies |
| Statewide | Regional summits |

**[EEOS-M04a]** Future types remain **configurable per community** [MPS-M04 mission types parallel].

**[EEOS-M04b]** Experience type informs **Experience Playbook templates** [EEOS-M17] and Mission Library browse [MDS-M20].

---

## EEOS-M05 — Experience Lifecycle

**[EEOS-M05]** Every experience follows a lifecycle:

```text
Idea
        ↓
Mission Design
        ↓
Planning
        ↓
Promotion
        ↓
Registration
        ↓
Preparation
        ↓
Live Experience
        ↓
Follow-Up
        ↓
Reflection
        ↓
Legacy
```

**[EEOS-M05a]** **Mission Design** links to MDS-001 — experiences inherit mission canvas purpose [MDS-M04].

**[EEOS-M05b]** **Live Experience** uses Live Operations cockpit [EEOS-M11].

**[EEOS-M05c]** **Legacy** feeds Community Legacy [CLS-001], Experience Playbook [EEOS-M17], MOR [ACN-M26].

**[EEOS-M05d]** Every completed experience **contributes knowledge back** into the platform [CKLS-001, MDS-M20 Mission Library].

---

## EEOS-M06 — Experience Headquarters

**[EEOS-M06]** Every experience receives its own **workspace** — operational center before, during, and after the event.

**[EEOS-M06a]** Includes:

| Section | Purpose |
|---------|---------|
| Purpose | Why we gather [MDS-M05] |
| Mission | Parent mission link |
| Agenda | [EEOS-M09] |
| Timeline | TSOS-001 |
| Location / Map | Venue, directions |
| Participants | Registration roster [EEOS-M07] |
| Volunteer assignments | VDS-001 [EEOS-M10] |
| Capacity | CCS-001 |
| Communications | CCNET-001 |
| Files | Documents, handouts |
| Checklists | EOS-M07 work packages |
| Media | [EEOS-M12] |
| Recognition | CRA-001 |
| Lessons learned | LIS-001 |

**[EEOS-M06b]** Route: `/experience/[slug]` — parallel to Mission HQ [MPS-M06, EOS-M05].

**[EEOS-M06c]** Shell reuses Community Command Center patterns [CCC-001] — experience-scoped widgets.

---

## EEOS-M07 — Registration

**[EEOS-M07]** Registration should be **frictionless** [EOS-M12 simplicity, mobile-first EEOS-M20].

**[EEOS-M07a]** Participants may:

- Register
- Join waitlist
- Cancel
- Invite friends [RGE-001, NET-001]
- Share QR codes
- Add to personal calendar [TSOS-001]
- Receive reminders [CAM-001, CFS-001]

**[EEOS-M07b]** Registration data feeds check-in [EEOS-M08] and capacity planning [EEOS-M14].

**[EEOS-M07c]** Orchestrator: `registerForExperience(experienceId, participantId)` · `generateExperienceQrCode(experienceId, participantId)`.

---

## EEOS-M08 — Check-In System

**[EEOS-M08]** Multi-mode check-in support:

| Mode | Use case |
|------|----------|
| QR codes | Fast volunteer/participant check-in [VDS-M10] |
| Manual check-in | Organizer fallback |
| Walk-in registration | Same-day arrivals |
| Volunteer check-in | Role-specific |
| Speaker check-in | Agenda tracking |
| Organizer dashboard | Live attendance view |

**[EEOS-M08a]** Attendance automatically updates:

- Civic Passport [CJT-001]
- Volunteer Passport [VDS-M17]
- Community Timeline [CLS-001, CCC-001]
- Mission Operating Record [ACN-M26]

**[EEOS-M08b]** Orchestrator: `checkInExperienceParticipant(experienceId, participantId, method)` · `getLiveAttendance(experienceId)`.

**[EEOS-M08c]** Check-in takes **seconds** — mobile-first [VDS-M10, EOS-M14].

---

## EEOS-M09 — Agenda Builder

**[EEOS-M09]** Every experience may include structured agenda:

- Sessions
- Breaks
- Speakers
- Activities
- Volunteer assignments [EEOS-M10]
- Resource links
- Maps
- Documents

**[EEOS-M09a]** Agenda **mobile-friendly** and **easy to update** during live operations [EEOS-M11 schedule updates].

**[EEOS-M09b]** Published agenda syncs to participant calendars and Daily Operations Brief [EOS-M17] on event day.

---

## EEOS-M10 — Volunteer Coordination

**[EEOS-M10]** Integrates directly with [Volunteer Development System VDS-001](VOLUNTEER_DEVELOPMENT_SYSTEM.md).

**[EEOS-M10a]** Organizers manage experience roles:

Setup · Registration · Photography · Technology · Hospitality · Cleanup · Transportation · Safety

**[EEOS-M10b]** Volunteers see **only assignments relevant to them** [SEC-001 visibility, CAM-001 attention budget].

**[EEOS-M10c]** Links to EOS work packages [EOS-M07] — Communications Package for promotion, Logistics Package for setup.

---

## EEOS-M11 — Live Operations

**[EEOS-M11]** During the experience, organizers access **live operational cockpit**:

| Capability | Purpose |
|------------|---------|
| Attendance | Real-time headcount [EEOS-M08] |
| Volunteer status | Who's checked in, gaps [VDS-001] |
| Announcements | Push to registered participants [CAM-001] |
| Schedule updates | Agenda changes [EEOS-M09] |
| Issue reporting | Blockers, resource needs |
| Capacity requests | CCS-001 |
| Emergency contacts | Where appropriate [VDS-M15] |

**[EEOS-M11a]** Mobile-optimized for **organizers in the field** [EEOS-BG, EOS-M14].

**[EEOS-M11b]** Live Operations surface on Experience HQ [EEOS-M06] — toggles automatically when experience enters Live stage [EEOS-M05].

---

## EEOS-M12 — Experience Capture

**[EEOS-M12]** Communities preserve:

- Photos
- Videos
- Speaker slides
- Handouts
- Stories
- Quotes
- Reflections

**[EEOS-M12a]** Media becomes part of **Community Legacy System** [CLS-001] and Experience Playbook [EEOS-M17].

**[EEOS-M12b]** Participants may upload from mobile during or after event [EOS-M14, CST-001].

**[EEOS-M12c]** Orchestrator: `captureExperienceMedia(experienceId, mediaPayload)`.

---

## EEOS-M13 — Follow-Up

**[EEOS-M13]** Every experience **automatically generates follow-up actions** — experience continues after participants go home.

**[EEOS-M13a]** Examples:

- Thank-you messages [CRA-001]
- Volunteer appreciation [VDS-M12]
- Photo sharing
- Survey (optional — never required)
- Lessons learned [LIS-001]
- Mission reflections
- Opportunity recommendations [OBE-001]

**[EEOS-M13b]** Follow-up tasks may spawn in EOS [EOS-M08] — linked to experience, not orphan tasks.

**[EEOS-M13c]** Orchestrator: `generateExperienceFollowUp(experienceId)` — advisory checklist, community chooses what to send.

---

## EEOS-M14 — Experience Analytics

**[EEOS-M14]** Measure **community impact** — not attendance alone [ACN-M06, CIS-M03 intelligence not vanity metrics].

**[EEOS-M14a]** Metrics:

- Attendance
- Volunteer participation
- New relationships [NET-001 edges formed]
- Communities represented
- Projects launched from experience
- Participant feedback
- Stories collected
- Leadership opportunities created [VDS-M13]

**[EEOS-M14b]** Feeds Community Intelligence [CIS-001] — explainable, non-ranking [COS-M09 Network Health parallel].

---

## EEOS-M15 — Accessibility

**[EEOS-M15]** Every experience should encourage **inclusion** — remove unnecessary barriers.

**[EEOS-M15a]** Examples:

- Accessibility information on registration page
- Transportation guidance
- Virtual participation (future)
- Language support (future)
- Dietary information (where applicable)

**[EEOS-M15b]** Displayed before registration commitment [EEOS-M07 informed choice].

---

## EEOS-M16 — Future AI Assistance

**[EEOS-M16]** Future AI may:

- Suggest agendas [EEOS-M09]
- Recommend volunteers [VDS-001]
- Predict attendance
- Identify missing capacity [CCS-001]
- Summarize feedback
- Generate learning reflections [LIS-001]
- Recommend improvements for Playbook [EEOS-M17]

**[EEOS-M16a]** AI **assists organizers while preserving human leadership** [OPIS-001 advisory, ACN-M19].

---

## EEOS-M17 — Experience Playbook

**[EEOS-M17]** **Experience Playbook** — signature architectural concept of EEOS.

**[EEOS-M17a]** Every successful experience **automatically creates** an Experience Playbook — proven template refined through real-world use.

**[EEOS-M17b]** Playbook includes:

| Section | Source |
|---------|--------|
| Original Mission Canvas | MDS-001 |
| Planning timeline | TSOS-001 |
| Agenda | EEOS-M09 |
| Volunteer assignments | VDS-001 |
| Checklists | EOS-M07 |
| Communications used | CCNET-001 |
| Attendance summary | EEOS-M08 |
| Photos and media | EEOS-M12 |
| Community reflections | EEOS-M13 |
| Lessons learned | LIS-001 |
| Budget notes | Optional — community choice |
| Suggested improvements | Community + later adapters |
| Reusable templates | Fork for next experience |

**[EEOS-M17c]** Example: A new organizer at University of Arkansas hosts a leadership retreat — browses Experience Playbooks from Philander Smith, UCA, or a county community, **adapts to local needs**, immediately benefits from accumulated wisdom.

**[EEOS-M17d]** Every event leaves behind **more than memories — wisdom that strengthens every future organizer** [MDS-M20 Mission Library parallel for experiences].

**[EEOS-M17e]** Orchestrators: `generateExperiencePlaybook(experienceId)` · `searchExperiencePlaybooks(filters)` · `forkExperienceFromPlaybook(playbookId, communityId)`.

**[EEOS-M17f]** Database: `DB-EXPERIENCE-PLAYBOOK` · table: `experience_playbooks`

**[EEOS-M17g]** Integrates Community Brain [CKLS-001] — Playbook is experience-facing discovery; Brain is knowledge layer.

---

## EEOS-M18 — Mission Library Relationship

**[EEOS-M18]** Experience Playbooks complement [Mission Library MDS-M20]:

| Library | Scope |
|---------|-------|
| Mission Library | Full mission design — canvas, outcomes, multi-event campaigns |
| Experience Playbook | Single gathering — agenda, check-in, volunteer roles, day-of ops |

**[EEOS-M18a]** Mission may spawn multiple experiences; each experience generates its own Playbook; mission completion may publish to Mission Library [MDS-M20].

---

## EEOS-M19 — Platform Integrations

**[EEOS-M19]** EEOS integrates:

| System | Integration |
|--------|-------------|
| MDS-001 | Mission design before experience planning |
| EOS-001 | Work packages, follow-up tasks, DOB on event day |
| VDS-001 | Volunteer roles, QR check-in, passport |
| TSOS-001 | Timeline, calendar, reminders |
| CLS-001 | Legacy, community timeline |
| CJT-001 | Civic Passport attendance |
| CRA-001 | Recognition, thank-yous |
| LIS-001 | Reflection, lessons learned |
| ACN-M26 MOR | Experience section in operating record |
| CKLS-001 | Playbooks, knowledge |
| SCN-001 | Cross-campus experience sharing |

---

## EEOS-M20 — V1 Scope

**[EEOS-M20]** Step 5.5 deliverables:

| Capability | V1 |
|------------|-----|
| Experience-first philosophy | ✅ Documented |
| Experience lifecycle | ✅ Spec |
| Experience HQ architecture | ✅ Spec |
| Registration, check-in, live ops, follow-up | ✅ Spec |
| Experience Playbook architecture | ✅ Spec |
| Volunteer and mission integration | ✅ Spec |
| Experience HQ UI | Stub |
| QR check-in flow | v1.1 |
| Livestream | Future |

---

## EEOS-BG — Burt Implementation Guidance

**[EEOS-BG]** Implementation should:

1. **Treat experiences as first-class entities** — not calendar events only [EEOS-M01]
2. **Integrate Missions, Volunteers, Time OS, Community Legacy** [EEOS-M19]
3. **Support QR-based participation** [EEOS-M08, VDS-M10]
4. **Preserve historical experience records** — append-only [CLS-001, MOR]
5. **Enable reusable Experience Playbook templates** [EEOS-M17]
6. **Optimize mobile for organizers in the field** [EEOS-M11, EOS-M14]
7. **Auto-generate follow-up checklist** — community chooses actions [EEOS-M13]
8. **Link every experience to parent mission** — no orphan gatherings [ACN-M19]

**[EEOS-BG-a]** Recommended structure:

```
src/lib/experiences/createExperience.ts
src/lib/experiences/registerForExperience.ts
src/lib/experiences/checkInExperienceParticipant.ts
src/lib/experiences/generateExperiencePlaybook.ts
src/lib/experiences/searchExperiencePlaybooks.ts
src/lib/experiences/forkExperienceFromPlaybook.ts
src/lib/experiences/generateExperienceFollowUp.ts
src/components/experience/ExperienceHeadquarters.tsx
src/components/experience/LiveOperationsCockpit.tsx
src/components/experience/AgendaBuilder.tsx
src/components/experience/ExperiencePlaybookBrowser.tsx
data/registry/experience-event-operating-system.json
```

---

## AC-052 — Acceptance Criteria

Step 5.5 is complete when:

- [x] **[AC-052a]** Experience-first philosophy documented. `[EEOS-M01, EEOS-M02, EEOS-M03]`
- [x] **[AC-052b]** Experience lifecycle established. `[EEOS-M05]`
- [x] **[AC-052c]** Registration, check-in, live operations, and follow-up defined. `[EEOS-M07–EEOS-M08, EEOS-M11, EEOS-M13]`
- [x] **[AC-052d]** Volunteer and mission integration incorporated. `[EEOS-M10, MDS-001, VDS-001]`
- [x] **[AC-052e]** Experience Playbook architecture specified. `[EEOS-M17]`
- [x] **[AC-052f]** Burt has blueprint for community experiences as heart of engagement. `[EEOS-BG, experience-event-operating-system.json]`

---

**Next Step:** 5.6 — Initiative Operating System

*Trace: Designed mission → planned experience → welcomed participants → live community moment → captured memories → follow-up gratitude → playbook published → next campus starts with proven wisdom*
