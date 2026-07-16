import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CoreRecordChecklistTable, CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { ensureCoreRecordFromEvent, getEventById, listCoreRecordRows } from "@/lib/calendar";

export const metadata = { title: "Calendar · Ownership" };

export default async function EventCoreRecordOwnershipPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCoreRecordFromEvent(event);
  const rows = listCoreRecordRows(eventId, "ownership");

  return (
    <CalendarChrome title={`${event.title} — Ownership`} subtitle="Operational owner and contact path" backHref={`/calendar/event/${eventId}/core-record`} backLabel="Core record">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CoreRecordSoftBetaNote />
      <CalendarSection title="Ownership checklist">
        <p className="mb-3 font-fieldSans text-sm text-field-ink/70">
          Owner: {event.owned_by_team ?? event.primary_contact ?? "—"} · Event Board: {event.volunteer_manager ?? "Carol Eagan"}
        </p>
        <CoreRecordChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
