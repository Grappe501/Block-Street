/**
 * CAE-11.12-W4 — Mission workspace assembler
 */
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";

export function assembleMissionWorkspace(ctx: KnowledgeExperienceContext, missionId: string) {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "mission");

  return {
    shell,
    mission_id: missionId,
    objective: "Connect learning to field practice",
    context: "Mission workspace links required knowledge and competencies to real work.",
    required_knowledge: [] as { id: string; title: string; href: string }[],
    required_competencies: [] as { id: string; title: string; href: string }[],
    checklists: [] as { id: string; label: string; complete: boolean }[],
    lessons_learned_href: "/api/v1/improvements/candidates",
    playbooks: [] as { id: string; title: string; href: string }[],
    advisory_only: true as const,
  };
}
