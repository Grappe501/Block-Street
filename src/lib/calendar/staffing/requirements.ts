import type { CreateRequirementInput, CalendarStaffingRequirement } from "./types";
import { getRoleDefinition } from "./role-catalog";
import { getRequirementById, listRequirements, saveRequirement } from "./store";
import { validateRequirement } from "./validate";

export function createRequirement(input: CreateRequirementInput): CalendarStaffingRequirement {
  const role = getRoleDefinition(input.roleKey);
  const now = new Date().toISOString();
  const req: CalendarStaffingRequirement = {
    requirementId: `req-${input.eventId}-${input.roleKey}-${Date.now()}`,
    status: input.status ?? "active",
    roleLabel: input.roleLabel || role?.label || input.roleKey,
    roleDescription: input.roleDescription || role?.description || "",
    minimumNeeded: input.minimumNeeded,
    targetNeeded: input.targetNeeded,
    maximumAllowed: input.maximumAllowed ?? null,
    criticality: input.criticality || role?.defaultCriticality || "required",
    trainingRequirementKeys: input.trainingRequirementKeys.length
      ? input.trainingRequirementKeys
      : role?.defaultTrainingRequirementKeys ?? [],
    leadRequired: input.leadRequired ?? role?.defaultLeadRequired ?? false,
    defaultShiftDurationMinutes: input.defaultShiftDurationMinutes ?? null,
    defaultArrivalOffsetMinutes: input.defaultArrivalOffsetMinutes ?? role?.defaultArrivalOffsetMinutes ?? null,
    accessibilityNotes: input.accessibilityNotes ?? null,
    participantInstructions: input.participantInstructions ?? null,
    internalNotes: input.internalNotes ?? null,
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    eventId: input.eventId,
    roleKey: input.roleKey,
    createdAt: now,
    updatedAt: now,
  };
  const errors = validateRequirement(req);
  if (errors.length) throw new Error(errors.join("; "));
  return saveRequirement(req);
}

export function cancelRequirement(requirementId: string, reason?: string): CalendarStaffingRequirement | null {
  const req = getRequirementById(requirementId);
  if (!req) return null;
  return saveRequirement({
    ...req,
    status: "canceled",
    internalNotes: reason ? `${req.internalNotes ?? ""}\nCanceled: ${reason}`.trim() : req.internalNotes,
    updatedAt: new Date().toISOString(),
  });
}

export function listActiveRequirements(eventId: string): CalendarStaffingRequirement[] {
  return listRequirements(eventId).filter((r) => r.status === "active" || r.status === "draft");
}

export function aggregateRequirementCounts(reqs: CalendarStaffingRequirement[]): {
  requiredPositions: number;
  targetPositions: number;
} {
  return {
    requiredPositions: reqs.reduce((s, r) => s + r.minimumNeeded, 0),
    targetPositions: reqs.reduce((s, r) => s + r.targetNeeded, 0),
  };
}
