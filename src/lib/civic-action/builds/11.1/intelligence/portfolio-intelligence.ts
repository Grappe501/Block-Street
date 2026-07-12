/**
 * CAE-11.1-W6 — Portfolio intelligence
 */
import { listInitiativeOperationalProjections } from "../integrations/analytics-projection";
import { initiativeApplicationService } from "../services/application-service";
import { detectInstitutionalPatterns } from "./pattern-engine";
import { detectOperationalRisks } from "./risk-intelligence";
import { analyzeInstitutionCapacity } from "./capacity-intelligence";
import { detectDuplicateCandidates } from "./duplicate-detection";

export function assemblePortfolioIntelligence(institutionId: string) {
  const ids = initiativeApplicationService.listInitiativeIds();
  const initiatives = ids
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((agg) => agg && agg.initiative.institution_id === institutionId);

  const byStatus: Record<string, typeof initiatives> = {};
  for (const agg of initiatives) {
    const s = agg!.initiative.status;
    if (!byStatus[s]) byStatus[s] = [];
    byStatus[s].push(agg!);
  }
  const risks = detectOperationalRisks(institutionId);
  const capacity = analyzeInstitutionCapacity(institutionId);
  const duplicates = detectDuplicateCandidates(institutionId, 0.65);
  const patterns = detectInstitutionalPatterns(institutionId);
  const projections = listInitiativeOperationalProjections(institutionId);

  return {
    institution_id: institutionId,
    totals: {
      initiatives: initiatives.length,
      active: byStatus.active?.length ?? 0,
      at_risk: byStatus.at_risk?.length ?? 0,
      approval_pending: byStatus.approval_pending?.length ?? 0,
      owner_required: byStatus.owner_required?.length ?? 0,
    },
    health: {
      mission_health: projections.filter((p) => p.health === "healthy").length,
      risk_health: risks.filter((r) => r.severity === "high" || r.severity === "critical").length,
      capacity_elevated: capacity.filter((c) => c.overload_band !== "normal").length,
      duplicate_candidates: duplicates.length,
    },
    patterns,
    upcoming_bottlenecks: [
      ...(byStatus.approval_pending?.length ? [`${byStatus.approval_pending.length} approval(s) waiting`] : []),
      ...(capacity.filter((c) => c.overload_band === "high").map((c) => `${c.human_label} overloaded`)),
    ],
    advisory_only: true,
  };
}
