# Build Volume 1.2 — System Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.2 · **ENG-002**  
**Artifact:** `SYSTEM_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.1 Engineering Doctrine](ENGINEERING_DOCTRINE.md) [ENG-001]  
**Volume sequence:** [VOLUME_1_MASTER_SEQUENCE.md](VOLUME_1_MASTER_SEQUENCE.md) · **EAB-001**  
**Governed by:** [Volume 0](../master/MASTER_ARCHITECTURE_BIBLE.md) [MAB-001]  
**Live spec:** `data/registry/system-architecture.json`

---

## ENG-SA01 — Purpose

**[ENG-SA01]** The System Architecture document defines the **overall technical structure** of the Community Operating System.

**[ENG-SA01a]** Rather than describing individual features, this document defines:

- How every subsystem communicates
- How responsibilities are divided
- How the platform scales over time

**[ENG-SA01b]** Every future engineering decision should **fit within this architecture**.

---

## ENG-SA02 — Guiding Principle

**[ENG-SA02]**

> **One Community Operating System composed of many independent, cooperating services.**

**[ENG-SA02a]** Each subsystem should have a **clear responsibility** while remaining **loosely coupled**.

**[ENG-SA02b]** Aligns with [ENG-D03] modular · API-driven · extensible.

---

## ENG-SA03 — Architectural Philosophy

**[ENG-SA03]** The Community Operating System is **not** a single application. It is an **ecosystem of coordinated subsystems**.

**[ENG-SA03a]** Each subsystem owns a specific domain.

**[ENG-SA03b]** Subsystems communicate through **well-defined interfaces** rather than direct dependencies.

**[ENG-SA03c]** This architecture allows individual areas to **evolve without destabilizing** the entire platform [DG-013 Scalable Architecture · GOS-M07].

---

## ENG-SA04 — The Platform Kernel

**[ENG-SA04]** At the center of the architecture sits the **Platform Kernel** — not another domain service, but the **small set of foundational capabilities** every other service depends on.

```text
                    ┌─────────────────────────────┐
                    │      PLATFORM KERNEL        │
                    │  Identity · Auth · Perms    │
                    │  Community registry · Time  │
                    │  Events · Notifications     │
                    │  Config · Audit · Graph I/F │
                    │  Search index hooks         │
                    └──────────────┬──────────────┘
                                   │
     ┌─────────────┬───────────────┼───────────────┬─────────────┐
     ↓             ↓               ↓               ↓             ↓
 Community    Mission         Growth          Knowledge    Intelligence
 Service      Service         Service         Service      Service
     ...        ...             ...             ...            ...
```

**[ENG-SA04a]** Kernel capabilities:

| Capability | Kernel responsibility | Detail in step |
|------------|----------------------|----------------|
| Identity & authentication | Who is acting | [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006] |
| Authorization & permissions | What they may do | ENG-006 |
| Community registry | Where they belong | [Registry Service](#layer-4--domain-services-layer) |
| Time & calendar foundation | When things happen | [1.9 Events](EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009] |
| Event & activity model | What happened | ENG-009 |
| Notification routing | How they are reached | [1.12 Communication](COMMUNICATION_ARCHITECTURE.md) [ENG-012] |
| Configuration management | How behavior varies | [ENG-SA12 Configuration Philosophy] |
| Audit logging | Immutable history | [ENG-SA06 Data Layer] |
| Search indexing hooks | Discovery pipeline | [1.10 Search](SEARCH_ARCHITECTURE.md) [ENG-010] |
| Community Knowledge Graph interface | How entities connect | [1.8 CKG](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008] |

**[ENG-SA04b]** Everything else — missions, communities, invitations, stories, partnerships, growth, intelligence — **builds on the kernel**.

**[ENG-SA04c]** The kernel stays **intentionally small and stable**. Most changes over the coming years occur in **domain services**; the kernel remains the reliable foundation [ENG-D07 Expansion Rule].

**[ENG-SA04d]** V1 implementation: kernel as **shared modules** in `src/lib/kernel/` — not a separate deployable, but a enforced boundary.

---

## ENG-SA05 — Primary Layers

**[ENG-SA05]** The platform consists of **nine major architectural layers**:

```text
Presentation Layer
        ↓
Experience Layer
        ↓
Application Layer
        ↓
Domain Services Layer
        ↓
Knowledge & Intelligence Layer
        ↓
Data Layer
        ↓
Integration Layer
        ↓
Infrastructure Layer
        ↓
