/**
 * CAE-11.12-W7 — Research agenda evolution
 */
import { toIntelligenceContext } from "../intelligence/api-context";
import { detectResearchGaps } from "../intelligence/research-intelligence";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generateResearchAgendaCandidates(institutionId: string): KnowledgeOptimization[] {
  const ctx = toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "res-evo",
    correlation_id: "res-evo",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });

  return detectResearchGaps(ctx).map((g) => ({
    optimization_id: `res-${g.gap_id}`,
    category: "research_priority",
    title: g.theme,
    what_changed: g.description,
    why: "Institutional uncertainty requires governed research.",
    confidence: g.confidence,
    evidence: [{ signal_id: g.gap_id, source: "research", summary: g.theme }],
    expected_benefit: g.recommended_action,
    potential_risk: "Findings do not automatically become policy.",
    who_should_review: "Research governance board",
    suggested_action: g.recommended_action,
    domain_command_required: null,
    human_approval_required: true,
    advisory_only: true,
    generated_at: nowIso(),
  }));
}

export const FINDING_ADOPTION_RULE = "Research findings require review before adoption — never automatic policy.";
