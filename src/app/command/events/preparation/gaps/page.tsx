import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { SEED_EVENTS, buildPreparationSummary, ensurePreparationFromEvent } from "@/lib/calendar";

export default function CommandPreparationGapsPage() {
  const gaps = SEED_EVENTS.map((e) => {
    ensurePreparationFromEvent(e);
    const summary = buildPreparationSummary(e.event_id);
    return { event: e, summary };
  }).filter((g) => g.summary.incompleteRequired > 0 || g.summary.readinessImpact !== "none");

  return (
    <CommandChrome title="Preparation gaps" subtitle="Required items incomplete" backHref="/command/events/preparation" backLabel="Preparation" nav={<CommandCalendarNav />}>
      <PreparationSoftBetaNote />
      <CommandSection title="Gaps">
        <ul className="space-y-2 font-fieldSans text-sm">
          {gaps.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/preparation`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.incompleteRequired} required incomplete · impact {summary.readinessImpact}</p>
              {summary.primaryGap && <p className="text-xs text-amber-800">{summary.primaryGap}</p>}
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
