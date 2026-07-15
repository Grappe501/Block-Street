import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listAssignments } from "@/lib/calendar/assignments";

export default function CommandStaffingAssignmentsPage() {
  ensureAssignmentDemoFixtures();
  const all = listAssignments();

  return (
    <CommandChrome title="Assignments" subtitle="Soft-beta confirmed only" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title="Assignment states">
        <ul className="font-fieldSans text-sm space-y-2">
          {all.map((a) => (
            <li key={a.assignmentId} className="rounded border bg-white p-2">
              {a.eventId} · {a.assignmentStatus} · durableAuthority={String(a.durableAuthority)}
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
