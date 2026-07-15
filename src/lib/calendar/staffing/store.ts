import type {
  CalendarShiftConfirmation,
  CalendarShiftInterest,
  CalendarShiftLeadAssignment,
  CalendarStaffingRequirement,
  CalendarVolunteerShift,
  CalendarVolunteerTrainingStatus,
} from "./types";

let requirements: CalendarStaffingRequirement[] = [];
let shifts: CalendarVolunteerShift[] = [];
let interests: CalendarShiftInterest[] = [];
let leadAssignments: CalendarShiftLeadAssignment[] = [];
let trainingStatuses: CalendarVolunteerTrainingStatus[] = [];
let confirmations: CalendarShiftConfirmation[] = [];

export function listRequirements(eventId?: string): CalendarStaffingRequirement[] {
  return eventId ? requirements.filter((r) => r.eventId === eventId && r.status !== "canceled") : [...requirements];
}

export function getRequirementById(requirementId: string): CalendarStaffingRequirement | null {
  return requirements.find((r) => r.requirementId === requirementId) ?? null;
}

export function saveRequirement(req: CalendarStaffingRequirement): CalendarStaffingRequirement {
  requirements = [req, ...requirements.filter((r) => r.requirementId !== req.requirementId)];
  return req;
}

export function listShifts(eventId?: string): CalendarVolunteerShift[] {
  const active = shifts.filter((s) => s.status !== "canceled");
  return eventId ? active.filter((s) => s.eventId === eventId) : [...active];
}

export function getShiftById(shiftId: string): CalendarVolunteerShift | null {
  return shifts.find((s) => s.shiftId === shiftId) ?? null;
}

export function saveShift(shift: CalendarVolunteerShift): CalendarVolunteerShift {
  shifts = [shift, ...shifts.filter((s) => s.shiftId !== shift.shiftId)];
  return shift;
}

export function listInterests(filter?: { eventId?: string; userId?: string; shiftId?: string }): CalendarShiftInterest[] {
  return interests.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.userId && i.userId !== filter.userId) return false;
    if (filter?.shiftId && i.shiftId !== filter.shiftId) return false;
    if (i.interestStatus === "withdrawn") return false;
    return true;
  });
}

export function saveInterest(interest: CalendarShiftInterest): CalendarShiftInterest {
  interests = [interest, ...interests.filter((x) => x.interestId !== interest.interestId)];
  return interest;
}

export function listLeadAssignments(shiftId?: string): CalendarShiftLeadAssignment[] {
  return shiftId
    ? leadAssignments.filter((a) => a.shiftId === shiftId && a.status !== "removed")
    : [...leadAssignments.filter((a) => a.status !== "removed")];
}

export function saveLeadAssignment(a: CalendarShiftLeadAssignment): CalendarShiftLeadAssignment {
  leadAssignments = [a, ...leadAssignments.filter((x) => x.assignmentId !== a.assignmentId)];
  return a;
}

export function listTrainingStatuses(userId?: string): CalendarVolunteerTrainingStatus[] {
  return userId ? trainingStatuses.filter((t) => t.userId === userId) : [...trainingStatuses];
}

export function saveTrainingStatus(s: CalendarVolunteerTrainingStatus): CalendarVolunteerTrainingStatus {
  trainingStatuses = [
    s,
    ...trainingStatuses.filter((t) => !(t.userId === s.userId && t.trainingKey === s.trainingKey)),
  ];
  return s;
}

export function listConfirmations(shiftId?: string): CalendarShiftConfirmation[] {
  return shiftId ? confirmations.filter((c) => c.shiftId === shiftId) : [...confirmations];
}

export function saveConfirmation(c: CalendarShiftConfirmation): CalendarShiftConfirmation {
  confirmations = [c, ...confirmations.filter((x) => x.confirmationId !== c.confirmationId)];
  return c;
}

export function clearStaffingStoreForTest(): void {
  requirements = [];
  shifts = [];
  interests = [];
  leadAssignments = [];
  trainingStatuses = [];
  confirmations = [];
}

export function seedStaffingFixtures(fixtures: {
  requirements?: CalendarStaffingRequirement[];
  shifts?: CalendarVolunteerShift[];
  interests?: CalendarShiftInterest[];
  leads?: CalendarShiftLeadAssignment[];
  training?: CalendarVolunteerTrainingStatus[];
  confirmations?: CalendarShiftConfirmation[];
}): void {
  if (fixtures.requirements) requirements = [...fixtures.requirements];
  if (fixtures.shifts) shifts = [...fixtures.shifts];
  if (fixtures.interests) interests = [...fixtures.interests];
  if (fixtures.leads) leadAssignments = [...fixtures.leads];
  if (fixtures.training) trainingStatuses = [...fixtures.training];
  if (fixtures.confirmations) confirmations = [...fixtures.confirmations];
}
