# VOLUME 0 — Community Operating System

# Master Architecture Bible

**Document ID:** VOLUME-000 · **MAB-001**  
**Artifact:** `MASTER_ARCHITECTURE_BIBLE.md`  
**Status:** Canonical Source of Truth  
**Priority:** Highest  
**Read Before Any Code Is Written**

> **Burt: This is the very first file you read.** Constitution · Encyclopedia · Engineering Handbook · Product Manual · Operating Standard.

**Live spec:** `data/registry/master-architecture-bible.json`  
**Requirements registry:** `data/requirements-registry.json`  
**Living systems:** `data/living-systems.json`

---

## Precedence

**[MAB-00]** Every design decision should be **traceable back to this document**.

**[MAB-00a]** When implementation documents conflict, **this document takes precedence** unless a newer approved revision explicitly supersedes it.

**[MAB-00b]** Phase documents (1–6) remain authoritative for **module detail**; Volume 0 is authoritative for **terminology, boundaries, standards, and coherence**.

**[MAB-00c]** Traceability motto [TR-MOTTO]: *If it cannot be traced, it should not be built.*

---

## MAB-M01 — Purpose

**[MAB-M01]** The Master Architecture Bible defines the **philosophy, architecture, terminology, engineering standards, governance model, design principles, and implementation order** for the entire **Community Operating System (COS)**.

**[MAB-M01a]** Exists so that:

- Every developer shares the same understanding
- Every AI assistant uses the same terminology
- Every new feature aligns with the original vision
- Every future expansion remains architecturally consistent
- The system can evolve for **decades without losing coherence**

---

## The COS Distinction [MAB-M01b]

This project is no longer merely a **platform** — it is a **Community Operating System**.

| Term | Meaning |
|------|---------|
| **Platform** | Something people use |
| **Operating System** | Something everything else runs on |

The long-term vision: a **reusable operating system** for healthy, relationship-centered communities — supporting educational institutions, counties, civic organizations, and partners while **preserving local identity and autonomy** [PCN-M17 · CCN-M004].

---

## Why Volume 0 Exists

Architecture is distributed across **dozens of implementation documents** (Phases 1–6, 102 build steps). Coding from dozens of sources invites inconsistency.

**Volume 0 unifies** vision, vocabulary, entities, relationships, standards, and build order into **one permanent reference manual** (500–1,000+ pages over time; v1 establishes canonical structure and core content).

---

## Requirement Index — Sections A–T

| Section | ID | Title |
|---------|-----|-------|
| A | MAB-A | Vision & Philosophy |
| B | MAB-B | Community Constitution |
| C | MAB-C | Canonical Vocabulary |
| D | MAB-D | Domain Architecture |
| E | MAB-E | Entity Dictionary |
| F | MAB-F | Relationship Model |
| G | MAB-G | Community Knowledge Graph |
| H | MAB-H | Data Standards |
| I | MAB-I | UI/UX Constitution |
| J | MAB-J | Public Experience Standards |
| K | MAB-K | AI Constitution |
| L | MAB-L | Security Constitution |
| M | MAB-M | Engineering Standards |
| N | MAB-N | Integration Standards |
| O | MAB-O | Performance Standards |
| P | MAB-P | Build Order |
| Q | MAB-Q | Testing Constitution |
| R | MAB-R | Documentation Standards |
| S | MAB-S | Launch Standards |
| T | MAB-T | Future Expansion |
| — | MAB-M21 | Burt's First Rule |
| — | AC-076 | Volume 0 acceptance criteria |

---

# Section A — Vision & Philosophy [MAB-A]

**[MAB-A01]** Why the platform exists · problems it solves · long-term vision · design philosophy.

### North Star [NS-013]

> **Does this help us reach the North Star?**

Connect Locally · Organize Statewide · Lead Together. Arkansas students and communities build **relationship-centered civic power** [BUILD-BIBLE · PHASE-001.2].

### Core themes

| Theme | Source |
|-------|--------|
| Relationship-first organizing | PHASE-001.5 Organizing Model |
| Community-centered growth | GCN-001 Growth Constitution |
| Human-centered technology | PEL-001 · CP-001 People First |
| Local leadership | CCN-M004 · GCN-M05 Community Before Scale |
| Statewide collaboration | SCN-001 · IPS-001 |
| Belonging over engagement | GCN-M03 · WBS-001 |
| Knowledge compounds | CKLS-001 · LIS-001 |
| Stories preserve culture | CST-001 · CLS-001 |
| Self-expanding network | GOS-001 Level 6 readiness |

