import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { ProposeEventForm } from "@/components/calendar/ProposeEventForm";
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
      <ProposeEventForm action={proposeAction} />
    </CalendarChrome>
  );
}
