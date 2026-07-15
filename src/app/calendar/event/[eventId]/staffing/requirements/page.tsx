import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureStaffingFromEvent, generateShiftsFromRequirement, listActiveRequirements } from "@/lib/calendar/staffing";

async function generateShiftsAction(eventId: string, requirementId: string, pattern: string) {
  "use server";
  generateShiftsFromRequirement({
    eventId,
    requirementId,
    pattern: pattern as "single" | "setup_program_breakdown" | "equal_blocks",
    blockCount: pattern === "equal_blocks" ? 2 : undefined,
  });
}

export default async function StaffingRequirementsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  const reqs = listActiveRequirements(eventId);

  return (
    <CalendarChrome title="Staffing requirements" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${reqs.length} requirements`}>
        <ul className="space-y-3">
          {reqs.map((r) => (
            <li key={r.requirementId} className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
              <p className="font-bold text-field-ink">{r.roleLabel}</p>
              <p className="text-field-ink/70">Min {r.minimumNeeded} · Target {r.targetNeeded} · {r.criticality}{r.generatedFromTemplate ? " · template-generated" : ""}</p>
              <form action={generateShiftsAction.bind(null, eventId, r.requirementId, "single")} className="mt-2 flex flex-wrap gap-2">
                <button type="submit" className="rounded border px-2 py-1 text-xs">Generate single shift</button>
              </form>
              <form action={generateShiftsAction.bind(null, eventId, r.requirementId, "setup_program_breakdown")} className="inline">
                <button type="submit" className="rounded border px-2 py-1 text-xs">Setup / program / breakdown</button>
              </form>
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
