import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CoreRecordSoftBetaNote } from "@/components/calendar/core-record/CoreRecordPanels";
import {
  SEED_EVENTS,
  buildCoreRecordSummary,
  ensureCoreRecordFromEvent,
  listEventsWithCoreRecordGaps,
} from "@/lib/calendar";

export const metadata = { title: "Core records" };

export default function CommandCoreRecordsPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureCoreRecordFromEvent(e);
    return { event: e, summary: buildCoreRecordSummary(e.event_id) };
  });
  const gaps = listEventsWithCoreRecordGaps(SEED_EVENTS);

  return (
    <CommandChrome title="Core records" subtitle="Ownership, schedule, and venue checklists" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <CoreRecordSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-3 font-fieldSans text-sm">
          <Link href="/command/events/core-records/missing-ownership" className="rounded-lg border bg-white p-3 underline">
            Missing ownership
          </Link>
          <Link href="/command/events/core-records/schedule-gaps" className="rounded-lg border bg-white p-3 underline">
            Schedule gaps
          </Link>
          <Link href="/command/events/core-records/venue-gaps" className="rounded-lg border bg-white p-3 underline">
            Venue gaps
          </Link>
        </div>
      </CommandSection>
      <CommandSection title={`${gaps.length} events with core record gaps`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {gaps.map((e) => (
            <li key={e.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}/core-record`} className="font-bold text-field-pine underline">
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </CommandSection>
      <CommandSection title="All events">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/core-record`} className="text-field-pine underline font-bold">
                {event.title}
              </Link>
              <p className="text-field-ink/70">
                Own {summary.ownershipReady}/{summary.ownershipTotal} · Sch {summary.scheduleReady}/{summary.scheduleTotal} · Ven{" "}
                {summary.venueReady}/{summary.venueTotal}
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
