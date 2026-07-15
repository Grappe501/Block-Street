import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { getEventSeriesById } from "@/lib/calendar/series";

export default async function SeriesEditPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = await params;
  const series = getEventSeriesById(seriesId);
  if (!series) notFound();
  return (
    <CalendarChrome title="Edit series" subtitle="Edit scopes: this occurrence · this and following · entire series (future only)." backHref={`/calendar/series/${seriesId}`} backLabel="Series" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="font-fieldSans text-sm">Series edit UI soft-beta preview. Completed occurrences are never silently rewritten.</p>
    </CalendarChrome>
  );
}
