import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { LifecycleHistoryTimeline, LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import { buildMergedHistoryTimeline, ensureLifecycleFromEvent, getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Status history" };

export default async function EventLifecycleHistoryPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureLifecycleFromEvent(event);
  const timeline = buildMergedHistoryTimeline(eventId);

  return (
    <CalendarChrome title={`${event.title} — Status history`} subtitle="Audited lifecycle timeline" backHref={`/calendar/event/${eventId}/lifecycle`} backLabel="Lifecycle">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <LifecycleSoftBetaNote />
      <CalendarSection title="Timeline">
        <LifecycleHistoryTimeline entries={timeline} />
      </CalendarSection>
    </CalendarChrome>
  );
}
