import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { EventOperationsWidget } from "@/components/calendar/operations/EventOperationsWidget";
import { listCampusCommandLinks } from "@/lib/command/board";
import { listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Campus command boards" };

export default function CampusCommandIndexPage() {
  const campuses = listCampusCommandLinks();

  return (
    <CommandChrome
      title="Campus boards"
      subtitle="Every college has independent pages. Lane leaders still connect to the matching campaign board. CM and ACM oversee both sides."
    >
      <CommandSection title={`Colleges (${campuses.length})`}>
        <div className="grid gap-2 sm:grid-cols-2">
          {campuses.map((c) => (
            <CommandCard
              key={c.slug}
              href={c.href}
              title={c.name}
              note="Campus lanes · linked to campaign boards"
            />
          ))}
        </div>
      </CommandSection>

      <EventOperationsWidget
        title="Campus events needing attention"
        summaries={listEventOperationsSummaries({ kind: "command" }).filter((s) =>
          s.scopeLabels.some((l) => l.startsWith("College:")),
        )}
        moreHref="/command/events/attention"
      />
    </CommandChrome>
  );
}
