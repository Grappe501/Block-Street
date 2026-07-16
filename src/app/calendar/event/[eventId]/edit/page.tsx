import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { buildCoreRecordSummary, ensureCoreRecordFromEvent, getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event edit" };

export default async function EventEditPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCoreRecordFromEvent(event);
  const summary = buildCoreRecordSummary(eventId);

  return (
    <CalendarChrome title={`${event.title} — Edit`} subtitle="Core record edit surface" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CoreRecordSoftBetaNote />
      <CalendarSection title="Edit">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Soft-beta edit surface. Use the core record checklist for ownership, schedule, and venue gaps.
        </p>
        <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
          {summary.incompleteRequired} open item(s) · Event ID: {event.event_id}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/core-record`} className="text-field-pine underline">
            Open core record
          </Link>
          <Link href={`/calendar/event/${eventId}/core-record/ownership`} className="text-field-pine underline">
            Ownership
          </Link>
          <Link href={`/calendar/event/${eventId}/core-record/schedule`} className="text-field-pine underline">
            Schedule
          </Link>
          <Link href={`/calendar/event/${eventId}/core-record/venue`} className="text-field-pine underline">
            Venue
          </Link>
        </div>
      </CalendarSection>
    </CalendarChrome>
  );
}
