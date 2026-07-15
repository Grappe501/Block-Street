const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "ready", "waived", "not_applicable"],
  in_progress: ["ready", "not_started", "waived"],
  ready: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionRsvp(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isRsvpReady(status: string): boolean {
  return status === "ready" || status === "waived" || status === "not_applicable";
}

export function validateRsvpTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionRsvp("not_started", "ready")) errors.push("not_started→ready");
  return errors;
}
