import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterAtRisk, listEventOperationsSummaries, sortByAttention } from "@/lib/calendar/operations";

export const metadata = { title: "At risk · Event Operations" };

export default function EventOperationsAtRiskPage() {
  const summaries = sortByAttention(filterAtRisk(listEventOperationsSummaries({ kind: "command" })));

  return (
    <EventOperationsChrome
      title="At risk"
      subtitle="Critical or urgent attention, or blocked overall readiness."
    >
      <CommandSection title={`${summaries.length} at-risk event(s)`}>
        <EventOperationsQueue summaries={summaries} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