### Six-phase architecture (complete)

```text
Volume 0  Master Architecture Bible     ← WHAT (product constitution)
Volumes 1–6 Implementation Bibles      ← HOW (factory layer) [IVS-001]
Phase 1   Constitutional Foundation     Why do we exist?
Phase 2   Arkansas Registry             What exists?
Phase 3   Human Operating System        Who participates?
Phase 4   Community Operating System    Where do people organize?
Phase 5   Action Operating System       How does work get done?
Phase 6   Growth Operating System       How does the platform grow itself?
Phase 7+  Intelligence · Platform · Experience (deferred — expand Volumes 1–6 first)
```

**Detail:** [LIVING-SYSTEMS-ARCHITECTURE.md](LIVING-SYSTEMS-ARCHITECTURE.md)

---

# Section B — Community Constitution [MAB-B]

**[MAB-B01]** Permanent constitutional framework — platform and community layers.

### Platform constitution

Phase 1 [BUILD-BIBLE.md](../build-steps/BUILD-BIBLE.md) · Core Principles CP-001–CP-020 · Guardrails DG-001–DG-015 · Constitutional Test CT-001.

### Community constitution

[Community Constitution CCN-001](../phase-04/COMMUNITY_CONSTITUTION.md) — every community **inherits**; local autonomy preserved.

### Action & growth constitutions

| Constitution | Scope |
|--------------|-------|
| [Action Constitution ACN-001](../phase-05/ACTION_CONSTITUTION.md) | How work gets done |
| [Growth Constitution GCN-001](../phase-06/GROWTH_CONSTITUTION.md) | How the network grows |

### Governance commitments

- **Decision principles** [CDS-001 collaborative decisions]
- **Privacy commitments** [SEC-001 · KDG-001]
- **Community autonomy** [CCN-M004 · IPS-M10]
- **Transparency** [GCN-M06 · NISS-M12 explainability]
- **Trust model** [Trust Center Phase 3]
- **Ethics** [DG-* guardrails]
- **AI principles** [MAB-K · GCN-M15]
- **Expansion principles** [CEF-M16 Mutual Strengthening · IPS-M14 Mutual Value · LCN-M17 Open Door]

---

# Section C — Canonical Vocabulary [MAB-C]

**[MAB-C01]** Every term defined **once**. All features use these definitions.

| Term | Definition | Primary doc |
|------|------------|-------------|
| **Participant** | A person in the network with persistent identity [PEP-001] | Participant Identity |
| **Community** | A place where people organize — campus, county, team, initiative [COS-001] | Community OS |
| **Mission** | A defined piece of work with purpose, participants, and outcomes [MPS-001 · ACN-001] | Action OS |
| **Initiative** | Multi-community coordinated effort [IOS-001] | Action OS |
| **Opportunity** | Something a participant can do — volunteer, learn, lead [OEX-001] | Community OS |
| **Experience** | An event or gathering with lifecycle [EEOS-001] | Action OS |
| **Committee** | Team type within community [TWG-001] | Community OS |
| **Mentor** | Experienced participant developing others [CLD-001 · LCN-001] | Growth OS |
| **Volunteer** | Participant serving on mission/experience [VDS-001] | Action OS |
| **Leadership** | Service-based development path, not titles [CLD-001 · PGL-001] | Human/Growth OS |
| **Community Brain** | Shared knowledge repository [CKLS-M16] | Community OS |
| **Story Atlas** | Geographic narrative layer [CST-M16] | Action OS |
| **Opportunity Exchange** | Community needs and offers [OEX-001] | Community OS |
| **Community Foundry** | Guided launch of new community [CEF-M15] | Growth OS |
| **Community Genome** | Shared DNA every community instantiates [GOS-M10] | Growth OS |
| **Belonging** | Participant feels part of community — not just registered [GCN-M16 Belonging Index] | Growth OS |
| **Partnership** | Institution-community collaboration [IPS-001] | Growth OS |
| **Playbook** | Reusable how-to from experience [CKLS-001 · EEOS-001] | Action OS |
| **Legacy** | Long-term community memory [CLS-001] | Community OS |
| **Impact Chain** | How actions led to change [CIIS-M16] | Action OS |
| **Network Twin** | Statewide strategic ecosystem model [NISS-M16] | Growth OS |

*Full glossary expands in registry and future MAB revisions.*

---

# Section D — Domain Architecture [MAB-D]

