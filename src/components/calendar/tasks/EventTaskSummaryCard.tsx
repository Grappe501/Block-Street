import Link from "next/link";
import type { CalendarTaskChecklistSummary } from "@/lib/calendar/tasks/types";

export function EventTaskSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarTaskChecklistSummary;
  eventId: string;
}) {
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Task checklist</h2>
      <p className="text-field-ink/70">
        {summary.completeCount}/{summary.requiredCount} required complete · {summary.blockedCount} blocked · {summary.overdueCount} overdue
      </p>
      {summary.primaryBlocker && <p className="text-xs text-amber-800">Primary: {summary.primaryBlocker}</p>}
      <Link href={`/calendar/event/${eventId}/tasks`} className="mt-2 inline-block text-field-pine underline text-xs">
        Open checklist
      </Link>
    </section>
  );
}
