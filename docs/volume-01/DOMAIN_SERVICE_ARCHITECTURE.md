# Build Volume 1.7 — Domain Service Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.7 · **ENG-007**  
**Artifact:** `DOMAIN_SERVICE_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Service Registry](SERVICE_REGISTRY.md) [SRG-001]  
**Builds on:** [1.2 System Architecture](SYSTEM_ARCHITECTURE.md) [ENG-002] · [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006] · [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004]  
**Live spec:** `data/registry/domain-service-architecture.json` · **Catalog:** `data/registry/service-registry.json`

---

## ENG-DS01 — Purpose

**[ENG-DS01]** The Domain Service Architecture defines how the **business logic** of the Community Operating System is organized.

**[ENG-DS01a]** Every major capability is implemented as a **domain service** with a clearly defined responsibility.

**[ENG-DS01b]** This prevents business logic from scattering across the application and allows each domain to **evolve independently** [ENG-SA03 · ENG-D10].

---

## ENG-DS02 — Guiding Principle

**[ENG-DS02]**

> **One responsibility. One service. One source of truth for every business capability.**

**[ENG-DS02a]** Each service owns **one business domain** and exposes a **clear public interface**.

---

## ENG-DS03 — Philosophy

**[ENG-DS03]** Services represent **business capabilities**, not technical layers.

**Yes — business domains:**

Communities · participants · missions · events · stories · leadership

**No — technical artifacts:**

Controllers · utilities · database helpers

**[ENG-DS03a]** The architecture should **mirror how communities actually operate** [PHASE-001.5 Organizing Model · OM-L1].

---

## ENG-DS04 — Service Architecture

**[ENG-DS04]** Every service follows the same internal structure:

```text
Public Interface
        ↓
Application Logic
        ↓
Business Rules
        ↓
Validation
        ↓
Repository Layer
        ↓
