import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { EventStaffingSummaryCard } from "@/components/calendar/staffing/EventStaffingSummaryCard";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { calculateEventStaffingSummary, ensureStaffingFromEvent, listActiveRequirements, listShifts } from "@/lib/calendar/staffing";

export const metadata = { title: "Calendar · Event staffing" };

export default async function EventStaffingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  const summary = calculateEventStaffingSummary(eventId);
  const reqs = listActiveRequirements(eventId);
  const shifts = listShifts(eventId);

  return (
    <CalendarChrome title={`${event.title} — Staffing`} subtitle="Volunteer shift planning — soft beta" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-6">
        <EventStaffingSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Quick links">
          <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
            <Link href={`/calendar/event/${eventId}/staffing/requirements`} className="rounded-lg border px-3 py-2 underline">Requirements ({reqs.length})</Link>
            <Link href={`/calendar/event/${eventId}/shifts`} className="rounded-lg border px-3 py-2 underline">Shifts ({shifts.length})</Link>
            <Link href={`/calendar/event/${eventId}/staffing/interests`} className="rounded-lg border px-3 py-2 underline">Interests</Link>
            <Link href={`/calendar/event/${eventId}/staffing/leads`} className="rounded-lg border px-3 py-2 underline">Leads</Link>
            <Link href={`/calendar/event/${eventId}/staffing/training`} className="rounded-lg border px-3 py-2 underline">Training</Link>
            <Link href={`/calendar/event/${eventId}/staffing/coverage`} className="rounded-lg border px-3 py-2 underline">Coverage</Link>
          </div>
        </CalendarSection>
      </div>
    </CalendarChrome>
  );
}
