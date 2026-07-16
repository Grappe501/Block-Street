import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import {
  LifecycleChecklistTable,
  LifecycleSoftBetaNote,
} from "@/components/calendar/lifecycle/LifecyclePanels";
import {
  buildLifecycleSummary,
  ensureLifecycleFromEvent,
  getEventById,
  listLifecycleRows,
  operationalStatusLabel,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Event lifecycle" };

export default async function EventLifecyclePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureLifecycleFromEvent(event);
  const summary = buildLifecycleSummary(eventId, event.operational_status, event.approval_status);
  const rows = listLifecycleRows(eventId);

  return (
    <CalendarChrome title={`${event.title} — Lifecycle`} subtitle="Operational status and approval workflow" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <LifecycleSoftBetaNote />
      <CalendarSection title="Operational status">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Current: <strong>{operationalStatusLabel(event.operational_status)}</strong> · Approval:{" "}
          <strong>{String(event.approval_status ?? "not_submitted")}</strong>
        </p>
        {summary.suggestedTransitions.length > 0 && (
          <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
            Suggested transitions: {summary.suggestedTransitions.map(operationalStatusLabel).join(", ")}
          </p>
        )}
      </CalendarSection>
      <CalendarSection title="Lifecycle checklist">
        <LifecycleChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
