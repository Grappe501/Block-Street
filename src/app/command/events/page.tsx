import Link from "next/link";
import { CommandCard, CommandSection } from "@/components/command/CommandChrome";
import { EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsMatrix } from "@/components/calendar/operations/EventOperationsMatrix";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { EventOperationsSummaryCards } from "@/components/calendar/operations/EventOperationsSummaryCards";
import {
  countSummaryMetrics,
  listEventOperationsSummaries,
  sortByAttention,
} from "@/lib/calendar/operations";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Event Operations Command · Carol Eagan" };

export default function EventOperationsDashboardPage() {
  const board = buildEventsBoard();
  const summaries = listEventOperationsSummaries({ kind: "command" });
  const metrics = countSummaryMetrics(summaries);
  const queue = sortByAttention(summaries).filter((s) => s.attentionSeverity !== "none").slice(0, 12);

  return (
    <EventOperationsChrome
      title="Event Operations Command"
      subtitle="What is happening, what needs attention, why, who owns it, and what should happen next — soft-beta honest."
    >
      <EventOperationsSummaryCards metrics={metrics} />

      <CommandSection title="Primary attention queue">
        <EventOperationsQueue summaries={queue.length ? queue : sortByAttention(summaries).slice(0, 6)} />
        <p className="mt-3">
          <Link href="/command/events/attention" className="font-fieldSans text-sm font-semibold text-field-pine underline">
            View full attention queue →
          </Link>
        </p>
      </CommandSection>

      <CommandSection title="Readiness matrix (upcoming)">
        <EventOperationsMatrix summaries={summaries} />
        <p className="mt-3">
          <Link href="/command/events/readiness" className="font-fieldSans text-sm font-semibold text-field-pine underline">
            Open readiness view →
          </Link>
        </p>
      </CommandSection>

      <CommandSection title="Existing Event Board routes">
        <div className="grid gap-3 sm:grid-cols-2">
          <CommandCard href="/calendar/templates" title="Event Template Library" note="Start from template or preview" accent />
          <CommandCard href="/command/events/templates" title="Command templates view" note="Most-used and scoped templates" />
          <CommandCard href="/command/events/series" title="Recurring series" note="Active and paused series" />
          <CommandCard href="/calendar/create" title="Propose without template" note="Blank-page path still available" />
          <CommandCard href="/command/events/calendar" title="Event board calendar" note="Month, list, drill-downs" />
          <CommandCard href="/command/events/staffing" title="Staffing gaps" note="Open volunteer slots" />
          <CommandCard href="/command/events/kelly-requests" title="Kelly requests" note="Candidate visit windows" />
          <CommandCard href="/command/events/conflicts" title="Conflicts" note="Scheduling overlaps" />
          <CommandCard href="/command/events/approvals" title="Approvals queue" note="Calendar approval shell" />
          <CommandCard href="/command/events/volunteer-needs" title="Volunteer needs" note="Command-wide gaps" />
          <CommandCard href="/command/events/completed" title="Completed events" note="Past events" />
          <CommandCard href={board.signupHref} title="Sign up — Event Lead" note="Interest form (soft beta)" />
          <CommandCard href="/command/managers" title="CM / ACM oversight" note="Managers over both sides" />
        </div>
      </CommandSection>
    </EventOperationsChrome>
  );
}
