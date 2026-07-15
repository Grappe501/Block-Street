import Link from "next/link";

export function EventOperationsSummaryCards({
  metrics,
}: {
  metrics: {
    today: number;
    thisWeek: number;
    needsAttention: number;
    criticalStaffing: number;
    pendingApprovals: number;
    kellyRequests: number;
    conflicts: number;
    reportsDue: number;
  };
}) {
  const cards = [
    ["Today", metrics.today, "/command/events/today"],
    ["This week", metrics.thisWeek, "/command/events/upcoming"],
    ["Needs attention", metrics.needsAttention, "/command/events/attention"],
    ["Critical staffing", metrics.criticalStaffing, "/command/events/staffing"],
    ["Pending approvals", metrics.pendingApprovals, "/command/events/approvals"],
    ["Kelly requests", metrics.kellyRequests, "/command/events/kelly-requests"],
    ["Unresolved conflicts", metrics.conflicts, "/command/events/conflicts"],
    ["Reports due", metrics.reportsDue, "/command/events/reports-due"],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, count, href]) => (
        <Link
          key={href}
          href={href}
          className="rounded-xl border border-field-ink/15 bg-white px-4 py-3 shadow-sm transition hover:border-field-pine/40"
        >
          <p className="font-fieldSans text-xs font-semibold uppercase tracking-wide text-field-ink/55">{label}</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{count}</p>
        </Link>
      ))}
    </div>
  );
}
