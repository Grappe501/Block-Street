import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { getEventById, listVolunteerNeeds } from "@/lib/calendar";

export const metadata = { title: "Calendar · Volunteer needs" };

export default function VolunteerNeedsPage() {
  const needs = listVolunteerNeeds({ kind: "public" });

  return (
    <CalendarChrome title="Volunteer needs" subtitle="Open slots pulled from the canonical event catalog." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`${needs.length} open needs`}>
        <ul className="space-y-2">
          {needs.map((n) => {
            const event = getEventById(n.event_id)!;
            return (
              <li key={n.event_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
                <Link href={`/calendar/event/${n.event_id}/volunteer`} className="font-fieldSans text-sm font-bold text-field-pine underline">
                  {event.title}
                </Link>
                <p className="mt-1 font-fieldSans text-xs text-field-ink/70">
                  {n.role} · {n.slots_open} open
                </p>
              </li>
            );
          })}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
