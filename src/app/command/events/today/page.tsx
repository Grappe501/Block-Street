import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterToday, listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Today · Event Operations" };

export default function EventOperationsTodayPage() {
  const summaries = filterToday(listEventOperationsSummaries({ kind: "command" }));

  return (
    <EventOperationsChrome title="Today" subtitle="Timeline of events happening today with ownership, staffing, and immediate next actions.">
      <CommandSection title={`${summaries.length} event(s) today`}>
        <EventOperationsQueue summaries={summaries} />
        {summaries.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/60">
            No events scheduled for today in the command scope. Check upcoming for the week ahead.
          </p>
        ) : null}
      </CommandSection>
    </EventOperationsChrome>
  );
}
