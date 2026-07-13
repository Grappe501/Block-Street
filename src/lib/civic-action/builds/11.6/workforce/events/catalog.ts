/**
 * CAE-11.6-W3 — Workforce events
 */
export const WORKFORCE_EVENT_CATALOG = [
  { event: "assignment.created", domain: "assignment", description: "Work assignment proposed or created" },
  { event: "assignment.accepted", domain: "assignment", description: "Human accepted assignment" },
  { event: "assignment.declined", domain: "assignment", description: "Human declined assignment" },
  { event: "assignment.completed", domain: "assignment", description: "Assignment completed" },
  { event: "assignment.delegated", domain: "assignment", description: "Assignment delegated with governance" },
  { event: "capacity.updated", domain: "capacity", description: "Capacity snapshot recomputed" },
  { event: "availability.updated", domain: "availability", description: "Availability profile updated" },
  { event: "recognition.awarded", domain: "recognition", description: "Recognition recorded" },
  { event: "burnout.warning", domain: "burnout", description: "Private advisory burnout indicator" },
  { event: "growth.goal.updated", domain: "growth", description: "Growth goal updated" },
  { event: "AI.assignment.recommended", domain: "ai", description: "AI recommended assignment (advisory)" },
] as const;
