# Build Volume 2.12 — AI Knowledge Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.12 · **DAB-013**  
**Artifact:** `AI_KNOWLEDGE_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.13 AI Architecture](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md) [ENG-013] · [CIF-001](../volume-01/COMMUNITY_INTELLIGENCE_FABRIC.md) · [LDT-001](../volume-01/LIVING_DIGITAL_TWIN_ARCHITECTURE.md) · [2.5 Knowledge Graph](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006] · [2.10 Search Index](SEARCH_INDEX_MODEL.md) [DAB-011]  
**Live spec:** `data/registry/ai-knowledge-model.json`

> AI should retrieve knowledge—not invent institutional memory.

---

## Purpose

**[DAB-AIK01]** The AI Knowledge Data Model defines how knowledge is prepared, organized, cited, retrieved, and explained for artificial intelligence throughout the Community Operating System.

**[DAB-AIK01a]** This model ensures AI operates from **grounded, permission-aware, explainable knowledge** rather than relying on opaque or disconnected information.

**[DAB-AIK01b]** The AI layer should always be able to answer:

> **"What evidence supports this response?"**

---

## Guiding Principle

**[DAB-AIK02]**

> **AI should retrieve knowledge—not invent institutional memory.**

**[DAB-AIK02a]** The Community Operating System **owns the knowledge**. AI helps people navigate it [DAB-PH10 · CIF-001].

---

## Philosophy

**[DAB-AIK03]** AI should **never become another database**.

**[DAB-AIK03a]** Instead, AI consumes carefully prepared **knowledge projections** built from canonical data.

**[DAB-AIK03b]** The architecture separates:

```text
Canonical Truth
        ↓
Knowledge Objects
        ↓
Retrieval Objects
        ↓
Context Assembly
        ↓
AI Response
        ↓
Explainability
```

**[DAB-AIK03c]** This separation **preserves trust** [ENG-AI08 · AIB-001].

**[DAB-AIK03d]** Knowledge is **curated by the platform**, not created by the AI.

---

## AI Knowledge Architecture

**[DAB-AIK04]** The knowledge pipeline consists of seven layers:

```text
Canonical Data
        ↓
Knowledge Objects
        ↓
Knowledge Graph
        ↓
Retrieval Objects
        ↓
Context Assembly
        ↓
AI Orchestrator
        ↓
