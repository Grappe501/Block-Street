import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event approvals" };

export default async function EventApprovalsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={`${event.title} — Approvals`} subtitle="Approval queue item" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Approvals">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Approval status: <strong>{event.approval_status}</strong>
        </p>
      </CalendarSection>
    </CalendarChrome>
  );
}
