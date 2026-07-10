# Volunteer Development System

**Document ID:** PHASE-005.4  
**Artifact:** `VOLUNTEER_DEVELOPMENT_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** VDS

> **Service develops leaders.**

Most platforms treat volunteers like a **scheduling problem**. That is backwards. Volunteers are the **lifeblood** of the platform — we develop people through service, not manage labor.

**Requirement:** VDS-001 · **Supersedes:** VOL-001 (Volunteer Management System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Opportunity & Belonging Engine OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · [Time & Scheduling OS TSOS-001](../phase-04/TIME_SCHEDULING_OPERATING_SYSTEM.md) · [Civic Journey Timeline CJT-001](../phase-03/CIVIC_JOURNEY_TIMELINE.md) · [Community Recognition CRA-001](../phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md) · [Personal Growth & Leadership PGL-001](../phase-03/PERSONAL_GROWTH_LEADERSHIP.md) · [Execution OS EOS-001](EXECUTION_OPERATING_SYSTEM.md)

**Live spec:** `data/registry/volunteer-development-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| VDS-M01 | Purpose |
| VDS-M02 | Guiding principle |
| VDS-M03 | Philosophy |
| VDS-M04 | Volunteer journey |
| VDS-M05 | Volunteer profile |
| VDS-M06 | Volunteer availability |
| VDS-M07 | Skills matching |
| VDS-M08 | Volunteer roles |
| VDS-M09 | Volunteer scheduling |
| VDS-M10 | QR check-in |
| VDS-M11 | Volunteer experience |
| VDS-M12 | Volunteer recognition |
| VDS-M13 | Volunteer development pathways |
| VDS-M14 | Volunteer history |
| VDS-M15 | Volunteer safety |
| VDS-M16 | Future AI assistance |
| VDS-M17 | Volunteer Passport |
| VDS-M18 | Civic Passport integration |
| VDS-M19 | Platform integrations |
| VDS-M20 | V1 scope |
| VDS-BG | Burt implementation guidance |
| AC-051 | Step 5.4 acceptance criteria |

---

## VDS-M01 — Purpose

**[VDS-M01]** The **Volunteer Development System** connects participants with **meaningful opportunities to serve** while supporting their long-term growth as organizers, leaders, mentors, and community builders.

**[VDS-M01a]** Volunteering is a **pathway for personal development and stronger communities** — not simply a source of labor [PEL-M01 people not users].

**[VDS-M01b]** The objective is **not filling shifts** — it is helping people discover meaningful ways to contribute, grow, and eventually lead [VDS-M02].

**[VDS-M01c]** Integrates with Opportunity Exchange [OEX-001] for discovery and Execution OS [EOS-001] for mission-level volunteer needs.

---

## VDS-M02 — Guiding Principle

**[VDS-M02]**

> **Service develops leaders.**

**[VDS-M02a]** Every volunteer experience should leave **both the community and the participant stronger** than before [ACN-M06, CRA-001].

**[VDS-M02b]** Complementary to growth domains [PGL-M01 Service] — VDS is the **operational layer** for service development.

---

## VDS-M03 — Philosophy

**[VDS-M03]** Volunteers are **not assigned work** — they are **invited into missions that matter** [MPS-M01, OBE-M01 belonging].

**[VDS-M03a]** The system should continually answer:

| Question | VDS component |
|----------|---------------|
| Where can I help? | OEX-001 · Opportunity surfacing [OBE-001] |
| What am I good at? | Skills matching [VDS-M07] · CCE-001 |
| What would I like to learn? | Development pathways [VDS-M13] · PGL-001 |
| Who can I serve alongside? | Teams [TWG-001] · relationships [NET-001] |
| How can I grow through this experience? | Volunteer Passport [VDS-M17] · reflection [VDS-M11] |

**[VDS-M03b]** Invitation over assignment — participants **choose** meaningful missions [SEC-001 consent, OBE-M explainable opportunities].

---

## VDS-M04 — Volunteer Journey

**[VDS-M04]** Every volunteer follows a **development pathway** — emphasis on **growth rather than status** [JRN-M01 journey parallel].

```text
Interested
        ↓
First Volunteer Experience
        ↓
Returning Volunteer
        ↓
Reliable Contributor
        ↓
Volunteer Leader
        ↓
Mentor
        ↓
Community Builder
```

**[VDS-M04a]** Journey stages are **descriptive, not gamified** — no points, no ranks [CRA-M01 appreciation not gamification].

**[VDS-M04b]** Stage derived from volunteer history [VDS-M14] — orchestrator: `deriveVolunteerJourneyStage(participantId)`.

**[VDS-M04c]** Each stage opens **development recommendations** [VDS-M13] — every experience opens another door.

---

