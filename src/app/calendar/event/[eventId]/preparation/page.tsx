import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { EventPreparationSummaryCard } from "@/components/calendar/preparation/EventPreparationSummaryCard";
import { PreparationChecklistTable } from "@/components/calendar/preparation/PreparationChecklistTable";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { buildPreparationSummary, ensurePreparationFromEvent, listPreparationRows } from "@/lib/calendar/preparation";

export default async function EventPreparationPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensurePreparationFromEvent(event);
  const summary = buildPreparationSummary(eventId);
  const rows = listPreparationRows(eventId);

  return (
    <CalendarChrome title="Event preparation" subtitle={event.title} backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <PreparationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-4">
        <EventPreparationSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Checklist">
          <PreparationChecklistTable rows={rows} eventId={eventId} />
        </CalendarSection>
        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/preparation/logistics`} className="underline text-field-pine">Logistics</Link>
          <Link href={`/calendar/event/${eventId}/preparation/materials`} className="underline text-field-pine">Materials</Link>
          <Link href={`/calendar/event/${eventId}/preparation/promotion`} className="underline text-field-pine">Promotion</Link>
          <Link href={`/calendar/event/${eventId}/preparation/reminders`} className="underline text-field-pine">Reminders</Link>
          <Link href={`/command/events/preparation`} className="underline text-field-pine">Command preparation</Link>
        </div>
      </div>
    </CalendarChrome>
  );
}
