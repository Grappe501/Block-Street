import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { LifecycleHistoryTimeline, LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import { SEED_EVENTS, buildMergedHistoryTimeline, ensureLifecycleFromEvent } from "@/lib/calendar";

export const metadata = { title: "Lifecycle transitions" };

export default function CommandLifecycleTransitionsPage() {
  const recent = SEED_EVENTS.flatMap((e) => {
    ensureLifecycleFromEvent(e);
    return buildMergedHistoryTimeline(e.event_id).slice(0, 3).map((h) => ({ event: e, entry: h }));
  })
    .sort((a, b) => new Date(b.entry.recordedAt).getTime() - new Date(a.entry.recordedAt).getTime())
    .slice(0, 12);

  return (
    <CommandChrome title="Recent status history" subtitle="Latest lifecycle entries across events" backHref="/command/events/lifecycle" backLabel="Lifecycle" nav={<CommandCalendarNav />}>
      <LifecycleSoftBetaNote />
      <CommandSection title="Recent entries">
        <ul className="space-y-3 font-fieldSans text-sm">
          {recent.map(({ event, entry }) => (
            <li key={entry.historyId} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/lifecycle/history`} className="font-bold text-field-pine underline">
                {event.title}
              </Link>
              <LifecycleHistoryTimeline entries={[entry]} />
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