## VDS-M05 — Volunteer Profile

**[VDS-M05]** Every participant has a **volunteer profile** — connects people with opportunities that fit them.

**[VDS-M05a]** Includes:

| Field | Purpose |
|-------|---------|
| Interests | Cause alignment |
| Skills | Matching [VDS-M07] |
| Availability | Scheduling [VDS-M06] |
| Preferred causes | Mission fit [MDS-M06] |
| Experience | Journey context [VDS-M04] |
| Certifications | Future — safety [VDS-M15] |
| Volunteer history | [VDS-M14] — participant-owned |
| Physical limitations | Optional — inclusive matching |
| Communication preferences | CAM-001 |
| Transportation availability | Optional — logistics [EOS-M07] |
| Language preferences | Future — translation roles |

**[VDS-M05b]** Extends Personal Headquarters [PHQ-001] — volunteer section, not separate account.

**[VDS-M05c]** Participant controls visibility [SEC-001] — profile data minimization.

---

## VDS-M06 — Volunteer Availability

**[VDS-M06]** Participants indicate when they can serve — **easy to update** [EOS-M14 mobile-first].

**[VDS-M06a]** Availability types:

- Days available
- Times available
- One-time availability
- Recurring availability
- Virtual participation
- Travel willingness
- Seasonal availability

**[VDS-M06b]** Integrates [TSOS-001] — availability feeds scheduling without treating people as calendar blocks [VDS-M03 invitation philosophy].

**[VDS-M06c]** Orchestrator: `updateVolunteerAvailability(participantId, availabilityPayload)`.

---

## VDS-M07 — Skills Matching

**[VDS-M07]** Platform matches opportunities with participant **strengths and growth interests** [CCE-001 Capability Graph].

**[VDS-M07a]** Skill examples:

Photography · Writing · Graphic design · Technology · Public speaking · Research · Teaching · Transportation · Event setup · Childcare (where appropriate) · Translation · Medical training (future)

**[VDS-M07b]** Skills **evolve over time** — practiced skills update from volunteer experiences [VDS-M11, PGL-M Growth Graph].

**[VDS-M07c]** Mission Canvas Section 6 [MDS-M10] defines needed skills; VDS matches participants **explainably** [OBE-M].

**[VDS-M07d]** Orchestrator: `matchVolunteersToMission(missionId)` · `matchMissionsToParticipant(participantId)`.

---

## VDS-M08 — Volunteer Roles

**[VDS-M08]** Roles help participants understand **expectations** — not hierarchy [TWG-M shared leadership].

**[VDS-M08a]** Examples:

| Role | Scope |
|------|-------|
| Event Volunteer | General support |
| Registration Team | Check-in [VDS-M10] |
| Welcome Team | First impressions |
| Technology Support | AV, systems |
| Communications | Messaging, social |
| Photographer | Documentation [CST-001] |
| Trainer | Onboarding others |
| Mentor | Development [PGL-001] |
| Project Coordinator | Mission leadership |
| Volunteer Coordinator | Recruitment support |

**[VDS-M08b]** Roles link to work packages [EOS-M07] — clear connection between role and mission purpose.

---

## VDS-M09 — Volunteer Scheduling

**[VDS-M09]** [Time & Scheduling OS TSOS-001](../phase-04/TIME_SCHEDULING_OPERATING_SYSTEM.md) integrates directly — **participant-friendly**, not admin-centric.

**[VDS-M09a]** Volunteers can:

- Accept opportunities
- Decline opportunities (no penalty — invitation model [VDS-M03])
- Request changes
- Trade shifts (future)
- Receive reminders [CFS-001, CAM-001]
- Check in [VDS-M10]
- Record completion

**[VDS-M09b]** Surfaces on Daily Operations Brief [EOS-M17] and Morning Brief [PCC-001].

**[VDS-M09c]** Scheduling serves **development and mission success** — not shift-filling metrics [VDS-M02].

---

## VDS-M10 — QR Check-In

**[VDS-M10]** Every volunteer opportunity supports **optional QR-based check-in** — seconds, not forms [EEOS-001 event layer].

**[VDS-M10a]** Benefits:

| Output | Destination |
|--------|-------------|
| Attendance | Volunteer history [VDS-M14] |
| Volunteer history | Volunteer Passport [VDS-M17] |
| Mission record | MOR [ACN-M26] |
| Community statistics | CIS-001 (non-ranking) |
| Recognition | CRA-001 |
| Volunteer hours | Optional — community choice [VDS-M14] |

**[VDS-M10b]** Orchestrator: `checkInVolunteer(participantId, opportunityId, qrToken)`.

**[VDS-M10c]** Mobile-first — scan from phone [EOS-M14].

---

## VDS-M11 — Volunteer Experience

