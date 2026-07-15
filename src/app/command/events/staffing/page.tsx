import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { SEED_EVENTS, calculateEventStaffingSummary, ensureStaffingFromEvent } from "@/lib/calendar";

export const metadata = { title: "Event staffing command" };

export default function CommandStaffingDashboard() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureStaffingFromEvent(e);
    return calculateEventStaffingSummary(e.event_id);
  });

  const noPlan = summaries.filter((s) => s.overallStatus === "no_plan");
  const critical = summaries.filter((s) => s.overallStatus === "critical_shortage");
  const belowMin = summaries.filter((s) => s.requirementsBelowMinimum > 0);
  const fully = summaries.filter((s) => s.overallStatus === "fully_staffed");

  return (
    <CommandChrome title="Event staffing command" subtitle="Shift planning and coverage — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <StaffingSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/staffing/critical" className="rounded-lg border bg-white p-3 underline">Critical gaps ({critical.length})</Link>
          <Link href="/command/events/staffing/gaps" className="rounded-lg border bg-white p-3 underline">All gaps ({belowMin.length})</Link>
          <Link href="/command/events/staffing/training" className="rounded-lg border bg-white p-3 underline">Training gaps</Link>
          <Link href="/command/events/staffing/leads" className="rounded-lg border bg-white p-3 underline">Shift leads</Link>
          <Link href="/command/events/staffing/templates" className="rounded-lg border bg-white p-3 underline">Template staffing</Link>
          <p className="rounded-lg border bg-white p-3">No plan: {noPlan.length}</p>
          <p className="rounded-lg border bg-white p-3">Fully staffed: {fully.length}</p>
        </div>
      </CommandSection>
      <CommandSection title="Events">
        <ul className="space-y-2">
          {summaries.map((s) => (
            <li key={s.eventId} className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
              <Link href={`/calendar/event/${s.eventId}/staffing`} className="font-bold text-field-pine underline">{s.eventId}</Link>
              <p className="text-field-ink/70">{s.overallStatus.replace(/_/g, " ")} · {s.confirmedPositions}/{s.targetPositions} confirmed</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
