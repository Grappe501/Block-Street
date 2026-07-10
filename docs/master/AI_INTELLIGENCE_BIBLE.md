# VOLUME 4 — AI & Intelligence Bible

**Document ID:** VOLUME-004 · **AIB-001**  
**Artifact:** `AI_INTELLIGENCE_BIBLE.md`  
**Status:** Canonical · v1 Structure  
**Priority:** Critical — technical AI before Phase 7 intelligence layer  
**Live spec:** `data/registry/ai-intelligence-bible.json`

> Intelligence was designed **conceptually** in Phases 4–6. Volume 4 defines it **technically**.

**Governed by:** [Volume 0 Section K](MASTER_ARCHITECTURE_BIBLE.md) [MAB-K] · [Volume 1.13 AI Technical Architecture](../volume-01/AI_INTELLIGENCE_ARCHITECTURE.md) [ENG-013 · CIF-001]

---

## AIB-M01 — Purpose

**[AIB-M01]** Define AI assistants, brains, prompts, retrieval, memory, agents, explainability, privacy, and human approval — so implementation matches constitutional AI principles.

**[AIB-M01a]** **AI advises; people decide** [CP-010 · MAB principle 10].

---

## Intelligence Layers

| Layer | Name | Scope | Phase ref |
|-------|------|-------|-----------|
| Personal | **LocalBrain** | One participant · private | PDT-001 · PCC-001 |
| Community | **Community Brain** | One community · governed | CKLS-001 |
| Operational | **Operations Intelligence** | Missions · statewide situational | OPIS-001 |
| Growth | **Growth Intelligence** | Network health · expansion | CGIS-001 · NISS-001 |
| Impact | **Impact Intelligence** | Outcomes · chains | CIIS-001 |

---

## LocalBrain Architecture [AIB-C01]

**[AIB-C01a]** **Scope:** Participant-owned · never shared without explicit consent.

**[AIB-C01b]** **Inputs:** PDT six domains · journey stage · relationships · missions · preferences.

**[AIB-C01c]** **Outputs:** Morning brief suggestions · opportunity matches [OBE-001] · reflection prompts · never auto-send messages.

**[AIB-C01d]** **Storage:** `participant_ai_context` — encrypted · exportable · deletable [TPS-001].

---

## Community Brain [AIB-C02]

**[AIB-C02a]** **Scope:** Community knowledge library [CKLS-001] — playbooks, decisions, lessons, FAQs.

**[AIB-C02b]** **Governance:** Community leaders approve knowledge ingestion · version history · attribution.

**[AIB-C02c]** **Retrieval:** RAG over community-scoped documents only · cite sources in every response.

---

## Prompt Contracts [AIB-C03]

**[AIB-C03a]** Prompts stored as versioned templates: `prompts/{domain}/{name}.v{semver}.md`

**[AIB-C03b]** Every prompt includes: system role · constitutional constraints · output schema · refusal conditions.

**[AIB-C03c]** **No prompt in client code** — server-side only · logged with hash for audit.

---

## Retrieval Pipelines [AIB-C04]

```text
Query → scope filter (community/participant) → vector + keyword hybrid
      → rerank → context assembly → LLM → structured response + citations
```

**[AIB-C04a]** Embeddings: community-scoped namespaces · re-index on knowledge publish.

**[AIB-C04b]** **Graph-augmented retrieval:** Include relationship context for opportunity matching [OBE-001 · RGE-001].

---

## Memory Model [AIB-C05]

| Memory type | TTL | Scope |
|-------------|-----|-------|
| Session | Conversation | Current thread |
| Working | 30 days | Active missions |
| Long-term | Indefinite | Explicitly saved insights |
| Community | Permanent | Approved knowledge objects |

**[AIB-C05a]** Participants can view and delete AI memory [TPS-001 Trust Center].

---

## Agent Collaboration [AIB-C06]

**[AIB-C06a]** **V1 agents (advisory only):** Welcome companion [WBS-001] · Mission design assistant [MDS-001] · Growth advisor [CGIS-001].

**[AIB-C06b]** **Agent rules:** No autonomous outbound actions · no permission escalation · human approval for anything public.

**[AIB-C06c]** **Multi-agent:** Orchestrator routes to specialist agents · shared trace ID for explainability.

---

## Explainability [AIB-C07]

Every AI output includes:

```json
{
  "answer": "...",
  "confidence": "medium",
  "sources": [{ "type": "playbook", "id": "...", "title": "..." }],
  "reasoning_summary": "...",
  "human_review_recommended": false
}
```

---

## Privacy Boundaries [AIB-C08]

- No cross-community inference without partnership agreement [IPS-001]
- No training on participant data without opt-in
- Local model option for sensitive communities (future) [MAB-T]
- Audit log of all AI requests with `participant_id`, `scope`, `prompt_hash`

---

## Human Approval Workflows [AIB-C09]

| Action | Approval required |
|--------|-------------------|
| Suggest opportunity | No |
| Draft invitation message | Participant review |
| Publish story summary | Author + community mod |
| Growth recommendation to leader | Leader opt-in display |
| Statewide network insight | State admin review [NISS-001] |

---

## AC-080 — Acceptance Criteria

- [x] **[AC-080a]** Five intelligence layers mapped to phase systems. `[AIB-M01]`
- [x] **[AC-080b]** LocalBrain and Community Brain architectures defined. `[AIB-C01, C02]`
- [x] **[AC-080c]** Prompt contracts, retrieval, memory documented. `[AIB-C03–C05]`
- [x] **[AC-080d]** Explainability, privacy, approval workflows specified. `[AIB-C07–C09]`
- [ ] **[AC-080e]** Production prompt library and embedding pipeline (v1.1+).

---

**End of Volume 4 v1.**
