import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";

export default function SeriesNewPage() {
  return (
    <CalendarChrome title="New series" subtitle="Create a series from a template use flow." nav={<CalendarNav />} backHref="/calendar/series" backLabel="Series">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="font-fieldSans text-sm">Start from <Link href="/calendar/templates" className="text-field-pine underline">Event Template Library</Link> and choose recurring in step 3.</p>
    </CalendarChrome>
  );
}
