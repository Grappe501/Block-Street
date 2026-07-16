import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import {
  buildLifecycleSummary,
  ensureLifecycleFromEvent,
  getEventById,
  operationalStatusLabel,
  suggestOperationalTransitions,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Lifecycle transitions" };

export default async function EventLifecycleTransitionsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureLifecycleFromEvent(event);
  const summary = buildLifecycleSummary(eventId, event.operational_status, event.approval_status);
  const transitions = suggestOperationalTransitions(event.operational_status);

  return (
    <CalendarChrome title={`${event.title} — Transitions`} subtitle="Allowed operational status moves" backHref={`/calendar/event/${eventId}/lifecycle`} backLabel="Lifecycle">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <LifecycleSoftBetaNote />
      <CalendarSection title="Current state">
        <p className="font-fieldSans text-sm">
          {operationalStatusLabel(event.operational_status)} · {summary.historyCount} history entries
        </p>
      </CalendarSection>
      <CalendarSection title="Suggested next statuses">
        <ul className="space-y-2 font-fieldSans text-sm">
          {transitions.map((t) => (
            <li key={t} className="rounded border bg-white px-3 py-2">
              {operationalStatusLabel(t)}
            </li>
          ))}
          {transitions.length === 0 && <li className="text-field-ink/60">No forward transitions from archived.</li>}
        </ul>
        <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
          <Link href={`/calendar/event/${eventId}/lifecycle/history`} className="text-field-pine underline">
            View full status history
          </Link>
        </p>
      </CalendarSection>
    </CalendarChrome>
  );
}
