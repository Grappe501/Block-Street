/**
 * CAE-11.2-W6 — Timeline intelligence (date collisions)
 */
import { objectiveApplicationService } from "../application-service";

export type TimelineCollision = {
  collision_id: string;
  objective_id: string;
  mission_id: string;
  date: string;
  label: string;
  severity: "low" | "medium" | "high";
};

export function detectTimelineCollisions(institutionId: string, initiativeId?: string): TimelineCollision[] {
  const byDate = new Map<string, { objective_id: string; mission_id: string; label: string }[]>();
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  for (const objective of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(objective.canonical_id);
    if (!bundle) continue;
    for (const mission of bundle.missions) {
      const date = mission.finish_date;
      if (!date) continue;
      const list = byDate.get(date) ?? [];
      list.push({ objective_id: objective.canonical_id, mission_id: mission.canonical_id, label: mission.display_name });
      byDate.set(date, list);
    }
  }

  const collisions: TimelineCollision[] = [];
  for (const [date, items] of byDate.entries()) {
    if (items.length < 2) continue;
    for (const item of items) {
      collisions.push({
        collision_id: `col-${date}-${item.mission_id}`,
        objective_id: item.objective_id,
        mission_id: item.mission_id,
        date,
        label: `${items.length} missions share finish date ${date}`,
        severity: items.length >= 4 ? "high" : items.length >= 2 ? "medium" : "low",
      });
    }
  }
  return collisions;
}
