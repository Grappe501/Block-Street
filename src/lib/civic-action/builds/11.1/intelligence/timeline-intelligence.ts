/**
 * CAE-11.1-W6 — Timeline collision intelligence
 */
import { initiativeApplicationService } from "../services/application-service";

export type TimelineCollision = {
  initiative_id_a: string;
  initiative_id_b: string;
  collision_type: "activation" | "completion" | "review";
  date: string;
  explanation: string;
};

export function detectTimelineCollisions(institutionId: string): TimelineCollision[] {
  const items: { id: string; activation?: string; completion?: string; review?: string }[] = [];
  for (const id of initiativeApplicationService.listInitiativeIds()) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    const t = agg.timeline;
    if (!t) continue;
    items.push({
      id,
      activation: t.activation_date ?? undefined,
      completion: t.target_completion_date ?? undefined,
      review: t.next_review_date ?? undefined,
    });
  }

  const collisions: TimelineCollision[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      for (const field of ["activation", "completion", "review"] as const) {
        const a = items[i][field];
        const b = items[j][field];
        if (a && b && a === b) {
          collisions.push({
            initiative_id_a: items[i].id,
            initiative_id_b: items[j].id,
            collision_type: field,
            date: a,
            explanation: `Both Initiatives share the same ${field} date (${a}).`,
          });
        }
      }
    }
  }
  return collisions;
}
