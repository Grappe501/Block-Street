# Knowledge Intelligence Protocol

**Requirement family:** CAE-11.12-W6-INT-* · **Registry:** `data/phase-11/knowledge_intelligence_registry.json`

## Core Invariants

1. Every intelligence result identifies evidence and canonical versions used.
2. Permission filtering occurs before retrieval, graph traversal, and context assembly.
3. AI-generated conclusions remain distinguishable from canonical knowledge (`ai_generated: true`).
4. Every recommendation exposes confidence, reasoning, limitations, and Human action required.
5. No intelligence service may publish knowledge, verify competency, finalize assessments, or issue credentials.
6. Personalization may not lower approved learning, assessment, competency, or certification standards.
7. Human learning data must never become reputation, loyalty, or social-credit scores.
8. Intelligence outputs retain canonical versions for reconstruction.

## Prohibited Actions

See `AI_PROHIBITED_ACTIONS` in `intelligence/contracts.ts`.

## Orchestrator

`runKnowledgeIntelligence()` in `intelligence/orchestrator.ts` routes all intelligence requests through:

- Privacy validation
- Permission-aware retrieval
- Evidence ledger
- AI provenance
- Human review routing when thresholds met
