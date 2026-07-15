import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterReportsDue, listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Reports due · Event Operations" };

export default function EventOperationsReportsDuePage() {
  const summaries = filterReportsDue(listEventOperationsSummaries({ kind: "command" }));

  return (
    <EventOperationsChrome
      title="Reports due"
      subtitle="Completed events missing reports, follow-up, or outcome capture."
    >
      <CommandSection title={`${summaries.length} event(s) needing follow-up`}>
        <EventOperationsQueue summaries={summaries} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
