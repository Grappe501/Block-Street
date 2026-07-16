const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "ready", "waived", "not_applicable", "blocked"],
  in_progress: ["ready", "blocked", "not_started", "waived"],
  blocked: ["in_progress", "not_started"],
  ready: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionConflictItem(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isConflictItemReady(status: string): boolean {
  return status === "ready" || status === "waived" || status === "not_applicable";
}

export function validateConflictTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionConflictItem("not_started", "ready")) errors.push("not_started→ready");
  return errors;
}

export function severityRank(severity: "low" | "medium" | "high"): number {
  return { low: 1, medium: 2, high: 3 }[severity];
}