**[MAB-D01]** Every major subsystem — clear boundaries and responsibilities.

| Domain | Phase | Question | Umbrella req |
|--------|-------|----------|--------------|
| **Human Operating System** | 3 | Who participates and how do they grow? | Human OS modules |
| **Community Operating System** | 4 | Where do people organize? | COS-001 |
| **Action Operating System** | 5 | How does work get done? | AOS-001 |
| **Growth Operating System** | 6 | How does the platform grow itself? | GOS-001 |
| **Learning System** | 4–5 | How does knowledge compound? | CKLS-001 · LIS-001 |
| **Intelligence Systems** | 4–7 | How do we understand and guide? | CIS-001 · OPIS-001 · NISS-001 |
| **Knowledge Systems** | 4–5 | What do we preserve? | CKLS-001 · CLS-001 |
| **Story Systems** | 5 | How do we remember? | CST-001 |
| **Capacity Systems** | 5 | What can we do? | CCS-001 · CCE-001 |
| **Partnership Systems** | 4–6 | How do institutions connect? | SCN-001 · IPS-001 |
| **Public Network** | 6 | How do outsiders discover and join? | PCN-001 |
| **Lifelong Community** | 6 | How do relationships persist? | LCN-001 |

**Rule:** Domains **integrate** via orchestrators and Community Knowledge Graph — domains do not duplicate source of truth [NISS-BG aggregation layer].

---

# Section E — Entity Dictionary [MAB-E]

**[MAB-E01]** Every primary entity includes: purpose · attributes · relationships · lifecycle · ownership · permissions.

| Entity | Purpose | Lifecycle ref | DB prefix |
|--------|---------|---------------|-----------|
| Participant | Person in network | JRN-001 · PEP-001 | DB-USERS |
| Community | Organizing home | COS-001 · CCN-001 | DB-NETWORKS |
| County | Geographic organizing unit | REG-001 | DB-COUNTIES |
| Educational Institution | Campus anchor | INST-001 | DB-INSTITUTIONS |
| Mission | Defined work unit | MPS-001 · ACN-001 | DB-MISSIONS |
| Initiative | Multi-community effort | IOS-001 | DB-IOS |
| Project / Task | Execution units | EOS-001 | DB-EOS |
| Event / Experience | Time-bound gathering | EEOS-001 | DB-EEOS |
| Committee / Team | Working group | TWG-001 | DB-TEAMS |
| Story | Narrative artifact | CST-001 | DB-CST |
| Lesson | Improvement record | LIS-001 | DB-LIS |
| Opportunity | Discoverable action | OEX-001 | DB-OPPORTUNITIES |
| Playbook | Reusable knowledge | CKLS-001 | DB-KNOWLEDGE |
| Capacity | What community can deploy | CCS-001 | DB-CAPABILITIES |
| Partnership | Institution relationship | IPS-001 | DB-IPS |
| Decision | Recorded choice | CDS-001 | DB-CDS |
| Legacy event | Historical marker | CLS-001 | DB-LEGACY |

**Ownership:** Communities own community-scoped entities [CCN-M004]. Participants own personal data [SEC-001]. Platform owns registry and cross-cutting infrastructure.

---

# Section F — Relationship Model [MAB-F]

**[MAB-F01]** The entire COS is built around **relationships** — not siloed records.

| Relationship | Example edge | Graph |
|--------------|--------------|-------|
| Participant ↔ Community | member_of · serves | Relationship Graph |
| Participant ↔ Participant | invited · mentors · knows | PRN-001 · PON-001 |
| Mission ↔ Initiative | part_of | Operational Graph |
| Volunteer ↔ Event | served_at | VDS-001 |
| Story ↔ Mission | documents | Story systems |
| Community ↔ County | located_in | REG-001 |
| Institution ↔ Community | partners_with | Partnership Graph |
| Mentor ↔ Participant | develops | Generational Graph |
| Decision ↔ Mission | governs | Decision Graph |
| Lesson ↔ Playbook | improves | Improvement Graph |

**Orchestrator pattern:** `getX()` functions in `src/lib/{domain}/` — never bypass permission layer.

---

# Section G — Community Knowledge Graph [MAB-G]

**[MAB-G01]** One unified graph [NISS-M17 · GOS-M16] — foundational architecture.

### Node types (non-exhaustive)

People · Communities · Institutions · Missions · Initiatives · Stories · Events · Playbooks · Opportunities · Capabilities · Partnerships · Decisions · Legacy markers

### Unified graph layers

