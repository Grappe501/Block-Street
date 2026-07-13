/**
 * CAE-11.12-W7 — Lessons from learning completions and missions
 */
import { knowledgeApplicationService } from "../application-service";
import { nowIso } from "../../../utils";

export type StructuredLesson = {
  lesson_id: string;
  source_type: "course_completion" | "mission" | "assessment";
  source_id: string;
  observation: string;
  recommendation: string;
  evidence: string;
  confidence: string;
  occurred_at: string;
};

export function extractLearningLessons(institutionId: string): StructuredLesson[] {
  const enrollments = knowledgeApplicationService
    .listEnrollments(institutionId)
    .filter((e) => e.lifecycle_state === "completed");

  return enrollments.slice(0, 5).map((e) => ({
    lesson_id: `les-${e.canonical_id}`,
    source_type: "course_completion",
    source_id: e.canonical_id,
    observation: `Enrollment ${e.canonical_id} completed for course ${e.course_id}`,
    recommendation: "Capture whether completion improved field practice — does not auto-verify competency.",
    evidence: "Completion event — not competency proof",
    confidence: "observed",
    occurred_at: e.updated_at ?? nowIso(),
  }));
}
