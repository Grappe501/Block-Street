/**
 * CAE-11.12-W5 — Permission-aware knowledge projections
 */
import type { KnowledgeArtifactRecord } from "../data-model";
import type { KnowledgeApiContext, KnowledgeArtifactView, KnowledgeViewLevel } from "./contracts";
import { LIFECYCLE_ACTION_ROUTES } from "./contracts";

function resolveViewLevel(apiCtx: KnowledgeApiContext): KnowledgeViewLevel {
  if (apiCtx.effective_permissions.includes("civic_action.manage")) return "administrator";
  if (apiCtx.effective_permissions.includes("civic_action.view")) return "contributor";
  return "member";
}

function statusLabel(state: string, locale: "en" | "es"): string {
  const labels: Record<string, { en: string; es: string }> = {
    draft: { en: "Draft", es: "Borrador" },
    review: { en: "In review", es: "En revisión" },
    validated: { en: "Validated", es: "Validado" },
    published: { en: "Published", es: "Publicado" },
    operational: { en: "Operational", es: "Operativo" },
    historical: { en: "Historical", es: "Histórico" },
    archived: { en: "Archived", es: "Archivado" },
  };
  return labels[state]?.[locale] ?? state;
}

function isRestrictedVisibility(visibility: KnowledgeArtifactRecord["visibility"]): boolean {
  return visibility === "private";
}

export function visibilityAllowed(artifact: KnowledgeArtifactRecord, apiCtx: KnowledgeApiContext): boolean {
  if (artifact.institution_id !== apiCtx.institution_id) return false;
  if (isRestrictedVisibility(artifact.visibility)) {
    return apiCtx.effective_permissions.includes("civic_action.manage");
  }
  return apiCtx.effective_permissions.includes("civic_action.view") || apiCtx.effective_permissions.includes("civic_action.manage");
}

export function assembleArtifactView(
  artifact: KnowledgeArtifactRecord,
  apiCtx: KnowledgeApiContext
): KnowledgeArtifactView {
  const viewLevel = resolveViewLevel(apiCtx);
  const availableActions = Object.keys(LIFECYCLE_ACTION_ROUTES).filter((action) => {
    if (artifact.lifecycle_state === "draft" && action === "submit-review") return true;
    if (artifact.lifecycle_state === "review" && (action === "validate" || action === "approve")) return true;
    if (artifact.lifecycle_state === "validated" && action === "publish") return true;
    return false;
  });

  return {
    id: artifact.canonical_id,
    public_id: artifact.public_id,
    institution_id: artifact.institution_id,
    initiative_id_optional: artifact.initiative_id ?? null,
    display_name: artifact.display_name,
    summary: artifact.summary?.slice(0, 280) ?? "",
    artifact_type: artifact.artifact_type,
    lifecycle_state: artifact.lifecycle_state,
    status_label: statusLabel(artifact.lifecycle_state, apiCtx.locale),
    language: artifact.language,
    visibility: artifact.visibility,
    confidence_level: artifact.confidence_level,
    evidence_status: artifact.evidence_status,
    version: artifact.current_version,
    is_current: artifact.lifecycle_state !== "historical" && artifact.lifecycle_state !== "archived",
    created_at: artifact.created_at,
    updated_at: artifact.updated_at,
    view_level: viewLevel,
    permissions: apiCtx.effective_permissions.filter((p) => p.startsWith("civic_action") || p.startsWith("training")),
    available_actions: availableActions,
  };
}

export function redactRestrictedSnippet(text: string, allowed: boolean): string {
  if (allowed) return text.slice(0, 200);
  return "[restricted]";
}
