import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";
import { getEventById, listVolunteerNeeds } from "@/lib/calendar";

export function generateStaticParams() {
  return collegeStaticParams();
}

export default async function CollegeCalendarVolunteerNeedsPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const needs = listVolunteerNeeds({ kind: "college", collegeSlug: college.slug });

  return (
    <CalendarChrome
      title={`${college.name} — volunteer needs`}
      subtitle="Open slots at this college."
      backHref={`/college/${college.slug}/calendar`}
      backLabel="Calendar"
      nav={<CalendarNav base={`/college/${college.slug}`} variant="college" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title={`${needs.length} needs`}>
        <ul className="space-y-2">
          {needs.map((n) => {
            const e = getEventById(n.event_id)!;
            return (
              <li key={n.event_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
                <Link href={`/calendar/event/${n.event_id}/volunteer`} className="font-fieldSans text-sm font-bold text-field-pine underline">
                  {e.title}
                </Link>
                <p className="mt-1 font-fieldSans text-xs text-field-ink/60">{n.slots_open} open</p>
              </li>
            );
          })}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
