/**
 * CAE-11.7-W7 — Learning tests
 */
import { learningRuntime } from "./services/learning-service";
import { seedLearningIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getLearningConstitution, LIX_LEARNING_PRINCIPLE, REQUIRED_LEARNING_SERVICES } from "./constitution";
import { checkLixW7Invariants } from "./invariants";
import { explainLearningAction } from "./traceability";
import { LEARNING_EVENT_CATALOG } from "./events/catalog";

export type LixW7TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW7CertificationTests(): LixW7TestResult[] {
  seedLearningIfEmpty();
  const results: LixW7TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getLearningConstitution();
  results.push({ name: "learning_principle", passed: constitution.governing_principle === LIX_LEARNING_PRINCIPLE });

  results.push({
    name: "required_learning_services",
    passed: REQUIRED_LEARNING_SERVICES.length === 13,
    detail: `${REQUIRED_LEARNING_SERVICES.length} services`,
  });

  results.push({ name: "w7_invariants", passed: checkLixW7Invariants().every((i) => i.passed) });

  results.push({
    name: "learning_event_catalog",
    passed: LEARNING_EVENT_CATALOG.length >= 9,
    detail: `${LEARNING_EVENT_CATALOG.length} events`,
  });

  const dashboard = learningRuntime.learning.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "learning_dashboard",
    passed: dashboard.human_worth_score === null && dashboard.auto_certify === false,
    detail: dashboard.greeting,
  });

  const competencies = learningRuntime.competencies.list(institutionId);
  results.push({
    name: "competency_framework",
    passed: competencies.length >= 2 && competencies.every((c) => c.explainable === true),
    detail: `${competencies.length} competencies`,
  });

  const courses = learningRuntime.curriculum.listCourses(institutionId);
  results.push({
    name: "curriculum_runtime",
    passed: courses.length >= 1 && !!courses[0].learning_objective,
    detail: courses[0]?.title,
  });

  const plan = learningRuntime.plans.create({
    human_id: humanId,
    institution_id: institutionId,
    role_context: "Organizer",
    goals: ["Improve canvassing skills"],
    language: "es",
  });
  results.push({
    name: "personalized_learning_plan",
    passed: plan.plan.evolving && plan.plan.language === "es",
    detail: plan.plan.plan_id,
  });

  const tutorEn = learningRuntime.tutor.session({
    human_id: humanId,
    institution_id: institutionId,
    topic: "Volunteer coordination",
    language: "en",
  });
  const tutorEs = learningRuntime.tutor.session({
    human_id: humanId,
    institution_id: institutionId,
    topic: "Coordinación de voluntarios",
    language: "es",
  });
  results.push({
    name: "ai_tutor_multilingual",
    passed: tutorEn.spanish_supported && tutorEs.language === "es",
    detail: "en/es",
  });

  const graph = learningRuntime.competencyGraph.list(institutionId);
  results.push({ name: "competency_graph", passed: graph.length >= 1, detail: `${graph.length} nodes` });

  let certBlocked = false;
  try {
    learningRuntime.certifications.request({
      human_id: humanId,
      institution_id: institutionId,
      name: "Auto Cert",
      certification_type: "internal",
      competency_ids: [],
      evidence: [],
    });
  } catch {
    certBlocked = true;
  }
  results.push({ name: "certification_requires_evidence", passed: certBlocked, detail: "evidence required" });

  const certReq = learningRuntime.certifications.request({
    human_id: humanId,
    institution_id: institutionId,
    name: "Volunteer Facilitator",
    certification_type: "volunteer",
    competency_ids: [competencies[0].competency_id],
    evidence: ["Completed facilitator training", "Supervisor attestation"],
  });
  results.push({
    name: "certification_pending",
    passed: certReq.auto_awarded === false && certReq.certification.ai_self_certified === false,
    detail: certReq.certification.status,
  });

  const awarded = learningRuntime.certifications.award(certReq.certification.certification_id, humanId, "usr-admin");
  results.push({
    name: "certification_human_awarded",
    passed: awarded.ai_self_certified === false && awarded.certification.awarded_by === "usr-admin",
    detail: awarded.certification.status,
  });

  const sim = learningRuntime.simulations.start({
    human_id: humanId,
    institution_id: institutionId,
    scenario_type: "public_meeting",
    title: "County board presentation practice",
    description: "Simulate presenting county immersion plan to board.",
  });
  const completed = learningRuntime.simulations.complete(sim.simulation.simulation_id, humanId, 85);
  results.push({
    name: "simulation_engine",
    passed: completed.mutates_canonical === false && sim.practice_environment === true,
    detail: `score ${completed.simulation.score}`,
  });

  const gap = learningRuntime.gaps.detect({
    human_id: humanId,
    institution_id: institutionId,
    gap_type: "training",
    subject: "Emergency response",
    description: "No recent emergency response training on record.",
    priority: "medium",
  });
  results.push({
    name: "knowledge_gap_detection",
    passed: gap.deficiencies_visible === true,
    detail: gap.gap.gap_id,
  });

  const mentor = learningRuntime.mentors.recommend({
    human_id: humanId,
    institution_id: institutionId,
    mentor_human_id: "usr-002",
    expertise: ["public_speaking"],
    reason: "Experienced speaker for media interview prep.",
  });
  results.push({
    name: "mentor_recommendation",
    passed: mentor.auto_assigned === false && mentor.mentor.recommendation_only === true,
    detail: mentor.mentor.mentor_id,
  });

  const experience = learningRuntime.experience.convert({
    mission_id: "msn-block-street-001",
    institution_id: institutionId,
    human_id: humanId,
    lessons_learned: ["Document county contacts early"],
    case_study: "Volunteer training launch retrospective",
  });
  results.push({
    name: "experience_to_learning",
    passed: experience.governed_review === true && experience.auto_published === false,
    detail: experience.experience.experience_id,
  });

  const university = learningRuntime.university.get(institutionId);
  results.push({
    name: "institutional_university",
    passed: !!university && university.departments.length >= 2,
    detail: university?.name,
  });

  const analytics = learningRuntime.analytics.compute({ institution_id: institutionId, human_id: humanId });
  results.push({
    name: "learning_analytics",
    passed: analytics.ranks_human_worth === false && analytics.analytics.human_worth_score === null,
    detail: `${analytics.analytics.progress_pct}% progress`,
  });

  let assessBlocked = false;
  try {
    learningRuntime.governance.assess({
      human_id: humanId,
      institution_id: institutionId,
      course_id: courses[0].course_id,
      score: 95,
      evaluator: "ai-only",
    });
  } catch {
    assessBlocked = true;
  }
  results.push({ name: "human_evaluator_required", passed: assessBlocked, detail: "ai-only blocked" });

  const governance = learningRuntime.governance.check("auto_certify");
  results.push({ name: "learning_governance", passed: governance.allowed === false, detail: "auto certify blocked" });

  const promotion = learningRuntime.learning.promote({
    human_id: humanId,
    institution_id: institutionId,
    experience_id: experience.experience.experience_id,
    target: "curriculum",
  });
  results.push({
    name: "learning_promotion",
    passed: promotion.governed_review === true && promotion.mutates_canonical === false,
    detail: promotion.promotion_status,
  });

  const trace = explainLearningAction({
    human_id: humanId,
    action_type: "plan",
    competency_id: competencies[0].competency_id,
    evidence_based: true,
  });
  results.push({
    name: "learning_traceability",
    passed: trace.includes("Humans govern certifications"),
    detail: "explainable",
  });

  return results;
}

export function allLixW7TestsPassed(): boolean {
  return runLixW7CertificationTests().every((t) => t.passed);
}
