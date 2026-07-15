import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterUpcoming, listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Upcoming · Event Operations" };

export default function EventOperationsUpcomingPage() {
  const all = listEventOperationsSummaries({ kind: "command" });
  const { next7, next30, later } = filterUpcoming(all);

  return (
    <EventOperationsChrome title="Upcoming" subtitle="Events grouped by next 7 days, next 30 days, and later.">
      <CommandSection title={`Next 7 days (${next7.length})`}>
        <EventOperationsQueue summaries={next7} />
      </CommandSection>
      <CommandSection title={`Next 30 days (${next30.length})`}>
        <EventOperationsQueue summaries={next30} />
      </CommandSection>
      <CommandSection title={`Later (${later.length})`}>
        <EventOperationsQueue summaries={later} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
