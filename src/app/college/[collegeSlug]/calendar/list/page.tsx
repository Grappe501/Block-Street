import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";
import { listEventsForScope } from "@/lib/calendar";

export function generateStaticParams() {
  return collegeStaticParams();
}

export default async function CollegeCalendarListPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const events = listEventsForScope({ kind: "college", collegeSlug: college.slug }).sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <CalendarChrome
      title={`${college.name} — list`}
      subtitle="College and statewide public events."
      backHref={`/college/${college.slug}/calendar`}
      backLabel="Calendar"
      nav={<CalendarNav base={`/college/${college.slug}`} variant="college" />}
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
