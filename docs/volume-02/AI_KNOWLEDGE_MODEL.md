# Build Volume 2.12 — AI Knowledge Model

### Data Architecture Bible

**Document ID:** VOLUME-002.12 · **DAB-013**  
**Artifact:** `AI_KNOWLEDGE_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.13 AI Architecture](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md) [ENG-013] · [CIF-001](../volume-01/COMMUNITY_INTELLIGENCE_FABRIC.md) · [LDT-001](../volume-01/LIVING_DIGITAL_TWIN_ARCHITECTURE.md)  
**Live spec:** `data/registry/ai-knowledge-model.json`

---

## DAB-AIK01 — Purpose

**[DAB-AIK01]** Defines retrieval chunks, citations, embeddings, prompt context, memory objects, Digital Twins, Community Brain objects, and explainability metadata — supporting **Community Intelligence Fabric**.

---

## DAB-AIK02 — Retrieval Chunks

**[DAB-AIK02a]** Table: `intelligence.retrieval_chunks`:

```text
retrieval_chunks (
  id, source_type, source_id, chunk_index,
  content_text, token_count,
  community_scope, visibility, data_class,
  embedding,              -- vector, nullable V1
  embedding_model,
  indexed_at, source_version
)
```

**[DAB-AIK02b]** Sources: knowledge_objects, stories, lessons, document_versions, mission canvases.

**[DAB-AIK02c]** Chunk size: ~512 tokens with 64-token overlap default.

---

## DAB-AIK03 — Citations

**[DAB-AIK03a]** Table: `intelligence.citations`:

```text
citations (
  id, response_id, chunk_id,
  entity_type, entity_id, excerpt,
  confidence, rank_order
)
```

**[DAB-AIK03b]** Every AI response with factual claims **must** link ≥1 citation [ENG-AI08 · CIF-001].

---

## DAB-AIK04 — Embeddings

**[DAB-AIK04a]** Stored on `retrieval_chunks.embedding` — pgvector.

**[DAB-AIK04b]** Model version tracked — re-embed on model upgrade via batch job.

**[DAB-AIK04c]** V1: optional — keyword retrieval acceptable for launch [PHASE-001.7].

---

## DAB-AIK05 — Prompt Context Objects

**[DAB-AIK05a]** Table: `intelligence.context_packages`:

```text
context_packages (
  id, request_id, participant_id, community_scope,
  chunks[], graph_paths[], permission_filter_applied,
  token_budget_used, created_at
)
```

**[DAB-AIK05b]** Auditable record of what context was provided to the model [ENG-AI14].

---

## DAB-AIK06 — Memory Objects

**[DAB-AIK06a]** Aligns with [ENG-013 memory layers](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md):

| Layer | Storage |
|-------|---------|
| Session | ephemeral / redis V1.1 |
| Participant context | `intelligence.participant_memory` |
| Community | `intelligence.community_memory` |
| Organizational | config + knowledge |
| Platform | DCL + metric snapshots |

**[DAB-AIK06b]** Memory writes require explicit consent or user action — never silent profiling [TPS-001].

---

## DAB-AIK07 — Digital Twins

**[DAB-AIK07a]** Table: `intelligence.twin_snapshots`:

```text
twin_snapshots (
  id, twin_type, scope_type, scope_id,
  snapshot_json, graph_summary, metrics_summary,
  generated_at, source_version, expires_at
)
```

**[DAB-AIK07b]** Types: participant, community, county, state [LDT-001 · ADT-002].

**[DAB-AIK07c]** Twins are **derived summaries** — not authoritative identity.

---

## DAB-AIK08 — Community Brain Objects

**[DAB-AIK08a]** Community Brain = curated knowledge index per community [CKLS-001]:

```text
community_brain_entries (
  id, community_id, entry_type, source_chunk_id,
  priority, freshness_score, last_validated_at
)
```

**[DAB-AIK08b]** Feeds CIF retrieval ranking for community-scoped questions.

---

## DAB-AIK09 — Explainability Metadata

**[DAB-AIK09a]** Table: `intelligence.ai_interactions`:

```text
ai_interactions (
  id, participant_id, agent_type, prompt_hash,
  response_summary, citations[], tools_used[],
  approval_required, approval_status,
  created_at, community_scope
)
```

**[DAB-AIK09b]** Supports human review, audit, and trust UI [AIB-001].

---

## AC-118 — Acceptance Criteria

- [x] **[AC-118a]** Retrieval chunks and citations documented. `[DAB-AIK02, AIK03]`
- [x] **[AC-118b]** Embeddings, context packages, and memory objects defined. `[DAB-AIK04–AIK06]`
- [x] **[AC-118c]** Digital Twins, Community Brain, and explainability metadata specified. `[DAB-AIK07–AIK09]`

---

**Next step:** [2.13 — Security & Privacy Data Model](SECURITY_PRIVACY_MODEL.md) [DAB-014]

**End of Volume 2.12.**
