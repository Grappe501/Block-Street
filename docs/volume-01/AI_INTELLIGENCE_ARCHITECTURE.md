# Build Volume 1.13 — AI & Intelligence Technical Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.13 · **ENG-013**  
**Artifact:** `AI_INTELLIGENCE_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Community Intelligence Fabric](COMMUNITY_INTELLIGENCE_FABRIC.md) [CIF-001]  
**Builds on:** [1.8 CKG](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008] · [1.10 Search](SEARCH_ARCHITECTURE.md) [ENG-010] · [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006] · [Intelligence Service](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-DS20]  
**Product alignment:** [Volume 4 — AI & Intelligence Bible](../master/AI_INTELLIGENCE_BIBLE.md) [AIB-001]  
**Live spec:** `data/registry/ai-intelligence-architecture.json`

---

## ENG-AI01 — Purpose

**[ENG-AI01]** The AI & Intelligence Technical Architecture defines how artificial intelligence is **integrated throughout the COS** while preserving transparency, human leadership, privacy, and constitutional principles [MAB-K · CP-010].

**[ENG-AI01a]** AI is **not a separate feature** — it is an **advisory layer** woven through the platform.

**[ENG-AI01b]** Helps people understand information · discover opportunities · automate routine work · make better-informed decisions.

**[ENG-AI01c]** The COS **must function when AI is unavailable** — graceful degradation [ENG-AI22].

---

## ENG-AI02 — Guiding Principle

**[ENG-AI02]**

> **AI augments human judgment. It never replaces community leadership.**

**[ENG-AI02a]** People remain **responsible for decisions**. AI helps people make **better decisions** [AIB-M01a · DG-003].

---

## ENG-AI03 — AI Philosophy

**[ENG-AI03]** The COS is built around:

People · communities · relationships · knowledge · history · service

**[ENG-AI03a]** AI exists to **strengthen those foundations** — never replace them [CLS-001 · PRN-001 · CKLS-001].

---

## ENG-AI04 — Constitutional Principles

**[ENG-AI04]** Every AI capability must satisfy:

| Principle | Enforcement |
|-----------|-------------|
| **Human oversight** | Approval workflows [ENG-AI20] |
| **Explainability** | Citations + uncertainty [ENG-AI18] |
| **Privacy** | PRE before retrieval [ENG-AI19] |
| **Permission awareness** | Inherited actor scope |
| **Evidence-based responses** | Retrieval before generation [ENG-AI12] |
| **Transparency** | Audit log · version stamps [ENG-AI24] |
| **Graceful degradation** | Non-AI fallbacks [ENG-AI22] |
| **No hidden decision making** | No silent writes to canonical data |

**Phase refs:** TPS-M15 · AIB-C06 · CCN-001.

---

## ENG-AI05 — AI Layer Architecture

**[ENG-AI05]** Intelligence sits **above domain services** — never bypasses platform architecture:

```text
Presentation
      ↓
Experience Layer
      ↓
AI Orchestration Layer
      ↓
Knowledge & Intelligence Layer
      ↓
Domain Services
      ↓
Community Knowledge Graph
      ↓
SQL Database
```

**[ENG-AI05a]** AI **never bypasses** PRE · domain ownership · or canonical writes [ENG-DS20 · ENG-DB16].

---

## ENG-AI06 — AI Orchestration Layer

**[ENG-AI06]** The **AI Orchestrator** coordinates:

Prompt routing · context assembly · permission filtering · retrieval · memory selection · tool execution · response generation · audit logging

**[ENG-AI06a]** **Gateway for all AI interactions** — no direct LLM calls from UI or domain services.

**Path:** `src/lib/kernel/ai/orchestrator.ts`

**Companion:** [Community Intelligence Fabric](COMMUNITY_INTELLIGENCE_FABRIC.md) [CIF-001] unifies multi-source orchestration.

---

## ENG-AI07 — Knowledge Sources

**[ENG-AI07]** AI may retrieve (authorization-scoped only):

Community Brain · Mission Library · experience playbooks · Community Legacy · Story Atlas · CKG · LHE · Digital Twins [LDT-001] · operational aggregates

**[ENG-AI07a]** **Only information the participant is authorized to access** — PRE runs before every retrieval [ENG-AI19].

**Volume 4 detail:** [AIB-C04 Retrieval Pipelines](../master/AI_INTELLIGENCE_BIBLE.md).

---

## ENG-AI08 — Retrieval Pipeline

**[ENG-AI08]** Every AI interaction follows:

```text
Question
      ↓
Permission Check (PRE)
      ↓
