import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ConflictChecklistTable, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import {
  buildConflictSummary,
  ensureConflictsForEvent,
  getConflictRecordById,
  getEventById,
  listConflictRows,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Conflict resolution" };

export default async function EventConflictResolutionPage({
  params,
}: {
  params: Promise<{ eventId: string; conflictId: string }>;
}) {
  const { eventId, conflictId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureConflictsForEvent(event);
  const record = getConflictRecordById(conflictId);
  if (!record || !record.eventIds.includes(eventId)) notFound();
  const summary = buildConflictSummary(conflictId);
  const rows = listConflictRows(conflictId, eventId);

  return (
    <CalendarChrome
      title={`${event.title} — Resolution`}
      subtitle={`Checklist for ${conflictId}`}
      backHref={`/calendar/event/${eventId}/conflicts/${conflictId}`}
      backLabel="Conflict detail"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <ConflictSoftBetaNote />
      {summary && (
        <CalendarSection title="Progress">
          <p className="font-fieldSans text-sm text-field-ink/80">
            Review {summary.reviewReady}/{summary.reviewTotal} · Communication {summary.communicationReady}/
            {summary.communicationTotal} · Resolution {summary.resolutionReady}/{summary.resolutionTotal}
          </p>
          {summary.incompleteRequired > 0 && (
            <p className="mt-1 text-xs text-amber-800">{summary.incompleteRequired} required item(s) still open</p>
          )}
        </CalendarSection>
      )}
      <CalendarSection title="Resolution checklist">
        <ConflictChecklistTable rows={rows} eventId={eventId} conflictId={conflictId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
