/**
 * CAE-11.12-W7 — Curriculum and learning experience evolution
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generateCurriculumEvolutionProposals(institutionId: string): KnowledgeOptimization[] {
  const courses = knowledgeApplicationService.listCourses(institutionId);
  const enrollments = knowledgeApplicationService.listEnrollments(institutionId);
  const recs: KnowledgeOptimization[] = [];

  for (const course of courses) {
    const active = enrollments.filter(
      (e) => e.course_id === course.canonical_id && (e.lifecycle_state === "active" || e.lifecycle_state === "enrolled")
    );
    recs.push({
      optimization_id: `cur-${course.canonical_id}`,
      category: "course_revision",
      title: `Course version impact review: ${course.display_name}`,
      what_changed: `Published version ${course.published_version ?? course.current_version}, ${active.length} active learners.`,
      why: "Course revisions must preserve active learner version binding.",
      confidence: "high",
      evidence: [{ signal_id: course.canonical_id, source: "course", summary: `${active.length} active` }],
      expected_benefit: "Improved learning without invalidating prior completions.",
      potential_risk: "Active learners must remain on enrolled version until migration approved.",
      who_should_review: "Course owner and instructional reviewer",
      suggested_action: "Pilot revision before PublishCourseVersion command.",
      domain_command_required: "PublishCourseVersion",
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
