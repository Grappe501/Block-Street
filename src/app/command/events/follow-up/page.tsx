import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { FollowUpSoftBetaNote } from "@/components/calendar/followup/ReportChecklistTable";
import { SEED_EVENTS, buildFollowUpSummary, ensureFollowUpFromEvent } from "@/lib/calendar";

export default function CommandFollowUpPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureFollowUpFromEvent(e);
    return { event: e, summary: buildFollowUpSummary(e.event_id) };
  }).filter((s) => s.summary.metricsTotal + s.summary.actionsTotal > 0);

  return (
    <CommandChrome title="Event follow-up" subtitle="Post-event metrics and follow-up actions — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <FollowUpSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/follow-up/incomplete" className="rounded-lg border bg-white p-3 underline">Incomplete</Link>
          <Link href="/command/events/follow-up/overdue" className="rounded-lg border bg-white p-3 underline">Overdue</Link>
        </div>
      </CommandSection>
      <CommandSection title="Events with report checklists">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/report`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">
                Metrics {summary.metricsSubmitted}/{summary.metricsTotal} · Actions {summary.actionsSubmitted}/{summary.actionsTotal} ·
                {summary.incompleteRequired} required incomplete
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
