import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ShiftBuilderForm } from "@/components/calendar/staffing/ShiftBuilderForm";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { createShift, ensureStaffingFromEvent, getRoleDefinition, listActiveRequirements, listActiveRoles } from "@/lib/calendar/staffing";

async function createShiftAction(eventId: string, data: Record<string, string>) {
  "use server";
  const req = listActiveRequirements(eventId).find((r) => r.requirementId === data.requirementId);
  if (!req) throw new Error("Requirement not found");
  const role = getRoleDefinition(data.roleKey || req.roleKey);
  const shift = createShift({
    eventId,
    requirementId: req.requirementId,
    name: data.name,
    roleKey: data.roleKey || req.roleKey,
    roleLabel: role?.label ?? req.roleLabel,
    startAt: new Date(data.startAt).toISOString(),
    endAt: new Date(data.endAt).toISOString(),
    arrivalAt: data.arrivalAt ? new Date(data.arrivalAt).toISOString() : null,
    minimumNeeded: Number(data.minimumNeeded || req.minimumNeeded),
    targetNeeded: Number(data.targetNeeded || req.targetNeeded),
    maximumAllowed: req.maximumAllowed,
    leadRequired: data.leadRequired === "yes",
    trainingRequirementKeys: req.trainingRequirementKeys,
    checkInLocation: data.checkInLocation || null,
    instructions: data.instructions || null,
    generatedFromRequirement: false,
    generatedFromTemplate: req.generatedFromTemplate,
  });
  return { shiftId: shift.shiftId };
}

export default async function NewShiftPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  const reqs = listActiveRequirements(eventId);
  if (reqs.length === 0) notFound();

  return (
    <CalendarChrome title="New shift" subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts`} backLabel="Shifts">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <ShiftBuilderForm
        eventId={eventId}
        requirements={reqs.map((r) => ({ requirementId: r.requirementId, roleLabel: r.roleLabel, roleKey: r.roleKey }))}
        roles={listActiveRoles().map((r) => ({ roleKey: r.roleKey, label: r.label }))}
        action={(d) => createShiftAction(eventId, d)}
      />
    </CalendarChrome>
  );
}
