import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { VerificationSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { SEED_EVENTS, buildVerificationSummary, ensureVerificationFromEvent } from "@/lib/calendar";

export default function CommandVerificationPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureVerificationFromEvent(e);
    return { event: e, summary: buildVerificationSummary(e.event_id) };
  }).filter((s) => {
    const t = s.summary.venueTotal + s.summary.campusTotal + s.summary.legalTotal + s.summary.accessibilityTotal;
    return t > 0;
  });

  return (
    <CommandChrome title="Event verification" subtitle="Venue and compliance checklist — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <VerificationSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/verification/gaps" className="rounded-lg border bg-white p-3 underline">Gaps</Link>
          <Link href="/command/events/verification/due" className="rounded-lg border bg-white p-3 underline">Due soon</Link>
        </div>
      </CommandSection>
      <CommandSection title="Events with verification checklists">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/verification`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.incompleteRequired} required incomplete</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
