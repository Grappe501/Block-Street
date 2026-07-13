/**
 * CAE-11.12-W4 — Competency workspace assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { CompetencyWorkspaceView } from "./view-models";

export function assembleCompetencyWorkspace(ctx: KnowledgeExperienceContext): CompetencyWorkspaceView {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "competencies");
  const records = knowledgeApplicationService.listCompetencyRecords(ctx.institution_id, ctx.actor_human_id);
  const competencies = knowledgeApplicationService.listCompetencies(ctx.institution_id);

  return {
    shell,
    competencies: competencies.slice(0, 10).map((c) => {
      const record = records.find((r) => r.competency_id === c.canonical_id);
      return {
        id: c.canonical_id,
        title: c.display_name,
        expected_behavior: c.description ?? "Demonstrated capability for assigned role",
        evidence_summary: record ? "Evidence on file" : "No verification recorded",
        verifier_label: record?.verified_by_human_id ?? null,
        last_reviewed: record?.updated_at ?? null,
        incomplete_items: record ? [] : ["Demonstration evidence required"],
        completion_is_not_competency: true,
        href: `/learning/competencies/${c.canonical_id}`,
      };
    }),
  };
}
