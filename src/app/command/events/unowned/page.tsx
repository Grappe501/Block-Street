import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterUnowned, listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Unowned · Event Operations" };

export default function EventOperationsUnownedPage() {
  const summaries = filterUnowned(listEventOperationsSummaries({ kind: "command" }));

  return (
    <EventOperationsChrome
      title="Unowned events"
      subtitle="Events lacking an operational owner or owning team. Owners are never invented."
    >
      <CommandSection title={`${summaries.length} unowned event(s)`}>
        <EventOperationsQueue summaries={summaries} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
