import type { OperationalStatus } from "../types";

const OPERATIONAL_TRANSITIONS: Record<string, OperationalStatus[]> = {
  draft: ["proposed", "canceled", "archived"],
  proposed: ["tentative", "scheduled", "canceled", "archived"],
  tentative: ["scheduled", "confirmed", "canceled", "postponed"],
  scheduled: ["confirmed", "in_progress", "canceled", "postponed"],
  confirmed: ["in_progress", "completed", "canceled", "postponed"],
  in_progress: ["completed", "canceled", "postponed"],
  completed: ["archived"],
  canceled: ["archived", "proposed"],
  postponed: ["scheduled", "confirmed", "canceled"],
  archived: [],
};

export function canTransitionOperational(from: OperationalStatus, to: OperationalStatus): boolean {
  return OPERATIONAL_TRANSITIONS[from]?.includes(to) ?? false;
}

export function suggestOperationalTransitions(status: OperationalStatus): OperationalStatus[] {
  return OPERATIONAL_TRANSITIONS[status] ?? [];
}

export function validateOperationalTransitions(): string[] {
  const errors: string[] = [];
  if (!canTransitionOperational("scheduled", "confirmed")) errors.push("scheduled→confirmed");
  if (!canTransitionOperational("confirmed", "completed")) errors.push("confirmed→completed");
  if (canTransitionOperational("archived", "scheduled")) errors.push("archived should not reopen");
  return errors;
}

export function operationalStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
