import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { PreparationChecklistTable } from "@/components/calendar/preparation/PreparationChecklistTable";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensurePreparationFromEvent, listPreparationRows } from "@/lib/calendar/preparation";

export default async function EventPreparationPromotionPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensurePreparationFromEvent(event);
  const rows = listPreparationRows(eventId, "promotion");

  return (
    <CalendarChrome title="Promotion" subtitle={event.title} backHref={`/calendar/event/${eventId}/preparation`} backLabel="Preparation">
      <CalendarHonestyBanner />
      <PreparationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Promotion checklist">
        <PreparationChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/preparation`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">
        All preparation
      </Link>
    </CalendarChrome>
  );
}
