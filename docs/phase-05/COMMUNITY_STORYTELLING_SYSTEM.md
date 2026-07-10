# Community Storytelling System

**Document ID:** PHASE-005.11  
**Artifact:** `COMMUNITY_STORYTELLING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** CST

> **Communities are remembered through their stories.**

Most platforms treat storytelling as **marketing**. That is backwards. Storytelling is **how communities preserve identity, inspire participation, and pass culture from one generation to the next.** Stories are not an afterthought — they are **part of the operating system**.

**Requirement:** CST-001 · **Supersedes:** AST-001 (Storytelling System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Community Legacy CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) · [Community Knowledge CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Community Impact Intelligence CIIS-001](COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md) · [Community Recognition CRA-001](../phase-04/COMMUNITY_RECOGNITION_APPRECIATION.md) · [Experience & Event OS EEOS-001](EXPERIENCE_EVENT_OPERATING_SYSTEM.md)

**Live spec:** `data/registry/community-storytelling-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CST-M01 | Purpose |
| CST-M02 | Guiding principle |
| CST-M03 | Storytelling philosophy |
| CST-M04 | Story categories |
| CST-M05 | Story structure |
| CST-M06 | Story collection |
| CST-M07 | Story approval |
| CST-M08 | Story discovery |
| CST-M09 | Story connections |
| CST-M10 | Storytelling templates |
| CST-M11 | Recognition through story |
| CST-M12 | Future AI assistance |
| CST-M13 | Not marketing |
| CST-M14 | Memory triad |
| CST-M15 | MOR integration |
| CST-M16 | Arkansas Story Atlas |
| CST-M17 | Memory preservation stack |
| CST-M18 | Platform integrations |
| CST-M19 | V1 scope |
| CST-BG | Burt implementation guidance |
| AC-058 | Step 5.11 acceptance criteria |

---

## CST-M01 — Purpose

**[CST-M01]** The **Community Storytelling System (CST)** captures, preserves, and shares the **human stories** that emerge from service, leadership, collaboration, and community life.

**[CST-M01a]** Every mission creates more than outcomes — it creates **experiences worth remembering** [CIIS-001 outcomes + stories].

**[CST-M01b]** The platform exists to help communities tell those stories **authentically** — not as promotional content [CST-M13].

**[CST-M01c]** Stories are **first-class platform entities** [CST-BG] — linked to missions, people, and legacy.

---

## CST-M02 — Guiding Principle

**[CST-M02]**

> **Communities are remembered through their stories.**

**[CST-M02a]** **Stories transform activities into meaning** [ACN-M04 Civic Operating Loop, CLS-001 living history].

**[CST-M02b]** Statistics explain. **Stories inspire.** The platform preserves both [CIIS-001 + CST-001].

---

## CST-M03 — Storytelling Philosophy

**[CST-M03]** Every meaningful mission should answer:

- Who was helped?
- Who grew? [PGL-001, VDS-001]
- What relationships formed? [PRN-001]
- What surprised us?
- What should future participants remember?

**[CST-M03a]** Storytelling is **cultural preservation** — passing identity from one generation to the next [CLS-001 alumni, anniversaries].

**[CST-M03b]** Collection should happen **during normal community activities** — not as a separate marketing exercise [CST-M06].

---

## CST-M04 — Story Categories

**[CST-M04]** Flexible architecture — six primary categories:

### Participant Stories [CST-M04a]

First volunteer experience · Leadership journey · Mentorship · Personal growth · Community connections · Graduation reflections [PDT-001, CJT-001]

### Mission Stories [CST-M04b]

Food drive · Campus welcome week · Community cleanup · Leadership retreat · Volunteer day · Statewide initiative [IOS-001] — **every mission deserves a narrative**

### Community Stories [CST-M04c]

Campus traditions · County milestones · Annual events · Historic accomplishments · Community identity · Volunteer culture [CLS-001]

### Leadership Stories [CST-M04d]

