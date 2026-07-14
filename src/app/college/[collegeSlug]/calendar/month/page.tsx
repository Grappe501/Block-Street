import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";
import { getMonthGrid, listEventsForScope } from "@/lib/calendar";

export function generateStaticParams() {
  return collegeStaticParams();
}

export default async function CollegeCalendarMonthPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const events = listEventsForScope({ kind: "college", collegeSlug: college.slug });
  const now = new Date();
  const weeks = getMonthGrid(now.getFullYear(), now.getMonth() + 1, events);
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <CalendarChrome
      title={`${college.name} calendar`}
      subtitle="College-scoped month projection."
      backHref={`/college/${college.slug}`}
      backLabel={college.shortName}
      nav={<CalendarNav base={`/college/${college.slug}`} variant="college" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title={monthLabel}>
        <MonthGrid weeks={weeks} monthLabel={monthLabel} />
      </CalendarSection>
    </CalendarChrome>
  );
}
