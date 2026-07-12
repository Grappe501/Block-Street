/**
 * CAE-11.2-W6 — Capacity intelligence (mission/task workload)
 */
import { objectiveApplicationService } from "../application-service";
import { humanLabel } from "../ux/experience-context";
import type { CapacitySnapshot } from "./contracts";

export function analyzeObjectiveCapacity(institutionId: string, initiativeId?: string): CapacitySnapshot[] {
  const counts = new Map<string, { missions: number; active: number }>();
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  for (const objective of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(objective.canonical_id);
    if (!bundle) continue;
    for (const mission of bundle.missions) {
      const lead = mission.operational_lead_human_id || objective.operational_owner_human_id;
      if (!lead) continue;
      const cur = counts.get(lead) ?? { missions: 0, active: 0 };
      cur.missions++;
      if (mission.lifecycle_state === "active") cur.active++;
      counts.set(lead, cur);
    }
  }

  return [...counts.entries()]
    .map(([humanId, c]) => {
      let band: CapacitySnapshot["overload_band"] = "normal";
      let recommendation: string | undefined;
      if (c.active >= 5 || c.missions >= 8) {
        band = "high";
        recommendation = "Consider assigning another Mission Lead or deferring new missions.";
      } else if (c.active >= 3 || c.missions >= 5) {
        band = "elevated";
        recommendation = "Workload is elevated — review assignments before accepting new missions.";
      }
      return {
        human_id: humanId,
        human_label: humanLabel(humanId),
        mission_count: c.missions,
        active_mission_count: c.active,
        task_count: 0,
        overload_band: band,
        recommendation_optional: recommendation,
      };
    })
    .sort((a, b) => b.mission_count - a.mission_count);
}
