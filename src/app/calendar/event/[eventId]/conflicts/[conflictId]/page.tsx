import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ConflictChecklistTable, ConflictResolutionStatusPanel, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import {
  buildConflictSummary,
  ensureConflictsForEvent,
  getConflictRecordById,
  getEventById,
  isConflictRecordResolvable,
  listConflictRows,
} from "@/lib/calendar";

export const metadata = { title: "Calendar · Conflict detail" };

export default async function EventConflictDetailPage({
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
      title={`${event.title} — ${conflictId}`}
      subtitle={record.summary}
      backHref={`/calendar/event/${eventId}/conflicts`}
      backLabel="Conflicts"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <ConflictSoftBetaNote />
      <CalendarSection title="Resolution status">
        <ConflictResolutionStatusPanel record={record} />
        {isConflictRecordResolvable(conflictId) && record.resolutionStatus === "open" && (
          <p className="mt-2 font-fieldSans text-xs text-field-pine">Checklist complete — record eligible for resolve or override.</p>
        )}
        <Link
          href={`/calendar/event/${eventId}/conflicts/${conflictId}/resolve`}
          className="mt-2 inline-block font-fieldSans text-sm text-field-pine underline"
        >
          Resolution workflow
        </Link>
      </CalendarSection>
      <CalendarSection title="Conflict record">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Kind: <strong>{record.kind.replace(/_/g, " ")}</strong> · Severity: <strong>{record.severity}</strong> ·
          State: <strong>{record.state.replace(/_/g, " ")}</strong>
        </p>
        {summary && (
          <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
            Resolution impact: {summary.readinessImpact}
            {summary.primaryGap ? ` · Gap: ${summary.primaryGap}` : ""}
          </p>
        )}
        <ul className="mt-3 space-y-1 font-fieldSans text-sm">
          {record.eventIds.map((id) => {
            const linked = getEventById(id);
            return linked ? (
              <li key={id}>
                <Link href={`/calendar/event/${id}/conflicts/${conflictId}`} className="text-field-pine underline">
                  {linked.title}
                </Link>
              </li>
            ) : null;
          })}
        </ul>
        <Link
          href={`/calendar/event/${eventId}/conflicts/${conflictId}/resolution`}
          className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline"
        >
          Resolution checklist
        </Link>
      </CalendarSection>
      <CalendarSection title="Resolution items (this event)">
        <ConflictChecklistTable rows={rows} eventId={eventId} conflictId={conflictId} />
      </CalendarSection>
    </CalendarChrome>
  );
}
