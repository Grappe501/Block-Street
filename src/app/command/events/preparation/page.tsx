import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { SEED_EVENTS, buildPreparationSummary, ensurePreparationFromEvent } from "@/lib/calendar";

export default function CommandPreparationPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensurePreparationFromEvent(e);
    return { event: e, summary: buildPreparationSummary(e.event_id) };
  }).filter((s) => s.summary.logisticsTotal + s.summary.materialsTotal + s.summary.promotionTotal + s.summary.remindersTotal > 0);

  return (
    <CommandChrome title="Event preparation" subtitle="Materials, logistics, promotion — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <PreparationSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/preparation/gaps" className="rounded-lg border bg-white p-3 underline">Gaps</Link>
          <Link href="/command/events/preparation/due" className="rounded-lg border bg-white p-3 underline">Due soon</Link>
        </div>
      </CommandSection>
      <CommandSection title="Events with preparation checklists">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/preparation`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">
                Materials {summary.materialsReady}/{summary.materialsTotal} · Promotion {summary.promotionReady}/{summary.promotionTotal} ·
                {summary.incompleteRequired} required incomplete
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
