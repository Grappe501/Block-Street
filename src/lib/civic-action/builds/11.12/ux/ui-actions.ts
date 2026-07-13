/**
 * CAE-11.12-W4 — Governed learning UI actions (no status dropdowns)
 */
import type { KnowledgeExperienceContext } from "./experience-context";
import type { LearningUiAction } from "./view-models";

export function resolveLearningActions(ctx: KnowledgeExperienceContext): LearningUiAction[] {
  const canManage = ctx.permissions.includes("civic_action.manage");
  const canTrain = ctx.permissions.includes("training.view");

  return [
    {
      action_key: "EnrollInCourse",
      label: "Enroll in course",
      description: "Start or resume governed learning enrollment.",
      available: canTrain,
      blocked_reason_optional: canTrain ? undefined : "Training access required.",
      requires_confirmation: false,
      endpoint_or_command: "/api/v1/learning/commands",
      permission_key: "training.view",
    },
    {
      action_key: "SubmitKnowledgeArtifactForReview",
      label: "Submit for review",
      description: "Send draft knowledge to steward review.",
      available: canManage,
      blocked_reason_optional: canManage ? undefined : "Steward or editor access required.",
      requires_confirmation: true,
      endpoint_or_command: "/api/v1/knowledge/commands",
      permission_key: "civic_action.manage",
    },
    {
      action_key: "RecordLearningProgress",
      label: "Record progress",
      description: "Save lesson progress without auto-certifying competency.",
      available: canTrain,
      blocked_reason_optional: canTrain ? undefined : "Enrollment required.",
      requires_confirmation: false,
      endpoint_or_command: "/api/v1/learning/commands",
      permission_key: "training.view",
    },
  ].filter((a) => !a.label.toLowerCase().includes("change status"));
}
