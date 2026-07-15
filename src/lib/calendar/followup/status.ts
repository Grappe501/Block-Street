const TRANSITIONS: Record<string, string[]> = {
  not_started: ["draft", "submitted", "waived", "not_applicable"],
  draft: ["submitted", "not_started", "waived"],
  submitted: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionFollowUp(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isFollowUpComplete(status: string): boolean {
  return status === "submitted" || status === "waived" || status === "not_applicable";
}

export function validateFollowUpTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionFollowUp("not_started", "submitted")) errors.push("not_started→submitted");
  if (!canTransitionFollowUp("draft", "submitted")) errors.push("draft→submitted");
  return errors;
}
