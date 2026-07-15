import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { getCounties } from "@/lib/data";
import { getMonthGrid, listEventsForScope } from "@/lib/calendar";

export function generateStaticParams() {
  return getCounties().map((c) => ({ slug: c.slug }));
}

export default async function CountyCalendarMonthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const county = getCounties().find((c) => c.slug === slug);
  if (!county) notFound();

  const events = listEventsForScope({ kind: "county", countySlug: county.slug });
  const now = new Date();
  const weeks = getMonthGrid(now.getFullYear(), now.getMonth() + 1, events);
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <CalendarChrome
      title={`${county.name} calendar`}
      subtitle="County-scoped month projection."
      backHref={`/county/${county.slug}`}
      backLabel={county.name}
      nav={<CalendarNav base={`/county/${county.slug}`} variant="county" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title={monthLabel}>
        <MonthGrid weeks={weeks} monthLabel={monthLabel} />
      </CalendarSection>
    </CalendarChrome>
  );
}
