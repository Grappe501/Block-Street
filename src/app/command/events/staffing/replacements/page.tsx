import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listOpenReplacementNeeds } from "@/lib/calendar/assignments";

export default function CommandStaffingReplacementsPage() {
  ensureAssignmentDemoFixtures();
  const needs = listOpenReplacementNeeds();

  return (
    <CommandChrome title="Replacements" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title="Open needs">
        <ul className="font-fieldSans text-sm">{needs.map((n) => <li key={n.replacementNeedId}>{n.urgency} · {n.status} · {n.eventId}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
