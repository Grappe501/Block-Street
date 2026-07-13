/**
 * CAE-11.12-W4 — Knowledge reader assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import { resolveLearningActions } from "./ui-actions";
import type { KnowledgeReaderView } from "./view-models";

export function assembleKnowledgeReader(
  artifactId: string,
  ctx: KnowledgeExperienceContext
): KnowledgeReaderView | null {
  const artifact = knowledgeApplicationService.getArtifact(artifactId);
  if (!artifact || artifact.institution_id !== ctx.institution_id) return null;

  const role = resolveLearningExperienceRole(ctx.permissions);
  const isHistorical = artifact.lifecycle_state === "historical" || artifact.lifecycle_state === "archived";

  return {
    shell: assembleLearningWorkbenchShell(ctx, role, "knowledge"),
    artifact_id: artifact.canonical_id,
    title: artifact.display_name,
    summary: artifact.summary ?? "",
    body_preview: (artifact.body ?? "").slice(0, 500),
    status_label: artifact.lifecycle_state,
    version: artifact.current_version,
    is_historical: isHistorical,
    historical_banner: isHistorical ? t(ctx.locale, "banner.historical") : null,
    effective_date: artifact.updated_at ?? null,
    author_label: artifact.created_by ?? "Institution",
    reviewers: [],
    sources: [],
    confidence_label: artifact.confidence_level ?? "medium",
    related_knowledge: [],
    related_courses: [],
    related_competencies: [],
    ai_command_prompts: [
      "Summarize this article.",
      "Find contradictory guidance.",
      t(ctx.locale, "es.tutor.prompt"),
    ],
    governed_actions: resolveLearningActions(ctx),
  };
}
