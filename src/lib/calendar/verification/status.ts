const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "verified", "waived", "not_applicable", "blocked"],
  in_progress: ["verified", "blocked", "not_started", "waived"],
  blocked: ["in_progress", "not_started"],
  verified: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionVerification(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isVerificationComplete(status: string): boolean {
  return status === "verified" || status === "waived" || status === "not_applicable";
}

export function validateVerificationTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionVerification("not_started", "verified")) errors.push("not_started→verified");
  return errors;
}
