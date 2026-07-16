import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ConflictResolutionStatusPanel, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import {
  buildConflictSummary,
  ensureConflictsForEvent,
  getConflictRecordById,
  getEventById,
  isConflictRecordResolvable,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Conflict resolve" };

export default async function EventConflictResolvePage({
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
  const resolvable = isConflictRecordResolvable(conflictId);

  return (
    <CalendarChrome
      title={`${event.title} — Resolve`}
      subtitle={`Workflow for ${conflictId}`}
      backHref={`/calendar/event/${eventId}/conflicts/${conflictId}`}
      backLabel="Conflict detail"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <ConflictSoftBetaNote />
      <CalendarSection title="Record closure">
        <ConflictResolutionStatusPanel record={record} />
        <p className="mt-3 font-fieldSans text-sm text-field-ink/80">
          {resolvable
            ? "Required checklist items are complete. Operators may resolve, approve override, or mark won't fix via session workflow tools."
            : "Complete required resolution checklist items before closing this conflict record."}
        </p>
        {summary && summary.incompleteRequired > 0 && (
          <p className="mt-1 text-xs text-amber-800">{summary.incompleteRequired} required item(s) still open</p>
        )}
      </CalendarSection>
    </CalendarChrome>
  );
}
