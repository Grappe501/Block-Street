import type { CalendarStaffingRequirement, CalendarVolunteerShift } from "./types";

export function validateRequirement(req: CalendarStaffingRequirement): string[] {
  const errors: string[] = [];
  if (!req.requirementId) errors.push("missing requirementId");
  if (!req.eventId) errors.push("missing eventId");
  if (!req.roleKey) errors.push("missing roleKey");
  if (req.minimumNeeded < 0) errors.push("minimum negative");
  if (req.targetNeeded < req.minimumNeeded) errors.push("target below minimum");
  if (req.maximumAllowed != null && req.maximumAllowed < req.targetNeeded) errors.push("maximum below target");
  return errors;
}

export function validateShift(shift: CalendarVolunteerShift): string[] {
  const errors: string[] = [];
  if (!shift.shiftId) errors.push("missing shiftId");
  if (!shift.eventId) errors.push("missing eventId");
  if (!shift.requirementId) errors.push("missing requirementId");
  if (new Date(shift.startAt) >= new Date(shift.endAt)) errors.push("start not before end");
  if (shift.arrivalAt && new Date(shift.arrivalAt) > new Date(shift.endAt)) errors.push("arrival after end");
  if (shift.minimumNeeded < 0) errors.push("minimum negative");
  if (shift.targetNeeded < shift.minimumNeeded) errors.push("target below minimum");
  if (shift.maximumAllowed != null && shift.maximumAllowed < shift.targetNeeded) errors.push("maximum below target");
  return errors;
}

export function validateRequirementRegistry(reqs: CalendarStaffingRequirement[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const r of reqs) {
    if (ids.has(r.requirementId)) errors.push(`duplicate requirement ${r.requirementId}`);
    ids.add(r.requirementId);
    errors.push(...validateRequirement(r).map((e) => `${r.requirementId}: ${e}`));
  }
  return errors;
}

export function validateShiftRegistry(shiftList: CalendarVolunteerShift[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of shiftList) {
    if (ids.has(s.shiftId)) errors.push(`duplicate shift ${s.shiftId}`);
    ids.add(s.shiftId);
    errors.push(...validateShift(s).map((e) => `${s.shiftId}: ${e}`));
  }
  return errors;
}
