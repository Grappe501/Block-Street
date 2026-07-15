import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { VerificationSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { SEED_EVENTS, buildVerificationSummary, ensureVerificationFromEvent } from "@/lib/calendar";

export default function CommandVerificationGapsPage() {
  const rows = SEED_EVENTS.map((e) => {
    ensureVerificationFromEvent(e);
    return { event: e, summary: buildVerificationSummary(e.event_id) };
  }).filter((s) => s.summary.incompleteRequired > 0);

  return (
    <CommandChrome title="Verification gaps" subtitle="Required items not verified" backHref="/command/events/verification" backLabel="Verification" nav={<CommandCalendarNav />}>
      <VerificationSoftBetaNote />
      <CommandSection title={`${rows.length} event(s) with gaps`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {rows.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/verification`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">Gap: {summary.primaryGap}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
