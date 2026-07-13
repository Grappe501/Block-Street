/**
 * CAE-11.12-W7 — Competency framework evolution
 */
import { toIntelligenceContext } from "../intelligence/api-context";
import { detectTeamCapabilityGaps } from "../intelligence/competency-intelligence";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export type CompetencyTransitionPolicy = {
  policy: "no_effect" | "review_existing" | "require_refresher" | "require_reassessment" | "case_by_case";
  grandfathering_required: true;
  human_approval_required: true;
};

export function generateCompetencyEvolutionProposals(institutionId: string): KnowledgeOptimization[] {
  const ctx = toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "comp-evo",
    correlation_id: "comp-evo",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });

  const gaps = detectTeamCapabilityGaps(ctx, "team-default");
  return gaps.gaps.map((g) => ({
    optimization_id: `cev-${g.gap_id}`,
    category: "competency_revision",
    title: `Competency coverage gap: ${g.competency_id}`,
    what_changed: g.reason,
    why: "Role requirements may need updated competency standards.",
    confidence: "medium",
    evidence: [{ signal_id: g.competency_id, source: "capability", summary: g.reason }],
    expected_benefit: "Adequate trained facilitators for operations.",
    potential_risk: "Requirement changes need explicit transition policy.",
    who_should_review: "Competency authority",
    suggested_action: g.recommendation,
    domain_command_required: null,
    human_approval_required: true,
    advisory_only: true,
    generated_at: nowIso(),
  }));
}

export function defaultTransitionPolicy(): CompetencyTransitionPolicy {
  return {
    policy: "case_by_case",
    grandfathering_required: true,
    human_approval_required: true,
  };
}
