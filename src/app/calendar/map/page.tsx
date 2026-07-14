import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { groupEventsByCityCounty, listEventsForScope, PUBLIC_PRIVACY_COPY } from "@/lib/calendar";

export const metadata = { title: "Calendar · Map shell" };

export default function CalendarMapPage() {
  const groups = groupEventsByCityCounty(listEventsForScope({ kind: "public" }));

  return (
    <CalendarChrome
      title="Map shell"
      subtitle={`Text grouping by city and county — no map API in soft beta. ${PUBLIC_PRIVACY_COPY.footnote}`}
      nav={<CalendarNav />}
    >
      <CalendarHonestyBanner />
      <div className="rounded-xl border border-dashed border-field-ink/25 bg-field-paper px-4 py-8 text-center">
        <p className="font-fieldSans text-sm text-field-ink/60">Map tiles not wired — browse events by place below.</p>
      </div>
      <CalendarSection title="Events by place">
        <ul className="space-y-4">
          {groups.map((g) => (
            <li key={g.label} className="rounded-xl border border-field-ink/15 bg-white p-4">
              <h3 className="font-fieldSans text-sm font-bold text-field-ink">{g.label}</h3>
              <ul className="mt-2 space-y-1">
                {g.events.map((e) => (
                  <li key={e.event_id}>
                    <Link href={`/calendar/event/${e.event_id}`} className="font-fieldSans text-sm text-field-pine underline">
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