Context Retrieval (search + RAG + graph)
      ↓
Knowledge Graph enrichment
      ↓
Supporting Evidence assembly
      ↓
AI Response generation
      ↓
Explainability Summary + citations
```

**[ENG-AI08a]** **Retrieval always precedes generation** — no pure parametric answers on platform facts [AIB-C04 · ENG-DB16].

---

## ENG-AI09 — AI Memory Model

**[ENG-AI09]** Multiple memory layers — distinct purposes [AIB-C05]:

| Layer | Scope | Persistence |
|-------|-------|-------------|
| **Session memory** | Current conversation | Temporary · TTL |
| **Participant context** | Preferences · communities · leadership · interests · current work | PDT / LocalBrain [AIB-C01] |
| **Community memory** | Brain · stories · traditions · knowledge · lessons · history | Community-scoped RAG |
| **Organizational memory** | Mission Library · playbooks · policies · graph · legacy | Cross-community where permitted |
| **Platform memory** | Constitution · DCL · architecture · standards | Read-only for agents |

**[ENG-AI09a]** Each layer has **authorization boundaries** — never commingle without consent [TPS-001].

---

## ENG-AI10 — AI Agent Architecture

**[ENG-AI10]** **Specialized agents** — not one monolithic assistant [AIB-C07]:

| Agent | Domain | Never does |
|-------|--------|------------|
| Community Guide | Community · growth | Grant permissions |
| Mission Planner | Mission · EOS | Publish without approval |
| Volunteer Coordinator | Opportunity · VDS | Assign without consent |
| Knowledge Librarian | CKLS · LIS | Write canonical without review |
| Leadership Coach | CLD · mentorship | Impersonate mentor |
| Story Assistant | CST | Publish story without author |
| Research Assistant | Search · graph | Access private data |
| Growth Advisor | GOS · ICS | Send invitations |
| Operations Advisor | OPIS · ACN | Override mission state |
| Accessibility Assistant | UX · a11y | Change user settings |

**[ENG-AI10a]** Agents collaborate through **AI Orchestrator** — shared tool registry · no agent-to-agent hidden channels.

**Path:** `src/lib/kernel/ai/agents/{agent}/`

---

## ENG-AI11 — Tool Architecture

**[ENG-AI11]** AI invokes **explicit, auditable tools**:

Search · calendar · maps · knowledge retrieval · graph queries · notifications (draft only) · document generation · reporting · scheduling

**[ENG-AI11a]** Every invocation logged: `tool_name` · `arguments_hash` · `actor_id` · `result_status` · no secrets in logs [ENG-AI24].

```typescript
interface AiToolInvocation {
  toolId: string;
  arguments: Record<string, unknown>;
  actorId: string;
  preApproved: boolean;
  auditId: string;
}
```

**[ENG-AI11b]** Tools call **domain service public contracts** — never raw SQL from agent [ENG-DS23 · SRG-001].

---

## ENG-AI12 — Explainability

**[ENG-AI12]** Every recommendation answers [ENG-KG19 · AIB-C08]:

What information was used? · What evidence supports this? · What assumptions were made? · What uncertainties remain?

**Response envelope:**

```typescript
interface AiResponse {
  content: string;
  citations: Citation[];
  assumptions: string[];
  uncertainties: string[];
  evidenceRefs: string[];
  modelVersion: string;
  promptVersion: string;
}
```

---

## ENG-AI13 — Permission Awareness

**[ENG-AI13]** AI **inherits participant permissions** [PRE-001] — cannot retrieve:

Private communities · restricted stories · private mentorship · administrative data · confidential operational records

**[ENG-AI13a]** Permission boundaries enforced **before context assembly** — empty context better than leaked context [TPS-001].

---

## ENG-AI14 — Human Approval

**[ENG-AI14]** Actions **always requiring human approval** [AIB-C06 · ENG-AU18]:

Publishing announcements · launching communities · granting permissions · deleting data · changing governance · submitting public communications

**[ENG-AI14a]** AI **prepares** · humans **approve** — workflow state `pending_approval` [PRE-001].

---

## ENG-AI15 — AI Failure Philosophy

**[ENG-AI15]** If AI unavailable:

Search continues · communities continue · events continue · knowledge remains available · platform falls back to traditional workflows

**[ENG-AI15a]** AI is **additive—not foundational** [ENG-AI01c · ED-AI-GATE Phase 7 deferral].

**UI pattern:** Hide AI surfaces · show "Assistant temporarily unavailable" · preserve manual paths.

---

## ENG-AI16 — AI Observability

**[ENG-AI16]** Log (privacy-safe):

Requests · latency · tools invoked · knowledge sources · errors · user feedback · approval decisions

**[ENG-AI16a]** Exclude unnecessary PII from logs · retention per TPS-001 · `intelligence.ai_audit_log`.

---

## ENG-AI17 — AI Versioning

**[ENG-AI17]** Every capability records:

Model version · prompt version · knowledge source version · tool versions · configuration version [AIB-C03]

**[ENG-AI17a]** Reproducibility for debugging and constitutional review [CCN-001].

---

## ENG-AI18 — Local AI Compatibility

**[ENG-AI18]** Support interchangeable providers via orchestration layer:

Cloud AI · private AI · local models · hybrid deployment · future providers

**[ENG-AI18a]** Provider adapter interface — `AiProvider.complete(prompt, context)` · swap without agent changes [AIB-C09].

**V1:** OpenAI-compatible API · env-configured endpoint.

---

## ENG-AI19 — Future AI Capabilities

**[ENG-AI19]** Extend architecture without changing it:

Meeting summaries · volunteer scheduling · mission planning · strategic forecasting · community health summaries · documentation drafts · graph exploration · natural language reporting · multi-agent collaboration

**[ENG-AI19a]** Register new capabilities in DCL + CIF capability catalog [CIF-001].

---

## ENG-AI20 — Security

**[ENG-AI20]** AI must **never**:

Store secrets · reveal unauthorized information · invent permissions · override governance · modify canonical data without explicit workflows

**[ENG-AI20a]** Security principles **unchanged** from platform baseline [TPS-001 · DG-003 · ENG-AU20].

---

## ENG-AI21 — Community Intelligence Fabric

**[ENG-AI21]** Unifying concept — **[Community Intelligence Fabric](COMMUNITY_INTELLIGENCE_FABRIC.md) [CIF-001]** coordinates AI, search, knowledge, graph, twins, and analytics into **coherent explainable assistance**.

**[ENG-AI21a]** Single pattern for every future AI capability — not isolated per-feature assistants.

---

## ENG-AI22 — Intelligence Service Boundary

**[ENG-AI22a]** **Intelligence Service** [ENG-DS20] stores recommendations with `evidence_refs` — never canonical truth alone.

**[ENG-AI22b]** CIF orchestrates reads · Intelligence Service persists approved insights · domain services own writes.

---

## ENG-AI23 — Burt Implementation Guidance

**[ENG-AI23]** Implementation should:

- **Centralize AI** through Orchestration Layer + CIF [ENG-AI06 · CIF-001]
- **Separate retrieval from generation** [ENG-AI08]
- Build **specialized agents** around business domains [ENG-AI10]
- **Enforce permissions** before context assembly [ENG-AI13]
- Make every recommendation **explainable** [ENG-AI12]
- Design **provider-independent** integrations [ENG-AI18]
- **Never** grant/revoke permissions via AI [ENG-AU22 · PRE-001]
- Align with [Volume 4 AIB-001](../master/AI_INTELLIGENCE_BIBLE.md) for prompt/RAG detail

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [AIB-001](../master/AI_INTELLIGENCE_BIBLE.md) | Product AI bible · LocalBrain · RAG |
| [CIF-001](COMMUNITY_INTELLIGENCE_FABRIC.md) | Unified intelligence orchestration |
| [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) | Twin context for Fabric |
| [DGE-001](DISCOVERY_ENGINE.md) | Non-AI discovery · AI summarizes only |
| [AME-001](ATTENTION_MANAGEMENT_ENGINE.md) | AI digest drafts · human approval |
| [ENG-005 API](API_ARCHITECTURE.md) | AI endpoints [pending] |

---

## AC-103 — Acceptance Criteria

Volume 1.13 is complete when:

- [x] **[AC-103a]** AI philosophy documented. `[ENG-AI02, ENG-AI03]`
- [x] **[AC-103b]** Orchestration, retrieval, and memory models defined. `[ENG-AI06–ENG-AI09]`
- [x] **[AC-103c]** Agent architecture established. `[ENG-AI10, ENG-AI11]`
- [x] **[AC-103d]** Explainability, permission awareness, and human approval incorporated. `[ENG-AI12–ENG-AI14]`
- [x] **[AC-103e]** Community Intelligence Fabric specified. `[ENG-AI21, CIF-001]`
- [x] **[AC-103f]** Burt has blueprint for AI implementation. `[ai-intelligence-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] *(Volume 1 sequence gap)*

**End of Volume 1.13 — AI & Intelligence Technical Architecture.**
