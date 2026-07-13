/**
 * CAE-11.7-W4 — Organizer events
 */
export const ORGANIZER_EVENT_CATALOG = [
  { event: "daily.plan.created", domain: "planning", description: "Daily plan prepared for Human review" },
  { event: "daily.plan.updated", domain: "planning", description: "Human edited daily plan" },
  { event: "mission.updated", domain: "mission", description: "Mission coordination snapshot refreshed" },
  { event: "dependency.blocked", domain: "dependency", description: "Blocked dependency identified" },
  { event: "resource.shortage", domain: "resource", description: "Missing resource flagged" },
  { event: "deadline.warning", domain: "deadline", description: "Deadline risk surfaced" },
  { event: "travel.updated", domain: "travel", description: "Travel plan refreshed" },
  { event: "team.capacity.changed", domain: "team", description: "Team capacity snapshot updated" },
  { event: "review.completed", domain: "review", description: "End-of-day review completed" },
  { event: "organizer.recommendation.created", domain: "organizer", description: "Explainable recommendation prepared" },
  { event: "organizer.recommendation.dismissed", domain: "organizer", description: "Human dismissed recommendation" },
  { event: "checklist.completed", domain: "checklist", description: "Checklist item completed by Human" },
] as const;
