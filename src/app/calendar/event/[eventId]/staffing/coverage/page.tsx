import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoverageTable } from "@/components/calendar/staffing/CoverageTable";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { calculateShiftCoverage, ensureStaffingFromEvent, listShifts } from "@/lib/calendar/staffing";

export default async function StaffingCoveragePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  const rows = listShifts(eventId).map((s) => ({ ...calculateShiftCoverage(s), roleLabel: s.roleLabel }));

  return (
    <CalendarChrome title="Staffing coverage" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Confirmed vs interest">
        <p className="mb-3 font-fieldSans text-xs text-field-ink/60">Interest ≠ confirmation · Suggested ≠ confirmed</p>
        <CoverageTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