Relationship · Trust · Growth · Conversation · Capability · Decision · Improvement · Operational · Impact · Generational · Partnership

**Route:** `/network/graph` · **Orchestrator:** `getCommunityKnowledgeGraph()` · alias `getLivingNetworkGraph()`

**Strategic interface:** Statewide Network Twin `/network/twin` [NISS-M16]

**Principle:** Graph is **underlying model** — not primary end-user UI most of the time [NISS-M17g].

---

# Section H — Data Standards [MAB-H]

**[MAB-H01]** Consistency rules for all domains.

| Standard | Rule |
|----------|------|
| **Naming** | kebab-case routes · camelCase JSON · snake_case DB · requirement IDs `{PREFIX}-{NNN}` |
| **Identifiers** | UUID primary keys · slug for public URLs · requirement trace on every feature |
| **Versioning** | Semantic versioning for registries · doc versionHistory in requirements-registry |
| **Metadata** | created_at · updated_at · created_by · community_id scope |
| **Audit history** | Status transitions [STS-001] · decision records [CDS-001] |
| **Archiving** | Soft delete default · legacy preservation [CLS-001] |
| **Ownership** | Every record has owning community or participant scope |
| **Classification** | public · community · private [KDG-M16 · PCN-M14] |

**Registry:** `data/requirements-registry.json` · `domainPrefixes` array.

---

# Section I — UI/UX Constitution [MAB-I]

**[MAB-I01]** No feature invents its own design language.

| Standard | Requirement |
|----------|-------------|
| **Navigation** | Personal HQ · Community Command Center · Action · Growth · Public discovery |
| **Mobile-first** | All flows designed mobile-first [CCC-M22 · PEL-001] |
| **Accessibility** | WCAG-oriented · required not optional [MAB canonical principle 13] |
| **Typography / spacing / color** | Tailwind design tokens · brand palette · community personality accents within guidelines [PCN-M17] |
| **Interaction patterns** | Cards · progressive disclosure · explainable intelligence |
| **Empty states** | Guide next action — never dead ends |
| **Loading / error** | Human-readable · no silent failures |

**Parallel UIs:** Personal Command Center [PCC-001] ↔ Community Command Center [CCC-001].

---

# Section J — Public Experience Standards [MAB-J]

**[MAB-J01]** Public layer standards [PCN-001].

- Public community · institution · county profiles
- Arkansas Community Explorer `/explore` [PCN-M16]
- Opportunity Explorer · Story showcase · Join pathways
- **SEO** · structured metadata · sitemap
- **Performance** · fast first paint on mobile
- **Trust signals** · clear attribution · no implied institutional endorsement [PCN-M05c]
- **Privacy** — only intentionally public content [PCN-M14]

---

# Section K — AI Constitution [MAB-K]

**[MAB-K01]** AI **advises; people decide** [canonical principle 10 · GCN-M15].

| Rule | Application |
|------|-------------|
| Human oversight | Communities approve AI-generated public content |
| Explainability | Every insight answers why [NISS-M12 · CGIS-M13] |
| Privacy | No training on private community data without consent [KDG-001] |
| Operational intelligence | OPIS-001 advisory only |
| Growth intelligence | NISS-001 · CGIS-001 — recommendations not commands |
| No hidden decision-making | AI never makes partnership, leadership, or governance decisions |
| Future agents | Local AI · shared AI — governed by same constitution |

---

# Section L — Security Constitution [MAB-L]

**[MAB-L01]** [SEC-001 · KDG-001 · Trust Center Phase 3]

- **Authentication** — secure identity [PEP-001]
- **Authorization** — role-based · community-scoped · least privilege
- **Permissions** — enforced at query layer for intelligence [NISS-M13]
- **Consent** — opt-in for career sharing, public stories, partnerships
- **Encryption** — in transit and at rest (production requirement)
- **Audit logs** — sensitive actions logged
- **Data ownership** — participants own personal data · communities own community data
- **Safety principles** — reporting · moderation pathways [future]

---

# Section M — Engineering Standards [MAB-M]

**[MAB-M01-ENG]** [PHASE-001.8 Implementation Doctrine · ED-*]

| Area | Standard |
|------|----------|
| Repository | Next.js app · `docs/` canonical · `data/registry/` live specs |
| Folder structure | `src/lib/{domain}/` orchestrators · `src/components/` UI |
| Naming | Match requirement IDs in commits |
| Testing | [MAB-Q] — traceability tests required |
| Documentation | Every feature updates registry + BUILD-LOG |
| API style | REST · typed · error codes · permission checks |
| Configuration | Environment variables · no secrets in repo |
| Deployment | Netlify · CI build gate |
| Observability | Logging · error boundaries (production) |

