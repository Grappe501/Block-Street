/**
 * CAE-11.12-W6 — Competency and capability intelligence (no Human ranking)
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { RoleReadinessResult } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";

export function computeCapabilityCoverage(ctx: KnowledgeIntelligenceContext) {
  const records = knowledgeApplicationService.listCompetencyRecords(ctx.institution_id);
  const byCompetency = new Map<string, number>();
  for (const r of records.filter((r) => r.lifecycle_state === "verified")) {
    byCompetency.set(r.competency_id, (byCompetency.get(r.competency_id) ?? 0) + 1);
  }

  return {
    institution_id: ctx.institution_id,
    competency_coverage: [...byCompetency.entries()].map(([id, count]) => ({
      competency_id: id,
      verified_count: count,
    })),
    human_leaderboard: null,
    trust_scores: null,
    advisory_only: true as const,
  };
}

export function evaluateRoleReadiness(
  ctx: KnowledgeIntelligenceContext,
  input: { role_id: string; required_competency_ids?: string[] }
): RoleReadinessResult {
  const required = input.required_competency_ids ?? [];
  const humanRecords = knowledgeApplicationService.listCompetencyRecords(
    ctx.institution_id,
    ctx.actor_human_id
  );
  const verified = new Set(
    humanRecords.filter((r) => r.lifecycle_state === "verified").map((r) => r.competency_id)
  );
  const missing = required.filter((id) => !verified.has(id));

  if (missing.length === 0 && required.length > 0) {
    return {
      readiness: "ready",
      evidence_summary: "All required competencies verified through authorized records",
      missing_requirements: [],
      next_actions: ["Role assignment remains a separate governed decision"],
      advisory_only: true,
    };
  }
  if (missing.length > 0) {
    return {
      readiness: "missing_required",
      evidence_summary: `${missing.length} required competencies not verified`,
      missing_requirements: missing.map((id) => `Competency ${id} requires explicit verification`),
      next_actions: ["Complete learning and submit evidence for Human review"],
      advisory_only: true,
    };
  }
  return {
    readiness: "human_review_required",
    evidence_summary: "Role requirements not fully specified",
    missing_requirements: ["Define role competency requirements"],
    next_actions: ["POST /api/v1/competencies/evaluate-assignment-eligibility"],
    advisory_only: true,
  };
}

export function detectTeamCapabilityGaps(ctx: KnowledgeIntelligenceContext, teamId: string) {
  const coverage = computeCapabilityCoverage(ctx);
  return {
    team_id: teamId,
    gaps: coverage.competency_coverage
      .filter((c) => c.verified_count < 2)
      .map((c) => ({
        gap_id: caeId("tcg"),
        competency_id: c.competency_id,
        reason: "Insufficient verified facilitators for operational coverage",
        recommendation: "Assign training — not a Human ranking",
      })),
    advisory_only: true as const,
    human_ranking: false,
  };
}
