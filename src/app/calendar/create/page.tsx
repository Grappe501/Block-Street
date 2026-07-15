import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { ProposeEventForm } from "@/components/calendar/ProposeEventForm";
import Link from "next/link";
import { proposeEvent } from "@/lib/calendar";

export const metadata = { title: "Calendar · Propose event" };

async function proposeAction(input: Parameters<typeof proposeEvent>[0]) {
  "use server";
  const event = proposeEvent(input);
  return { event_id: event.event_id };
}

export default function CalendarCreatePage() {
  return (
    <CalendarChrome title="Propose an event" subtitle="Submit a draft for volunteer manager review." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href="/calendar/templates" className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-sm font-bold text-field-wheat">
          Start from template
        </Link>
        <span className="self-center font-fieldSans text-xs text-field-ink/60">or propose without a template below</span>
      </div>
      <ProposeEventForm action={proposeAction} />
    </CalendarChrome>
  );
}
