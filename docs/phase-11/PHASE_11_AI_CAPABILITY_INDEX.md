# Phase 11 AI Capability Index — Knowledge Intelligence (ADP-001)

**Build:** 11.12 · **Protocol:** W6 · **Registry:** `data/phase-11/knowledge_intelligence_registry.json`

## Orchestration

| Capability | Service | Route |
|------------|---------|-------|
| Intelligence orchestration | `KnowledgeIntelligenceOrchestrator` | All `/api/v1/intelligence/*` |
| AI copilot | `KnowledgeCopilot` | `POST /api/v1/ai/knowledge/query` |

## Knowledge

| Capability | Service |
|------------|---------|
| Semantic retrieval | `SemanticKnowledgeSearchService` |
| Graph intelligence | `KnowledgeGraphIntelligenceService` |
| Quality / freshness | `KnowledgeQualityService` |
| Gap detection | `KnowledgeGapDetectionService` |
| Duplicate detection | `DuplicateKnowledgeDetection` |
| Contradiction detection | `ContradictionDetectionService` |

## Learning & Capability

| Capability | Service |
|------------|---------|
| Adaptive learning | `AdaptiveLearningService` |
| Learning recommendations | `LearningRecommendationService` |
| Competency intelligence | `CompetencyIntelligenceService` |
| Certification readiness | `CertificationReadinessService` |
| Assessment intelligence | `AssessmentIntelligenceService` |

## Research, Memory, Tutor

| Capability | Service |
|------------|---------|
| Research synthesis | `ResearchIntelligenceService` |
| Institutional memory | `InstitutionalMemoryIntelligenceService` |
| Explainable tutor | `AITutorOrchestrator` |
| Executive brief | `ExecutiveKnowledgeBriefService` |

## Oversight

| Capability | Service |
|------------|---------|
| Privacy controls | `IntelligencePrivacyService` |
| AI provenance | `AIProvenanceService` |
| AI incidents | `AIIncidentService` |
| Human review routing | `AIHumanOversightService` |
| Evaluation suite | `IntelligenceEvaluationSuite` |

**Boundary:** All capabilities set `canonical_mutation_allowed: false`.
