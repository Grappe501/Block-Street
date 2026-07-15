import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { SEED_EVENTS, calculateEventStaffingSummary, ensureStaffingFromEvent } from "@/lib/calendar";

export default function CommandStaffingCriticalPage() {
  const critical = SEED_EVENTS.filter((e) => {
    ensureStaffingFromEvent(e);
    return calculateEventStaffingSummary(e.event_id).overallStatus === "critical_shortage";
  });

  return (
    <CommandChrome title="Critical staffing" subtitle="Critical roles below minimum or missing required leads" backHref="/command/events/staffing" backLabel="Staffing">
      <StaffingSoftBetaNote />
      <CommandSection title={`${critical.length} critical events`}>
        {critical.length === 0 ? <p className="font-fieldSans text-sm">No critical staffing gaps in seed data.</p> : (
          <ul className="space-y-2 font-fieldSans text-sm">
            {critical.map((e) => (
              <li key={e.event_id} className="rounded-lg border bg-white p-3">
                <Link href={`/calendar/event/${e.event_id}/staffing/coverage`} className="font-bold text-field-pine underline">{e.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </CommandSection>
    </CommandChrome>
  );
}