Database
```

**[ENG-DS04a]** Business rules live **inside the service** — not in UI components or database triggers [ENG-DB02 · RCN-001].

**Canonical folder template:** [ENG-003 Repository Architecture](CANONICAL_REPOSITORY_ARCHITECTURE.md) — `services/{domain}/`.

---

## ENG-DS05 — Service Standards

**[ENG-DS05]** Every domain service must:

| Standard | Requirement |
|----------|-------------|
| **Own business rules** | Single source of truth for domain logic |
| **Expose documented interfaces** | Contracts with version [ENG-DS18] |
| **Be independently testable** | Unit + integration without full app |
| **Support dependency injection** | Test doubles · swappable repos |
| **Be observable** | Health · metrics · events [ENG-DS22] |
| **Be permission-aware** | PRE at service entry [PRE-001] |
| **Avoid unrelated domains** | Call other services — no cross-schema writes |

---

## ENG-DS06 — Core Domain Services Overview

**[ENG-DS06]** The COS is composed of **sixteen core domain services** — refines [ENG-002]'s fourteen by elevating **Leadership** and **Story** to first-class services.

| # | Service | Schema domain | ENG-002 ref |
|---|---------|---------------|-------------|
| 1 | Identity | `identity` | ENG-SA-SVC-01 |
| 2 | Registry | `registry` | ENG-SA-SVC-02 |
| 3 | Community | `community` | ENG-SA-SVC-03 |
| 4 | Mission | `mission` | ENG-SA-SVC-04 |
| 5 | Experience | `experience` | ENG-SA-SVC-05 |
| 6 | Opportunity | `opportunity` | ENG-SA-SVC-07 |
| 7 | Growth | `growth` | ENG-SA-SVC-06 |
| 8 | Leadership | `community` + `growth` edges | **New first-class** |
| 9 | Knowledge | `knowledge` | ENG-SA-SVC-08 |
| 10 | Story | `knowledge` (story tables) | **New first-class** |
| 11 | Capacity | `capacity` | ENG-SA-SVC-09 |
| 12 | Partnership | `partnership` | ENG-SA-SVC-10 |
| 13 | Communication | platform + domain hooks | ENG-SA-SVC-12 |
| 14 | Intelligence | `intelligence` | ENG-SA-SVC-11 |
| 15 | Search | search projections | ENG-SA-SVC-13 |
| 16 | Media | `platform` + storage | ENG-SA-SVC-14 |

**Catalog:** [Service Registry](SERVICE_REGISTRY.md) [SRG-001] · `data/registry/service-registry.json`

---

## ENG-DS07 — Identity Service

**[ENG-DS07]** **Owns:** Participants · profiles · authentication references · sessions · preferences · privacy settings

**Never owns:** Missions · communities · stories

**Path:** `services/identity/` · kernel: `src/lib/kernel/identity/`  
**Phase:** PEP-001 · PHQ-001 · ENG-006

---

## ENG-DS08 — Registry Service

**[ENG-DS08]** **Owns:** Counties · educational institutions · community registry · geographic hierarchy · community types

**Provides:** Canonical **reference data** — read-heavy, statewide scope [ADT-001]

**Path:** `services/registry/` · **Never owns:** Membership rules (→ Community)

---

## ENG-DS09 — Community Service

**[ENG-DS09]** **Owns:** Communities · committees · membership · community settings · leadership **assignments** (records) · community lifecycle

**[ENG-DS09a]** Authoritative source for **community state** [COS-001 · CCN-001]

**Path:** `services/community/` · Leadership **pathways** owned by Leadership Service

---

## ENG-DS10 — Mission Service

**[ENG-DS10]** **Owns:** Missions · projects · tasks · milestones · mission templates · Mission Operating Records [ACN-001]

**Coordinates:** Work execution [MDS-001 · EOS-001 · STS-001]

**Path:** `services/mission/`

---

## ENG-DS11 — Experience Service

**[ENG-DS11]** **Owns:** Events · registration · attendance · agendas · check-in · calendar scheduling

**Supports:** In-person and virtual experiences [EEOS-001 · TSOS-001]

**Path:** `services/experience/`

---

## ENG-DS12 — Opportunity Service

**[ENG-DS12]** **Owns:** Volunteer opportunities · open positions · community needs · assignments · matching workflows

**Connects:** People with opportunities [OEX-001 · OBE-001 · VDS-001]

**Path:** `services/opportunity/`

---

## ENG-DS13 — Growth Service

**[ENG-DS13]** **Owns:** Invitations · QR identities · welcome journeys · belonging checkpoints · outreach campaigns · community expansion

**Supports:** Sustainable growth [ICS-001 · GOS-001 · WBS-001 · CP-016]

**Path:** `services/growth/` · **Does not own:** Leadership development pathways (→ Leadership)

---

## ENG-DS14 — Leadership Service

**[ENG-DS14]** **Owns:** Leadership pathways · mentorship · leadership succession · leadership opportunities · Community Builder development [CLD-001]

**[ENG-DS14a]** Leadership is a **distinct domain** — not folded into Community or Growth alone.

**Path:** `services/leadership/` · Collaborates with Community (assignments) · Growth (invitations)

---

## ENG-DS15 — Knowledge Service

**[ENG-DS15]** **Owns:** Community Brain · lessons learned · playbooks · Mission Library · knowledge articles · legacy entries [CKLS-001 · LIS-001 · CLS-001]

**Preserves:** Institutional knowledge · **Does not own:** Narrative stories (→ Story Service)

**Path:** `services/knowledge/`

---

## ENG-DS16 — Story Service

**[ENG-DS16]** **Owns:** Stories · Story Atlas · testimonials · community history · media narratives [CST-001]

**[ENG-DS16a]** Stories remain **separate from operational records** — cultural memory, not mission execution data.

**Path:** `services/story/` · Uses Media Service for assets

---

## ENG-DS17 — Capacity Service

**[ENG-DS17]** **Owns:** Skills · equipment · facilities · transportation · resource availability · shared assets [CCS-001 · CCE-001]

**Path:** `services/capacity/`

---

## ENG-DS18 — Partnership Service

**[ENG-DS18]** **Owns:** Institutional partners · community partners · collaboration records · partnership opportunities · shared initiatives [IPS-001 · SCN-001]

**Path:** `services/partnership/`

---

## ENG-DS19 — Communication Service

**[ENG-DS19]** **Owns:** Notifications · announcements · digests · messaging preferences · communication history [CAM-001 · CCNET-001]

**Does not own:** Participant identity · **Routes through** kernel notification hooks [ENG-SA04]

**Path:** `services/communication/`

---

## ENG-DS20 — Intelligence Service

**[ENG-DS20]** **Owns:** Operational · growth · network intelligence · explainable recommendations · forecast summaries [OPIS-001 · CGIS-001 · NISS-001]

**[ENG-DS20a]** **Never becomes canonical truth** — reads evidence · writes only to `intelligence` schema with refs [ENG-DB16 · AIB-001]

**Path:** `services/intelligence/`

---

## ENG-DS21 — Search Service

**[ENG-DS21]** **Owns:** Search indexing · discovery · filtering · ranking · search suggestions [ENG-010]

**Provides:** Unified search experience · **Does not own** source entities

**Path:** `services/search/`

---

## ENG-DS22 — Media Service

**[ENG-DS22]** **Owns:** Images · documents · videos · file metadata · upload workflows [CST-001 consent]

**Independent:** From business domains — other services store `media_id` references only

**Path:** `services/media/`

---

## ENG-DS23 — Service Contracts

**[ENG-DS23]** Every service exposes a **documented public contract**:

| Contract element | Purpose |
|------------------|---------|
| Supported operations | Method catalog |
| Required inputs | Typed parameters |
| Expected outputs | DTOs / events |
| Error conditions | Structured errors [ENG-DS26] |
| Permission requirements | PRE keys per operation |
| Version | Semver · breaking change policy |

**[ENG-DS23a]** Contracts prevent accidental coupling [ENG-005 API · RCN-03 Zod + types].

**Location:** `services/{domain}/contracts/` · registered in [SRG-001](SERVICE_REGISTRY.md)

---

## ENG-DS24 — Service Communication

**[ENG-DS24]** Preferred flow:

```text
Application Layer
        ↓
