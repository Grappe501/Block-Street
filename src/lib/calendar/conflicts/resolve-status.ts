import type { ConflictResolutionStatus } from "./types";

const RESOLUTION_TRANSITIONS: Record<string, ConflictResolutionStatus[]> = {
  open: ["under_review", "resolved", "override_approved", "wont_fix"],
  under_review: ["resolved", "override_approved", "wont_fix", "open"],
  resolved: ["open"],
  override_approved: [],
  wont_fix: ["open"],
};

export function canTransitionConflictResolution(from: ConflictResolutionStatus, to: ConflictResolutionStatus): boolean {
  return RESOLUTION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateConflictResolutionTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionConflictResolution("open", "resolved")) errors.push("open→resolved");
  if (!canTransitionConflictResolution("open", "override_approved")) errors.push("open→override_approved");
  return errors;
}
