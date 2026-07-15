import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { SEED_EVENTS, listStaffingGaps, ensureStaffingFromEvent } from "@/lib/calendar";

export default function CommandStaffingGapsPage() {
  SEED_EVENTS.forEach((e) => ensureStaffingFromEvent(e));
  const gaps = listStaffingGaps(SEED_EVENTS.map((e) => e.event_id));

  return (
    <CommandChrome title="Staffing gaps" subtitle="Minimum and lead gaps" backHref="/command/events/staffing" backLabel="Staffing">
      <StaffingSoftBetaNote />
      <CommandSection title={`${gaps.length} gaps`}>
        <ul className="space-y-2 md:hidden">
          {gaps.map((g) => (
            <li key={g.shiftId} className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
              <Link href={`/calendar/event/${g.eventId}/staffing/coverage`} className="font-bold text-field-pine underline">{g.roleLabel}</Link>
              <p>Gap {g.minimumGap} · Confirmed {g.confirmedCount} · Interest {g.interestedCount}</p>
            </li>
          ))}
        </ul>
        <ul className="hidden space-y-2 md:block font-fieldSans text-sm">
          {gaps.map((g) => (
            <li key={g.shiftId} className="rounded-lg border bg-white p-3">
              <Link href={`/calendar/event/${g.eventId}/staffing/coverage`} className="text-field-pine underline">{g.eventId} · {g.roleLabel}</Link>
              — min gap {g.minimumGap}, interest {g.interestedCount}, confirmed {g.confirmedCount}
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
