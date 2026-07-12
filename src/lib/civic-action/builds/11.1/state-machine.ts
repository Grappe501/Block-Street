import type { CanonicalInitiativeStatus } from "./data-model";

/** Allowed lifecycle transitions — CAE-11.1-W2 state machine */
export const ALLOWED_TRANSITIONS: Record<CanonicalInitiativeStatus, CanonicalInitiativeStatus[]> = {
  concept: ["discovery", "cancelled"],
  discovery: ["design", "concept", "cancelled"],
  design: ["approval_pending", "discovery", "cancelled"],
  approval_pending: ["approved", "design", "cancelled"],
  approved: ["preparation", "approval_pending", "design", "cancelled"],
  preparation: ["active", "approved", "cancelled"],
  active: ["paused", "at_risk", "closing", "owner_required", "cancelled"],
  paused: ["active", "preparation", "closing", "cancelled"],
  at_risk: ["active", "paused", "closing", "cancelled"],
  owner_required: ["active", "paused", "closing", "cancelled"],
  closing: ["completed", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export const ILLEGAL_TRANSITIONS: { from: CanonicalInitiativeStatus; to: CanonicalInitiativeStatus; reason: string }[] = [
  { from: "concept", to: "completed", reason: "Cannot complete without governed lifecycle" },
  { from: "concept", to: "active", reason: "Cannot activate from concept without approval path" },
  { from: "cancelled", to: "active", reason: "Cancelled initiatives require restoration workflow" },
  { from: "archived", to: "active", reason: "Archived initiatives require restoration or successor" },
  { from: "completed", to: "active", reason: "Completed initiatives require restoration workflow" },
];

export function isTransitionAllowed(from: CanonicalInitiativeStatus, to: CanonicalInitiativeStatus): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateTransition(from: CanonicalInitiativeStatus, to: CanonicalInitiativeStatus): { allowed: boolean; reason?: string } {
  if (from === to) return { allowed: true };
  const illegal = ILLEGAL_TRANSITIONS.find((t) => t.from === from && t.to === to);
  if (illegal) return { allowed: false, reason: illegal.reason };
  if (!isTransitionAllowed(from, to)) {
    return { allowed: false, reason: `Transition ${from} → ${to} is not in the allowed lifecycle` };
  }
  return { allowed: true };
}

export const ACTIVATION_REQUIRED_STATUS: CanonicalInitiativeStatus[] = ["preparation", "approved"];

export const TERMINAL_STATUSES: CanonicalInitiativeStatus[] = ["completed", "cancelled", "archived"];

export function getStateMachineDefinition() {
  return {
    wave: "11.1-W2",
    states: Object.keys(ALLOWED_TRANSITIONS) as CanonicalInitiativeStatus[],
    allowed_transitions: ALLOWED_TRANSITIONS,
    illegal_transitions: ILLEGAL_TRANSITIONS,
    activation_from: ACTIVATION_REQUIRED_STATUS,
    terminal: TERMINAL_STATUSES,
  };
}
