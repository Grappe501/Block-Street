/**
 * CAE-11.12-W6 — Permission-aware semantic retrieval
 */
import { searchKnowledge, explainKnowledgeSearchResult } from "../integrations/search-projection";
import { knowledgeApplicationService } from "../application-service";
import { visibilityAllowed } from "../api/assemble-knowledge-view";
import type { KnowledgeIntelligenceContext } from "./api-context";
import type { IntelligenceEvidenceReference } from "./contracts";
import { isCurrentLifecycle, isHistoricalLifecycle } from "./utils";
import type { KnowledgeApiContext } from "../api/contracts";

function toApiCtx(ctx: KnowledgeIntelligenceContext): KnowledgeApiContext {
  return {
    actor_human_id: ctx.actor_human_id,
    service_identity_id_optional: null,
    institution_id: ctx.institution_id,
    institution_membership_id: "intel",
    initiative_id_optional: ctx.initiative_id_optional ?? null,
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    idempotency_key_optional: null,
    locale: ctx.locale,
    timezone: ctx.timezone,
    effective_permissions: ctx.permissions,
  };
}

export function semanticKnowledgeQuery(
  ctx: KnowledgeIntelligenceContext,
  query: string,
  options?: { include_historical?: boolean }
) {
  const hits = searchKnowledge({
    institution_id: ctx.institution_id,
    query,
    include_historical: options?.include_historical,
    actor_permissions: ctx.permissions,
  });

  const evidence: IntelligenceEvidenceReference[] = hits.map((h) => ({
    signal_id: h.entity_id,
    source_type: h.entity_type,
    entity_id: h.entity_id,
    entity_type: h.entity_type,
    summary: h.summary,
    publication_state: h.lifecycle_state,
  }));

  const current = hits.filter((h) => h.is_current);
  const historical = hits.filter((h) => !h.is_current);

  return {
    hits,
    current_count: current.length,
    historical_count: historical.length,
    evidence,
    permission_filtered_before_retrieval: true,
    advisory_only: true as const,
  };
}

export function explainRetrieval(entityId: string, ctx: KnowledgeIntelligenceContext) {
  const explanation = explainKnowledgeSearchResult(entityId, ctx.institution_id);
  if (!explanation) return null;

  const artifact = knowledgeApplicationService.getArtifact(entityId);
  const apiCtx = toApiCtx(ctx);
  if (artifact && !visibilityAllowed(artifact, apiCtx)) return null;

  return {
    ...explanation,
    is_current: explanation.is_current,
    lifecycle_state: explanation.lifecycle_state,
    why_matched: "Permission-filtered keyword retrieval",
    advisory_only: true as const,
  };
}

export function filterArtifactsByPermission(ctx: KnowledgeIntelligenceContext) {
  const apiCtx = toApiCtx(ctx);
  return knowledgeApplicationService
    .listArtifacts(ctx.institution_id)
    .filter((a) => visibilityAllowed(a, apiCtx))
    .map((a) => ({
      id: a.canonical_id,
      display_name: a.display_name,
      lifecycle_state: a.lifecycle_state,
      is_current: isCurrentLifecycle(a.lifecycle_state),
      is_historical: isHistoricalLifecycle(a.lifecycle_state),
      version: a.current_version,
      visibility: a.visibility,
    }));
}
