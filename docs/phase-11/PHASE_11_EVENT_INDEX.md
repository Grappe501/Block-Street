# Phase 11 Event Index — Knowledge Domain (ADP-001)

**Build:** 11.12 · **Protocol:** W3 · **Catalog:** `data/phase-11/knowledge_event_catalog.json`

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

**Publisher:** `publishKnowledgeEvent()` · **Outbox:** `knowledge_event_outbox`
