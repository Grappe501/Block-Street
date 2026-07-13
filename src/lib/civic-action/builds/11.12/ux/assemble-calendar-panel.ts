/**
 * CAE-11.12-W4 — Calendar panel assembler
 */
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";

export function assembleCalendarPanel(ctx: KnowledgeExperienceContext) {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "home");

  return {
    shell,
    events: [] as { id: string; title: string; when: string; type: string; href: string }[],
    sync_external_allowed: true,
    categories: ["classes", "reviews", "deadlines", "missions", "certification_renewals", "meetings"],
  };
}
