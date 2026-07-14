import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { ProposeEventForm } from "@/components/calendar/ProposeEventForm";
import { getCounties } from "@/lib/data";
import { proposeEvent } from "@/lib/calendar";

export function generateStaticParams() {
  return getCounties().map((c) => ({ countySlug: c.slug }));
}

async function proposeAction(input: Parameters<typeof proposeEvent>[0]) {
  "use server";
  const event = proposeEvent(input);
  return { event_id: event.event_id };
}

export default async function CountyCalendarProposePage({ params }: { params: Promise<{ countySlug: string }> }) {
  const { countySlug } = await params;
  const county = getCounties().find((c) => c.slug === countySlug);
  if (!county) notFound();

  return (
    <CalendarChrome
      title={`Propose event — ${county.name}`}
      subtitle="County-scoped proposal."
      backHref={`/county/${county.slug}/calendar`}
      backLabel={county.name}
      nav={<CalendarNav base={`/county/${county.slug}`} variant="county" />}
    >
      <CalendarHonestyBanner />
      <ProposeEventForm action={proposeAction} defaults={{ county_slug: county.slug, scope: "county" }} />
    </CalendarChrome>
  );
}
