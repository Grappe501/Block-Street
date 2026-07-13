# Phase 11 Event Index — Knowledge Domain (ADP-001)

**Build:** 11.12 · **Protocols:** W3 (domain events) + W5 (catalog registry) · **Catalog:** `data/phase-11/knowledge_event_catalog.json` (v `11.12-w5.1`, 25 events)

## Knowledge artifact events

- `knowledge.artifact_created`
- `knowledge.artifact_edited`
- `knowledge.artifact_submitted_for_review`
- `knowledge.artifact_review_completed`
- `knowledge.artifact_validated`
- `knowledge.artifact_approved`
- `knowledge.artifact_published`

## Claim & citation

- `knowledge.claim_created`
- `knowledge.citation_attached`

## Learning

- `knowledge.course_created`
- `knowledge.course_version_published`
- `knowledge.enrollment_created`
- `knowledge.learning_progress_recorded`
- `knowledge.learning_completed`

## Competency & assessment

- `knowledge.competency_verified`
- `knowledge.assessment_attempt_started`
- `knowledge.assessment_evaluated`

## Certification

- `knowledge.certification_eligibility_evaluated`
- `knowledge.certification_awarded`

## AI & translation

- `knowledge.ai_suggestion_created`
- `knowledge.ai_suggestion_reviewed`
- `knowledge.translation_draft_created`
- `knowledge.translation_approved`

## Memory

- `knowledge.correction_reported`
- `knowledge.conflict_identified`

**Publisher:** `publishKnowledgeEvent()` · **Outbox:** `knowledge_event_outbox` · **W5 dispatcher:** `events/outbox-publisher.ts`

---

## Context Intelligence (LIX-002) — Build 11.7-lix W2

**Catalog:** `src/lib/civic-action/builds/11.7/living/context/events/catalog.ts` (16 events)

### Context lifecycle

- `context.signal_received`
- `context.resolved`
- `context.changed`
- `context.confirmation_requested`
- `context.confirmed`
- `context.corrected`
- `context.expired`
- `context.inference_paused`

### Attention & focus

- `attention.priority_recommended`
- `attention.interruption_deferred`
- `focus.session_started`
- `focus.session_completed`

### Next actions

- `next_action.recommended`
- `next_action.accepted`
- `next_action.dismissed`

### Institution

- `institution.context_switched`

---

## Executive Assistant (LIX-003) — Build 11.7-lix W3

**Catalog:** `src/lib/civic-action/builds/11.7/living/executive-assistant/events/catalog.ts` (18 events)

### Executive lifecycle

- `executive_assistant.requested`
- `executive_assistant.response_generated`
- `briefing.generated`
- `briefing.refreshed`
- `briefing.expired`

### Decisions & commitments

- `meeting.preparation_generated`
- `decision.package_generated`
- `decision.more_evidence_required`
- `commitment.suggested`
- `commitment.confirmed`
- `commitment.completed`
- `commitment.overdue`

### Drafting & delegation

- `executive_draft.created`
- `delegation.recommended`
- `handoff.package_created`

### Risk & audit

- `executive.risk_escalated`
- `executive.opportunity_identified`
- `executive_output.reported`
