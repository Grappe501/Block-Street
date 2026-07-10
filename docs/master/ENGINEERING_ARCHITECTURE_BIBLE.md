# VOLUME 1 — Engineering Architecture Bible

**Document ID:** VOLUME-001 · **EAB-001**  
**Status:** In Progress (13/14 steps · 1.5 API pending)  
**Priority:** Critical — defines how Burt technically builds the COS

> **What is the software architecture?**

**Master sequence:** [VOLUME_1_MASTER_SEQUENCE.md](../volume-01/VOLUME_1_MASTER_SEQUENCE.md)  
**Live spec:** `data/registry/engineering-architecture-bible.json`  
**Governed by:** [Volume 0](MASTER_ARCHITECTURE_BIBLE.md) [MAB-001]

---

## Purpose

Volume 1 is the **technical factory blueprint** — not user features. It answers how the Community Operating System is built: architecture, persistence, APIs, auth, services, graph, search, maps, notifications, AI hooks, deployment.

**Read 1.1 first:** [Engineering Doctrine](../volume-01/ENGINEERING_DOCTRINE.md) [ENG-001]

---

## Step Sequence (1.1–1.14)

| Step | Document | Requirement | Status |
|------|----------|-------------|--------|
| **1.1** | [Engineering Doctrine](../volume-01/ENGINEERING_DOCTRINE.md) | ENG-001 | ✅ |
| **1.2** | [System Architecture](../volume-01/SYSTEM_ARCHITECTURE.md) | ENG-002 | ✅ |
| **1.3** | [Canonical Repository Architecture](../volume-01/CANONICAL_REPOSITORY_ARCHITECTURE.md) | ENG-003 · RCN-001 | ✅ |
| **1.4** | [Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) | ENG-004 · DCL-001 | ✅ |
| 1.5 | API Architecture | ENG-005 | Pending |
| **1.6** | [Authentication & Authorization](../volume-01/AUTHORIZATION_ARCHITECTURE.md) | ENG-006 · PRE-001 | ✅ |
| 1.7 | [Domain Service Architecture](../volume-01/DOMAIN_SERVICE_ARCHITECTURE.md) | ENG-007 · SRG-001 | ✅ |
| **1.8** | [Community Knowledge Graph](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) | ENG-008 · LDT-001 | ✅ |
| **1.9** | [Event & Timeline](../volume-01/EVENT_TIMELINE_ARCHITECTURE.md) | ENG-009 · LHE-001 | ✅ |
| **1.10** | [Search & Discovery](../volume-01/SEARCH_ARCHITECTURE.md) | ENG-010 · DGE-001 | ✅ |
| **1.11** | [Map & Geographic](../volume-01/MAP_GEOGRAPHIC_ARCHITECTURE.md) | ENG-011 · ADT-002 | ✅ |
| **1.12** | [Notification & Communication](../volume-01/COMMUNICATION_ARCHITECTURE.md) | ENG-012 · AME-001 | ✅ |
| **1.13** | [AI & Intelligence](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md) | ENG-013 · CIF-001 | ✅ |
| 1.14 | [Deployment, Testing & Release](../volume-01/DEPLOYMENT_TESTING_RELEASE_ARCHITECTURE.md) | ENG-014 · CRCC-001 | ✅ |

**Full detail:** [VOLUME_1_MASTER_SEQUENCE.md](../volume-01/VOLUME_1_MASTER_SEQUENCE.md)

---

## v1 Summary Chapters (reference)

The initial v1 umbrella captured fourteen engineering domains in one document. Steps 1.2–1.14 **expand** each into dedicated artifacts under `docs/volume-01/`.

| Domain | Primary step |
|--------|--------------|
| System topology | 1.2 |
| Repo layout | 1.3 |
| Database | 1.4 + [Volume 2](DATA_ARCHITECTURE_BIBLE.md) |
| API | 1.5 |
| Auth | 1.6 |
| Domain services | 1.7 |
| Knowledge graph | 1.8 |
| Events & timelines | 1.9 |
| Search | 1.10 |
| Maps | 1.11 |
| Notifications | 1.12 |
| AI technical | 1.13 + [Volume 4](AI_INTELLIGENCE_BIBLE.md) |
| Deploy & test | 1.14 |

---

## Completion Standard

Volume 1 is complete when Burt has blueprints for app architecture, database, API, auth, services, graph, search, maps, notifications, AI, and deployment/testing.

**Next step:** Build **1.5 — API Architecture** [ENG-005] *(only remaining Volume 1 sequence gap)* · then Phase 7 per Volume 0 gate.

---

**End of Volume 1 umbrella.** · *Follow the master sequence; do not skip steps.*
