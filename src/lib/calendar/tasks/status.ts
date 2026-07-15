const TASK_TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "blocked", "complete", "waived", "not_applicable"],
  in_progress: ["complete", "blocked", "not_started", "waived"],
  blocked: ["in_progress", "not_started", "waived"],
  complete: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionTask(from: string, to: string): boolean {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTaskActive(status: string): boolean {
  return ["not_started", "in_progress", "blocked"].includes(status);
}

export function isTaskComplete(status: string): boolean {
  return status === "complete" || status === "waived" || status === "not_applicable";
}

export function validateTaskTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionTask("not_started", "in_progress")) errors.push("not_started→in_progress");
  if (!canTransitionTask("in_progress", "complete")) errors.push("in_progress→complete");
  if (!canTransitionTask("blocked", "in_progress")) errors.push("blocked→in_progress");
  return errors;
}
