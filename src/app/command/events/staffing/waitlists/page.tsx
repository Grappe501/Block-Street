import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listWaitlistEntries, sortWaitlistEntries } from "@/lib/calendar/assignments";

export default function CommandStaffingWaitlistsPage() {
  ensureAssignmentDemoFixtures();
  const entries = sortWaitlistEntries(listWaitlistEntries());

  return (
    <CommandChrome title="Waitlists" subtitle="Waitlist ≠ assignment" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title={`${entries.length} active entries`}>
        <ul className="font-fieldSans text-sm">{entries.map((w) => <li key={w.waitlistEntryId}>{w.eventId} · {w.priorityGroup} · {w.waitlistStatus}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
