/**
 * CAE-11.6-W2 — Mission lifecycle state machine
 */
import type { MissionLifecycleState } from "./data-model";

export const MISSION_TRANSITIONS: Record<MissionLifecycleState, MissionLifecycleState[]> = {
  draft: ["planning"],
  planning: ["draft", "awaiting_approval"],
  awaiting_approval: ["planning", "approved"],
  approved: ["planning", "scheduled"],
  scheduled: ["ready"],
  ready: ["in_progress"],
  in_progress: ["paused", "blocked", "escalated", "review"],
  paused: ["in_progress", "blocked"],
  blocked: ["in_progress", "escalated"],
  escalated: ["in_progress", "review"],
  review: ["in_progress", "completed"],
  completed: ["archived"],
  archived: [],
};

export function assertMissionTransition(from: MissionLifecycleState, to: MissionLifecycleState): void {
  const allowed = MISSION_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new Error(`Illegal mission transition: ${from} → ${to}`);
  }
}

export function canTransitionMission(from: MissionLifecycleState, to: MissionLifecycleState): boolean {
  return (MISSION_TRANSITIONS[from] ?? []).includes(to);
}