Organizer reflections · Mentor experiences · Committee development [TWG-001] · Lessons from leadership · Leadership transitions [CCN-001 succession]

### Partnership Stories [CST-M04e]

Campus-county collaboration [SCN-001] · Regional initiatives · Community partnerships · Shared successes · Relationship building

### Legacy Stories [CST-M04f]

Community history · Major milestones · Anniversaries · Generational transitions · Alumni reflections — **legacy keeps communities connected across time** [CLS-001]

---

## CST-M05 — Story Structure

**[CST-M05]** Every story includes:

| Field | Purpose |
|-------|---------|
| Title | Human-readable name |
| Summary | Brief overview |
| Participants | Who is in the story [PEP-001 consent] |
| Community | Owning community |
| Mission | Related mission [MDS-001] |
| Timeline | When it happened [TSOS-001, CJT-001] |
| Photos | Visual media |
| Videos | Motion media |
| Quotes | Authentic voices |
| Lessons learned | For Community Brain [CKLS-001] |
| Related resources | Links and attachments |
| Related playbooks | EEOS-M17, CKLS-M07 |
| Related missions | Cross-links |
| Category | [CST-M04] |
| Tags | Discovery [CST-M08] |

**[CST-M05a]** Stories become **searchable knowledge** [CKLS-M09 searchable knowledge].

---

## CST-M06 — Story Collection

**[CST-M06]** Communities should easily capture stories:

| Format | Context |
|--------|---------|
| Written reflections | Post-mission, post-event |
| Short interviews | Mobile-friendly |
| Photo journals | During experiences [EEOS-001] |
| Video clips | Event highlights |
| Audio recordings | Oral history |
| Event highlights | Live capture [EEOS-M12] |
| Community memories | Alumni, anniversaries |

**[CST-M06a]** Collection **simple enough for normal activities** — one-tap capture from Experience HQ [EEOS-001], Mission HQ [MPS-001], Personal HQ [PHQ-001].

**[CST-M06b]** Orchestrator: `createStory(draft)` · supports **multimedia** [CST-BG].

---

## CST-M07 — Story Approval

**[CST-M07]** Communities **review stories before publication**:

| Workflow | Purpose |
|----------|---------|
| Drafts | Work in progress |
| Editing | Community refinement |
| Consent | Participant permission [KDG-001, PEP-001] |
| Privacy settings | Who can see |
| Role-based publishing | Leaders, editors [TWG-001] |

**[CST-M07a]** **Respect for participants is essential** — no publish without consent for identifiable content [DG-001 boundaries, CCN-001].

**[CST-M07b]** Preserve **draft and publication history** — append-only [CST-BG].

---

## CST-M08 — Story Discovery

**[CST-M08]** Participants browse stories by:

Community · Mission · County · Campus · Topic · Volunteer experience · Leadership · Year · Tags

**[CST-M08a]** Stories remain **easy to discover** — not buried in admin archives [CST-M16 Story Atlas primary discovery UX].

**[CST-M08b]** Route: `/stories` · `/community/[slug]/stories` · Search integrates CKLS [CKLS-M09].

---

## CST-M09 — Story Connections

**[CST-M09]** Stories connect to:

| Entity | Link |
|--------|------|
| Participants | PDT-001, Civic Passport |
| Communities | CID-001 |
| Projects | EOS-001 |
| Initiatives | IOS-001 |
| Mission Operating Records | ACN-M26 |
| Experience Playbooks | EEOS-M17 |
| Community Brain | CKLS-001 |
| Legacy Timeline | CLS-001 |
| Impact Chain | CIIS-M16 |

**[CST-M09a]** The platform **understands how stories relate to everything else** — graph edges, not orphan content [REL-001].

---

## CST-M10 — Storytelling Templates

**[CST-M10]** Reusable **prompts** help richer stories:

- What inspired this mission?
- What surprised you today?
- What challenge did you overcome?
- Who made a difference?
- What would you tell next year's organizers?

**[CST-M10a]** Communities may **create and share templates** [CKLS-001 playbooks parallel].

