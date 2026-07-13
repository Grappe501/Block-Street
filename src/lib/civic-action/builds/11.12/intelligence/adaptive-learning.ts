/**
 * CAE-11.12-W6 — Adaptive learning intelligence
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeIntelligenceContext } from "./api-context";

export function getLearnerContext(ctx: KnowledgeIntelligenceContext) {
  const enrollments = knowledgeApplicationService.listEnrollments(ctx.institution_id, ctx.actor_human_id);
  const competencies = knowledgeApplicationService.listCompetencyRecords(ctx.institution_id, ctx.actor_human_id);
  const awards = knowledgeApplicationService.listCertificationAwards(ctx.institution_id, ctx.actor_human_id);

  return {
    human_id: ctx.actor_human_id,
    institution_id: ctx.institution_id,
    active_enrollments: enrollments.filter((e) => e.lifecycle_state === "active").length,
    completed_enrollments: enrollments.filter((e) => e.lifecycle_state === "completed").length,
    verified_competencies: competencies.filter((c) => c.lifecycle_state === "verified").length,
    active_certifications: awards.filter((a) => a.lifecycle_state === "awarded").length,
    advisory_only: true as const,
    note: "Completion does not auto-verify competency",
  };
}

export function recommendAdaptiveNextStep(
  ctx: KnowledgeIntelligenceContext,
  input?: { course_id?: string; goal?: string }
) {
  const learner = getLearnerContext(ctx);
  const enrollments = knowledgeApplicationService.listEnrollments(ctx.institution_id, ctx.actor_human_id);
  const active = enrollments.find((e) => e.lifecycle_state === "active" || e.lifecycle_state === "enrolled");

  const recommendations: string[] = [];
  if (active) {
    recommendations.push("Continue active enrollment — progress does not equal competency verification.");
  } else {
    recommendations.push("Enroll in assigned learning via governed command API.");
  }
  if (input?.goal?.includes("mission") || input?.goal?.includes("practice")) {
    recommendations.push("Consider field-practice Mission — evidence becomes competency candidate only.");
  }
  recommendations.push("Schedule spaced review in seven days via Calendar (event-driven, not direct write).");

  return {
    recommendation_id: caeId("adl"),
    sequence_recommendations: recommendations,
    standards_unchanged: true,
    competency_auto_verify: false,
    certification_auto_award: false,
    prerequisites_inferred: active ? [] : ["Complete prerequisite course if assigned"],
    human_review_required: false,
    advisory_only: true as const,
    learner_context: learner,
  };
}

export function recommendSpacedReview(ctx: KnowledgeIntelligenceContext) {
  const competencies = knowledgeApplicationService.listCompetencyRecords(ctx.institution_id, ctx.actor_human_id);
  return competencies
    .filter((c) => c.lifecycle_state === "verified")
    .map((c) => ({
      competency_id: c.competency_id,
      reason: "Verified competency may benefit from periodic review",
      suggested_interval_days: 7,
      calendar_request_only: true,
      advisory_only: true as const,
    }));
}
