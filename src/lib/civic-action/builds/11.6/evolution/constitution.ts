/**
 * CAE-11.6-W16 — Institutional Evolution & CanonForge Constitution (OPS-002)
 */
export const OPS_EVOLUTION_PRINCIPLE =
  "Institutions should improve themselves without losing their constitutional identity.";

export const EVOLUTION_ARCHITECTURE = [
  "institutional_memory",
  "knowledge_graph",
  "operational_evidence",
  "lessons_learned",
  "improvement_opportunities",
  "evolution_proposals",
  "human_governance",
  "approved_evolution",
  "canon_update",
  "next_generation_institution",
] as const;

export const CONSTITUTION_LAYERS = [
  "constitution",
  "policy",
  "procedure",
  "implementation",
  "configuration",
  "presentation",
] as const;

export const CANON_REGISTRY_OBJECTS = [
  "identity",
  "mission",
  "knowledge",
  "calendar",
  "resource",
  "conversation",
  "institution",
  "federation",
  "automation",
  "prediction",
  "certification",
  "improvement",
  "experience",
  "evolution",
] as const;

export const DRIFT_TYPES = [
  "documentation",
  "schema",
  "api",
  "knowledge",
  "policy",
  "ui",
  "workflow",
  "translation",
] as const;

export const CANON_VERSION_TYPES = [
  "major",
  "minor",
  "patch",
  "experimental",
  "institution_branch",
  "federation_extension",
  "historical_snapshot",
] as const;

export const FUTURE_BUILD_QUEUE_CATEGORIES = [
  "approved_ideas",
  "research_topics",
  "technical_debt",
  "requested_features",
  "ai_suggestions",
  "innovation",
  "community_requests",
] as const;

export const CANON_QUALITY_GATES = [
  "evidence",
  "architectural_review",
  "impact_analysis",
  "testing",
  "documentation",
  "approval",
  "certification",
  "traceability",
] as const;

export const REQUIRED_EVOLUTION_SERVICES = [
  "CanonForgeService",
  "EvolutionService",
  "ConstitutionService",
  "ArchitectureReviewService",
  "DriftDetectionService",
  "BuildGenomeService",
  "FactoryGenerationService",
  "InstitutionCloneService",
  "DocumentationSyncService",
  "DigitalTwinService",
  "ResearchService",
  "FutureBuildQueueService",
  "GlobalTraceabilityService",
  "EvolutionAnalyticsService",
  "AIEvolutionAdvisorService",
] as const;

export const EVOLUTION_COMMANDS = [
  "CreateEvolutionProposal",
  "ReviewArchitecture",
  "RunCanonAudit",
  "DetectDrift",
  "GenerateInstitution",
  "GenerateDocumentation",
  "GenerateFactoryPackage",
  "RunDigitalTwin",
  "ApproveCanonRevision",
  "PublishNewCanon",
] as const;

export const EVOLUTION_AI_MAY_NOT = [
  "Approve constitutional changes without Human governance",
  "Publish Canon revisions without explicit authorization",
  "Silently modify constitutional principles",
  "Bypass Canon quality gates",
  "Generate institutions without certified Canon foundation",
] as const;

export function getEvolutionConstitution() {
  return {
    system_id: "OPS-002",
    build: "11.6",
    wave: "11.6-W16",
    governing_principle: OPS_EVOLUTION_PRINCIPLE,
    architecture: [...EVOLUTION_ARCHITECTURE],
    constitution_layers: [...CONSTITUTION_LAYERS],
    canon_registry_objects: [...CANON_REGISTRY_OBJECTS],
    drift_types: [...DRIFT_TYPES],
    canon_version_types: [...CANON_VERSION_TYPES],
    future_build_categories: [...FUTURE_BUILD_QUEUE_CATEGORIES],
    quality_gates: [...CANON_QUALITY_GATES],
    required_services: [...REQUIRED_EVOLUTION_SERVICES],
    commands: [...EVOLUTION_COMMANDS],
    ai_may_not: [...EVOLUTION_AI_MAY_NOT],
    api_namespace: "/api/v1/evolution",
  };
}