**[VDS-M11]** After each volunteer experience, participants may record:

- Reflection
- Lessons learned
- Photos [CST-001]
- Stories
- Suggestions
- Skills developed [PGL-001]

**[VDS-M11a]** Experiences become part of **Civic Passport** via Volunteer Passport section [VDS-M17, VDS-M18].

**[VDS-M11b]** Append-only — participant owns narrative [CJT-M11 historical integrity].

**[VDS-M11c]** Feeds Learning & Improvement [LIS-001] and Community Legacy [CLS-001] when shared.

---

## VDS-M12 — Volunteer Recognition

**[VDS-M12]** Recognition focuses on **service** — reinforces community culture [CRA-001, ACN-M16 celebration].

**[VDS-M12a]** Examples:

- First volunteer day
- Community appreciation
- Service milestones
- Mentorship recognition
- Project contributions
- Volunteer anniversaries

**[VDS-M12b]** **Not gamification** — gratitude and story, not points [CRA-M01].

**[VDS-M12c]** Recognition events append to Civic Journey Timeline [CJT-M14].

---

## VDS-M13 — Volunteer Development Pathways

**[VDS-M13]** Future recommendations may include:

- Leadership opportunities
- Training [CKLS-001]
- Mentorship [PGL-001]
- Committee participation [TWG-001]
- Project leadership [EOS-M11]
- Community partnerships [SCN-001]

**[VDS-M13a]** **Every experience opens another door** — journey stage [VDS-M04] triggers explainable suggestions [OBE-001, OPIS-001 advisory].