Observability Layer
```

**[ENG-SA05a]** Each layer has **distinct responsibilities**. Lower layers never depend on higher layers.

**[ENG-SA05b]** The **Platform Kernel** spans Domain Services + Data boundaries — shared infrastructure for all domain services.

---

## Layer 1 — Presentation Layer [ENG-SA-L1]

**Purpose:** Everything the participant sees.

**Examples:**

- Public website · [PCN-001 Public Community Network]
- Participant dashboard · [PHQ-001 Personal HQ]
- Community dashboard · [CCC-001 Community Command Center]
- Mobile · tablet · desktop experiences [UXB-001]
- Administrative interfaces · `/admin`
- Community Explorer · [PCN-M16]
- Maps · [CGO-M16 · IPS-M13]
- Story Atlas · [CST-M01]

**Responsibilities:** Rendering · user interaction · accessibility · responsive layouts · navigation [ENG-D11 UI Doctrine].

**Rule:** Contains **no business logic** — consumes Application Layer and services only.

**Implementation:** `src/app/` · `src/components/` (presentation) · Next.js App Router.

---

## Layer 2 — Experience Layer [ENG-SA-L2]

**Purpose:** Coordinates **user journeys** — multi-step flows across services.

**Examples:**

| Journey | Phase ref |
|---------|-----------|
| Welcome & Belonging | [WBS-001](../phase-06/WELCOME_BELONGING_SYSTEM.md) |
| Invitation flows | [ICS-001](../phase-06/INVITATION_CONNECTION_SYSTEM.md) |
| Community onboarding | [CEF-001](../phase-06/COMMUNITY_EXPANSION_FRAMEWORK.md) |
| Mission creation | [MDS-001](../phase-05/MISSION_DESIGN_SYSTEM.md) |
| Event registration | [EEOS-001](../phase-05/EXPERIENCE_EVENT_OPERATING_SYSTEM.md) |
| Volunteer experience | [VDS-001](../phase-05/VOLUNTEER_DEVELOPMENT_SYSTEM.md) |
| Leadership journey | [CLD-001](../phase-06/COMMUNITY_LEADERSHIP_DEVELOPMENT_SYSTEM.md) |

**Rule:** Orchestrates experiences using underlying Application + Domain services — not a duplicate of business rules.

**Implementation:** `src/lib/experiences/` · flow orchestrators · wizard components.

---

## Layer 3 — Application Layer [ENG-SA-L3]

**Purpose:** Coordinates **requests** — use cases that span multiple domain services.

**Examples:**

| Use case | Services involved |
|----------|-------------------|
| Create mission | Mission · Community · Knowledge |
| Join community | Identity · Community · Growth · Welcome |
| Accept invitation | Identity · Invitations · Growth · Notification |
| Publish story | Knowledge · Media · Community · Consent |
| Register for event | Experience · Mission · Notification |
| Launch community | Community · Growth · Registry · Config |

**Rule:** Application Layer **coordinates** Domain Services — does not embed domain rules.

**Implementation:** `src/lib/app/` or `src/lib/use-cases/` · server actions · route handlers as entry points.

---

## Layer 4 — Domain Services Layer [ENG-SA-L4]

**Purpose:** Each major business capability as its own **service** with clear ownership [ENG-D10 Service Doctrine].

### Identity Service [ENG-SA-SVC-01]

Participants · profiles · authentication · roles · permissions  
**Phase:** 3 · **Kernel:** yes (identity core)  
**Paths:** `src/lib/participant/` · `src/lib/auth/`

### Registry Service [ENG-SA-SVC-02]

Counties · educational institutions · community registry · map registry nodes  
**Phase:** 2 · **Kernel:** partial (community registry)  
**Paths:** `src/lib/registry/`

### Community Service [ENG-SA-SVC-03]

Communities · committees · membership · leadership · community settings  
**Phase:** 4 · **Paths:** `src/lib/community/`

### Mission Service [ENG-SA-SVC-04]

Missions · projects · tasks · milestones · Mission Operating Records [ACN-001]  
**Phase:** 5 · **Paths:** `src/lib/mission/` · `src/lib/execution/`

### Experience Service [ENG-SA-SVC-05]

Events · registration · attendance · check-in · calendars [EEOS · TSOS-001]  
**Phase:** 5 · **Paths:** `src/lib/experience/` · `src/lib/time/`

### Growth Service [ENG-SA-SVC-06]

Invitations · QR codes · outreach · community growth · leadership development  
**Phase:** 6 · **Paths:** `src/lib/growth/` · `src/lib/invitations/`

### Opportunity Service [ENG-SA-SVC-07]

Volunteer opportunities · projects · committees · needs · matching [OEX-001 · OBE-001]  
**Phase:** 3–4 · **Paths:** `src/lib/opportunity/`

### Knowledge Service [ENG-SA-SVC-08]

Community Brain · lessons · playbooks · Story Atlas · Mission Library · legacy [CKLS · CST · CLS]  
**Phase:** 4–5 · **Paths:** `src/lib/knowledge/`

### Capacity Service [ENG-SA-SVC-09]

People · skills · equipment · facilities · transportation · partnership capacity [CCS-001]  
**Phase:** 5 · **Paths:** `src/lib/capacity/`

### Partnership Service [ENG-SA-SVC-10]

Institutions · organizations · collaborations · shared initiatives [IPS-001 · SCN-001]  
**Phase:** 4–6 · **Paths:** `src/lib/partnership/`

### Intelligence Service [ENG-SA-SVC-11]

Operational · growth · impact · network intelligence · explainable recommendations [OPIS · CGIS · CIIS · NISS]  
**Phase:** 5–6 · **Paths:** `src/lib/intelligence/`

### Communication Service [ENG-SA-SVC-12]

Notifications · announcements · messages · digests · communication preferences [CAM-001 · CCNET-001]  
**Phase:** 4 · **Paths:** `src/lib/comms/`

### Search Service [ENG-SA-SVC-13]

Search · filters · recommendations · discovery  
**Phase:** 7 hook · **Paths:** `src/lib/search/`

### Media Service [ENG-SA-SVC-14]

Photos · video · documents · file management [CST-001 consent]  
**Paths:** `src/lib/media/`

---

## Layer 5 — Knowledge & Intelligence Layer [ENG-SA-L5]

**Purpose:** Shared **intelligence** across the platform — reads from domain services, never owns canonical writes alone.

**Includes:**

- Community Brain [CKLS-001]
- Community Knowledge Graph [NISS-M17 · ENG-008]
- Community Legacy [CLS-001]
- Operational Intelligence [OPIS-001]
- Network Twin [NISS-M16]
- Personal Digital Twin [PDT-001]
- Learning systems [LIS-001]
- Impact systems [CIIS-001]

**Rule:** Every domain **contributes knowledge** upward; intelligence layer **aggregates and explains** — does not silently mutate source data [ENG-D15 AI Doctrine].

---

## Layer 6 — Data Layer [ENG-SA-L6]

**Purpose:** **Persistent storage** [ENG-D09 Data Doctrine].

**Components:**

- SQL database (Postgres / Supabase)
- Knowledge Graph tables [ENG-008]
- Media metadata
- Audit history
- Configuration store
- Search indexes
- Event history [ENG-009]

**Rule:** **No business rules** belong here — only schema, constraints, RLS, indexes.

**Detail:** [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [Volume 2](../master/DATA_ARCHITECTURE_BIBLE.md).

---

## Layer 7 — Integration Layer [ENG-SA-L7]

**Purpose:** Connects **external systems** — isolated from core business logic [ENG-D08].

**Examples:**

| Integration | Use |
|-------------|-----|
| Google Calendar · Outlook · Apple Calendar | TSOS-001 sync |
| Email providers | Transactional mail |
| SMS providers | Opt-in critical alerts |
| Mapping services | Mapbox / tiles |
| Identity providers | OAuth institutions (future) |
| AI providers | RAG + completion [Volume 4] |
| Payment systems | Future only if ever needed |

**Rule:** Integrations fail **gracefully** [ENG-SA11 Failure Philosophy] — adapters in `src/lib/integrations/`.

---

## Layer 8 — Infrastructure Layer [ENG-SA-L8]

**Purpose:** **Runs the platform** — replaceable components.

**Includes:** Hosting (Netlify) · CDN · database (Supabase) · storage · secrets · caching · background jobs · queue processing · backups · monitoring

**Rule:** Infrastructure should remain **replaceable** [DG-008 No Vendor Lock-In].

**Detail:** [1.14 Deployment Architecture](DEPLOYMENT_TESTING_RELEASE_ARCHITECTURE.md) [ENG-014].

---

## Layer 9 — Observability Layer [ENG-SA-L9]

**Purpose:** Understand **system health** without exposing private participant data.

**Examples:** Application logs · error tracking (Sentry) · performance · build health · deploy history · audit trails · usage metrics · feature adoption

**Rule:** Aggregates and alerts — **no PII in logs** · permission-gated drill-down.

**Implementation:** Structured logging · error boundaries · admin deploy tab.

---

## ENG-SA06 — Architectural Boundaries

**[ENG-SA06]** Every subsystem owns its own responsibilities.

| Never | Because |
|-------|---------|
| Identity manages Missions | Mission Service owns mission lifecycle |
| Mission Service owns Participants | Identity Service owns people |
| Growth Service manages Authentication | Kernel / Identity owns auth |
| Knowledge Service manages Permissions | Kernel / Identity owns authorization |

**[ENG-SA06a]** Services collaborate through **contracts** — typed interfaces · events · API schemas [ENG-005].

---

## ENG-SA07 — Communication Pattern

**[ENG-SA07]** Preferred flow:

```text
UI (Presentation)
        ↓
