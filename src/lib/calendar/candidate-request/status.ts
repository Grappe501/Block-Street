const TRANSITIONS: Record<string, string[]> = {
  not_started: ["in_progress", "ready", "waived", "not_applicable", "blocked"],
  in_progress: ["ready", "blocked", "not_started", "waived"],
  blocked: ["in_progress", "not_started"],
  ready: [],
  waived: [],
  not_applicable: [],
};

export function canTransitionCandidate(from: string, to: string): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCandidateItemReady(status: string): boolean {
  return status === "ready" || status === "waived" || status === "not_applicable";
}

export function validateCandidateTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionCandidate("not_started", "ready")) errors.push("not_started→ready");
  return errors;
}

export function attendanceFromEventStatus(status: string | null | undefined): import("./types").CandidateAttendanceSnapshot {
  const raw = status ?? "not_requested";
  const allowed = [
    "not_requested",
    "requested",
    "under_review",
    "hold_placed",
    "tentatively_accepted",
    "confirmed",
    "declined",
    "canceled",
    "completed",
  ];
  return (allowed.includes(raw) ? raw : "requested") as import("./types").CandidateAttendanceSnapshot;
}
