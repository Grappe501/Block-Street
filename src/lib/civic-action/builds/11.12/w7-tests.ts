/**
 * CAE-11.12-W7 — Knowledge evolution & continuous improvement tests
 */
import {
  knowledgeOptimizationService,
  OPTIMIZATION_PROHIBITED_ACTIONS,
  ACTIVE_ATTEMPT_PROTECTION,
} from "./optimization";
import { queryOptimizationAdvisor } from "./optimization/optimization-advisor";
import { recordOptimizationFeedback, isOptimizationRejected } from "./optimization/feedback-store";
import { extractLearningLessons } from "./optimization/lesson-engine";
import { certificationChangePolicy } from "./optimization/certification-evolution";
import { implementApprovedImprovement } from "./optimization/improvement-implementation";
import {
  createImprovementCandidate,
  createImprovementProposal,
  createImprovementPilot,
  startImprovementPilot,
  stopImprovementPilot,
  transitionProposalStatus,
} from "./optimization/improvement-governance";
import { recordImprovementOutcome } from "./optimization/outcome-measurement";
import {
  createAIImprovementProposal,
  evaluateAIImprovementProposal,
  approveAIConfigurationChange,
} from "./optimization/ai-improvement";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W7TestResult = { name: string; passed: boolean; detail?: string };

