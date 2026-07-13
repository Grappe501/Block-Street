/**
 * CAE-11.12-W6 — Executive knowledge intelligence brief
 */
import { caeId, nowIso } from "../../../utils";
import { computeKnowledgeHealth } from "./quality-intelligence";
import { detectKnowledgeGaps } from "./gap-detection";
import { forecastCertificationExpirations } from "./certification-readiness";
import { computeCapabilityCoverage } from "./competency-intelligence";
import type { KnowledgeIntelligenceContext } from "./api-context";

export function generateExecutiveKnowledgeBrief(ctx: KnowledgeIntelligenceContext) {
  const health = computeKnowledgeHealth(ctx);
  const gaps = detectKnowledgeGaps(ctx);
  const expiring = forecastCertificationExpirations(ctx);
  const coverage = computeCapabilityCoverage(ctx);

  return {
    brief_id: caeId("ekb"),
    institution_id: ctx.institution_id,
    generated_at: nowIso(),
    what_institution_learned: ["Learning completions tracked via event stream — not competency proof"],
    knowledge_at_risk: health.overall_band === "at_risk" ? ["Weak evidence or conflicts detected"] : [],
    critical_documentation_gaps: gaps.slice(0, 3).map((g) => g.description),
    competency_coverage_summary: coverage.competency_coverage,
    expiring_credentials: expiring.length,
    recommended_decisions: [
      "Review knowledge health snapshot",
      "Address documentation gaps through steward workflow",
      "Plan certification renewals via governed commands",
    ],
    individual_human_ranking: null,
    reading_time_minutes: 5,
    advisory_only: true as const,
  };
}
