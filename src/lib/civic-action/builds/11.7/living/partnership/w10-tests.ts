/**
 * CAE-11.7-W10 — Partnership tests
 */
import { partnershipRuntime } from "./services/partnership-service";
import { seedPartnershipIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getPartnershipConstitution, LIX_PARTNERSHIP_PRINCIPLE, REQUIRED_PARTNERSHIP_SERVICES } from "./constitution";
import { checkLixW10Invariants } from "./invariants";
import { explainPartnershipAction } from "./traceability";
import { PARTNERSHIP_EVENT_CATALOG } from "./events/catalog";

export type LixW10TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW10CertificationTests(): LixW10TestResult[] {
  seedPartnershipIfEmpty();
  const results: LixW10TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getPartnershipConstitution();
  results.push({ name: "partnership_principle", passed: constitution.governing_principle === LIX_PARTNERSHIP_PRINCIPLE });

  results.push({
    name: "required_partnership_services",
    passed: REQUIRED_PARTNERSHIP_SERVICES.length === 12,
    detail: `${REQUIRED_PARTNERSHIP_SERVICES.length} services`,
  });

  results.push({ name: "w10_invariants", passed: checkLixW10Invariants().every((i) => i.passed) });

  results.push({
    name: "partnership_event_catalog",
    passed: PARTNERSHIP_EVENT_CATALOG.length >= 8,
    detail: `${PARTNERSHIP_EVENT_CATALOG.length} events`,
  });

  const dashboard = partnershipRuntime.partnership.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "living_institution_dashboard",
    passed:
      dashboard.invitation_not_instruction === true &&
      dashboard.secret_human_scores === false &&
      dashboard.employee_scores === false,
    detail: dashboard.central_question,
  });

  const rec = partnershipRuntime.recommendations.create({
    human_id: humanId,
    institution_id: institutionId,
    subject: "Volunteer recruitment strategy",
    recommendation: "Increase facilitator recruitment in target counties before expansion.",
  });
  results.push({
    name: "recommendation_transparency",
    passed:
      rec.invitation_not_instruction === true &&
      rec.recommendation.evidence.length > 0 &&
      rec.recommendation.ai_limitations.length > 0 &&
      rec.recommendation.hidden === false,
    detail: rec.recommendation.recommendation_id,
  });

  const trust = partnershipRuntime.trust.calibrate({
    recommendation_id: rec.recommendation.recommendation_id,
    institution_id: institutionId,
  });
  results.push({
    name: "trust_calibration",
    passed: trust.per_recommendation === true && trust.secret_human_score === false,
    detail: `${trust.trust.trust_score}`,
  });

  const recalc = partnershipRuntime.trust.recalculate({
    recommendation_id: rec.recommendation.recommendation_id,
    institution_id: institutionId,
  });
  results.push({
    name: "trust_recalculate",
    passed: recalc.event === "trust.updated",
    detail: recalc.trust.trust_id,
  });

  const wisdom = partnershipRuntime.wisdom.accumulate({
    institution_id: institutionId,
    title: "Partner alignment",
    lesson: "Align county partners before public announcement to avoid coordination gaps.",
    best_practice: true,
  });
  results.push({
    name: "institutional_wisdom",
    passed: wisdom.wisdom.best_practice === true,
    detail: wisdom.wisdom.wisdom_id,
  });

  const selfEval = partnershipRuntime.selfEvaluation.evaluate({
    recommendation_id: rec.recommendation.recommendation_id,
    institution_id: institutionId,
    was_helpful: true,
    evidence_sufficient: true,
  });
  results.push({
    name: "ai_self_evaluation",
    passed: selfEval.transparent === true,
    detail: selfEval.evaluation.evaluation_id,
  });

  const feedback = partnershipRuntime.feedback.submit({
    human_id: humanId,
    institution_id: institutionId,
    recommendation_id: rec.recommendation.recommendation_id,
    accuracy: 4,
    helpfulness: 5,
    completeness: 4,
    clarity: 5,
    suggested_improvements: "Include volunteer retention data",
  });
  results.push({
    name: "human_feedback",
    passed: feedback.hidden_reinforcement === false,
    detail: feedback.feedback.feedback_id,
  });

  const quality = partnershipRuntime.quality.measure({
    institution_id: institutionId,
    recommendation_id: rec.recommendation.recommendation_id,
  });
  results.push({
    name: "recommendation_quality",
    passed: quality.observable === true && quality.quality.hallucination_rate < 0.1,
    detail: `${quality.quality.acceptance_rate}`,
  });

  const outcome = partnershipRuntime.outcomes.record({
    institution_id: institutionId,
    human_id: humanId,
    decision_id: "dec-county-expansion-001",
    decision_subject: "Expand to two counties",
    expected_outcome: "Launch in both counties by September",
    actual_outcome: "One county launched; second delayed 6 weeks",
    lessons_learned: ["Partner onboarding takes longer than forecast"],
  });
  results.push({
    name: "decision_outcome_tracking",
    passed: outcome.outcome.lessons_learned.length > 0,
    detail: outcome.outcome.outcome_id,
  });

  const reflection = partnershipRuntime.learning.recordReflection({
    institution_id: institutionId,
    decision_id: "dec-county-expansion-001",
    outcome_summary: "Phased launch succeeded with one delay",
    reflection: "Institution learned to build partner onboarding buffer into expansion plans.",
  });
  results.push({
    name: "institutional_learning_loop",
    passed: reflection.learning.lessons.length > 0,
    detail: reflection.learning.learning_id,
  });

  const health = partnershipRuntime.health.measure(institutionId);
  results.push({
    name: "organizational_health",
    passed: health.employee_score === false && health.institutional_only === true,
    detail: `${health.health.mission_completion}`,
  });

  const memory = partnershipRuntime.memoryEvolution.evolve({
    institution_id: institutionId,
    memory_key: "county_expansion_policy",
    change_type: "correction",
    change_summary: "Added partner capacity validation requirement",
    changed_by: humanId,
  });
  results.push({
    name: "memory_evolution_versioned",
    passed: memory.silent_deletion === false && memory.evolution.new_version > memory.evolution.previous_version,
    detail: `v${memory.evolution.new_version}`,
  });

  const collaboration = partnershipRuntime.collaboration.activate({
    institution_id: institutionId,
    human_id: humanId,
    pattern: "committee_support",
    context: "Board governance review of expansion plan",
  });
  results.push({
    name: "collaboration_patterns",
    passed: collaboration.replaces_leadership === false && collaboration.ai_adapts === true,
    detail: collaboration.collaboration.pattern,
  });

  const governance = partnershipRuntime.transparency.recordGovernanceChange({
    institution_id: institutionId,
    change_type: "policy",
    title: "Evidence requirement for expansion decisions",
    summary: "All expansion recommendations must cite at least two evidence sources.",
    approved_by: humanId,
  });
  results.push({
    name: "governance_evolution",
    passed: governance.historically_traceable === true,
    detail: governance.governance.governance_id,
  });

  const audit = partnershipRuntime.transparency.audit({
    institution_id: institutionId,
    subject_type: "recommendation",
    subject_id: rec.recommendation.recommendation_id,
    why_recommendation: rec.recommendation.recommendation,
    why_confidence: "Based on evidence and historical accuracy",
    why_sources: rec.recommendation.evidence.join(", "),
    who_approved: null,
    who_changed: humanId,
    why_changed: "Transparency audit for recommendation",
  });
  results.push({
    name: "transparency_audit",
    passed: audit.explainable === true,
    detail: audit.audit.audit_id,
  });

  const security = partnershipRuntime.partnership.security.check("secret_human_trust_scores");
  results.push({ name: "partnership_security", passed: security.allowed === false, detail: "secret scores blocked" });

  const trace = explainPartnershipAction({
    human_id: humanId,
    action_type: "trust_calibration",
    recommendation_id: rec.recommendation.recommendation_id,
    trust_score: trust.trust.trust_score,
  });
  results.push({
    name: "partnership_traceability",
    passed: trace.includes("invitations—not instructions"),
    detail: "explainable",
  });

  results.push({
    name: "no_canonical_mutation",
    passed: dashboard.mutates_canonical === false,
    detail: "advisory only",
  });

  return results;
}

export function allLixW10TestsPassed(): boolean {
  return runLixW10CertificationTests().every((t) => t.passed);
}
