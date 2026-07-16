import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import { SEED_EVENTS, buildLifecycleSummary, ensureLifecycleFromEvent, listEventsNeedingLifecycleAction } from "@/lib/calendar";

export const metadata = { title: "Event lifecycle" };

export default function CommandLifecyclePage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureLifecycleFromEvent(e);
    return { event: e, summary: buildLifecycleSummary(e.event_id, e.operational_status, e.approval_status) };
  });
  const needingAction = listEventsNeedingLifecycleAction(SEED_EVENTS);

  return (
    <CommandChrome title="Event lifecycle" subtitle="Operational status and status history — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <LifecycleSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/lifecycle/pending" className="rounded-lg border bg-white p-3 underline">
            Pending actions
          </Link>
          <Link href="/command/events/lifecycle/transitions" className="rounded-lg border bg-white p-3 underline">
            Recent history
          </Link>
        </div>
      </CommandSection>
      <CommandSection title={`${needingAction.length} events needing lifecycle attention`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {needingAction.map((e) => (
            <li key={e.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}/lifecycle`} className="font-bold text-field-pine underline">
                {e.title}
              </Link>
              <p className="text-field-ink/70">
                {e.operational_status.replace(/_/g, " ")} · {String(e.approval_status ?? "not_submitted")}
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
      <CommandSection title="All seed events">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/lifecycle`} className="text-field-pine underline font-bold">
                {event.title}
              </Link>
              <p className="text-field-ink/70">
                {summary.historyCount} entries · Approval {summary.approvalReady}/{summary.approvalTotal}
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
