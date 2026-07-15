import type { CalendarVolunteerShift, CreateShiftInput, GenerateShiftsFromRequirementInput } from "./types";
import { getEventById } from "../events";
import { getRequirementById, getShiftById, saveShift } from "./store";
import { validateShift } from "./validate";

export function createShift(input: CreateShiftInput): CalendarVolunteerShift {
  const now = new Date().toISOString();
  const shift: CalendarVolunteerShift = {
    shiftId: `shf-${input.eventId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: input.status ?? "open",
    shiftLeadUserIds: input.shiftLeadUserIds ?? [],
    eventId: input.eventId,
    requirementId: input.requirementId,
    name: input.name,
    roleKey: input.roleKey,
    roleLabel: input.roleLabel,
    startAt: input.startAt,
    endAt: input.endAt,
    arrivalAt: input.arrivalAt ?? null,
    checkInOpensAt: input.checkInOpensAt ?? null,
    minimumNeeded: input.minimumNeeded,
    targetNeeded: input.targetNeeded,
    maximumAllowed: input.maximumAllowed ?? null,
    leadRequired: input.leadRequired,
    trainingRequirementKeys: input.trainingRequirementKeys,
    checkInLocation: input.checkInLocation ?? null,
    instructions: input.instructions ?? null,
    accessibilityNotes: input.accessibilityNotes ?? null,
    materialsToBring: input.materialsToBring ?? [],
    generatedFromRequirement: input.generatedFromRequirement ?? false,
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    createdAt: now,
    updatedAt: now,
  };
  const errors = validateShift(shift);
  if (errors.length) throw new Error(errors.join("; "));
  return saveShift(shift);
}

export function generateShiftsFromRequirement(input: GenerateShiftsFromRequirementInput): CalendarVolunteerShift[] {
  const req = getRequirementById(input.requirementId);
  if (!req) throw new Error("Requirement not found");
  const event = getEventById(input.eventId);
  if (!event) throw new Error("Event not found");

  const durationMs = (req.defaultShiftDurationMinutes ?? 120) * 60_000;
  const eventStart = new Date(event.start_at).getTime();
  const eventEnd = new Date(event.end_at).getTime();
  const blocks: Array<{ name: string; startAt: string; endAt: string }> = [];

  if (input.pattern === "custom" && input.customBlocks?.length) {
    blocks.push(...input.customBlocks);
  } else if (input.pattern === "setup_program_breakdown") {
    const third = (eventEnd - eventStart) / 3;
    blocks.push(
      { name: `${req.roleLabel} — Setup`, startAt: new Date(eventStart).toISOString(), endAt: new Date(eventStart + third).toISOString() },
      { name: `${req.roleLabel} — Program`, startAt: new Date(eventStart + third).toISOString(), endAt: new Date(eventStart + 2 * third).toISOString() },
      { name: `${req.roleLabel} — Breakdown`, startAt: new Date(eventStart + 2 * third).toISOString(), endAt: new Date(eventEnd).toISOString() },
    );
  } else if (input.pattern === "equal_blocks" && input.blockCount && input.blockCount > 1) {
    const span = eventEnd - eventStart;
    const blockMs = span / input.blockCount;
    for (let i = 0; i < input.blockCount; i++) {
      const start = eventStart + i * blockMs;
      blocks.push({
        name: `${req.roleLabel} — Block ${i + 1}`,
        startAt: new Date(start).toISOString(),
        endAt: new Date(start + blockMs).toISOString(),
      });
    }
  } else {
    blocks.push({
      name: `${req.roleLabel} — Full event`,
      startAt: event.start_at,
      endAt: event.end_at,
    });
  }

  return blocks.map((b) =>
    createShift({
      eventId: input.eventId,
      requirementId: req.requirementId,
      name: b.name,
      roleKey: req.roleKey,
      roleLabel: req.roleLabel,
      startAt: b.startAt,
      endAt: b.endAt,
      arrivalAt: req.defaultArrivalOffsetMinutes
        ? new Date(new Date(b.startAt).getTime() - req.defaultArrivalOffsetMinutes * 60_000).toISOString()
        : null,
      minimumNeeded: req.minimumNeeded,
      targetNeeded: req.targetNeeded,
      maximumAllowed: req.maximumAllowed,
      leadRequired: req.leadRequired,
      trainingRequirementKeys: req.trainingRequirementKeys,
      instructions: req.participantInstructions,
      accessibilityNotes: req.accessibilityNotes,
      generatedFromRequirement: true,
      generatedFromTemplate: req.generatedFromTemplate,
    }),
  );
}

export function cancelShift(shiftId: string): CalendarVolunteerShift | null {
  const shift = getShiftById(shiftId);
  if (!shift) return null;
  return saveShift({ ...shift, status: "canceled", updatedAt: new Date().toISOString() });
}
