import Link from "next/link";
import type { CalendarConflictSummary } from "@/lib/calendar/conflicts/types";

export function ConflictSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta conflict detection and resolution checklist. Records are session-local while Gate A is open — seed catalog plus overlap detection.
    </p>
  );
}

export function EventConflictSummaryCard({
  summaries,
  eventId,
}: {
  summaries: CalendarConflictSummary[];
  eventId: string;
}) {
  if (summaries.length === 0) return null;
  const open = summaries.filter((s) => s.state !== "no_conflict" && s.state !== "override_approved");
  const blocked = summaries.filter((s) => s.readinessImpact === "blocked");
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Scheduling conflicts</h2>
      <p className="text-field-ink/70">
        {summaries.length} conflict record(s) · {open.length} open · {blocked.length} blocking resolution
      </p>
      {summaries[0]?.primaryGap && (
        <p className="text-xs text-amber-800">Primary gap: {summaries[0].primaryGap}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/conflicts`} className="text-field-pine underline">
          Conflicts
        </Link>
        {summaries[0] && (
          <Link
            href={`/calendar/event/${eventId}/conflicts/${summaries[0].conflictId}`}
            className="text-field-pine underline"
          >
            First conflict
          </Link>
        )}
      </div>
    </section>
  );
}

export function ConflictChecklistTable({
  rows,
  eventId,
  conflictId,
}: {
  rows: { itemId: string; category: string; label: string; required: boolean; status: string }[];
  eventId: string;
  conflictId: string;
}) {
  if (rows.length === 0) return null;
  return (
    <table className="w-full font-fieldSans text-sm">
      <thead>
        <tr className="text-left text-field-ink/60">
          <th className="py-1">Item</th>
          <th>Category</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.itemId} className="border-t border-field-ink/10">
            <td className="py-2">
              <Link
                href={`/calendar/event/${eventId}/conflicts/${conflictId}/resolution`}
                className="text-field-pine underline"
              >
                {r.label}
              </Link>
            </td>
            <td>{r.category}</td>
            <td>{r.status.replace(/_/g, " ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ConflictRecordList({
  summaries,
  eventId,
}: {
  summaries: CalendarConflictSummary[];
  eventId?: string;
}) {
  if (summaries.length === 0) {
    return <p className="font-fieldSans text-sm text-field-ink/70">No conflict records detected.</p>;
  }
  return (
    <ul className="space-y-3">
      {summaries.map((s) => (
        <li key={s.conflictId} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3 font-fieldSans text-sm">
          <p className="font-bold text-field-ink">{s.conflictId}</p>
          <p className="text-field-ink/70">
            {s.kind.replace(/_/g, " ")} · {s.state.replace(/_/g, " ")} · {s.resolutionStatus.replace(/_/g, " ")}
          </p>
          <p className="mt-1 text-field-ink/60">
            Review {s.reviewReady}/{s.reviewTotal} · Communication {s.communicationReady}/{s.communicationTotal} ·
            Resolution {s.resolutionReady}/{s.resolutionTotal}
          </p>
          {eventId ? (
            <Link
              href={`/calendar/event/${eventId}/conflicts/${s.conflictId}`}
              className="mt-2 inline-block text-field-pine underline"
            >
              Open conflict
            </Link>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {s.eventIds.map((id) => (
                <Link key={id} href={`/calendar/event/${id}/conflicts/${s.conflictId}`} className="text-field-pine underline">
                  {id}
                </Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
