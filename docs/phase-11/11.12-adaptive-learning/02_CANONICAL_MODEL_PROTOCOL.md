# Knowledge Canonical Data Model Protocol

**Build:** 11.12 · **Protocol:** W2 · **Protocol ID:** CAE-11.12-W2 · **System ID:** ADP-001

> **Recovery note:** Blob recovery labeled this content **CAE-11.5-W2**. Repository registers Knowledge & Learning at **Build 11.12** (**ADP-001**), not blob 11.5 (TIM-001). See [BUILD_NUMBER_RECONCILIATION.md](../BUILD_NUMBER_RECONCILIATION.md).

## Mission

Define the authoritative data architecture for institutional knowledge, learning, competency, and certification. This protocol is the **only approved canonical model** for ADP-001 knowledge objects.

No UI. No APIs. No business logic — only the model every future layer depends on.

**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md) · [PROTOCOL_ARCHITECTURE.md](../PROTOCOL_ARCHITECTURE.md)

## Governing principle

Knowledge exists to improve decisions and execution. Every knowledge artifact should reduce uncertainty—not merely increase information.

## Canonical source

| Layer | Location |
|-------|----------|
| TypeScript | `src/lib/civic-action/builds/11.12/data-model.ts` |
| Entity registry | `src/lib/civic-action/builds/11.12/entity-registry.ts` |
| Database contract | `data/phase-11/knowledge_database_contract.json` |
| Entity schema | `data/phase-11/knowledge_entity_schema.json` |
| State machines | `data/phase-11/knowledge_state_machines.json` |
| Event catalog | `data/phase-11/knowledge_event_catalog.json` |
| Relationship matrix | `data/phase-11/knowledge_relationship_matrix.json` |

## Entity registry summary

**54 canonical entities** across knowledge core, learning, competency, certification, institutional memory, and AI governance. See [KNOWLEDGE_ENTITY_REGISTRY.md](KNOWLEDGE_ENTITY_REGISTRY.md).

## Entity graph

```text
Institution
  └── KnowledgeDomain
        ├── KnowledgeCollection
        │     └── KnowledgeArtifact
        │           ├── KnowledgeClaim → Citation → Source
        │           ├── KnowledgeVersion
        │           └── Playbook / SOP
        ├── Course
        │     └── Module → Lesson → LearningObject
        ├── LearningPath
        ├── Competency → Certification
        └── InstitutionalMemoryRecord
```

## Constitutional invariants (DATA-001 through DATA-008)

| ID | Invariant |
|----|-----------|
| DATA-001 | Every knowledge artifact belongs to institutional context (domain + collection) |
| DATA-002 | Permanent canonical identity; IDs never recycle |
| DATA-003 | Every institutional claim traces to evidence with visible confidence |
| DATA-004 | Knowledge versions and history are immutable |
| DATA-005 | Orphan knowledge, claims, and citations are prohibited |
| DATA-006 | AI-generated content must be labeled; AI cannot create institutional truth |
| DATA-007 | Course completion binds to artifact and course version at time of completion |
| DATA-008 | Certification awards require met requirements and human authority |

## COM-002 boundary

11.7 COM-002 owns conversation-derived knowledge capture. ADP-001 does **not** duplicate COM-002 canonical IDs. See [KNOWLEDGE_OVERLAP_AUDIT.md](KNOWLEDGE_OVERLAP_AUDIT.md).

## Certification

```bash
npm run phase11:11.12:w2:all
```

## Next protocol

**CAE-11.12-W3 — Domain Services Protocol:** lifecycle behavior, validation, mutation rules, knowledge services.