**Production gate:** [TR-MOTTO] — traced in requirements-registry before code ships.

---

# Section N — Integration Standards [MAB-N]

**[MAB-N01]** External connectors — consistent patterns.

| Integration | Status | Notes |
|-------------|--------|-------|
| Calendars | Planned | TSOS-001 export/import |
| Email | Planned | Invitation · notifications [CAM-001] |
| Maps | In progress | Arkansas registry · explorer maps |
| Authentication | Planned | SSO future |
| Storage | Planned | Story media [CST-001] |
| AI | Architecture defined | MAB-K |
| External APIs | Future connectors | Document in registry |

---

# Section O — Performance Standards [MAB-O]

**[MAB-O01]** Scalability target: **2 students to 20,000 without architectural redesign** [GOS-001 · CEF-M01].

- **Caching** — map tiles · public profiles · graph aggregations
- **Search** — statewide search Phase 7
- **Large datasets** — paginated feeds · graph scope limits
- **Knowledge Graph** — query by scope · never load full graph to client
- **Offline** — progressive enhancement mobile (future)
- **Maps** — layer toggles · lazy load

---

# Section P — Build Order [MAB-P]

**[MAB-P01]** Nothing built out of order. Burt follows:

### 1. Read Volume 0 (this document)

### 2. Read BUILD-BIBLE Phase 1 constitution

### 3. Implementation sequence

```text
Volume 0   Master Architecture Bible          ← canonical source of truth (WHAT)
Volumes 1–6 Implementation Bibles             ← factory layer (HOW) [IVS-001]
Phase 1    Constitution (1.1–1.9)              ← DONE (design)
Phase 2    Digital Arkansas (2.x)               ← DONE (design)
Phase 3    Human OS (3.x)                       ← DONE (design)
Phase 4    Community OS (4.1–4.14)             ← DONE (design)
Phase 5    Action OS (5.1–5.14)                 ← DONE (design)
Phase 6    Growth OS (6.1–6.14)                ← DONE (design)
Phase 7+   Intelligence · Platform · Experience ← DEFERRED until Volumes 1–6 expanded
Production Vertical slices per ED-VS          ← after Volume 0 + Volumes 1–6 read
```

### 4. Validation gates

- Requirement in registry [TR-BR checklist]
- Orchestrator specified in domain doc
- Permission model identified
- BUILD-LOG entry on completion

**Master progress:** `data/build-progress.json` · **102+ build steps**

---

# Section Q — Testing Constitution [MAB-Q]

**[MAB-Q01]** Every shipped capability requires:

| Test type | Scope |
|-----------|-------|
| Unit tests | Orchestrators · pure logic |
| Integration tests | API · DB · permissions |
| UAT | Community launch scenarios |
| Accessibility | WCAG checks |
| Security | Permission boundaries |
| Performance | Map · search · graph queries |
| Mobile | Primary flows |
| Community launch | Foundry · welcome · first mission |

**Trace tests:** TEST-{PREFIX}-{NNN} in requirements-registry.

---

# Section R — Documentation Standards [MAB-R]

**[MAB-R01]** Every feature must include:

- Architecture (phase doc + registry JSON)
- User guide (when user-facing)
- Administrator guide (community leaders)
- Developer guide (orchestrator + DB)
- API documentation (when endpoints exist)
- Future AI documentation (explainability notes)

**BUILD-LOG:** `docs/build-log/BUILD-LOG.md` — chronological record.

---

# Section S — Launch Standards [MAB-S]

**[MAB-S01]** Progressive launch model.

| Stage | Scope |
|-------|-------|
| Beta | Leader testing · single community |
| Pilot | Campus or county · Foundry launch |
| Campus launch | Full community genome · readiness Level 2+ |
| County launch | Multi-community county hub |
| Statewide launch | Network readiness Level 5+ |
| Certification | COS-001 · AOS-001 · GOS-001 readiness dashboards |
| Rollback | Documented revert procedures |

**Launch checklist:** `data/launch-readiness.json` · LS-CHK Phase 1.

---

# Section T — Future Expansion [MAB-T]

**[MAB-T01]** Architecture designed for:

- Additional educational institutions · community types [CEF-001]
- Neighboring states · national expansion [registry pattern]
- Additional languages [PCN future · MAB-K]
- Future technologies · AI agents [MAB-K]
- Interstate without redesign [GOS-M07 · configurable not hard-coded]

