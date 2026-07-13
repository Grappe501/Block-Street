/**
 * CAE-11.7-W13 — Factory tests
 */
import { factoryRuntime } from "./services/factory-service";
import { seedFactoryIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import {
  CAPABILITY_LIFECYCLE_STAGES,
  getFactoryConstitution,
  LIX_FACTORY_PRINCIPLE,
  REQUIRED_FACTORY_SERVICES,
} from "./constitution";
import { checkLixW13Invariants } from "./invariants";
import { explainFactoryAction } from "./traceability";
import { FACTORY_EVENT_CATALOG } from "./events/catalog";

export type LixW13TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW13CertificationTests(): LixW13TestResult[] {
  seedFactoryIfEmpty();
  const results: LixW13TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getFactoryConstitution();
  results.push({ name: "factory_principle", passed: constitution.governing_principle === LIX_FACTORY_PRINCIPLE });
  results.push({
    name: "capability_lifecycle",
    passed: CAPABILITY_LIFECYCLE_STAGES.length === 10,
    detail: `${CAPABILITY_LIFECYCLE_STAGES.length} stages`,
  });
  results.push({
    name: "required_factory_services",
    passed: REQUIRED_FACTORY_SERVICES.length === 12,
    detail: `${REQUIRED_FACTORY_SERVICES.length} services`,
  });
  results.push({ name: "w13_invariants", passed: checkLixW13Invariants().every((i) => i.passed) });
  results.push({
    name: "factory_event_catalog",
    passed: FACTORY_EVENT_CATALOG.length >= 10,
    detail: `${FACTORY_EVENT_CATALOG.length} events`,
  });

  const dashboard = factoryRuntime.factory.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "factory_dashboard",
    passed: dashboard.ai_final_authority === false && dashboard.rollback_always_possible === true,
    detail: dashboard.central_question,
  });

  const capability = factoryRuntime.registry.register({
    institution_id: institutionId,
    name: "County Immersion Analytics",
    owner: humanId,
    category: "analytics",
    purpose: "Extend prediction runtime with county-specific immersion metrics",
    dependencies: ["prediction-runtime"],
    risk_classification: "high",
    lifecycle_stage: "proposal",
  });
  results.push({
    name: "capability_registry",
    passed: capability.capability.governed === true && capability.event === "capability.created",
    detail: capability.capability.capability_id,
  });

  const design = factoryRuntime.designer.design({
    capability_id: capability.capability.capability_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "capability_designer",
    passed: design.ai_assisted === true && design.ai_final_authority === false,
    detail: design.design.design_id,
  });

  const approvedDesign = factoryRuntime.designer.approve(design.design.design_id, institutionId, humanId);
  results.push({
    name: "human_engineering_authority",
    passed: approvedDesign.human_approved === true && approvedDesign.ai_final_authority === false,
    detail: "human approved",
  });

  const review = factoryRuntime.architecture.review({
    capability_id: capability.capability.capability_id,
    institution_id: institutionId,
  });
  results.push({
    name: "architecture_review",
    passed: review.skip_allowed === false && review.review.governance_passed === true,
    detail: review.review.review_id,
  });

  const build = factoryRuntime.build.build({
    capability_id: capability.capability.capability_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "build_pipeline",
    passed: build.reproducible === true && build.build.status === "completed",
    detail: build.build.build_id,
  });

  const certification = factoryRuntime.certification.certify({
    capability_id: capability.capability.capability_id,
    build_id: build.build.build_id,
    institution_id: institutionId,
  });
  results.push({
    name: "testing_certification",
    passed: certification.passed === true && certification.production_ready === true,
    detail: certification.certification.certification_id,
  });

  let productionBlocked = false;
  try {
    factoryRuntime.deployment.start({
      capability_id: capability.capability.capability_id,
      build_id: build.build.build_id,
      institution_id: institutionId,
      human_id: humanId,
      environment: "production",
      approved_by_human: false,
    });
  } catch {
    productionBlocked = true;
  }
  results.push({
    name: "deployment_requires_approval",
    passed: productionBlocked,
    detail: "production blocked",
  });

  const deployment = factoryRuntime.deployment.start({
    capability_id: capability.capability.capability_id,
    build_id: build.build.build_id,
    institution_id: institutionId,
    human_id: humanId,
    environment: "staging",
    approved_by_human: true,
  });
  results.push({
    name: "deployment_runtime",
    passed: deployment.rollback_available === true && deployment.versioned === true,
    detail: deployment.deployment.deployment_id,
  });

  const rollback = factoryRuntime.rollback.execute({
    deployment_id: deployment.deployment.deployment_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "rollback_engine",
    passed: rollback.reversible === true && rollback.deployment_history_preserved === true,
    detail: rollback.rollback.rollback_id,
  });
  results.push({
    name: "rollback_always_possible",
    passed: rollback.reversible === true,
    detail: "reversible",
  });

  const extension = factoryRuntime.marketplace.publish({
    institution_id: institutionId,
    publisher: humanId,
    name: "County Training Playbook Pack",
    category: "playbook",
    validated: true,
  });
  results.push({
    name: "extension_marketplace",
    passed: extension.ownership_preserved === true && extension.event === "extension.published",
    detail: extension.extension.extension_id,
  });

  const evolution = factoryRuntime.evolution.observe({
    capability_id: capability.capability.capability_id,
    institution_id: institutionId,
  });
  results.push({
    name: "capability_evolution",
    passed: evolution.continuous === true,
    detail: evolution.evolution.evolution_id,
  });

  const observatory = factoryRuntime.observatory.measure({ institution_id: institutionId });
  results.push({
    name: "platform_observatory",
    passed: observatory.leadership_visible === true && observatory.observatory.platform_maturity > 0,
    detail: `${observatory.observatory.platform_maturity}`,
  });

  const improvement = factoryRuntime.improvement.propose({
    institution_id: institutionId,
    source: "feature_request",
    title: "Add federation-aware capability sharing",
  });
  results.push({
    name: "continuous_improvement",
    passed: improvement.entered_pipeline === true && improvement.governed === true,
    detail: improvement.improvement.improvement_id,
  });

  const governance = factoryRuntime.governance.track({
    capability_id: capability.capability.capability_id,
    institution_id: institutionId,
    owner: humanId,
  });
  results.push({
    name: "engineering_governance",
    passed: governance.engineering_memory === true && governance.governance.standards_compliant === true,
    detail: governance.governance.governance_id,
  });

  const security = factoryRuntime.factory.security.check("skip_certification");
  results.push({ name: "factory_security", passed: security.allowed === false, detail: "cert required" });

  const trace = explainFactoryAction({
    human_id: humanId,
    action_type: "capability_deploy",
    capability_id: capability.capability.capability_id,
    deployment_id: deployment.deployment.deployment_id,
  });
  results.push({ name: "factory_traceability", passed: trace.includes("reversible"), detail: "explainable" });

  results.push({ name: "no_canonical_mutation", passed: dashboard.mutates_canonical === false, detail: "governed only" });

  return results;
}

export function allLixW13TestsPassed(): boolean {
  return runLixW13CertificationTests().every((t) => t.passed);
}
