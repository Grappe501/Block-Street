import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CandidateSoftBetaNote } from "@/components/calendar/candidate/CandidatePanels";
import { SEED_EVENTS } from "@/lib/calendar";

export default function CommandCandidateConflictsPage() {
  const rows = SEED_EVENTS.filter(
    (e) =>
      e.kelly_requested &&
      e.kelly_attendance_status === "confirmed" &&
      (e.conflict_state === "hard_conflict" || e.conflict_state === "likely_conflict"),
  );

  return (
    <CommandChrome title="Candidate conflicts" subtitle="Confirmed with scheduling conflicts" backHref="/command/events/candidate-requests" backLabel="Candidate requests" nav={<CommandCalendarNav />}>
      <CandidateSoftBetaNote />
      <CommandSection title={`${rows.length} conflict(s)`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {rows.map((event) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/candidate-request`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">Conflict: {event.conflict_state?.replace(/_/g, " ")}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
