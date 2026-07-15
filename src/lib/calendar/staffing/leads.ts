import type { CalendarShiftInterest, CalendarShiftLeadAssignment } from "./types";
import { trainingEligibilityLabel } from "./eligibility";
import { listInterests, saveInterest, saveLeadAssignment } from "./store";

const DEMO_USER = "usr-demo-001";

export function expressInterest(input: {
  eventId: string;
  shiftId?: string | null;
  requirementId?: string | null;
  userId?: string;
  rolePreferenceKeys?: string[];
  notes?: string | null;
  trainingKeys?: string[];
}): CalendarShiftInterest {
  const userId = input.userId ?? DEMO_USER;
  const now = new Date().toISOString();
  const interest: CalendarShiftInterest = {
    interestId: `int-${input.eventId}-${userId}-${Date.now()}`,
    eventId: input.eventId,
    shiftId: input.shiftId ?? null,
    requirementId: input.requirementId ?? null,
    userId,
    rolePreferenceKeys: input.rolePreferenceKeys ?? [],
    availability: "available",
    interestStatus: "interested",
    trainingEligibility: trainingEligibilityLabel(userId, input.trainingKeys ?? []),
    scheduleConflict: "unknown",
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  };
  return saveInterest(interest);
}

export function withdrawInterest(interestId: string): CalendarShiftInterest | null {
  const existing = listInterests().find((i) => i.interestId === interestId);
  if (!existing) return null;
  return saveInterest({ ...existing, interestStatus: "withdrawn", updatedAt: new Date().toISOString() });
}

export function assignShiftLead(input: {
  shiftId: string;
  userId: string;
  role?: CalendarShiftLeadAssignment["role"];
  status?: CalendarShiftLeadAssignment["status"];
  assignedByUserId?: string | null;
}): CalendarShiftLeadAssignment {
  const now = new Date().toISOString();
  const assignment: CalendarShiftLeadAssignment = {
    assignmentId: `lead-${input.shiftId}-${input.userId}`,
    shiftId: input.shiftId,
    userId: input.userId,
    role: input.role ?? "primary_lead",
    status: input.status ?? "suggested",
    assignedByUserId: input.assignedByUserId ?? null,
    assignedAt: now,
    acceptedAt: input.status === "accepted" ? now : null,
    trainingStatus: "unknown",
    source: "soft_beta",
  };
  return saveLeadAssignment(assignment);
}

export function listMyInterests(userId = DEMO_USER): CalendarShiftInterest[] {
  return listInterests({ userId });
}
