# Wave 3 Handoff — Knowledge and Learning Domain Services

**From:** CAE-11.12-W2 (Canonical Data Model)  
**To:** CAE-11.12-W3 (Domain Services Protocol)  
**Date:** 2026-07-12

## Stable Aggregates

| Aggregate | Root Entity | Child Entities |
|-----------|-------------|----------------|
| Knowledge | KnowledgeDomain | Collection → Artifact → Version, Claim, Citation |
| Learning | Course | Module → Lesson → LearningObject |
| Competency | Competency | Level, Evidence, HumanCompetencyRecord |
| Certification | Certification | Requirement, Award, Renewal |
| Memory | InstitutionalMemoryRecord | Insight, Lesson |

## Repository Boundaries

Implement in `src/lib/civic-action/builds/11.12/services/`:

1. **CanonicalKnowledgeArtifactRepository** — artifact CRUD, version append, publication
2. **CanonicalKnowledgeClaimRepository** — claim lifecycle, evidence binding
3. **CanonicalCourseRepository** — course/module/lesson hierarchy, version pinning
4. **CanonicalCompetencyRepository** — competency levels, human records
5. **CanonicalCertificationRepository** — requirements, awards, renewal/revocation
6. **CanonicalEvidenceRepository** — cross-platform evidence references
7. **CanonicalRelationshipRepository** — knowledge graph edges
8. **CanonicalVersionRepository** — immutable version store
9. **CanonicalSearchIndexer** — derived permission-aware projections
10. **CanonicalEventPublisher** — `knowledge_event_catalog.json` events

## Lifecycle States (from W2)

- **Artifact:** draft → in_review → validated → approved → published → operational → superseded → archived
- **Course:** draft → instructional_review → pilot → approved → published → active → retired → archived
- **Claim:** draft → pending_evidence → validated → disputed → superseded
- **Certification award:** active → expiring → expired → suspended → revoked

## Required Commands (W3)

- `createKnowledgeArtifact`, `submitForReview`, `approveVersion`, `publishArtifact`
- `addClaim`, `attachEvidence`, `createCitation`, `resolveConflict`
- `createCourse`, `pinKnowledgeVersion`, `enrollLearner`, `recordCompletion`
- `verifyCompetency`, `awardCertification`, `renewCertification`, `revokeCertification`
- `createTranslation`, `markTranslationStale`
- `createAISuggestion`, `recordHumanReviewDecision` (never auto-publish)

## Validation Rules (enforce in services)

- KNW-V-001–014: identity, orphan prevention, evidence before validation
- KNW-V-030–034: completion binds exact course and artifact versions
- Child cannot exceed parent lifecycle (`childExceedsParent`)
- AI content requires `content_origin` and `is_ai_generated`
- Certification award requires `requirements_met` and issuing authority

## Policy Services

- Visibility vs classification (separate evaluation)
- Stewardship assignment enforcement
- COM-002 reference-only bridging (no ID collision)
- Import cannot fabricate review, competency, or certification

## Events

Emit per `data/phase-11/knowledge_event_catalog.json`: `knowledge.*`, `learning.*`, `competency.*`, `certification.*`, `ai.*`

## Migration Needs

- `src/lib/training/types.ts` — legacy training model; migrate to ADP-001 Course/Competency/Certification on W3+
- COM-002 `communication_knowledge` — promotion workflow to `InstitutionalLesson` (reference only)
- Identity trust certifications (`src/lib/identity-trust/`) — separate from ADP-001 operational certifications; document boundary

## W3 Does Not Build

- Human UI workbench (W4)
- Public APIs and webhooks (W5)
- Adaptive intelligence and recommendations (W6)
- Optimization layer (W7)
- Production certification (W8)
