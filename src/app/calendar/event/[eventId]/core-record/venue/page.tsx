import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoreRecordChecklistTable, CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { ensureCoreRecordFromEvent, getEventById, listCoreRecordRows } from "@/lib/calendar";

export const metadata = { title: "Calendar · Venue" };

export default async function EventCoreRecordVenuePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCoreRecordFromEvent(event);
  const rows = listCoreRecordRows(eventId, "venue");

  return (
    <CalendarChrome title={`${event.title} — Venue`} subtitle="Calendar venue record — not contract approval" backHref={`/calendar/event/${eventId}/core-record`} backLabel="Core record">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CoreRecordSoftBetaNote />
      <CalendarSection title="Venue checklist">
        <p className="mb-3 font-fieldSans text-sm text-field-ink/70">
          {event.location_name ?? event.location_type ?? "TBD"}
          {event.virtual_url ? ` · ${event.virtual_url}` : ""}
        </p>
        <CoreRecordChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
