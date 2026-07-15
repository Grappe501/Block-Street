import { CommandSection, EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { EventOperationsQueue } from "@/components/calendar/operations/EventOperationsRow";
import { filterNeedsAttention, listEventOperationsSummaries, sortByAttention } from "@/lib/calendar/operations";

export const metadata = { title: "Attention · Event Operations" };

export default function EventOperationsAttentionPage() {
  const summaries = sortByAttention(filterNeedsAttention(listEventOperationsSummaries({ kind: "command" })));

  return (
    <EventOperationsChrome
      title="Needs attention"
      subtitle="Every severity includes a human-readable reason. Critical and urgent events appear first."
    >
      <CommandSection title={`${summaries.length} event(s) flagged`}>
        <EventOperationsQueue summaries={summaries} />
      </CommandSection>
    </EventOperationsChrome>
  );
}
