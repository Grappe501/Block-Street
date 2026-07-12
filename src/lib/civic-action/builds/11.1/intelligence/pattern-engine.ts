/**
 * CAE-11.1-W6 — Pattern recognition (institutional insights)
 */
import { initiativeApplicationService } from "../services/application-service";

export type InstitutionalPattern = {
  pattern_id: string;
  title: string;
  description: string;
  confidence: "low" | "medium";
  evidence_count: number;
};

export function detectInstitutionalPatterns(institutionId: string): InstitutionalPattern[] {
  const patterns: InstitutionalPattern[] = [];
  const aggs = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((agg) => agg && agg.initiative.institution_id === institutionId);

  const approvalPending = aggs.filter((a) => a!.initiative.status === "approval_pending").length;
  if (approvalPending >= 2) {
    patterns.push({
      pattern_id: "approval-congestion",
      title: "Approval congestion",
      description: `${approvalPending} Initiatives are waiting for approval — executives may need a batch review session.`,
      confidence: "medium",
      evidence_count: approvalPending,
    });
  }

  const atRisk = aggs.filter((a) => a!.initiative.status === "at_risk").length;
  if (atRisk >= 1) {
    patterns.push({
      pattern_id: "elevated-risk",
      title: "Elevated operational risk",
      description: `${atRisk} Initiative(s) marked at risk in the portfolio.`,
      confidence: atRisk >= 2 ? "medium" : "low",
      evidence_count: atRisk,
    });
  }

  return patterns;
}
