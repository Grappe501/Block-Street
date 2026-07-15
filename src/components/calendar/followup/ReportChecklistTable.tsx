import Link from "next/link";
import type { CalendarFollowUpSummary } from "@/lib/calendar/followup/types";

export function FollowUpSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta follow-up and reporting. Submitted metrics are not durable production records while Gate A is open.
    </p>
  );
}

export function EventReportSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarFollowUpSummary;
  eventId: string;
}) {
  if (summary.metricsTotal + summary.actionsTotal === 0) return null;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Post-event report</h2>
      <p className="text-field-ink/70">
        Metrics {summary.metricsSubmitted}/{summary.metricsTotal} · Actions {summary.actionsSubmitted}/{summary.actionsTotal}
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">
          {summary.incompleteRequired} required incomplete · {summary.overdueCount} overdue
        </p>
      )}
      {summary.primaryGap && <p className="text-xs text-amber-800">Primary gap: {summary.primaryGap}</p>}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/report`} className="text-field-pine underline">
          Open report
        </Link>
        <Link href={`/calendar/event/${eventId}/report/metrics`} className="text-field-pine underline">
          Metrics
        </Link>
        <Link href={`/calendar/event/${eventId}/report/follow-up`} className="text-field-pine underline">
          Follow-up actions
        </Link>
      </div>
    </section>
  );
}

export function ReportChecklistTable({
  rows,
  eventId,
}: {
  rows: {
    itemId: string;
    category: string;
    label: string;
    required: boolean;
    status: string;
    metricType?: string | null;
    dueAt?: string | null;
  }[];
  eventId: string;
}) {
  if (rows.length === 0) {
    return <p className="font-fieldSans text-sm text-field-ink/70">No report items seeded for this event.</p>;
  }
  return (
    <table className="w-full font-fieldSans text-sm">
      <thead>
        <tr className="border-b text-left text-xs uppercase text-field-ink/60">
          <th className="py-2 pr-2">Item</th>
          <th className="py-2 pr-2">Category</th>
          <th className="py-2 pr-2">Status</th>
          <th className="py-2 pr-2">Due</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.itemId} className="border-b border-field-ink/10">
            <td className="py-2 pr-2">
              <Link href={`/calendar/event/${eventId}/report/${row.itemId}`} className="text-field-pine underline">
                {row.label}
              </Link>
              {row.required && <span className="ml-1 text-xs text-amber-800">required</span>}
            </td>
            <td className="py-2 pr-2 capitalize">{row.category}</td>
            <td className="py-2 pr-2">{row.status.replace(/_/g, " ")}</td>
            <td className="py-2 pr-2">{row.dueAt ? new Date(row.dueAt).toLocaleString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
