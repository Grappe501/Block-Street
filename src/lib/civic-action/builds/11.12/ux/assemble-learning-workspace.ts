/**
 * CAE-11.12-W4 — Learning workspace assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { LearningWorkspaceView } from "./view-models";

export function assembleLearningWorkspace(ctx: KnowledgeExperienceContext): LearningWorkspaceView {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "learning");

  const enrollments = knowledgeApplicationService.listEnrollments(ctx.institution_id, ctx.actor_human_id);
  const courses = knowledgeApplicationService.listCourses(ctx.institution_id);
  const courseById = new Map(courses.map((c) => [c.canonical_id, c]));

  const active = enrollments.find((e) => e.lifecycle_state === "active" || e.lifecycle_state === "enrolled");

  return {
    shell,
    learning_path: enrollments.slice(0, 5).map((e) => ({
      course_id: e.course_id ?? "",
      display_name: courseById.get(e.course_id ?? "")?.display_name ?? "Course",
      status: e.lifecycle_state,
      href: `/learning/courses/${e.course_id}`,
    })),
    current_course: active
      ? {
          course_id: active.course_id ?? "",
          display_name: courseById.get(active.course_id ?? "")?.display_name ?? "Course",
          progress_percent: 50,
          href: `/learning/courses/${active.course_id}`,
        }
      : null,
    lesson_progress: [{ lesson_id: "les-1", label: "Introduction", complete: false }],
    time_remaining_label: "About 45 minutes remaining",
    notes_href: "/api/v1/workspace/notes",
    bookmarks_href: "/api/v1/workspace/bookmarks",
    tutor_href: "/learning/tutor",
    assessments: knowledgeApplicationService
      .listAssessments(ctx.institution_id)
      .slice(0, 3)
      .map((a) => ({
        id: a.canonical_id,
        title: a.display_name,
        href: `/learning/assessments/${a.canonical_id}`,
      })),
    certificates_in_progress: [],
    ai_tutor_advisory: true,
  };
}

export function assembleCoursePlayer(courseId: string, ctx: KnowledgeExperienceContext) {
  const course = knowledgeApplicationService.listCourses(ctx.institution_id).find((c) => c.canonical_id === courseId);
  const workspace = assembleLearningWorkspace(ctx);
  return {
    ...workspace,
    current_course: course
      ? {
          course_id: course.canonical_id,
          display_name: course.display_name,
          progress_percent: 50,
          href: `/learning/courses/${course.canonical_id}`,
        }
      : workspace.current_course,
    tutor_note: t(ctx.locale, "tutor.advisory"),
  };
}
