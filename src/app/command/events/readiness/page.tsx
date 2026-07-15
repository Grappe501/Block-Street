import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsMatrix } from "@/components/calendar/operations/EventOperationsMatrix";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Readiness · Event Operations" };

export default function EventOperationsReadinessPage() {
  const summaries = listEventOperationsSummaries({ kind: "command" });

  return (
    <EventOperationsChrome
      title="Readiness"
      subtitle="Transparent rule-based readiness — no opaque score. Every dimension shows state and explanation on the event detail panel."
    >
      <CommandSection title="Readiness matrix">
        <EventOperationsMatrix summaries={summaries} />
      </CommandSection>
      <CommandSection title="All events">
        <EventOperationsQueue summaries={summaries} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
