import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import { SEED_EVENTS, listEventsNeedingLifecycleAction } from "@/lib/calendar";

export const metadata = { title: "Lifecycle pending" };

export default function CommandLifecyclePendingPage() {
  const pending = listEventsNeedingLifecycleAction(SEED_EVENTS);

  return (
    <CommandChrome title="Lifecycle pending" subtitle="Events with open approval or completion actions" backHref="/command/events/lifecycle" backLabel="Lifecycle" nav={<CommandCalendarNav />}>
      <LifecycleSoftBetaNote />
      <CommandSection title={`${pending.length} events`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {pending.map((e) => (
            <li key={e.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}/lifecycle`} className="font-bold text-field-pine underline">
                {e.title}
              </Link>
              <p className="text-field-ink/70">
                {e.operational_status.replace(/_/g, " ")} · approval {String(e.approval_status ?? "not_submitted")}
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
