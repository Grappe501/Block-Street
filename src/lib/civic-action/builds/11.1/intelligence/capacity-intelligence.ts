/**
 * CAE-11.1-W6 — Capacity intelligence (workload visibility)
 */
import { initiativeApplicationService } from "../services/application-service";
import { humanLabel } from "../ux/experience-context";
import type { CapacitySnapshot } from "./contracts";

export function analyzeInstitutionCapacity(institutionId: string): CapacitySnapshot[] {
  const counts = new Map<string, { total: number; active: number; approval: number }>();
  const ids = initiativeApplicationService.listInitiativeIds();

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    const owner = agg.initiative.operational_owner_human_id;
    if (!owner) continue;
    const cur = counts.get(owner) ?? { total: 0, active: 0, approval: 0 };
    cur.total++;
    if (agg.initiative.status === "active" || agg.initiative.status === "at_risk") cur.active++;
    if (agg.initiative.status === "approval_pending") cur.approval++;
    counts.set(owner, cur);
  }

  return [...counts.entries()].map(([humanId, c]) => {
    let band: CapacitySnapshot["overload_band"] = "normal";
    let recommendation: string | undefined;
    if (c.total >= 6 || c.active >= 4) {
      band = "high";
      recommendation = "Consider assigning another operational owner or pausing non-critical Initiatives.";
    } else if (c.total >= 4 || c.active >= 3) {
      band = "elevated";
      recommendation = "Workload is elevated — review delegation before accepting new Initiatives.";
    }
    return {
      human_id: humanId,
      human_label: humanLabel(humanId),
      initiative_count: c.total,
      active_initiative_count: c.active,
      approval_pending_count: c.approval,
      overload_band: band,
      recommendation_optional: recommendation,
    };
  }).sort((a, b) => b.initiative_count - a.initiative_count);
}