Experience orchestrator (optional)
        ↓
Application Layer (use case)
        ↓
Domain Service
        ↓
Platform Kernel (auth, audit, graph hook)
        ↓
Data Layer
```

**[ENG-SA07a]** Service-to-service: **orchestrator calls** or **domain events** — never direct cross-import of internal helpers.

**[ENG-SA07b]** Anti-pattern: React component → SQL query skipping service layer.

---

## ENG-SA08 — State Management

**[ENG-SA08]** State exists at three levels:

### Client State

Temporary interface state — dialogs · forms · filters · selections  
**Lives in:** React component state · URL params · client stores (minimal)

### Application State

Current user session — navigation · permissions · working context (active community)  
**Lives in:** Server session · Supabase auth · context providers

### Persistent State

Everything stored permanently — participants · communities · stories · events · knowledge · relationships  
**Lives in:** Data Layer only [ENG-SA-L6]

**Rule:** Persistent state **never** authoritative in client-only storage.

---

## ENG-SA09 — Configuration Philosophy

**[ENG-SA09]** Prefer **configuration over code** [ENG-D06 · MAB principle 19].

**Examples:** Community types · institution types · roles · permissions · workflows · templates · recognition categories · growth stages [CGS-001]

**[ENG-SA09a]** Future expansion should require **configuration whenever possible** — Community Genome templates [GOS-M10] · Foundry [CEF-001].

---

## ENG-SA10 — Scalability Philosophy

**[ENG-SA10]** Architecture supports growth without redesign:

```text
One campus
    ↓
