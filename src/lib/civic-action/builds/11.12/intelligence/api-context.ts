/**
 * CAE-11.12-W6 — Intelligence API context bridge
 */
import type { KnowledgeApiContext } from "../api/contracts";
import type { IntelligenceRequest } from "./contracts";

export type KnowledgeIntelligenceContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string | null;
  permissions: string[];
  locale: "en" | "es";
  timezone: string;
  request_id: string;
  correlation_id: string;
};

export function toIntelligenceContext(
  apiCtx: KnowledgeApiContext,
  extra?: { initiativeId?: string | null }
): KnowledgeIntelligenceContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    initiative_id_optional: extra?.initiativeId ?? apiCtx.initiative_id_optional,
    permissions: apiCtx.effective_permissions,
    locale: apiCtx.locale,
    timezone: apiCtx.timezone,
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
  };
}

export function buildIntelligenceRequest(
  ctx: KnowledgeIntelligenceContext,
  input: {
    request_type: IntelligenceRequest["request_type"];
    purpose: string;
    query?: string;
    target_entity_type?: string;
    target_entity_id?: string;
    course_id?: string;
    lesson_id?: string;
    competency_id?: string;
    depth?: IntelligenceRequest["requested_depth"];
  }
): IntelligenceRequest {
  return {
    intelligence_request_id: `int-req-${ctx.request_id}`,
    request_type: input.request_type,
    institution_id: ctx.institution_id,
    requesting_human_id: ctx.actor_human_id,
    purpose: input.purpose,
    target_entity_type_optional: input.target_entity_type ?? null,
    target_entity_id_optional: input.target_entity_id ?? null,
    course_id_optional: input.course_id ?? null,
    lesson_id_optional: input.lesson_id ?? null,
    competency_id_optional: input.competency_id ?? null,
    language: ctx.locale,
    requested_depth: input.depth ?? "standard",
    query_optional: input.query,
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    created_at: new Date().toISOString(),
  };
}
