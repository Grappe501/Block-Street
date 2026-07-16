const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "ready", "waived", "not_applicable", "blocked"],
  in_progress: ["ready", "blocked", "not_started", "waived"],
  blocked: ["in_progress", "not_started"],
  ready: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionCoreRecord(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCoreRecordItemReady(status: string): boolean {
  return status === "ready" || status === "waived" || status === "not_applicable";
}

export function validateCoreRecordTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionCoreRecord("not_started", "ready")) errors.push("not_started→ready");
  return errors;
}
