import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { getCounties } from "@/lib/data";
import { listEventsForScope } from "@/lib/calendar";

export function generateStaticParams() {
  return getCounties().map((c) => ({ countySlug: c.slug }));
}

export default async function CountyCalendarListPage({ params }: { params: Promise<{ countySlug: string }> }) {
  const { countySlug } = await params;
  const county = getCounties().find((c) => c.slug === countySlug);
  if (!county) notFound();

  const events = listEventsForScope({ kind: "county", countySlug: county.slug }).sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <CalendarChrome
      title={`${county.name} — list`}
      subtitle="County and statewide public events."
      backHref={`/county/${county.slug}/calendar`}
      backLabel="Calendar"
      nav={<CalendarNav base={`/county/${county.slug}`} variant="county" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title={`${events.length} events`}>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.event_id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
