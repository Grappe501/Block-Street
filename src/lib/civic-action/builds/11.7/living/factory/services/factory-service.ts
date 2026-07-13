/**
 * CAE-11.7-W13 — Capability Factory Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { seedAutomationIfEmpty } from "../../automation/services/seed";
import type { CapabilityLifecycleStage, DeploymentEnvironment } from "../data-model";
import {
  listBuilds,
  listCapabilities,
  listCertifications,
  listDeployments,
  listDesigns,
  listEngineeringGovernance,
  listEvolution,
  listExtensions,
  listImprovements,
  listObservatory,
  listReviews,
  listRollbacks,
  saveBuild,
  saveCapability,
  saveCertification,
  saveDeployment,
  saveDesign,
  saveEngineeringGovernance,
  saveEvolution,
  saveExtension,
  saveImprovement,
  saveObservatory,
  saveReview,
  saveRollback,
} from "./repository";

export class FactoryError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureFactoryBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
  seedFederationIfEmpty();
  seedAutomationIfEmpty();
}

function getBrain(humanId: string) {
  ensureFactoryBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new FactoryError("FACTORY_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function getCapability(capabilityId: string, institutionId: string) {
  const capability = listCapabilities(institutionId).find((c) => c.capability_id === capabilityId);
  if (!capability) throw new FactoryError("CAPABILITY_NOT_FOUND", "Capability not found");
  return capability;
}

function getDeployment(deploymentId: string, institutionId: string) {
  const deployment = listDeployments(institutionId).find((d) => d.deployment_id === deploymentId);
  if (!deployment) throw new FactoryError("DEPLOYMENT_NOT_FOUND", "Deployment not found");
  return deployment;
}

export const capabilityRegistryService = {
  list: listCapabilities,
  register(input: {
    institution_id: string;
    name: string;
    owner: string;
    category: string;
    purpose: string;
    dependencies?: string[];
    interfaces?: string[];
    permissions?: string[];
    risk_classification?: "low" | "medium" | "high" | "critical";
    lifecycle_stage?: CapabilityLifecycleStage;
  }) {
    const existing = listCapabilities(input.institution_id).filter((c) => c.name === input.name);
    const record = {
      capability_id: caeId("cap"),
      name: input.name,
      institution_id: input.institution_id,
      owner: input.owner,
      category: input.category,
      version: existing.length + 1,
      purpose: input.purpose,
      dependencies: input.dependencies ?? [],
      interfaces: input.interfaces ?? [],
      permissions: input.permissions ?? ["capability.read"],
      risk_classification: input.risk_classification ?? ("medium" as const),
      lifecycle_stage: input.lifecycle_stage ?? ("proposal" as const),
      status: "draft" as const,
      governed: true as const,
      created_at: nowIso(),
    };
    saveCapability(record);
    engineeringGovernanceService.track({
      capability_id: record.capability_id,
      institution_id: input.institution_id,
      owner: input.owner,
    });
    return { capability: record, event: "capability.created" as const, governed: true };
  },
  advance(capabilityId: string, institutionId: string, stage: CapabilityLifecycleStage) {
    const capability = getCapability(capabilityId, institutionId);
    const updated = { ...capability, lifecycle_stage: stage };
    saveCapability(updated);
    return { capability: updated, event: "capability.updated" as const };
  },
};

export const capabilityDesigner = {
  list: listDesigns,
  design(input: {
    capability_id: string;
    institution_id: string;
    human_id: string;
    architecture?: string;
    data_models?: string[];
    api_contracts?: string[];
    testing_plan?: string;
    migration_plan?: string;
    human_approved?: boolean;
  }) {
    getBrain(input.human_id);
    const record = {
      design_id: caeId("dsn"),
      capability_id: input.capability_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      architecture: input.architecture ?? "Layered service architecture with governed API contracts",
      data_models: input.data_models ?? ["CapabilityRecord", "DeploymentRecord"],
      api_contracts: input.api_contracts ?? ["GET /capabilities", "POST /capability/propose"],
      testing_plan: input.testing_plan ?? "Unit integration security governance certification",
      migration_plan: input.migration_plan ?? "Backward-compatible migration with rollback",
      ai_assisted: true as const,
      human_approved: input.human_approved ?? false,
      designed_at: nowIso(),
    };
    saveDesign(record);
    capabilityRegistryService.advance(input.capability_id, input.institution_id, "architecture");
    return {
      design: record,
      ai_assisted: true,
      human_final_authority: true,
      ai_final_authority: false,
    };
  },
  approve(designId: string, institutionId: string, humanId: string) {
    getBrain(humanId);
    const design = listDesigns(institutionId).find((d) => d.design_id === designId);
    if (!design) throw new FactoryError("DESIGN_NOT_FOUND", "Design not found");
    const updated = { ...design, human_approved: true };
    saveDesign(updated);
    return { design: updated, human_approved: true, ai_final_authority: false };
  },
};

export const architectureReviewService = {
  list: listReviews,
  review(input: { capability_id: string; institution_id: string }) {
    const capability = getCapability(input.capability_id, input.institution_id);
    const record = {
      review_id: caeId("arv"),
      capability_id: input.capability_id,
      institution_id: input.institution_id,
      layer_violations: 0,
      circular_dependencies: 0,
      security_passed: true,
      permission_boundaries_passed: true,
      governance_passed: true,
      approved: capability.risk_classification !== "critical",
      reviewed_at: nowIso(),
    };
    saveReview(record);
    if (record.approved) {
      capabilityRegistryService.advance(input.capability_id, input.institution_id, "prototype");
    }
    return {
      review: record,
      approved: record.approved,
      event: record.approved ? ("architecture.approved" as const) : undefined,
      skip_allowed: false,
    };
  },
};

export const buildPipelineService = {
  list: listBuilds,
  build(input: { capability_id: string; institution_id: string; human_id: string }) {
    getBrain(input.human_id);
    const capability = getCapability(input.capability_id, input.institution_id);
    const review = listReviews(input.institution_id).find(
      (r) => r.capability_id === input.capability_id && r.approved
    );
    if (!review) {
      throw new FactoryError("ARCHITECTURE_REVIEW_REQUIRED", "Architecture review required before build");
    }

    const record = {
      build_id: caeId("bld"),
      capability_id: input.capability_id,
      institution_id: input.institution_id,
      version: capability.version,
      status: "completed" as const,
      reproducible: true as const,
      started_at: nowIso(),
      completed_at: nowIso(),
    };
    saveBuild(record);
    capabilityRegistryService.advance(input.capability_id, input.institution_id, "testing");
    return {
      build: record,
      reproducible: true,
      event: "build.completed" as const,
    };
  },
};

export const testingCertificationService = {
  list: listCertifications,
  certify(input: { capability_id: string; build_id: string; institution_id: string }) {
    const build = listBuilds(input.institution_id).find((b) => b.build_id === input.build_id);
    if (!build || build.status !== "completed") {
      throw new FactoryError("BUILD_NOT_READY", "Build must complete before certification");
    }

    const record = {
      certification_id: caeId("crt"),
      capability_id: input.capability_id,
      build_id: input.build_id,
      institution_id: input.institution_id,
      unit_tests: true,
      integration_tests: true,
      security_tests: true,
      governance_tests: true,
      passed: true,
      certified_at: nowIso(),
    };
    saveCertification(record);
    capabilityRegistryService.advance(input.capability_id, input.institution_id, "certification");
    return {
      certification: record,
      passed: true,
      event: "certification.passed" as const,
      production_ready: true,
    };
  },
};

export const deploymentService = {
  list: listDeployments,
  start(input: {
    capability_id: string;
    build_id: string;
    institution_id: string;
    human_id: string;
    environment: DeploymentEnvironment;
    approved_by_human?: boolean;
  }) {
    getBrain(input.human_id);
    const certification = listCertifications(input.institution_id).find(
      (c) => c.capability_id === input.capability_id && c.build_id === input.build_id && c.passed
    );
    if (!certification) {
      throw new FactoryError("CERTIFICATION_REQUIRED", "Certification required before deployment");
    }

    if (input.environment === "production" && !input.approved_by_human) {
      throw new FactoryError("PRODUCTION_APPROVAL_REQUIRED", "Production deployment requires Human approval");
    }

    const capability = getCapability(input.capability_id, input.institution_id);
    const record = {
      deployment_id: caeId("dpl"),
      capability_id: input.capability_id,
      build_id: input.build_id,
      institution_id: input.institution_id,
      environment: input.environment,
      version: capability.version,
      status: "deployed" as const,
      approved_by_human: input.approved_by_human ?? input.environment !== "production",
      rollback_available: true as const,
      deployed_at: nowIso(),
    };
    saveDeployment(record);
    capabilityRegistryService.advance(input.capability_id, input.institution_id, "deployment");
    platformObservatoryService.measure({ institution_id: input.institution_id });
    return {
      deployment: record,
      rollback_available: true,
      event: "deployment.completed" as const,
      versioned: true,
    };
  },
};

export const rollbackService = {
  list: listRollbacks,
  execute(input: {
    deployment_id: string;
    institution_id: string;
    human_id: string;
    rollback_type?: "immediate" | "partial" | "feature_flag" | "blue_green" | "canary" | "data_migration";
  }) {
    getBrain(input.human_id);
    const deployment = getDeployment(input.deployment_id, input.institution_id);
    if (!deployment.rollback_available) {
      throw new FactoryError("ROLLBACK_UNAVAILABLE", "Rollback not available for this deployment");
    }

    const record = {
      rollback_id: caeId("rbk"),
      deployment_id: input.deployment_id,
      institution_id: input.institution_id,
      rollback_type: input.rollback_type ?? ("immediate" as const),
      reversible: true as const,
      executed_at: nowIso(),
    };
    saveRollback(record);
    saveDeployment({ ...deployment, status: "rolled_back" });
    return {
      rollback: record,
      reversible: true,
      event: "rollback.executed" as const,
      deployment_history_preserved: true,
    };
  },
};

export const marketplaceService = {
  list: listExtensions,
  publish(input: {
    institution_id: string;
    publisher: string;
    name: string;
    category: "capability" | "module" | "agent" | "workflow" | "playbook" | "theme" | "learning" | "research" | "integration";
    validated?: boolean;
  }) {
    if (!input.validated) {
      throw new FactoryError("EXTENSION_VALIDATION_REQUIRED", "Extensions require validation before publish");
    }

    const existing = listExtensions(input.institution_id).filter((e) => e.name === input.name);
    const record = {
      extension_id: caeId("ext"),
      institution_id: input.institution_id,
      publisher: input.publisher,
      name: input.name,
      category: input.category,
      version: existing.length + 1,
      ownership_preserved: true as const,
      validated: true,
      published_at: nowIso(),
    };
    saveExtension(record);
    return {
      extension: record,
      ownership_preserved: true,
      event: "extension.published" as const,
    };
  },
};

export const capabilityEvolutionService = {
  list: listEvolution,
  observe(input: { capability_id: string; institution_id: string }) {
    const record = {
      evolution_id: caeId("evo"),
      capability_id: input.capability_id,
      institution_id: input.institution_id,
      usage_score: 0.72,
      failure_rate: 0.04,
      maintenance_cost: 0.35,
      improvement_opportunities: ["Add caching layer", "Improve error recovery", "Expand test coverage"],
      observed_at: nowIso(),
    };
    saveEvolution(record);
    capabilityRegistryService.advance(input.capability_id, input.institution_id, "observation");
    return { evolution: record, continuous: true };
  },
};

export const platformObservatoryService = {
  list: listObservatory,
  measure(input: { institution_id: string }) {
    const deployments = listDeployments(input.institution_id);
    const deployed = deployments.filter((d) => d.status === "deployed").length;
    const record = {
      observatory_id: caeId("obs"),
      institution_id: input.institution_id,
      system_health: 0.91,
      deployment_stability: deployed > 0 ? 0.88 : 0.75,
      adoption_rate: 0.65,
      technical_debt: 0.22,
      platform_maturity: 0.78,
      measured_at: nowIso(),
    };
    saveObservatory(record);
    return { observatory: record, leadership_visible: true };
  },
};

export const continuousImprovementService = {
  list: listImprovements,
  propose(input: {
    institution_id: string;
    source: "feature_request" | "support_ticket" | "observation" | "lesson_learned" | "ai_recommendation" | "operational_failure";
    title: string;
  }) {
    const record = {
      improvement_id: caeId("imp"),
      institution_id: input.institution_id,
      source: input.source,
      title: input.title,
      status: "in_pipeline" as const,
      entered_pipeline: true,
      proposed_at: nowIso(),
    };
    saveImprovement(record);
    return { improvement: record, entered_pipeline: true, governed: true };
  },
};

export const engineeringGovernanceService = {
  list: listEngineeringGovernance,
  track(input: { capability_id: string; institution_id: string; owner: string }) {
    const record = {
      governance_id: caeId("egv"),
      capability_id: input.capability_id,
      institution_id: input.institution_id,
      owner: input.owner,
      architecture_decisions: ["Governed API contracts", "Versioned deployments", "Rollback required"],
      standards_compliant: true as const,
      security_reviewed: true,
      updated_at: nowIso(),
    };
    saveEngineeringGovernance(record);
    return { governance: record, engineering_memory: true };
  },
};

export const factoryRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureFactoryBoot();
    getBrain(input.human_id);
    const capabilities = listCapabilities(input.institution_id);
    const deployments = listDeployments(input.institution_id);
    const certifications = listCertifications(input.institution_id).filter((c) => c.passed);
    const improvements = listImprovements(input.institution_id).filter((i) => i.entered_pipeline);

    return {
      greeting: "Capability Factory",
      central_question: "How does our Institution safely improve itself?",
      capabilities: capabilities.length,
      certified: certifications.length,
      deployed: deployments.filter((d) => d.status === "deployed").length,
      pending_improvements: improvements.length,
      ai_final_authority: false,
      human_engineering_authority: true,
      mutates_canonical: false,
      rollback_always_possible: true,
    };
  },
  security: {
    prohibited: [
      "deploy_production_without_approval",
      "skip_certification",
      "modify_constitutional_governance",
      "self_authorize_deployments",
      "rewrite_deployment_history",
      "remove_rollback_capability",
      "install_extensions_without_validation",
      "ai_final_engineering_authority",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), observable: true };
    },
  },
};

export const factoryRuntime = {
  factory: factoryRuntimeService,
  registry: capabilityRegistryService,
  designer: capabilityDesigner,
  architecture: architectureReviewService,
  build: buildPipelineService,
  certification: testingCertificationService,
  deployment: deploymentService,
  rollback: rollbackService,
  marketplace: marketplaceService,
  evolution: capabilityEvolutionService,
  observatory: platformObservatoryService,
  improvement: continuousImprovementService,
  governance: engineeringGovernanceService,
};
