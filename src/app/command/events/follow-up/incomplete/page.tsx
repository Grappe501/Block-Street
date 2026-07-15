import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { FollowUpSoftBetaNote } from "@/components/calendar/followup/ReportChecklistTable";
import { SEED_EVENTS, buildFollowUpSummary, ensureFollowUpFromEvent } from "@/lib/calendar";

export default function CommandFollowUpIncompletePage() {
  const rows = SEED_EVENTS.map((e) => {
    ensureFollowUpFromEvent(e);
    return { event: e, summary: buildFollowUpSummary(e.event_id) };
  }).filter((s) => s.summary.incompleteRequired > 0);

  return (
    <CommandChrome title="Incomplete follow-up" subtitle="Required report items not submitted" backHref="/command/events/follow-up" backLabel="Follow-up" nav={<CommandCalendarNav />}>
      <FollowUpSoftBetaNote />
      <CommandSection title={`${rows.length} event(s) with incomplete reports`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {rows.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/report`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.incompleteRequired} required incomplete · gap: {summary.primaryGap}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
