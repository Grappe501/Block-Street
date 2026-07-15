import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { getCounties } from "@/lib/data";
import { getEventById, listVolunteerNeeds } from "@/lib/calendar";

export function generateStaticParams() {
  return getCounties().map((c) => ({ slug: c.slug }));
}

export default async function CountyCalendarVolunteerNeedsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const county = getCounties().find((c) => c.slug === slug);
  if (!county) notFound();

  const needs = listVolunteerNeeds({ kind: "county", countySlug: county.slug });

  return (
    <CalendarChrome
      title={`${county.name} — volunteer needs`}
      subtitle="Open slots in this county."
      backHref={`/county/${county.slug}/calendar`}
      backLabel="Calendar"
      nav={<CalendarNav base={`/county/${county.slug}`} variant="county" />}
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
