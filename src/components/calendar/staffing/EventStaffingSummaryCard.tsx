import Link from "next/link";
import type { CalendarEventStaffingSummary } from "@/lib/calendar/staffing";

export function EventStaffingSummaryCard({ summary, eventId }: { summary: CalendarEventStaffingSummary; eventId: string }) {
  return (
    <section className="rounded-xl border border-field-ink/15 bg-white p-4">
      <h3 className="font-fieldDisplay text-lg text-field-ink">Staffing summary</h3>
      <p className="mt-1 font-fieldSans text-xs text-field-ink/60">Status: {summary.overallStatus.replace(/_/g, " ")}</p>
      <dl className="mt-3 grid gap-2 font-fieldSans text-sm sm:grid-cols-2">
        <div><dt className="font-semibold">Requirements</dt><dd>{summary.requirementCount}</dd></div>
        <div><dt className="font-semibold">Shifts</dt><dd>{summary.shiftCount}</dd></div>
        <div><dt className="font-semibold">Confirmed</dt><dd>{summary.confirmedPositions} / {summary.targetPositions} target</dd></div>
        <div><dt className="font-semibold">Interested</dt><dd>{summary.totalInterestCount} (eligible {summary.eligibleInterestCount})</dd></div>
      </dl>
      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href={`/calendar/event/${eventId}/staffing/requirements`} className="text-field-pine underline">Requirements</Link>
        <Link href={`/calendar/event/${eventId}/shifts`} className="text-field-pine underline">Shifts</Link>
        <Link href={`/calendar/event/${eventId}/staffing/coverage`} className="text-field-pine underline">Coverage</Link>
      </nav>
      {summary.primaryNextAction ? (
        <Link href={summary.primaryNextAction.route} className="mt-3 inline-block rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-sm font-bold text-field-wheat">
          {summary.primaryNextAction.label}
        </Link>
      ) : null}
    </section>
  );
}
