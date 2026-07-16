import Link from "next/link";
import type { CalendarCoreRecordSummary } from "@/lib/calendar/core-record/types";

export function CoreRecordSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta core record checklist. Canonical event fields are read from seed — checklist mutations are session-local while Gate A is open.
    </p>
  );
}

export function EventCoreRecordSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarCoreRecordSummary;
  eventId: string;
}) {
  const total = summary.ownershipTotal + summary.scheduleTotal + summary.venueTotal;
  if (total === 0) return null;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Core record</h2>
      <p className="text-field-ink/70">
        Ownership {summary.ownershipReady}/{summary.ownershipTotal} · Schedule {summary.scheduleReady}/{summary.scheduleTotal} ·
        Venue {summary.venueReady}/{summary.venueTotal}
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">{summary.incompleteRequired} required item(s) open — {summary.primaryGap}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/core-record`} className="text-field-pine underline">
          Core record
        </Link>
        <Link href={`/calendar/event/${eventId}/core-record/ownership`} className="text-field-pine underline">
          Ownership
        </Link>
        <Link href={`/calendar/event/${eventId}/edit`} className="text-field-pine underline">
          Edit
        </Link>
      </div>
    </section>
  );
}

export function CoreRecordChecklistTable({
  rows,
  eventId,
}: {
  rows: { itemId: string; category: string; label: string; required: boolean; status: string; fieldSnapshot?: string | null }[];
  eventId: string;
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
              <Link href={`/calendar/event/${eventId}/core-record/${r.category}`} className="text-field-pine underline">
                {r.label}
              </Link>
              {r.fieldSnapshot && <span className="block text-xs text-field-ink/55">{r.fieldSnapshot}</span>}
            </td>
            <td>{r.category}</td>
            <td>{r.status.replace(/_/g, " ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
