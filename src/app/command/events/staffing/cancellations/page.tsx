import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listCancellations } from "@/lib/calendar/assignments";

export default function CommandStaffingCancellationsPage() {
  ensureAssignmentDemoFixtures();
  const items = listCancellations();

  return (
    <CommandChrome title="Cancellations" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title="Cancellation workflow">
        <ul className="font-fieldSans text-sm">{items.map((c) => <li key={c.cancellationId}>{c.cancellationStatus} · {c.reasonKey}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