Grounded Response
```

**[DAB-AIK04a]** Every AI interaction follows this flow.

**[DAB-AIK04b]** Each layer has **one responsibility** — canonical truth never passes directly to the model.

---

## Canonical Knowledge Sources

**[DAB-AIK05]** AI may retrieve from:

Community Brain · Mission Library · Stories · Lessons · Experience Playbooks · Community Legacy · Community Event Ledger · Knowledge Graph · Digital Twins · Configuration · Policies · Public reference material

**[DAB-AIK05a]** No retrieval **bypasses authorization** [TPS-001 · DAB-SPM].

**[DAB-AIK05b]** Search indexes [DAB-011] and analytics [DAB-012] are **not** canonical sources — they assist discovery only.

---

## Knowledge Objects

**[DAB-AIK06]** A **Knowledge Object** represents a reusable unit of information.

**[DAB-AIK06a]** Examples:

Lesson · Story · Playbook section · Mission summary · Community profile · Leadership guidance · Volunteer handbook

**[DAB-AIK06b]** Knowledge objects remain **canonical** [DAB-E43 · CKLS-001].

**[DAB-AIK06c]** Quality metadata: author, reviewer, approval, source, evidence, quality level, historical significance [DAB-AIK17].

---

## Retrieval Objects

**[DAB-AIK07]** **Retrieval Objects** are optimized for AI — derived from Knowledge Objects.

**[DAB-AIK07a]** Each Retrieval Object includes:

Canonical Source ID · Retrieval ID · Text · Summary · Topic · Keywords · Relationships · Permission Metadata · Version · Embedding Reference · Citation Reference

**[DAB-AIK07b]** Retrieval objects are **projections** — replaceable without altering canonical truth [DAB-SCH17a].

---

## Chunking Model

**[DAB-AIK08]** Knowledge should be divided into **meaningful chunks**.

**[DAB-AIK08a]** Chunks should **preserve context**.

**[DAB-AIK08b]** Examples:

Playbook chapter · Story section · Meeting summary · Lesson · Mission reflection · Policy article

**[DAB-AIK08c]** Chunk boundaries should be **semantically meaningful** rather than based solely on character counts.

**[DAB-AIK08d]** Chunk strategy aligns with Search Index Model [DAB-SIX11b · DAB-011].

---

## Embedding Objects

**[DAB-AIK09]** Each retrieval object may include:

Embedding ID · Model Version · Embedding Timestamp · Language · Source Version · Refresh Status

**[DAB-AIK09a]** Embeddings remain **replaceable** — re-embed on model upgrade via batch job.

**[DAB-AIK09b]** V1: keyword retrieval acceptable for launch; embeddings optional [PHASE-001.7].

**[DAB-AIK09c]** Provider-independent — knowledge survives model changes [DAB-AIK21].

---

## Context Assembly

**[DAB-AIK10]** Before AI generates a response:

1. Relevant retrieval objects are selected
2. Permissions are evaluated
3. Knowledge Graph relationships are examined [DAB-006]
4. Timeline context is considered [DAB-008]
5. Digital Twin context may be added [LDT-001]

**[DAB-AIK10a]** The assembled context becomes the **AI prompt**.

**[DAB-AIK10b]** Auditable record of what context was provided [ENG-AI14 · DAB-AIK14].

---

## Citation Model

**[DAB-AIK11]** Every AI response should support **citations**.

**[DAB-AIK11a]** Each citation includes:

Canonical Source · Knowledge Object · Story · Playbook · Policy · Event · Version · Location

**[DAB-AIK11b]** Every AI response with factual claims **must** link ≥1 citation [ENG-AI08 · CIF-001].

**[DAB-AIK11c]** Participants should be able to **inspect supporting evidence**.

---

## Explainability Objects

**[DAB-AIK12]** Each AI response records:

Knowledge sources · Confidence · Assumptions · Missing information · Reasoning summary · Tool usage

**[DAB-AIK12a]** **Explainability strengthens trust** [AIB-001 · CIF-001].

**[DAB-AIK12b]** Supports human review, audit, and trust UI.

---

## Knowledge Freshness

**[DAB-AIK13]** Every retrieval object records:

Last Updated · Refresh Schedule · Canonical Version · Review Status · Staleness Indicator

**[DAB-AIK13a]** Participants should know **how current knowledge is**.

---

## Digital Twin Context

**[DAB-AIK14]** Retrieval may include **Digital Twin summaries**.

**[DAB-AIK14a]** Examples:

Participant Twin · Community Twin · County Twin · Mission Twin · Institution Twin

**[DAB-AIK14b]** Twins are **derived summaries** — not authoritative identity [LDT-001 · ADT-002].

**[DAB-AIK14c]** Only **authorized context** is available.

---

## Memory Objects

**[DAB-AIK15]** **Separate memory from knowledge.**

**[DAB-AIK15a]** Memory includes:

Current conversation · Temporary planning · Participant preferences · Recent interactions

**[DAB-AIK15b]** Knowledge remains **permanent**. Memory remains **contextual**.

**[DAB-AIK15c]** Memory layers align with [ENG-013](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md):

| Layer | Scope |
|-------|-------|
| Session | Ephemeral — current conversation |
| Participant | Preferences, recent interactions |
| Community | Community-scoped context |
| Organizational | Config + curated knowledge |
| Platform | DCL + governance rules |

**[DAB-AIK15d]** Memory writes require explicit consent or user action — never silent profiling [TPS-001].

---

## AI Prompt Profiles

**[DAB-AIK16]** Prompt profiles become **configurable objects**.

**[DAB-AIK16a]** Examples:

Community Guide · Leadership Coach · Mission Planner · Volunteer Coordinator · Knowledge Librarian · Research Assistant

**[DAB-AIK16b]** Prompt behavior becomes **governed data** [DCL-001 · DAB-009].

---

## Retrieval Filters

**[DAB-AIK17]** Retrieval respects:

Permissions · Visibility · Community boundaries · Knowledge quality · Version · Language · Review status

**[DAB-AIK17a]** **Unauthorized knowledge never enters the prompt.**

---

## Knowledge Quality

**[DAB-AIK18]** Knowledge objects should record:

Author · Reviewer · Approval · Source · Evidence · Quality level · Historical significance

**[DAB-AIK18a]** Quality supports **explainability** and retrieval ranking.

---

## AI Conversation Records

**[DAB-AIK19]** Store:

Conversation ID · Prompt Profile · Knowledge Sources · Tools Invoked · Model Version · Response Metadata · Approval Status (where applicable)

**[DAB-AIK19a]** Conversation history should remain **permission-aware**.

---

## AI Feedback

**[DAB-AIK20]** Participants may provide:

Helpful · Needs Improvement · Incorrect · Incomplete · Suggested Revision

**[DAB-AIK20a]** Feedback improves **future retrieval** rather than rewriting canonical knowledge automatically.

---

## AI Governance

**[DAB-AIK21]** Every AI capability should support:

Version tracking · Approval · Monitoring · Audit · Prompt versioning · Knowledge versioning

**[DAB-AIK21a]** **Governance protects institutional trust** [AIB-001 · DCL-001].

---

## Future AI Models

**[DAB-AIK22]** Architecture supports:

Cloud models · Local models · Hybrid deployment · Specialized models · Future providers

**[DAB-AIK22a]** Knowledge remains **provider-independent** through the AI Orchestration Layer [ENG-013].

---

## Canonical Knowledge Fabric

**[DAB-AIK23]** **Major Architectural Recommendation:** Create a **Canonical Knowledge Fabric** as the layer that unifies every knowledge source before AI retrieval.

**[DAB-AIK23a]** Instead of having AI retrieve independently from stories, playbooks, Community Brain entries, Digital Twins, or policies, the Knowledge Fabric presents a **single, normalized interface**.

**[DAB-AIK23b]** For every retrieval request, it assembles:

- Canonical Knowledge Objects
- Community Knowledge Graph relationships [DAB-006]
- Community Event Ledger history [DAB-007]
- Digital Twin summaries [LDT-001]
- Story evidence [DAB-008]
- Lessons learned · Experience Playbooks · Community Brain entries [CKLS-001]
- Configuration and governance rules [DAB-009]
- Relevant public reference material (when applicable)

**[DAB-AIK23c]** The Knowledge Fabric performs:

Permission filtering · Deduplication · Version selection · Context ranking · Citation assembly · Explainability preparation

**[DAB-AIK23d]** The AI Orchestrator then receives **one coherent knowledge package** rather than querying many independent systems.

**[DAB-AIK23e]** Separation of concerns:

| Layer | Responsibility |
|-------|----------------|
| **Canonical systems** | Preserve truth |
| **Knowledge Fabric** | Prepare truth for retrieval |
| **AI Orchestrator** | Reason over prepared context |
| **AI models** | Generate responses grounded in that context |

**[DAB-AIK23f]** Reinforces: **knowledge is curated by the platform, not created by the AI.**

**[DAB-AIK23g]** Live spec: `data/registry/ai-knowledge-model.json` · `canonicalKnowledgeFabric`

---

## Community Brain Integration

**[DAB-AIK24]** Community Brain = curated knowledge index per community [CKLS-001]:

Priority · Freshness score · Last validated · Entry type · Source chunk reference

**[DAB-AIK24a]** Feeds Knowledge Fabric retrieval ranking for community-scoped questions.

---

## Burt Implementation Guidance

**[DAB-AIK25]** Implementation should:

1. Keep **canonical knowledge separate** from retrieval objects
2. Build retrieval as a **projection layer**
3. Preserve **citations for every response**
4. Support **semantic chunking**
5. Separate **memory from permanent knowledge**
6. Keep AI **provider-independent** through the AI Orchestration Layer
7. Consult Canonical Knowledge Fabric spec before AI retrieval features

**[DAB-AIK25a]** Logical home: Intelligence schema [DAB-SCH17] — KnowledgeObject · RetrievalObject · Embedding · ContextPackage · Citation · ExplainabilityRecord · ConversationRecord · MemoryObject · PromptProfile.

---

## AC-118 — Acceptance Criteria

Volume 2.12 is complete when:

- [x] **[AC-118a]** AI knowledge philosophy is documented. `[DAB-AIK03]`
- [x] **[AC-118b]** Knowledge and retrieval object models are defined. `[DAB-AIK06, AIK07]`
- [x] **[AC-118c]** Chunking, embeddings, citations, explainability, and memory are established. `[DAB-AIK08–AIK15]`
- [x] **[AC-118d]** Governance, feedback, and provider independence are incorporated. `[DAB-AIK20–AIK22]`
- [x] **[AC-118e]** Canonical Knowledge Fabric specified. `[DAB-AIK23]`
- [x] **[AC-118f]** Burt has a complete blueprint for grounded AI knowledge across the COS. `[DAB-AIK25]`

---

**Next step:** [2.13 — Security & Privacy Data Model](SECURITY_PRIVACY_MODEL.md) [DAB-014]

**End of Volume 2.12.**
