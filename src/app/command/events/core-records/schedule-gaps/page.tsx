import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { SEED_EVENTS, listEventsWithScheduleGaps } from "@/lib/calendar";

export const metadata = { title: "Schedule gaps" };

export default function CommandScheduleGapsPage() {
  const events = listEventsWithScheduleGaps(SEED_EVENTS);

  return (
    <CommandChrome title="Schedule gaps" subtitle="Events with schedule checklist gaps" backHref="/command/events/core-records" backLabel="Core records" nav={<CommandCalendarNav />}>
      <CoreRecordSoftBetaNote />
      <CommandSection title={`${events.length} events`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {events.map((e) => (
            <li key={e.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}/core-record/schedule`} className="font-bold text-field-pine underline">
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
