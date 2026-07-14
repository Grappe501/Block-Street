import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { getEventById, listConflicts } from "@/lib/calendar";

export const metadata = { title: "Calendar · Kelly conflicts" };

export default function KellyConflictsPage() {
  const conflicts = listConflicts();

  return (
    <CalendarChrome title="Kelly conflicts" subtitle="Scheduling overlaps from seed conflict catalog." nav={<CalendarNav variant="kelly" />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`${conflicts.length} conflicts`}>
        <ul className="space-y-3">
          {conflicts.map((c) => (
            <li key={c.conflict_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
              <p className="font-fieldSans text-sm font-bold text-field-ink">{c.summary}</p>
              <p className="mt-1 font-fieldSans text-xs uppercase text-field-ink/55">{c.severity}</p>
              <ul className="mt-2 space-y-1">
                {c.event_ids.map((id) => {
                  const e = getEventById(id);
                  return e ? (
                    <li key={id}>
                      <Link href={`/calendar/event/${id}`} className="font-fieldSans text-sm text-field-pine underline">
                        {e.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
