/**
 * CAE-11.6-W11 — Resilience events
 */
export const RESILIENCE_EVENT_CATALOG = [
  { event: "continuity.plan.created", domain: "continuity", description: "Continuity plan created or updated" },
  { event: "incident.activated", domain: "incident", description: "Incident activated" },
  { event: "incident.escalated", domain: "incident", description: "Incident escalated to higher level" },
  { event: "emergency.center.opened", domain: "eoc", description: "Emergency Operations Center opened" },
  { event: "mutual.aid.requested", domain: "mutual_aid", description: "Mutual aid requested from federation" },
  { event: "recovery.started", domain: "recovery", description: "Recovery phase initiated" },
  { event: "recovery.completed", domain: "recovery", description: "Recovery phase completed" },
  { event: "exercise.completed", domain: "exercise", description: "Resilience exercise completed" },
  { event: "backup.verified", domain: "backup", description: "Backup verification completed" },
  { event: "incident.closed", domain: "incident", description: "Incident closed with lessons learned" },
  { event: "lesson.learned.recorded", domain: "lessons", description: "Lesson learned recorded to institutional memory" },
] as const;
