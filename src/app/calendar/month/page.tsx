import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { getMonthGrid, listEventsForScope, PUBLIC_PRIVACY_COPY } from "@/lib/calendar";

export const metadata = { title: "Calendar · Month" };

export default function CalendarMonthPage() {
  const events = listEventsForScope({ kind: "public" });
  const now = new Date();
  const weeks = getMonthGrid(now.getFullYear(), now.getMonth() + 1, events);
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <CalendarChrome title="Month view" subtitle={PUBLIC_PRIVACY_COPY.body} nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title={monthLabel}>
        <MonthGrid weeks={weeks} monthLabel={monthLabel} />
      </CalendarSection>
    </CalendarChrome>
  );
}
