import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import { SEED_EVENTS, listEventsWithVenueGaps } from "@/lib/calendar";

export const metadata = { title: "Venue gaps" };

export default function CommandVenueGapsPage() {
  const events = listEventsWithVenueGaps(SEED_EVENTS);

  return (
    <CommandChrome title="Venue gaps" subtitle="Events with venue checklist gaps" backHref="/command/events/core-records" backLabel="Core records" nav={<CommandCalendarNav />}>
      <CoreRecordSoftBetaNote />
      <CommandSection title={`${events.length} events`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {events.map((e) => (
            <li key={e.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}/core-record/venue`} className="font-bold text-field-pine underline">
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
