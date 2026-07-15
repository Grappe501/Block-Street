import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { SEED_EVENTS, listLeadAssignments, listShifts, ensureStaffingFromEvent } from "@/lib/calendar";

export default function CommandStaffingLeadsPage() {
  SEED_EVENTS.forEach((e) => ensureStaffingFromEvent(e));
  const needing = SEED_EVENTS.flatMap((e) =>
    listShifts(e.event_id).filter((s) => s.leadRequired).map((s) => ({ event: e, shift: s, leads: listLeadAssignments(s.shiftId) })),
  );

  return (
    <CommandChrome title="Shift leads" subtitle="Lead coverage command view" backHref="/command/events/staffing" backLabel="Staffing">
      <StaffingSoftBetaNote />
      <CommandSection title="Shifts requiring leads">
        <ul className="space-y-2 font-fieldSans text-sm">
          {needing.map(({ event, shift, leads }) => (
            <li key={shift.shiftId} className="rounded-lg border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/staffing/leads`} className="font-bold text-field-pine underline">{event.title} — {shift.name}</Link>
              <p>{leads.filter((l) => l.status === "accepted").length} accepted · {leads.length} total assignments</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
