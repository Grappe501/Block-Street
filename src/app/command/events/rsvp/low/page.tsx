import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { SEED_EVENTS, buildRsvpSummary, ensureRsvpFromEvent } from "@/lib/calendar";

export default function CommandRsvpLowPage() {
  const rows = SEED_EVENTS.map((e) => {
    ensureRsvpFromEvent(e);
    return { event: e, summary: buildRsvpSummary(e.event_id) };
  }).filter(
    (s) =>
      s.summary.targetHeadcount != null &&
      s.summary.headcountEstimate < s.summary.targetHeadcount * 0.5 &&
      s.summary.planTotal + s.summary.operationsTotal > 0,
  );

  return (
    <CommandChrome title="Low RSVP headcount" subtitle="Events below half of target" backHref="/command/events/rsvp" backLabel="RSVP" nav={<CommandCalendarNav />}>
      <RsvpSoftBetaNote />
      <CommandSection title={`${rows.length} event(s) below target`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {rows.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/rsvp`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.headcountEstimate} / {summary.targetHeadcount} target</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
