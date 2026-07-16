import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoreRecordChecklistTable, CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { ensureCoreRecordFromEvent, getEventById, listCoreRecordRows } from "@/lib/calendar";

export const metadata = { title: "Calendar · Schedule" };

export default async function EventCoreRecordSchedulePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCoreRecordFromEvent(event);
  const rows = listCoreRecordRows(eventId, "schedule");

  return (
    <CalendarChrome title={`${event.title} — Schedule`} subtitle="Canonical date and time record" backHref={`/calendar/event/${eventId}/core-record`} backLabel="Core record">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CoreRecordSoftBetaNote />
      <CalendarSection title="Schedule checklist">
        <p className="mb-3 font-fieldSans text-sm text-field-ink/70">
          {event.start_at} → {event.end_at}
        </p>
        <CoreRecordChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
