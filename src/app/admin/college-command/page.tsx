import { buildCollegeCommandDashboard } from "@/lib/college-command/dashboard";
import { CollegeCommandWorkbench } from "@/components/college-command/CollegeCommandWorkbench";
import { EventOperationsWidget } from "@/components/calendar/operations/EventOperationsWidget";
import { listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = {
  title: "College Leader Workbench — ASYON",
  description: "Statewide education organizing command",
};

export default function CollegeCommandPage() {
  const dashboard = buildCollegeCommandDashboard();
  const ops = listEventOperationsSummaries({ kind: "command" }).filter((s) =>
    s.scopeLabels.some((l) => l.startsWith("College:")),
  );
  return (
    <div>
      <CollegeCommandWorkbench dashboard={dashboard} />
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <EventOperationsWidget
          title="College command — events needing attention"
          summaries={ops}
          moreHref="/command/events"
        />
      </div>
    </div>
  );
}