Domain Service
        ↓
Another Domain Service (when necessary)
        ↓
Repository
        ↓
Database
```

**[ENG-DS24a]** **Direct database access across domains is forbidden** — call owning service's public interface [RCN-001].

**[ENG-DS24b]** Platform Kernel is invoked by services — not bypassed for auth, events, or audit.

---

## ENG-DS25 — Domain Ownership

**[ENG-DS25]** Every piece of business data has **exactly one owner**:

| Data | Owner |
|------|-------|
| Communities | Community Service |
| Stories | Story Service |
| Leadership pathways | Leadership Service |
| Events | Experience Service |
| Lessons / playbooks | Knowledge Service |
| Volunteer opportunities | Opportunity Service |

**[ENG-DS25a]** Ownership prevents **conflicting business rules**.

---

## ENG-DS26 — Cross-Domain Collaboration

**[ENG-DS26]** Workflows span services — **Application Layer orchestrates**; each service retains domain ownership.

**Example — Launch community:**

| Step | Service |
|------|---------|
| Validate county/institution | Registry |
| Create community record | Community |
| Assign founding leadership | Leadership |
| Seed welcome journey | Growth |
| Create charter knowledge entry | Knowledge |
| Notify participants | Communication |

**[ENG-DS26a]** Use **saga-style orchestration** in application layer — not distributed monolithic transactions [ENG-DS27].

---

## ENG-DS27 — Event Publishing

**[ENG-DS27]** Services publish **domain events** to `platform.domain_events` [ENG-DB26]:

`CommunityCreated` · `MissionCompleted` · `ParticipantJoined` · `StoryPublished` · `LeadershipAssigned` · `KnowledgeCaptured`

**[ENG-DS27a]** Other services **react** via event handlers — no synchronous tight coupling [ENG-009].

**Event catalog:** [Service Registry](SERVICE_REGISTRY.md) per-service `eventsPublished` / `eventsConsumed`

---

## ENG-DS28 — Transaction Philosophy

**[ENG-DS28]** Transactions remain **as small as practical** — single service · single aggregate where possible.

**[ENG-DS28a]** Long-running workflows use **application orchestration** + idempotent steps — not large multi-table DB transactions across domains.

---

## ENG-DS29 — Error Handling

**[ENG-DS29]** Every service returns **structured errors**:

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Input failed rules |
| `PERMISSION_DENIED` | PRE denied [PRE-001] |
| `NOT_FOUND` | Resource missing |
| `CONFLICT` | State conflict · optimistic lock |
| `DEPENDENCY_UNAVAILABLE` | Downstream service down |
| `INTERNAL_ERROR` | Unexpected failure |

**[ENG-DS29a]** Consistent shape across platform — mapped to HTTP in [ENG-005 API](API_ARCHITECTURE.md) when built.

---

## ENG-DS30 — Observability

**[ENG-DS30]** Every service exposes:

Health status · performance metrics · error rates · audit logs · domain events

**[ENG-DS30a]** Built in from the beginning [ENG-SA-L9 Observability · OLB-001]

---

## ENG-DS31 — Versioning

**[ENG-DS31]** Public contracts support **versioning**:

Breaking changes require documentation · migration guidance · compatibility review [ENG-D13]

---

## ENG-DS32 — Future AI Assistance

**[ENG-DS32]** AI may:

Recommend orchestration improvements · explain service interactions · generate documentation · assist debugging · identify architectural smells

**[ENG-DS32a]** AI **must never silently modify service behavior** [AIB-001 · ENG-D15]

---

## ENG-DS33 — Service Registry

**[ENG-DS33]** The **[Service Registry](SERVICE_REGISTRY.md) [SRG-001]** catalogs every domain service — architectural map of the COS.

**Per service:** name · purpose · owning domain · contract · events published/consumed · dependencies · version · health · documentation · maintainer

**[ENG-DS33a]** Developers and AI assistants use the registry to know **where features belong** and **how services interact**.

**Live catalog:** `data/registry/service-registry.json`

---

## ENG-DS34 — Burt Implementation Guidance

**[ENG-DS34]** Implementation should:

- Build **one service per business domain**
- Keep **business logic inside services**
- Use **contracts** for all public interfaces
- **Publish domain events** rather than tight coupling
- Maintain **clear ownership boundaries**
- Design services to **evolve independently**
- Register every new service in **SRG-001** before merge [RCN-001]

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ENG-002 System Architecture](SYSTEM_ARCHITECTURE.md) | Layers · kernel · 14→16 service refinement |
| [PRE-001](PERMISSION_RESOLUTION_ENGINE.md) | Permission checks at service boundary |
| [ENG-005 API](API_ARCHITECTURE.md) | HTTP exposure of service contracts [pending] |
| [ENG-008 CKG](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) | Graph edges from service events |
| [ENG-009 Events](EVENT_TIMELINE_ARCHITECTURE.md) | Event consumption patterns |

---

## AC-091 — Acceptance Criteria

Volume 1.7 is complete when:

- [x] **[AC-091a]** Core domain services defined (16 services). `[ENG-DS06–ENG-DS22]`
- [x] **[AC-091b]** Service ownership rules documented. `[ENG-DS25]`
- [x] **[AC-091c]** Communication patterns and contracts established. `[ENG-DS23, ENG-DS24]`
- [x] **[AC-091d]** Cross-domain collaboration specified. `[ENG-DS26, ENG-DS27]`
- [x] **[AC-091e]** Service Registry specified. `[ENG-DS33, SRG-001]`
- [x] **[AC-091f]** Burt has blueprint for business logic architecture. `[domain-service-architecture.json]`

---

**Note:** Steps **1.5 API** [ENG-005] remains pending — services expose contracts; API layer maps HTTP when built.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.8 — Community Knowledge Graph](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008]

**End of Volume 1.7 — Domain Service Architecture.**
