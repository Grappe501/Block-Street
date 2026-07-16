import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoreRecordChecklistTable, CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import {
  buildCoreRecordSummary,
  ensureCoreRecordFromEvent,
  getEventById,
  listCoreRecordRows,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Core record" };

export default async function EventCoreRecordPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCoreRecordFromEvent(event);
  const summary = buildCoreRecordSummary(eventId);
  const rows = listCoreRecordRows(eventId);

  return (
    <CalendarChrome title={`${event.title} — Core record`} subtitle="Ownership, schedule, and venue checklist" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CoreRecordSoftBetaNote />
      <CalendarSection title="Summary">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Ownership {summary.ownershipReady}/{summary.ownershipTotal} · Schedule {summary.scheduleReady}/{summary.scheduleTotal} ·
          Venue {summary.venueReady}/{summary.venueTotal}
        </p>
      </CalendarSection>
      <CalendarSection title="Checklist">
        <CoreRecordChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