**[CST-M10b]** Templates optional — never required boilerplate [CST-M03 authentic voices].

---

## CST-M11 — Recognition Through Story

**[CST-M11]** Recognition emphasizes **contribution through narrative** [CRA-001] — not badges alone:

- Volunteer spotlight
- Leadership journey
- Community appreciation
- Mentor recognition
- Project reflections

**[CST-M11a]** **Stories celebrate people naturally** — recognition without gamification pressure [Phase 8 gamification boundaries].

**[CST-M11b]** Connects CRA appreciation moments to published stories [CRA-001 storytelling recognition].

---

## CST-M12 — Future AI Assistance

**[CST-M12]** Future AI may **assist while preserving authentic voices**:

| Capability | Role |
|------------|------|
| Transcribe interviews | Accessibility |
| Organize photos | Suggest groupings |
| Summarize stories | With human review |
| Suggest titles | Draft assistance |
| Connect related stories | Narrative threads |
| Recommend historical context | CLS-001, CKLS-001 |

**[CST-M12a]** **AI assists — never replaces** participant voice [ACN-M06, KDG-001].

---

## CST-M13 — Not Marketing

**[CST-M13]** CST is **explicitly not** a marketing or promotional content system [DG-001].

**[CST-M13a]** No "engagement optimization" for stories · No viral metrics · No ranking communities by story output [CCN-M01, COS-001].

**[CST-M13b]** Stories serve **community memory and culture** — authentic, consent-based, participant-centered [CST-M07].

---

## CST-M14 — Memory Triad

**[CST-M14]** CST completes a **preservation triad** with Phase 4 systems:

| System | Preserves | Question |
|--------|-----------|----------|
| Community Brain [CKLS-001] | Knowledge | What we know |
| Community Legacy [CLS-001] | History | What we've built |
| **Story Atlas [CST-M16]** | **Human experience** | **Who we became while building it** |

**[CST-M14a]** Together: a platform that doesn't just organize communities — it helps them **remember why their work mattered**.

---

## CST-M15 — MOR Integration

**[CST-M15]** Stories are a **core section of the Mission Operating Record** [ACN-M26]:

```text
MOR includes:
  ... execution ...
  → Mission Impact Report [CIIS-M05]
  → Stories collected [CST-M05]
  → Media archive [CST-M06]
```

**[CST-M15a]** MOR without stories is **incomplete human history** of the mission [ACN-M19 preservation].

---

## CST-M16 — Arkansas Story Atlas

**[CST-M16]** **Signature feature.** An **interactive map of Arkansas** where every campus and county gradually **fills with stories** — the **emotional memory of the statewide network**.

**[CST-M16a]** Click a county and discover:

- Volunteer reflections
- Leadership journeys
- Community traditions
- Successful missions
- Historic milestones
- Alumni memories
- Partnership stories
- Annual events

**[CST-M16b]** Explore by **topic**:

Environmental projects · Student leadership · Community service · Mentorship · Campus traditions · Regional collaboration

**[CST-M16c]** Route: `/map/stories` · Orchestrator: `getStoryAtlas(filters?)` · extends Arkansas Collaboration Map [SCN-M04] and Capacity Map [CCS-M16] with **human narrative layer**.

**[CST-M16d]** Complements data layers:

| Map layer | Content |
|-----------|---------|
| Collaboration Map [SCN] | Who connects |
| Capacity Map [CCS] | What is available |
| **Story Atlas [CST]** | **Who we became** |

**[CST-M16e]** **Inspiring discovery** — new participants see what participation looks like before they join [PEL-001 belonging].

---

## CST-M17 — Memory Preservation Stack

**[CST-M17]** CST sits in the long-term memory architecture:

| Layer | System | Content |
|-------|--------|---------|
| Operational | MOR [ACN-M26] | Mission stories attached |
| Impact | CIIS-001 | Stories as evidence |
| Knowledge | Community Brain [CKLS-001] | Searchable narratives |
| History | Community Legacy [CLS-001] | Timeline, alumni |
| **Experience** | **Story Atlas [CST-M16]** | **Geographic human memory** |
| Personal | Civic Passport [CPP-001] | Individual story contributions |

