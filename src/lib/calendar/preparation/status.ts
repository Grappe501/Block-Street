const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "ready", "waived", "not_applicable"],
  in_progress: ["ready", "not_started", "waived"],
  blocked: ["in_progress", "not_started"],
  ready: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionPreparation(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isPreparationReady(status: string): boolean {
  return status === "ready" || status === "waived" || status === "not_applicable";
}

export function validatePreparationTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionPreparation("not_started", "ready")) errors.push("not_started→ready");
  if (!canTransitionPreparation("in_progress", "ready")) errors.push("in_progress→ready");
  return errors;
}
