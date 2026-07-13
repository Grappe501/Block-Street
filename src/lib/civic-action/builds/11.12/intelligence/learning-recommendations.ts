/**
 * CAE-11.12-W6 — Learning recommendation engine
 */
import { caeId, nowIso } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { IntelligenceRecommendation } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { scoreToConfidence } from "./utils";

export function generateLearningRecommendations(ctx: KnowledgeIntelligenceContext): IntelligenceRecommendation[] {
  const courses = knowledgeApplicationService
    .listCourses(ctx.institution_id)
    .filter((c) => c.lifecycle_state === "published");
  const enrollments = knowledgeApplicationService.listEnrollments(ctx.institution_id, ctx.actor_human_id);
  const enrolledIds = new Set(enrollments.map((e) => e.course_id));

  const recs: IntelligenceRecommendation[] = [];

  for (const course of courses.filter((c) => !enrolledIds.has(c.canonical_id)).slice(0, 3)) {
    recs.push({
      recommendation_id: caeId("lrc"),
      recommendation_type: "course",
      institution_id: ctx.institution_id,
      subject_type: "Human",
      subject_id: ctx.actor_human_id,
      recommendation: `Consider enrolling in ${course.display_name}`,
      reason: "Published course available in your institution",
      evidence_references: [
        {
          signal_id: course.canonical_id,
          source_type: "Course",
          entity_id: course.canonical_id,
          entity_type: "Course",
          summary: course.description?.slice(0, 120) ?? course.display_name,
          canonical_version: course.current_version,
          publication_state: course.lifecycle_state,
        },
      ],
      canonical_versions: [{ entity_id: course.canonical_id, version: course.current_version }],
      confidence: scoreToConfidence(0.65),
      expected_benefit: "Build institutional knowledge aligned with role requirements",
      possible_downside: "Time commitment required",
      alternatives: ["Review knowledge articles first", "Speak with a mentor"],
      limitations: ["Advisory only — does not enroll automatically"],
      human_action_required: "POST /api/v1/learning/commands EnrollHumanInLearning",
      status: "active",
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
