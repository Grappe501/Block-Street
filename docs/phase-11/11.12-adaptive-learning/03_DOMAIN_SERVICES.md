# Knowledge Domain Services Protocol

**Build:** 11.12 · **Protocol:** W3 · **Protocol ID:** CAE-11.12-W3 · **System ID:** ADP-001

> **Recovery note:** Blob CAE-11.5-W3 maps to repository **CAE-11.12-W3**. See [BUILD_NUMBER_RECONCILIATION.md](../BUILD_NUMBER_RECONCILIATION.md).

**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md) · [02_CANONICAL_MODEL_PROTOCOL.md](02_CANONICAL_MODEL_PROTOCOL.md)

## Mission

Transform the canonical knowledge model (W2) into a governed knowledge and learning engine. W2 defined entities; W3 defines lawful mutation behavior.

## Sole mutation path

`KnowledgeDomainService.execute()` — `src/lib/civic-action/builds/11.12/services/knowledge-engine.ts`

No UI, API, automation, AI, or script may bypass this engine. Direct store writes are forbidden.

## Engine scope

Knowledge Artifact → Claim → Citation → Course → Enrollment → Completion → Competency → Assessment → Certification → Translation → AI Suggestion

## Core responsibilities

Lifecycle enforcement, stewardship, evidence gates, version/audit, events/outbox, idempotency, optimistic concurrency, AI truth boundaries, completion version binding.

## Validation pipeline

Identity → permission → institution → parent-child lifecycle → business rules (evidence, approval, certification requirements).

## Related documentation

- [KNOWLEDGE_COMMAND_STANDARD.md](KNOWLEDGE_COMMAND_STANDARD.md)
- [KNOWLEDGE_LIFECYCLE_ENGINE.md](KNOWLEDGE_LIFECYCLE_ENGINE.md)
- [CLAIM_EVIDENCE_SERVICES.md](CLAIM_EVIDENCE_SERVICES.md)
- [LEARNING_PROGRAM_AND_COURSE_SERVICES.md](LEARNING_PROGRAM_AND_COURSE_SERVICES.md)
- [CERTIFICATION_SERVICES.md](CERTIFICATION_SERVICES.md)
- [TRANSLATION_AND_AI_TUTOR_SERVICES.md](TRANSLATION_AND_AI_TUTOR_SERVICES.md)
- [KNOWLEDGE_EVENT_AND_OUTBOX_STANDARD.md](KNOWLEDGE_EVENT_AND_OUTBOX_STANDARD.md)
- [PROTOCOL_3_CERTIFICATION.md](PROTOCOL_3_CERTIFICATION.md)