Five campuses
    ↓
All Arkansas educational institutions
    ↓
Statewide county communities
    ↓
Neighboring states
    ↓
National expansion
```

**[ENG-SA10a]** Same modular monolith V1 · horizontal scale via read replicas · CDN · caching before service split [ENG-D08].

**[ENG-SA10b]** Target: **2 → 20,000 participants** without architectural redesign [GOS-001].

---

## ENG-SA11 — Failure Philosophy

**[ENG-SA11]** The platform **degrades gracefully**:

| Failure | Platform behavior |
|---------|-------------------|
| External calendar unavailable | Community still functions · local calendar works |
| AI unavailable | Platform still functions · manual workflows |
| Notification provider unavailable | Core operations continue · in-app queue retries |
| Map tiles unavailable | List views · cached bounds still work |

**[ENG-SA11a]** **Optional systems never prevent essential community functions** — belonging · missions · membership · stories.

---

## ENG-SA12 — Engineering Principles

**[ENG-SA12]** Every subsystem should be:

| Property | Meaning |
|----------|---------|
| **Independent** | Clear ownership · deployable slice |
| **Replaceable** | Interface-stable · adapter pattern |
| **Testable** | Orchestrator unit tests · mock data layer |
| **Observable** | Logs · metrics · trace IDs |
| **Documented** | Phase doc + registry |
| **Permission-aware** | Kernel auth on every mutation |
| **Versioned** | API v1 · migration history |
| **Extensible** | Config hooks · event emission |

---

## ENG-SA13 — Burt Implementation Guidance

**[ENG-SA13]** Implementation should:

- Build services around **domain boundaries** [ENG-SA-L4]
- Keep business logic **out of UI components** [ENG-D10]
- **Isolate** external integrations [ENG-SA-L7]
- Design for **configuration** rather than customization [ENG-SA09]
- Favor **composition** over tight coupling
- Ensure every service is **independently testable**
- Place kernel shared code in `src/lib/kernel/` — domain code never bypasses kernel auth/audit

---

## AC-084 — Acceptance Criteria

Volume 1.2 is complete when:

- [x] **[AC-084a]** System layers (1–9) defined. `[ENG-SA05, ENG-SA-L1–L9]`
- [x] **[AC-084b]** Platform Kernel established as architectural center. `[ENG-SA04]`
- [x] **[AC-084c]** Domain service boundaries established (14 services). `[ENG-SA-L4]`
- [x] **[AC-084d]** Communication patterns and boundaries documented. `[ENG-SA06, ENG-SA07]`
- [x] **[AC-084e]** State, configuration, scalability, and failure philosophies incorporated. `[ENG-SA08–SA11]`
- [x] **[AC-084f]** Burt has complete blueprint for overall COS technical architecture. `[system-architecture.json]`

---

**Next step:** [1.4 — Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004]

**End of Volume 1.2 — System Architecture.**
