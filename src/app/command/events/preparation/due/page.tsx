import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { SEED_EVENTS, ensurePreparationFromEvent, listPreparationItems } from "@/lib/calendar";
import { isPreparationReady } from "@/lib/calendar/preparation/status";

export default function CommandPreparationDuePage() {
  const now = Date.now();
  const due = SEED_EVENTS.flatMap((e) => {
    ensurePreparationFromEvent(e);
    return listPreparationItems({ eventId: e.event_id })
      .filter((i) => i.dueAt && new Date(i.dueAt).getTime() > now && new Date(i.dueAt).getTime() - now < 14 * 86400000 && !isPreparationReady(i.itemStatus))
      .map((i) => ({ event: e, item: i }));
  });

  return (
    <CommandChrome title="Preparation due soon" subtitle="Items due within 14 days" backHref="/command/events/preparation" backLabel="Preparation" nav={<CommandCalendarNav />}>
      <PreparationSoftBetaNote />
      <CommandSection title="Due soon">
        <ul className="space-y-2 font-fieldSans text-sm">
          {due.map(({ event, item }) => (
            <li key={item.itemId} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/preparation/${item.itemId}`} className="text-field-pine underline font-bold">{item.label}</Link>
              <p className="text-field-ink/70">{event.title} · due {item.dueAt ? new Date(item.dueAt).toLocaleDateString() : "—"}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
