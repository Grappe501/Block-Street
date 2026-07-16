import Link from "next/link";
import type { CalendarLifecycleSummary } from "@/lib/calendar/lifecycle/types";
import type { CalendarStatusHistoryEntry } from "@/lib/calendar/lifecycle/types";

export function LifecycleSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta lifecycle and status history. Transitions are session-local — not durable production authority while Gate A is open.
    </p>
  );
}

export function EventLifecycleSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarLifecycleSummary;
  eventId: string;
}) {
  const total = summary.approvalTotal + summary.operationalTotal + summary.publicationTotal;
  if (total === 0) return null;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Lifecycle &amp; status history</h2>
      <p className="text-field-ink/70">
        {summary.operationalStatus.replace(/_/g, " ")} · Approval {summary.approvalReady}/{summary.approvalTotal} ·{" "}
        {summary.historyCount} history entries
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">{summary.incompleteRequired} required lifecycle item(s) open</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/lifecycle`} className="text-field-pine underline">
          Lifecycle
        </Link>
        <Link href={`/calendar/event/${eventId}/lifecycle/history`} className="text-field-pine underline">
          History
        </Link>
        <Link href={`/calendar/event/${eventId}/approvals`} className="text-field-pine underline">
          Approvals
        </Link>
      </div>
    </section>
  );
}

export function LifecycleHistoryTimeline({ entries }: { entries: CalendarStatusHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="font-fieldSans text-sm text-field-ink/70">No status history recorded yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {entries.map((h) => (
        <li key={h.historyId} className="rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-field-ink/55">{h.recordedAt}</span>
            <span className="rounded bg-field-pine/10 px-1.5 py-0.5 text-xs uppercase text-field-pine">{h.category}</span>
          </div>
          <p className="mt-1">{h.note}</p>
          {(h.fromStatus || h.toStatus) && (
            <p className="mt-1 text-xs text-field-ink/60">
              {h.fromStatus ? `${h.fromStatus} → ` : ""}
              {h.toStatus ?? ""}
              {h.actor ? ` · ${h.actor}` : ""}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function LifecycleChecklistTable({
  rows,
  eventId,
}: {
  rows: { itemId: string; category: string; label: string; required: boolean; status: string }[];
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
              <Link href={`/calendar/event/${eventId}/lifecycle`} className="text-field-pine underline">
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
