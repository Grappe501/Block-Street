import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { SEED_EVENTS, buildRsvpSummary, ensureRsvpFromEvent } from "@/lib/calendar";

export default function CommandRsvpPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureRsvpFromEvent(e);
    return { event: e, summary: buildRsvpSummary(e.event_id) };
  }).filter((s) => s.summary.planTotal + s.summary.operationsTotal > 0);

  return (
    <CommandChrome title="Event RSVP" subtitle="Capacity and response tracking — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <RsvpSoftBetaNote />
      <CommandSection title="Priority views">
        <Link href="/command/events/rsvp/low" className="rounded-lg border bg-white p-3 font-fieldSans text-sm underline block w-fit">Low headcount</Link>
      </CommandSection>
      <CommandSection title="Events with RSVP plans">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/rsvp`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.headcountEstimate} estimated · target {summary.targetHeadcount ?? "—"}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