**Community Genome** ensures new communities instantiate proven structure [GOS-M10].

---

# Canonical Principles [MAB-CP]

Every feature must satisfy:

1. People before technology.
2. Relationships before transactions.
3. Belonging before engagement.
4. Communities before organizations.
5. Service before recognition.
6. Transparency before complexity.
7. Local leadership before centralized control.
8. Knowledge should compound.
9. Stories preserve culture.
10. AI advises; people decide.
11. Privacy is foundational.
12. Mobile-first by default.
13. Accessibility is required.
14. Every community has equal value.
15. Every participant can become a leader.
16. Every completed mission improves the next.
17. Growth is earned through trust.
18. The platform should become simpler as it becomes more capable.
19. The platform must remain configurable rather than hard-coded.
20. Every architectural decision should make future expansion easier.

*Aligns with CP-* constitutional principles · extends with COS-specific commitments.*

---

# MAB-M21 — Burt's First Rule

Before implementing **any** feature, ask:

1. **Does this align with the Constitution?**
2. **Does it strengthen relationships?**
3. **Will it still make sense five years from now?**
4. **Does it simplify the platform rather than complicate it?**

If any answer is **no** — reconsider implementation [ED-GR design first].

**Evaluation question [PEL-M13]:** *Does this strengthen relationships, deepen belonging, and help people grow into community builders?*

---

# Implementation Document Index

| Volume/Phase | Master document |
|--------------|-----------------|
| **Volume 0** | This document |
| **Volumes 1–6** | [VOLUMES-INDEX.md](VOLUMES-INDEX.md) [IVS-001] |
| Volume 1 | [ENGINEERING_ARCHITECTURE_BIBLE.md](ENGINEERING_ARCHITECTURE_BIBLE.md) [EAB-001] |
| Volume 2 | [DATA_ARCHITECTURE_BIBLE.md](DATA_ARCHITECTURE_BIBLE.md) [DAB-001] |
| Volume 3 | [USER_EXPERIENCE_BIBLE.md](USER_EXPERIENCE_BIBLE.md) [UXB-001] |
| Volume 4 | [AI_INTELLIGENCE_BIBLE.md](AI_INTELLIGENCE_BIBLE.md) [AIB-001] |
| Volume 5 | [OPERATIONS_LAUNCH_BIBLE.md](OPERATIONS_LAUNCH_BIBLE.md) [OLB-001] |
| Volume 6 | [EXPERIENCE_DESIGN_BIBLE.md](EXPERIENCE_DESIGN_BIBLE.md) [EDB-001] |
| Phase 1 | [BUILD-BIBLE.md](../build-steps/BUILD-BIBLE.md) |
| Phase 2 | [PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md) |
| Phase 3 | [PHASE_3_MASTER_SEQUENCE.md](../phase-03/) |
| Phase 4 | [PHASE_4_MASTER_SEQUENCE.md](../phase-04/PHASE_4_MASTER_SEQUENCE.md) |
| Phase 5 | [PHASE_5_MASTER_SEQUENCE.md](../phase-05/PHASE_5_MASTER_SEQUENCE.md) |
| Phase 6 | [PHASE_6_MASTER_SEQUENCE.md](../phase-06/PHASE_6_MASTER_SEQUENCE.md) |
| Living systems | [LIVING-SYSTEMS-ARCHITECTURE.md](LIVING-SYSTEMS-ARCHITECTURE.md) |

---

# AC-076 — Acceptance Criteria

Volume 0 v1 is complete when:

- [x] **[AC-076a]** Volume 0 purpose and precedence established. `[MAB-M01, MAB-00]`
- [x] **[AC-076b]** Sections A–T structure documented. `[MAB-A through MAB-T]`
- [x] **[AC-076c]** Canonical principles and Burt's First Rule established. `[MAB-CP, MAB-M21]`
- [x] **[AC-076d]** COS distinction explicit. `[MAB-M01b]`
- [x] **[AC-076e]** Core vocabulary, entities, domains, and graph specified. `[MAB-C–G]`
- [x] **[AC-076f]** Engineering, security, AI, and build order standards defined. `[MAB-H–P]`
- [x] **[AC-076g]** Live registry and Burt read-first path established. `[master-architecture-bible.json]`

---

**End of Volume 0 v1.** · *Expand sections over time toward 500–1,000+ pages. Begin production code only after reading this document and BUILD-BIBLE.*
