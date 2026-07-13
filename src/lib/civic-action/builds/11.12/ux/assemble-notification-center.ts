/**
 * CAE-11.12-W4 — Notification center assembler
 */
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";

export function assembleNotificationCenter(ctx: KnowledgeExperienceContext) {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "home");

  return {
    shell,
    groups: [
      { key: "learning", label: "Learning", count: 0, items: [] },
      { key: "reviews", label: "Reviews", count: 0, items: [] },
      { key: "certifications", label: "Certifications", count: 0, items: [] },
      { key: "missions", label: "Missions", count: 0, items: [] },
      { key: "ai_suggestions", label: "AI Suggestions", count: 0, items: [] },
    ],
    can_mute: true,
    can_defer: true,
  };
}
