/**
 * CAE-11.2-W2 — Execution lifecycle state machines + parent-child constraints
 */
import type { CanonicalMissionStatus, CanonicalObjectiveStatus, CanonicalTaskStatus } from "./data-model";

export const OBJECTIVE_TRANSITIONS: Record<CanonicalObjectiveStatus, CanonicalObjectiveStatus[]> = {
  draft: ["proposed", "archived"],
  proposed: ["approved", "draft", "archived"],
  approved: ["ready", "proposed", "archived"],
  ready: ["active", "approved", "archived"],
  active: ["on_track", "needs_attention", "at_risk", "completed", "archived"],
  on_track: ["needs_attention", "at_risk", "completed", "active"],
  needs_attention: ["on_track", "at_risk", "active", "completed"],
  at_risk: ["on_track", "needs_attention", "active", "partially_achieved", "completed"],
  completed: ["archived", "superseded"],
  partially_achieved: ["archived", "superseded"],
  superseded: ["archived"],
  archived: [],
};

export const MISSION_TRANSITIONS: Record<CanonicalMissionStatus, CanonicalMissionStatus[]> = {
  planned: ["ready", "cancelled", "archived"],
  ready: ["active", "planned", "cancelled"],
  active: ["paused", "completed", "cancelled"],
  paused: ["active", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export const TASK_TRANSITIONS: Record<CanonicalTaskStatus, CanonicalTaskStatus[]> = {
  draft: ["assigned", "cancelled", "archived"],
  assigned: ["active", "draft", "cancelled"],
  active: ["blocked", "completed", "cancelled"],
  blocked: ["active", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export const ILLEGAL_CHILD_PARENT: { child: string; child_state: string; parent: string; parent_state: string; reason: string }[] = [
  { child: "Task", child_state: "active", parent: "Mission", parent_state: "draft", reason: "Task cannot be Active if Mission remains Draft" },
  { child: "Task", child_state: "active", parent: "Mission", parent_state: "planned", reason: "Task cannot be Active if Mission is only Planned" },
  { child: "Mission", child_state: "active", parent: "Objective", parent_state: "draft", reason: "Mission cannot be Active if Objective is Draft" },
  { child: "Objective", child_state: "active", parent: "Initiative", parent_state: "inactive", reason: "Objective cannot be Active until parent Initiative is Active" },
];

const PARENT_RANK: Record<string, number> = {
  draft: 0,
  proposed: 1,
  planned: 1,
  assigned: 1,
  approved: 2,
  ready: 3,
  active: 4,
  on_track: 5,
  needs_attention: 5,
  at_risk: 5,
  blocked: 4,
  paused: 4,
  completed: 6,
  partially_achieved: 6,
  cancelled: 6,
  superseded: 7,
  archived: 8,
};

export function childExceedsParent(childState: string, parentState: string): boolean {
  const c = PARENT_RANK[childState] ?? 0;
  const p = PARENT_RANK[parentState] ?? 0;
  return c > p && childState !== parentState;
}

export function isObjectiveTransitionAllowed(from: CanonicalObjectiveStatus, to: CanonicalObjectiveStatus): boolean {
  if (from === to) return true;
  return OBJECTIVE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isMissionTransitionAllowed(from: CanonicalMissionStatus, to: CanonicalMissionStatus): boolean {
  if (from === to) return true;
  return MISSION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTaskTransitionAllowed(from: CanonicalTaskStatus, to: CanonicalTaskStatus): boolean {
  if (from === to) return true;
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getStateMachineDefinition() {
  return {
    protocol: "11.2-W2",
    entities: {
      Objective: { states: Object.keys(OBJECTIVE_TRANSITIONS), transitions: OBJECTIVE_TRANSITIONS },
      Mission: { states: Object.keys(MISSION_TRANSITIONS), transitions: MISSION_TRANSITIONS },
      Task: { states: Object.keys(TASK_TRANSITIONS), transitions: TASK_TRANSITIONS },
    },
    illegal_child_parent: ILLEGAL_CHILD_PARENT,
    principle: "Children cannot exceed parent lifecycle",
  };
}
