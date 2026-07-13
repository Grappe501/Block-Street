/**
 * CAE-11.6-W16 — Evolution tests
 */
import { opsEvolutionService } from "./services/evolution-service";
import { seedEvolutionIfEmpty } from "./services/seed";
import { getEvolutionConstitution, OPS_EVOLUTION_PRINCIPLE, REQUIRED_EVOLUTION_SERVICES } from "./constitution";
import { checkOpsW16Invariants } from "./invariants";
import { explainEvolutionAction } from "./traceability";
import { EVOLUTION_EVENT_CATALOG } from "./events/catalog";

export type OpsW16TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW16CertificationTests(): OpsW16TestResult[] {
  seedEvolutionIfEmpty();
  const results: OpsW16TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getEvolutionConstitution();
  results.push({ name: "evolution_principle", passed: constitution.governing_principle === OPS_EVOLUTION_PRINCIPLE });

  results.push({
    name: "required_evolution_services",
    passed: REQUIRED_EVOLUTION_SERVICES.length === 15,
    detail: `${REQUIRED_EVOLUTION_SERVICES.length} services`,
  });

  results.push({ name: "w16_invariants", passed: checkOpsW16Invariants().every((i) => i.passed) });

  const proposals = opsEvolutionService.evolution.list(institutionId);
  results.push({
    name: "evolution_registry",
    passed: proposals.length >= 1,
    detail: `${proposals.length} proposals`,
  });

  const proposed = opsEvolutionService.evolution.propose({
    institution_id: institutionId,
    proposal: "Add automated drift detection scheduling",
    reason: "Continuous Canon integrity monitoring",
    supporting_evidence: ["evd-block-street-001"],
    affected_systems: ["drift", "canonforge"],
    implementation_plan: "Schedule nightly drift scans",
    proposed_by: "usr-001",
  });
  results.push({
    name: "create_evolution_proposal",
    passed: proposed.event === "evolution.proposed",
    detail: proposed.proposal.evolution_id,
  });

  const approved = opsEvolutionService.evolution.approve(proposed.proposal.evolution_id, "usr-001");
  results.push({
    name: "approve_evolution",
    passed: approved.event === "evolution.approved" && approved.human_governed,
    detail: approved.proposal.approval_status,
  });

  const review = opsEvolutionService.architectureReview.review({
    institution_id: institutionId,
    evolution_id: proposed.proposal.evolution_id,
    reviewed_by: "usr-001",
  });
  results.push({
    name: "review_architecture",
    passed: review.event === "architecture.review.completed" && review.measurable,
    detail: `health ${review.review.overall_health.toFixed(2)}`,
  });

  const audit = opsEvolutionService.canonForge.audit(institutionId);
  results.push({
    name: "run_canon_audit",
    passed: audit.constitutional_integrity,
    detail: `${audit.published} published`,
  });

  const drift = opsEvolutionService.driftDetection.detect(institutionId);
  results.push({
    name: "detect_drift",
    passed: drift.constitutional_integrity_protected,
    detail: `${drift.drifts_detected} drifts`,
  });

  const genome = opsEvolutionService.buildGenome.forInstitution(institutionId);
  results.push({
    name: "build_genome",
    passed: !!genome.genome && genome.future_builders_informed,
    detail: genome.build_history.length > 0 ? genome.build_history[0] : "none",
  });

  const clone = opsEvolutionService.cloning.generate({
    source_institution_id: institutionId,
    target_type: "nonprofit",
    target_name: "Community Action Coalition",
    canon_version: "11.6-w16.1",
  });
  results.push({
    name: "generate_institution",
    passed: clone.event === "institution.generated" && clone.certified_canon,
    detail: clone.clone.target_type,
  });

  const docs = opsEvolutionService.documentation.generate(institutionId);
  results.push({
    name: "generate_documentation",
    passed: docs.event === "documentation.generated" && docs.living_documentation,
    detail: `${docs.sync.synced_artifacts.length} artifacts`,
  });

  const factory = opsEvolutionService.factory.generate(institutionId);
  results.push({
    name: "generate_factory_package",
    passed: factory.event === "factory.generated" && factory.certified_canon,
    detail: factory.package.birth_certificate,
  });

  const twin = opsEvolutionService.digitalTwin.run({
    institution_id: institutionId,
    simulation_type: "growth",
    parameters: { horizon_months: 24 },
  });
  results.push({
    name: "run_digital_twin",
    passed: twin.event === "digital.twin.completed" && twin.supports_planning,
    detail: twin.twin.simulation_type,
  });

  const canon = opsEvolutionService.canonForge.list(institutionId);
  const published = opsEvolutionService.canonForge.publish(canon[0]!.canon_id, "usr-001");
  results.push({
    name: "publish_new_canon",
    passed: published.event === "canon.updated" && published.human_governed,
    detail: published.canon.version,
  });

  const futureBuild = opsEvolutionService.futureBuilds.queue({
    institution_id: institutionId,
    category: "ai_suggestions",
    title: "AI-assisted architecture review",
    description: "Extend architecture review with AI pre-analysis",
    priority: "medium",
  });
  results.push({
    name: "future_build_queue",
    passed: futureBuild.event === "future.build.queued",
    detail: futureBuild.build.category,
  });

  const research = opsEvolutionService.research.record({
    institution_id: institutionId,
    category: "technology",
    title: "LocalBrain portable institutional nodes",
    summary: "Research on distributed institutional memory",
  });
  results.push({
    name: "research_engine",
    passed: research.feeds_canon_evolution,
    detail: research.research.category,
  });

  const trace = opsEvolutionService.traceability.link({
    institution_id: institutionId,
    object_type: "evolution",
    object_id: proposed.proposal.evolution_id,
    backward_why: "Automated drift detection reduces Canon divergence",
    forward_dependents: ["driftDetectionService", "documentationSyncService"],
  });
  const verified = opsEvolutionService.traceability.verify(institutionId);
  results.push({
    name: "global_traceability",
    passed: trace.impact_analysis_automatic && verified.proposals_traced,
    detail: `${verified.links_count} links`,
  });

  const ai = opsEvolutionService.aiAdvisor.advise(institutionId);
  results.push({
    name: "ai_evolution_advisor",
    passed: ai.advisory_only && ai.may_not_approve && ai.humans_govern,
    detail: ai.architectural_opportunities[0],
  });

  const dashboard = opsEvolutionService.analytics.dashboard(institutionId);
  results.push({
    name: "executive_evolution_dashboard",
    passed: dashboard.advisory_only && dashboard.architecture_health > 0,
    detail: `health ${dashboard.architecture_health.toFixed(2)}`,
  });

  const layers = opsEvolutionService.constitution.layers();
  results.push({
    name: "constitution_layers",
    passed: layers.layers.length === 6 && layers.evolution_frequency.constitution === "explicit_governance_only",
    detail: "6 layers",
  });

  const artifacts = opsEvolutionService.canonForge.generateArtifacts(institutionId);
  results.push({
    name: "canonforge_outputs",
    passed: artifacts.cursor_build_packages.length > 0,
    detail: artifacts.cursor_build_packages[0],
  });

  const localBrain = opsEvolutionService.experience.localBrainPackage(institutionId);
  results.push({
    name: "localbrain_integration",
    passed: localBrain.portable_node && localBrain.institution_memory,
    detail: "portable node",
  });

  const explain = explainEvolutionAction({
    institution_id: institutionId,
    action_type: "approve_evolution",
    evolution_id: approved.proposal.evolution_id,
    evidence_refs: ["evd-block-street-001"],
  });
  results.push({
    name: "evolution_traceability",
    passed: explain.includes(institutionId) && explain.includes(OPS_EVOLUTION_PRINCIPLE),
  });

  results.push({
    name: "evolution_event_catalog",
    passed: EVOLUTION_EVENT_CATALOG.length === 10,
    detail: `${EVOLUTION_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW16TestsPassed(): boolean {
  return runOpsW16CertificationTests().every((t) => t.passed);
}