export function runKnwW7OptimizationTests(): W7TestResult[] {
  const results: W7TestResult[] = [];
  const institutionId = DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id;

  const overview = knowledgeOptimizationService.getOverview(institutionId);
  results.push({
    name: "optimization_overview",
    passed:
      overview.advisory_only === true &&
      overview.canonical_mutation_allowed === false &&
      overview.contract_version === "11.12-w7.1",
  });

  const optimizations = overview.optimizations;
  const explainable =
    optimizations.length === 0 ||
    optimizations.every(
      (o) =>
        o.why &&
        o.evidence &&
        o.confidence &&
        o.advisory_only &&
        o.expected_benefit &&
        o.who_should_review &&
        o.what_changed
    );
  results.push({ name: "optimizations_explainable", passed: explainable, detail: `${optimizations.length} items` });

  const prohibited = queryOptimizationAdvisor(institutionId, "please publish and rewrite this knowledge automatically");
  results.push({
    name: "advisor_blocks_self_implement",
    passed: prohibited.blocked === true && prohibited.canonical_mutation_allowed === false,
  });

  const brief = knowledgeOptimizationService.buildExecutiveBrief(institutionId);
  results.push({
    name: "executive_improvement_brief",
    passed: !!brief.brief_id && brief.individual_human_ranking === null && brief.advisory_only === true,
  });

  const maturity = knowledgeOptimizationService.getMaturity(institutionId);
  results.push({
    name: "maturity_institution_not_human",
    passed: maturity.human_ranking === null && maturity.individual_scores === null,
    detail: maturity.level,
  });

  const sim = knowledgeOptimizationService.runSimulation(institutionId, {
    scenario_type: "course_revision",
    parameters: {},
  });
  results.push({
    name: "simulation_non_mutating",
    passed: sim.production_mutated === false && sim.advisory_only === true,
  });

  const lessons = extractLearningLessons(institutionId);
  results.push({ name: "lessons_engine_runs", passed: Array.isArray(lessons) });

  recordOptimizationFeedback({
    optimization_id: "opt-knw-test-reject",
    action: "rejected",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_rejection_learns",
    passed: isOptimizationRejected("opt-knw-test-reject", institutionId),
  });

  results.push({
    name: "optimization_prohibited_actions",
    passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
    detail: `${OPTIMIZATION_PROHIBITED_ACTIONS.length} rules`,
  });

  const candidate = createImprovementCandidate({
    institution_id: institutionId,
    candidate_type: "knowledge_revision",
    source_type: "human_suggestion",
    source_id: "test-source",
    title: "Test candidate",
    problem_statement: "Test problem",
    evidence_references: [{ signal_id: "sig-1", source: "test", summary: "evidence" }],
    identified_by_human_id: actorId,
  });
  const proposal = createImprovementProposal({
    candidate_id: candidate.improvement_candidate_id,
    institution_id: institutionId,
    proposal_type: "knowledge_revision",
    proposed_change: "Revise safety claim",
    change_rationale: "Broken source",
    expected_benefit: "Accurate guidance",
    measurement_plan: "Compare error rate",
    rollback_plan: "Restore prior version",
    steward_human_id: actorId,
    approval_authority: "Knowledge steward",
    domain_command_optional: "CreateKnowledgeArtifact",
  });
  results.push({
    name: "improvement_governance_lifecycle",
    passed: !!candidate.improvement_candidate_id && proposal.status === "proposed",
  });

  const pilot = createImprovementPilot({
    improvement_proposal_id: proposal.improvement_proposal_id,
    institution_id: institutionId,
    pilot_type: "course_pilot",
    scope: "Limited learner cohort",
    success_metrics: ["understanding"],
    harm_metrics: ["accessibility"],
    stop_conditions: ["accessibility worsens"],
  });
  transitionProposalStatus(proposal.improvement_proposal_id, "approved_for_pilot");
  startImprovementPilot(pilot.pilot_id);
  stopImprovementPilot(pilot.pilot_id, "failed");
  const pilots = knowledgeOptimizationService.listPilots(institutionId);
  const failedVisible = pilots.some((p) => p.pilot_id === pilot.pilot_id && p.status === "failed");
  results.push({
    name: "pilot_isolation_and_failed_visible",
    passed: pilot.production_isolated === true && failedVisible,
  });

  transitionProposalStatus(proposal.improvement_proposal_id, "approved_for_adoption");
  const impl = implementApprovedImprovement(
    proposal.improvement_proposal_id,
    actorId,
    DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions
  );
  results.push({
    name: "canonical_command_boundary",
    passed: impl.direct_store_mutation === false,
    detail: impl.domain_result_message,
  });

  recordImprovementOutcome({
    improvement_proposal_id: proposal.improvement_proposal_id,
    institution_id: institutionId,
    outcome_category: "improved",
    expected_benefit: "Safer guidance",
    observed_outcome: "Fewer safety errors",
  });
  results.push({
    name: "outcome_measurement",
    passed: knowledgeOptimizationService.listOutcomes(institutionId).length > 0,
  });

  const certPolicy = certificationChangePolicy();
  results.push({
    name: "certification_grandfathering",
    passed: certPolicy.grandfathering_required && certPolicy.historical_record_preserved,
  });

  results.push({
    name: "assessment_active_attempt_protection",
    passed: ACTIVE_ATTEMPT_PROTECTION.enforcement === "version_binding",
  });

  const aiProposal = createAIImprovementProposal({
    institution_id: institutionId,
    observed_failure: "Weak safe refusal",
    proposed_change: "Adjust prompt template",
  });
  const evaluated = evaluateAIImprovementProposal(aiProposal.proposal_id, institutionId);
  const autoDeployBlocked = evaluated?.auto_deploy_forbidden === true;
  const approved = evaluated?.regression_passed ? approveAIConfigurationChange(aiProposal.proposal_id) : null;
  results.push({
    name: "ai_improvement_governance",
    passed: autoDeployBlocked && (evaluated?.status === "rejected" || approved?.status === "approved"),
    detail: evaluated?.status,
  });

  const steward = knowledgeOptimizationService.getStewardPortfolio(institutionId);
  results.push({
    name: "stewardship_no_human_ranking",
    passed: steward.steward_human_ranking === null && steward.punitive_workload_score === null,
  });

  const health = knowledgeOptimizationService.getLearningHealth(institutionId);
  results.push({
    name: "learning_health_no_human_scores",
    passed: health.human_performance_scores === null,
  });

  return results;
}

export function allW7TestsPassed(): boolean {
  return runKnwW7OptimizationTests().every((t) => t.passed);
}
