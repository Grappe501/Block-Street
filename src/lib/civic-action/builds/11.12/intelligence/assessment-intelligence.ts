/**
 * CAE-11.12-W6 — Assessment intelligence (protected boundaries)
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeIntelligenceContext } from "./api-context";

export function analyzeAssessmentCoverage(ctx: KnowledgeIntelligenceContext) {
  const assessments = knowledgeApplicationService.listAssessments(ctx.institution_id);
  const courses = knowledgeApplicationService.listCourses(ctx.institution_id);
  const courseIds = new Set(courses.map((c) => c.canonical_id));
  const uncovered = courses.filter(
    (c) => !assessments.some((a) => a.course_id === c.canonical_id)
  );

  return {
    total_assessments: assessments.length,
    courses_without_assessment: uncovered.map((c) => c.canonical_id),
    under_assessed_objectives: uncovered.length > 0 ? ["Some courses lack linked assessments"] : [],
    answer_keys_exposed: false,
    protected_content_exposed: false,
    advisory_only: true as const,
  };
}

export function provideFormativeFeedback(
  ctx: KnowledgeIntelligenceContext,
  input: { concept?: string; protected_assessment_active?: boolean }
) {
  if (input.protected_assessment_active) {
    return {
      feedback: "Concept-level review only during protected assessment.",
      areas_to_review: input.concept ? [`Review fundamentals of ${input.concept}`] : ["Review course materials"],
      practice_suggestions: ["Use practice mode outside protected assessment"],
      answer_key_disclosed: false,
      finalize_allowed: false,
      advisory_only: true as const,
    };
  }
  return {
    feedback: "Formative feedback based on authorized learning context.",
    areas_to_review: ["Review cited knowledge sources"],
    practice_suggestions: ["Complete practice exercises", "Ask tutor for worked example"],
    answer_key_disclosed: false,
    finalize_allowed: false,
    advisory_only: true as const,
  };
}
