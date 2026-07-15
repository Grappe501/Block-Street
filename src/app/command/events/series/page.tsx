import Link from "next/link";
import { CommandSection } from "@/components/command/CommandChrome";
import { EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { listEventSeries, listSeriesNeedingAttention } from "@/lib/calendar/series";
import { describeRecurrence } from "@/lib/calendar/recurrence";

export const metadata = { title: "Recurring series · Command" };

export default function CommandSeriesPage() {
  const series = listEventSeries();
  const attention = listSeriesNeedingAttention();

  return (
    <EventOperationsChrome title="Recurring series" subtitle="Session-local series command view." backHref="/command/events" backLabel="Event Operations">
      <CommandSection title={`${series.length} series in session`}>
        {series.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/60">No series yet. Create from <Link href="/calendar/templates" className="text-field-pine underline">templates</Link>.</p>
        ) : (
          <ul className="space-y-2">
            {series.map((s) => (
              <li key={s.seriesId} className="rounded-lg border bg-white p-3">
                <Link href={`/calendar/series/${s.seriesId}`} className="font-fieldSans text-sm font-bold text-field-pine">{s.title}</Link>
                <p className="font-fieldSans text-xs text-field-ink/70">{describeRecurrence(s.recurrenceRule, s.defaultStartTime)} · {s.status}</p>
              </li>
            ))}
          </ul>
        )}
      </CommandSection>
      {attention.length > 0 ? (
        <CommandSection title="Series without owners">
          <p className="font-fieldSans text-sm">{attention.length} series need ownership assignment.</p>
        </CommandSection>
      ) : null}
    </EventOperationsChrome>
  );
}
