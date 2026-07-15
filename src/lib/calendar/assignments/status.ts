const OFFER_TRANSITIONS: Record<string, string[]> = {
  draft: ["ready", "withdrawn"],
  ready: ["offered", "withdrawn"],
  offered: ["viewed", "accepted", "declined", "change_requested", "expired", "withdrawn"],
  viewed: ["accepted", "declined", "change_requested", "expired", "withdrawn"],
  change_requested: ["superseded"],
};

const ASSIGNMENT_TRANSITIONS: Record<string, string[]> = {
  confirmation_pending: ["soft_beta_confirmed"],
  soft_beta_confirmed: ["cancellation_requested", "canceled_by_volunteer", "canceled_by_manager", "replaced"],
  cancellation_requested: ["canceled_by_volunteer", "canceled_by_manager", "soft_beta_confirmed"],
};

const WAITLIST_TRANSITIONS: Record<string, string[]> = {
  active: ["offer_prepared", "withdrawn", "removed", "no_longer_needed"],
  offer_prepared: ["offered", "active"],
  offered: ["accepted", "declined", "expired", "active"],
};

export function canTransitionOffer(from: string, to: string): boolean {
  return OFFER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionAssignment(from: string, to: string): boolean {
  return ASSIGNMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionWaitlist(from: string, to: string): boolean {
  return WAITLIST_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateAllTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionOffer("draft", "ready")) errors.push("offer draft→ready");
  if (!canTransitionOffer("offered", "accepted")) errors.push("offer offered→accepted");
  if (!canTransitionAssignment("soft_beta_confirmed", "canceled_by_volunteer")) errors.push("assignment cancel");
  if (!canTransitionWaitlist("active", "offer_prepared")) errors.push("waitlist offer_prepared");
  return errors;
}