---

## CST-M18 — Platform Integrations

**[CST-M18]** CST integrates:

| System | Integration |
|--------|-------------|
| ACN-M26 MOR | Story archive per mission |
| CIIS-001 | Story-based measurement [CIIS-M07] |
| CKLS-001 | Searchable knowledge |
| CLS-001 | Legacy timeline, alumni |
| CRA-001 | Recognition through story |
| EEOS-001 | Event story capture |
| EOS-001 | Mission execution media |
| VDS-001 | Volunteer journey stories |
| PGL-001 / PDT-001 | Leadership narratives |
| IOS-001 | Initiative stories |
| SCN-001 | Geographic discovery |
| CIS-001 | Storytelling in intelligence [CIS-M11] |
| KDG-001 | Consent, privacy governance |
| CJT-001 | Civic journey timeline |
| LIS-001 | Reflection → story |

---

## CST-M19 — V1 Scope

**[CST-M19]** Step 5.11 deliverables:

| Capability | V1 |
|------------|-----|
| Community Storytelling philosophy | ✅ Documented |
| Story categories + structure | ✅ Spec |
| Collection + discovery | ✅ Spec |
| Approval + privacy workflows | ✅ Spec |
| Story connections model | ✅ Spec |
| Arkansas Story Atlas architecture | ✅ Spec |
| Memory triad + stack | ✅ Spec |
| Story UI implementation | Stub |
| Live Atlas aggregation | v1.1 |
| AI transcription/organization | Future [CST-M12] |

---

## CST-BG — Burt Implementation Guidance

**[CST-BG]** Implementation should:

1. **Treat stories as first-class entities** [CST-M01c]
2. **Support multimedia** — photos, video, audio [CST-M06]
3. **Maintain relationships** between stories and platform objects [CST-M09]
4. **Preserve drafts and publication history** [CST-M07b]
5. **Support search and long-term archival** [CKLS-001, CLS-001]
6. **Implement consent workflows** before publish [CST-M07, KDG-001]
7. **Never optimize for viral marketing metrics** [CST-M13]
8. **Extend map routes** toward Story Atlas layer [CST-M16]

**[CST-BG-a]** Recommended structure:

```
src/lib/stories/createStory.ts
src/lib/stories/publishStory.ts
src/lib/stories/getStoryAtlas.ts
src/lib/stories/connectStoryToMission.ts
src/components/stories/StoryEditor.tsx
src/components/stories/StoryDiscovery.tsx
src/components/stories/ArkansasStoryAtlas.tsx
data/registry/community-storytelling-system.json
```

**[CST-BG-b]** Database: `DB-CST` · tables: `stories`, `story_media`, `story_connections`, `story_consents`, `story_drafts`.

---

## AC-058 — Acceptance Criteria

Step 5.11 is complete when:

- [x] **[AC-058a]** Community Storytelling philosophy documented. `[CST-M01, CST-M02, CST-M03, CST-M13]`
- [x] **[AC-058b]** Story categories and structure established. `[CST-M04, CST-M05]`
- [x] **[AC-058c]** Story collection and discovery defined. `[CST-M06, CST-M08, CST-M16]`
- [x] **[AC-058d]** Privacy and approval workflows incorporated. `[CST-M07, KDG-001]`
- [x] **[AC-058e]** Arkansas Story Atlas architecture specified. `[CST-M16, CST-M14, CST-M17]`
- [x] **[AC-058f]** Burt has blueprint for storytelling as operating system. `[CST-BG, community-storytelling-system.json]`

---

**Next Step:** 5.12 — Learning & Improvement System *(complete — see LEARNING_IMPROVEMENT_SYSTEM.md)*

*Trace: Experience happens → story captured simply → consent reviewed → published → connected to mission and legacy → appears on Story Atlas → inspires next participant → culture passes forward*
