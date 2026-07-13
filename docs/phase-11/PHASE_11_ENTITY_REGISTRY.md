# Phase 11 Entity Registry

**Updated:** 2026-07-12  
**Live registry:** `src/lib/civic-action/builds/*/entity-registry.ts`

## Build 11.12 — ADP-001 Knowledge Engine (W2)

**Protocol:** CAE-11.12-W2 · **Entities:** 54 · **Store keys:** 46

| Subsystem | Entities | Versioned | Audited |
|-----------|----------|-----------|---------|
| knowledge | KnowledgeDomain, KnowledgeCollection, KnowledgeArtifact, KnowledgeVersion, KnowledgeClaim, Source, Citation, EvidenceReference, KnowledgeRelationship, KnowledgeReview, KnowledgeApproval, Playbook, StandardOperatingProcedure, ResearchProject, ResearchFinding, KnowledgeTranslation, KnowledgeGap, KnowledgeCorrection, KnowledgeAttachment, KnowledgeTag, KnowledgeVersionAudit, KnowledgeHistoryEvent | Most | Yes |
| learning | Course, Module, Lesson, LearningObject, LearningPath, LearningPathStep, LearningEnrollment, LearningCompletion, LearningProgress, CoursePrerequisite, Assessment, AssessmentAttempt, AssessmentResult, AssessmentQuestion, LearningBadge | Most | Yes |
| competency | Skill, Competency, CompetencyLevel, HumanCompetencyRecord, CompetencyEvidence | Most | Yes |
| certification | Certification, CertificationAward, CertificationRequirement | Most | Yes |
| memory | InstitutionalInsight, InstitutionalLesson, InstitutionalMemoryRecord | Yes | Yes |
| ai | TutorConversation, AIKnowledgeSuggestion | Partial | Yes |
| governance | HumanReviewDecision, KnowledgeConflict, KnowledgeSteward, StewardshipAssignment | Partial | Yes |

**COM-002 boundary:** Conversation, Message, and CommunicationKnowledge remain in Build 11.7 — not re-canonicalized in ADP-001.

**Repositories (W3):** CanonicalKnowledgeArtifactRepository, CanonicalKnowledgeClaimRepository, CanonicalCourseRepository, CanonicalCompetencyRepository, CanonicalCertificationRepository, CanonicalEvidenceRepository, CanonicalRelationshipRepository, CanonicalVersionRepository, CanonicalSearchIndexer, CanonicalEventPublisher.

## Other Builds

| Build | System ID | Entity Registry Location |
|-------|-----------|--------------------------|
| 11.1 | INI-001 | `builds/11.1/` initiative entities |
| 11.2 | OBJ-001 | `builds/11.2/entity-registry.ts` (14 execution entities) |
| 11.7 | COM-002 | `builds/11.7/` communication entities |
