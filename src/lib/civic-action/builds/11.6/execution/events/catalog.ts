/**
 * CAE-11.6-W2 — Mission execution events
 */
export const MISSION_EVENT_CATALOG = [
  { event: "mission.created", domain: "mission", description: "Operational mission created" },
  { event: "mission.approved", domain: "mission", description: "Mission approved for execution" },
  { event: "mission.started", domain: "mission", description: "Mission moved to in progress" },
  { event: "mission.paused", domain: "mission", description: "Mission paused" },
  { event: "mission.blocked", domain: "mission", description: "Mission blocked" },
  { event: "mission.escalated", domain: "mission", description: "Mission escalated to leadership" },
  { event: "mission.completed", domain: "mission", description: "Mission completed" },
  { event: "mission.archived", domain: "mission", description: "Mission archived" },
  { event: "task.created", domain: "task", description: "Task created under mission" },
  { event: "task.completed", domain: "task", description: "Task completed" },
  { event: "evidence.recorded", domain: "evidence", description: "Mission evidence recorded" },
  { event: "decision.logged", domain: "decision", description: "Mission decision logged" },
  { event: "lesson.recorded", domain: "lesson", description: "Lessons learned submitted" },
] as const;
