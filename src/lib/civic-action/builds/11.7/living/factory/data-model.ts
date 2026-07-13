/**
 * CAE-11.7-W13 — Factory data model
 */
import type { CAPABILITY_LIFECYCLE_STAGES, DEPLOYMENT_ENVIRONMENTS } from "./constitution";

export type CapabilityLifecycleStage = (typeof CAPABILITY_LIFECYCLE_STAGES)[number];
export type DeploymentEnvironment = (typeof DEPLOYMENT_ENVIRONMENTS)[number];

export const FACTORY_STORE_KEYS = {
  capabilities: "lix_factory_capabilities",
  designs: "lix_factory_designs",
  reviews: "lix_factory_reviews",
  builds: "lix_factory_builds",
  certifications: "lix_factory_certifications",
  deployments: "lix_factory_deployments",
  rollbacks: "lix_factory_rollbacks",
  extensions: "lix_factory_extensions",
  evolution: "lix_factory_evolution",
  observatory: "lix_factory_observatory",
  improvements: "lix_factory_improvements",
  governance: "lix_factory_governance",
} as const;

export interface CapabilityRecord {
  capability_id: string;
  name: string;
  institution_id: string;
  owner: string;
  category: string;
  version: number;
  purpose: string;
  dependencies: string[];
  interfaces: string[];
  permissions: string[];
  risk_classification: "low" | "medium" | "high" | "critical";
  lifecycle_stage: CapabilityLifecycleStage;
  status: "active" | "retired" | "draft";
  governed: true;
  created_at: string;
}

export interface DesignRecord {
  design_id: string;
  capability_id: string;
  institution_id: string;
  human_id: string;
  architecture: string;
  data_models: string[];
  api_contracts: string[];
  testing_plan: string;
  migration_plan: string;
  ai_assisted: true;
  human_approved: boolean;
  designed_at: string;
}

export interface ArchitectureReviewRecord {
  review_id: string;
  capability_id: string;
  institution_id: string;
  layer_violations: number;
  circular_dependencies: number;
  security_passed: boolean;
  permission_boundaries_passed: boolean;
  governance_passed: boolean;
  approved: boolean;
  reviewed_at: string;
}

export interface BuildRecord {
  build_id: string;
  capability_id: string;
  institution_id: string;
  version: number;
  status: "planning" | "building" | "packaging" | "completed" | "failed";
  reproducible: true;
  started_at: string;
  completed_at: string | null;
}

export interface CertificationRecord {
  certification_id: string;
  capability_id: string;
  build_id: string;
  institution_id: string;
  unit_tests: boolean;
  integration_tests: boolean;
  security_tests: boolean;
  governance_tests: boolean;
  passed: boolean;
  certified_at: string | null;
}

export interface DeploymentRecord {
  deployment_id: string;
  capability_id: string;
  build_id: string;
  institution_id: string;
  environment: DeploymentEnvironment;
  version: number;
  status: "pending_approval" | "deploying" | "deployed" | "rolled_back" | "failed";
  approved_by_human: boolean;
  rollback_available: true;
  deployed_at: string | null;
}

export interface RollbackRecord {
  rollback_id: string;
  deployment_id: string;
  institution_id: string;
  rollback_type: "immediate" | "partial" | "feature_flag" | "blue_green" | "canary" | "data_migration";
  reversible: true;
  executed_at: string;
}

export interface ExtensionRecord {
  extension_id: string;
  institution_id: string;
  publisher: string;
  name: string;
  category: "capability" | "module" | "agent" | "workflow" | "playbook" | "theme" | "learning" | "research" | "integration";
  version: number;
  ownership_preserved: true;
  validated: boolean;
  published_at: string;
}

export interface EvolutionRecord {
  evolution_id: string;
  capability_id: string;
  institution_id: string;
  usage_score: number;
  failure_rate: number;
  maintenance_cost: number;
  improvement_opportunities: string[];
  observed_at: string;
}

export interface ObservatoryRecord {
  observatory_id: string;
  institution_id: string;
  system_health: number;
  deployment_stability: number;
  adoption_rate: number;
  technical_debt: number;
  platform_maturity: number;
  measured_at: string;
}

export interface ImprovementRecord {
  improvement_id: string;
  institution_id: string;
  source: "feature_request" | "support_ticket" | "observation" | "lesson_learned" | "ai_recommendation" | "operational_failure";
  title: string;
  status: "proposed" | "in_pipeline" | "completed";
  entered_pipeline: boolean;
  proposed_at: string;
}

export interface EngineeringGovernanceRecord {
  governance_id: string;
  capability_id: string;
  institution_id: string;
  owner: string;
  architecture_decisions: string[];
  standards_compliant: true;
  security_reviewed: boolean;
  updated_at: string;
}
