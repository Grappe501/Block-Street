/**
 * CAE-11.12-W4 — Workspace API helpers
 */
import type { KnowledgeApiContext } from "../api/contracts";
import type { KnowledgeExperienceContext } from "../ux/experience-context";

export const WORKSPACE_CONTRACT_VERSION = "11.12-w4.1";

export function toExperienceContext(apiCtx: KnowledgeApiContext): KnowledgeExperienceContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    institution_name: "Block Street",
    active_membership_id: apiCtx.institution_membership_id,
    initiative_id_optional: apiCtx.initiative_id_optional,
    permissions: apiCtx.effective_permissions,
    locale: apiCtx.locale,
    timezone: apiCtx.timezone,
  };
}

export function workspaceMeta(apiCtx: KnowledgeApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: WORKSPACE_CONTRACT_VERSION,
    advisory_only: true,
    ...extra,
  };
}