**[VDS-M13b]** Development is **participant-paced** — no pressure [VDS-M16 AI supports, doesn't pressure].

---

## VDS-M14 — Volunteer History

**[VDS-M14]** Platform preserves:

- Events served
- Projects supported
- Hours (if communities choose to track — **optional, never required**)
- Skills demonstrated
- Communities served
- Impact stories

**[VDS-M14a]** **Volunteer history belongs to the participant** [SEC-001, PHQ-001 participant-owned data].

**[VDS-M14b]** Feeds Volunteer Passport [VDS-M17], MOR [ACN-M26], and Growth Graph [PGL-001].

**[VDS-M14c]** Exportable for portfolios [CJT-M15 future] — participant controls sharing.

---

## VDS-M15 — Volunteer Safety

**[VDS-M15]** Communities may define requirements for certain opportunities — **transparent expectations**.

**[VDS-M15a]** Examples:

- Training completed
- Age requirements
- Background checks (if ever applicable — community policy, not platform default)
- Safety briefings
- Emergency contacts (where appropriate)

**[VDS-M15b]** Requirements visible **before** acceptance [VDS-M03 informed invitation].

**[VDS-M15c]** Future certifications tracked on volunteer profile [VDS-M05].

---

## VDS-M16 — Future AI Assistance

**[VDS-M16]** Future AI may:

- Recommend volunteer opportunities [OBE-001]
- Suggest skill development [PGL-001]
- Identify potential mentors [PGL-001]
- Predict volunteer shortages (community-internal, not pressure)
- Recommend balanced workloads
- Help prevent volunteer burnout [CAM-001 attention budget]

**[VDS-M16a]** AI **supports volunteers — not pressures them** [OPIS-001 advisory, ACN-M19].

**[VDS-M16b]** Burnout prevention: never surface opportunities when attention budget exceeded [CAM-M].

---

## VDS-M17 — Volunteer Passport

**[VDS-M17]** **Volunteer Passport** — signature feature of the Volunteer Development System.

**[VDS-M17a]** Dedicated section within **Civic Passport** [CJT-M13] — rich record of service that **doesn't simply count hours**.

**[VDS-M17b]** Captures **experiences**, not transactions:

| Record type | Example |
|-------------|---------|
| Communities served | Three campuses, two counties |
| Missions completed | Welcome weeks, food drives |
| Skills practiced | Event planning, photography |
| New skills learned | Public speaking, logistics |
| People mentored | Eight new volunteers |
| Teams worked with | Cross-campus collaborations |
| Leadership roles accepted | Volunteer coordinator, project lead |
| Community appreciation received | Recognition events [CRA-001] |
| Reflections written | Post-experience notes [VDS-M11] |
| Stories shared | Legacy contributions [CLS-001] |

**[VDS-M17c]** Example — after four years, a participant sees:

> Organized three campus welcome weeks. Helped launch two county service initiatives. Mentored eight new volunteers. Learned event planning and public speaking. Worked with participants from nine Arkansas campuses. Helped create two statewide playbooks.

**Not:** *Volunteer Hours: 146*

**[VDS-M17d]** **Stories inspire continued service** long after graduation [ACN-M04 Civic Operating Loop → new people].

**[VDS-M17e]** Orchestrator: `appendVolunteerPassportEntry(participantId, experiencePayload)` · `getVolunteerPassport(participantId)`.

**[VDS-M17f]** Database: `DB-VOLUNTEER-PASSPORT` · table: `volunteer_passport_entries`

---

## VDS-M18 — Civic Passport Integration

**[VDS-M18]** Volunteer Passport is a **first-class section** of Civic Passport [CJT-001, CPP-001]:

| Civic Passport section | Source |
|------------------------|--------|
| Journey timeline | CJT-001 — all categories |
| **Volunteer Passport** | VDS-M17 — service story |
| Growth & leadership | PGL-001 |
| Recognition | CRA-001 |
| Relationships | NET-001 |

**[VDS-M18a]** Timeline categories include volunteer service [CJT-M04] — Volunteer Passport provides **structured depth** beneath timeline events.

**[VDS-M18b]** Participant portfolio view [CJT-M15] aggregates Volunteer Passport highlights.

---

## VDS-M19 — Platform Integrations

**[VDS-M19]** Volunteer Development System integrates:

| System | Integration |
|--------|-------------|
| OEX-001 | Volunteer opportunity discovery |
| OBE-001 | Explainable opportunity matching |
| TSOS-001 | Scheduling, availability |
| EOS-001 | Mission volunteer needs, DOB |
| EEOS-001 | Event QR check-in |
| MDS-001 | Canvas participants & skills sections |
| CCE-001 | Skills matching |
| CJT-001 | Civic Passport, timeline |
| CRA-001 | Service recognition |
| PGL-001 | Growth, mentorship |
| ACN-M26 MOR | Volunteer participation section |
| CAM-001 | Attention budget, burnout prevention |

---

## VDS-M20 — V1 Scope

**[VDS-M20]** Step 5.4 deliverables:

| Capability | V1 |
|------------|-----|
| Volunteer Development philosophy | ✅ Documented |
| Volunteer journey pathway | ✅ Spec |
| Profile, availability, skills matching | ✅ Spec |
| Roles, scheduling, QR check-in | ✅ Spec |
| Recognition, reflection, development | ✅ Spec |
| Volunteer Passport architecture | ✅ Spec |
| Volunteer UI implementation | Stub |
| QR check-in flow | v1.1 with EEOS-001 |
| AI recommendations | Future [VDS-M16] |

---

## VDS-BG — Burt Implementation Guidance

**[VDS-BG]** Implementation should:

1. **Treat volunteering as participant development** — not labor scheduling [VDS-M01, VDS-M02]
2. **Integrate with Opportunity Exchange** [OEX-001] — discovery layer
3. **Connect to Time Operating System** [TSOS-001] — scheduling without dehumanization
4. **Preserve volunteer history** — participant-owned [VDS-M14]
5. **Implement Volunteer Passport** — experience story, not hour counter [VDS-M17]
6. **Support future certifications** [VDS-M15]
7. **Optimize for mobile** — check-in, accept/decline, reflection [EOS-M14]
8. **Invitation model** — decline without penalty [VDS-M03]
9. **Feed Civic Journey Timeline** — every experience append-only [CJT-M14]

**[VDS-BG-a]** Recommended structure:

```
src/lib/volunteers/matchVolunteersToMission.ts
src/lib/volunteers/updateVolunteerAvailability.ts
src/lib/volunteers/checkInVolunteer.ts
src/lib/volunteers/appendVolunteerPassportEntry.ts
src/lib/volunteers/deriveVolunteerJourneyStage.ts
src/components/volunteer/VolunteerProfileSection.tsx
src/components/volunteer/VolunteerPassport.tsx
src/components/volunteer/OpportunityInviteCard.tsx
data/registry/volunteer-development-system.json
```

---

## AC-051 — Acceptance Criteria

Step 5.4 is complete when:

- [x] **[AC-051a]** Volunteer Development philosophy documented. `[VDS-M01, VDS-M02, VDS-M03]`
- [x] **[AC-051b]** Volunteer journey established. `[VDS-M04]`
- [x] **[AC-051c]** Skills matching and scheduling defined. `[VDS-M07, VDS-M09, VDS-M06]`
- [x] **[AC-051d]** Recognition, reflection, and development incorporated. `[VDS-M11, VDS-M12, VDS-M13]`
- [x] **[AC-051e]** Volunteer Passport architecture specified. `[VDS-M17, VDS-M18]`
- [x] **[AC-051f]** Burt has blueprint for volunteering as leadership development. `[VDS-BG, volunteer-development-system.json]`

---

**Next Step:** 5.5 — Experience & Event Operating System

*Trace: Invited into mission → served with purpose → reflected → recognized → passport enriched → journey advances → mentor next generation*
