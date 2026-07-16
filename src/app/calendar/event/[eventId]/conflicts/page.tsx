import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { ensureConflictsForEvent, getEventById, listEventConflictSummaries } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event conflicts" };

export default async function EventConflictsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureConflictsForEvent(event);
  const summaries = listEventConflictSummaries(eventId);

  return (
    <CalendarChrome
      title={`${event.title} — Conflicts`}
      subtitle="Detected overlaps and Kelly travel buffer review"
      backHref={`/calendar/event/${eventId}`}
      backLabel="Event"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <ConflictSoftBetaNote />
      <CalendarSection title="Conflict state">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Event state: <strong>{event.conflict_state.replace(/_/g, " ")}</strong>
          {event.conflict_ids.length > 0 && (
            <>
              {" "}
              · Linked IDs: {event.conflict_ids.join(", ")}
            </>
          )}
        </p>
      </CalendarSection>
      <CalendarSection title={`${summaries.length} conflict record(s)`}>
        <ConflictRecordList summaries={summaries} eventId={eventId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
