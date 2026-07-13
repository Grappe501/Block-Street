import {
  assembleDailyBrief,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";

export default function DailyBriefPage() {
  const view = assembleDailyBrief(DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Today&apos;s Brief</h1>
          <p className="mt-1 text-slate-600">{view.date_label}</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-teal-700">{view.conversations_count}</p>
            <p className="text-sm text-slate-600">Active Conversations</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-teal-700">{view.decisions_count}</p>
            <p className="text-sm text-slate-600">Pending Decisions</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-teal-700">{view.meetings_count}</p>
            <p className="text-sm text-slate-600">Today&apos;s Meetings</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-teal-700">{view.action_items_count}</p>
            <p className="text-sm text-slate-600">Action Items</p>
          </div>
        </div>

        {view.highlights.length === 0 ? (
          <p className="card text-slate-600">{view.empty_message}</p>
        ) : (
          <ul className="space-y-3">
            {view.highlights.map((h) => (
              <li key={h.id} className="card">
                <h2 className="font-bold text-slate-900">{h.title}</h2>
                <p className="mt-1 text-sm text-slate-700">{h.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CollaborationWorkbenchShell>
  );
}
