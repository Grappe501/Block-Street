/**
 * CAE-11.7-W13 — Factory Constitution (LIX-013)
 */
export const LIX_FACTORY_PRINCIPLE =
  "Institutions should evolve continuously, but never without constitutional governance.";

export const CAPABILITY_LIFECYCLE_STAGES = [
  "idea",
  "proposal",
  "architecture",
  "prototype",
  "testing",
  "certification",
  "deployment",
  "observation",
  "improvement",
  "retirement",
] as const;

export const DEPLOYMENT_ENVIRONMENTS = [
  "development",
  "testing",
  "staging",
  "pilot",
  "production",
] as const;

export const FACTORY_MAY = [
  "design_capabilities_with_ai",
  "propose_improvements",
  "run_architecture_review",
  "execute_build_pipeline",
  "certify_releases",
  "deploy_to_staged_environments",
  "observe_deployments",
  "rollback_safely",
  "publish_extensions",
  "evolve_capabilities",
] as const;

export const FACTORY_MAY_NOT = [
  "deploy_production_without_approval",
  "skip_certification",
  "modify_constitutional_governance",
  "self_authorize_deployments",
  "rewrite_deployment_history",
  "remove_rollback_capability",
  "install_extensions_without_validation",
  "break_backward_compatibility_without_migration",
  "mutate_canonical_outside_governed_workflow",
  "ai_final_engineering_authority",
] as const;

export const REQUIRED_FACTORY_SERVICES = [
  "CapabilityRegistryService",
  "CapabilityDesigner",
  "ArchitectureReviewService",
  "BuildPipelineService",
  "TestingCertificationService",
  "DeploymentService",
  "RollbackService",
  "MarketplaceService",
  "CapabilityEvolutionService",
  "PlatformObservatoryService",
  "ContinuousImprovementService",
  "EngineeringGovernanceService",
] as const;

export function getFactoryConstitution() {
  return {
    protocol_id: "CAE-11.7-W13",
    governing_principle: LIX_FACTORY_PRINCIPLE,
    lifecycle_stages: CAPABILITY_LIFECYCLE_STAGES,
    deployment_environments: DEPLOYMENT_ENVIRONMENTS,
    may: FACTORY_MAY,
    may_not: FACTORY_MAY_NOT,
    required_services: REQUIRED_FACTORY_SERVICES,
  };
}
