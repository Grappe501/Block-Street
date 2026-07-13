/**
 * CAE-11.6-W1 — Strategy domain events
 */
export const STRATEGY_EVENT_CATALOG = [
  "vision.updated",
  "mission.updated",
  "goal.created",
  "goal.completed",
  "objective.updated",
  "key_result.updated",
  "strategic_review.completed",
  "risk.created",
  "risk.escalated",
  "program.created",
  "project.created",
] as const;

export type StrategyEventName = (typeof STRATEGY_EVENT_CATALOG)[number];
